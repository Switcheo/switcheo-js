import { Account, Config } from '../switcheo'
import TransactionContainer from '../models/transaction-container'
import req from '../req'

import { Request } from './common'

export type UrlPathFn = (result: TransactionContainer) => string

export function buildRequest(config: Config, urlPath: string, payload: object): object {
  return { url: config.url + urlPath, payload }
}

export async function buildSignedRequest(config: Config, urlPath: string,
  params: object, account: Account): Promise<object> {
  const payload: object = await buildSignedRequestPayload(config, params, account)
  return buildRequest(config, urlPath, payload)
}

export async function buildSignedRequestPayload(config: Config,
  params: object, account: Account): Promise<object> {
  const timestamp: number = await req.fetchTimestamp(config)
  const signableParams: object = { ...params, timestamp }
  const signature: string = await account.signParams(signableParams)
  return { ...signableParams, signature, address: account.address }
}

export async function performMultistepRequest(config: Config, firstUrlPath: string,
  secondUrlPathFn: UrlPathFn, params: object, account: Account): Promise<object> {
  const firstRequest: Request =
    await buildSignedRequest(config, firstUrlPath, params, account) as Request
  const firstResult: TransactionContainer =
    new TransactionContainer(await req.post(firstRequest.url, firstRequest.payload))
  const signature: string = await account.signTransaction(firstResult.transaction)
  const secondRequest: Request =
    buildRequest(config, secondUrlPathFn(firstResult), { signature }) as Request
  return req.post(secondRequest.url, secondRequest.payload)
}
