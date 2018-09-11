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
  const payload = await buildSignedRequestPayload(config, params, account)
  return buildRequest(config, urlPath, payload)
}

export async function buildSignedRequestPayload(config: Config,
  params: object, account: Account): Promise<object> {
  const timestamp = await req.fetchTimestamp(config)
  const signableParams = { ...params, timestamp }
  const signature = account.signParams(signableParams)
  return { ...signableParams, signature, address: account.address }
}

export async function performMultistepRequest(config: Config, firstUrlPath: string,
  secondUrlPathFn: UrlPathFn, params: object, account: Account): Promise<object> {
  const firstRequest = await buildSignedRequest(config, firstUrlPath, params, account) as Request
  const firstResult: TransactionContainer =
    new TransactionContainer(await req.post(firstRequest.url, firstRequest.payload))
  const signature = account.signTransaction(firstResult.transaction)
  const secondRequest = buildRequest(config, secondUrlPathFn(firstResult), { signature }) as Request
  return req.post(secondRequest.url,  secondRequest.payload)
}
