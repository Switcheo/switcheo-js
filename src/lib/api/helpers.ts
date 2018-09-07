import Account from '../switcheo/account'
import Config from '../switcheo/config'
import TransactionContainer from '../models/transaction-container'
import req from '../req'

import { Request } from './common'

export type UrlPathFn = (result: TransactionContainer) => string

export function buildRequest(payload: object, config: Config, urlPath: string): object {
  return { url: config.url + urlPath, payload }
}

export async function buildSignedRequest(params: object, account: Account,
  config: Config, urlPath: string): Promise<object> {
  const payload = await buildSignedRequestPayload(params, account, config)
  return buildRequest(payload, config, urlPath)
}

export async function buildSignedRequestPayload(params: object, account: Account,
  config: Config): Promise<object> {
  const timestamp = await req.fetchTimestamp(config)
  const signableParams = { ...params, timestamp }
  const signature = account.signParams(signableParams)
  return { ...signableParams, signature, address: account.address }
}

export async function performMultistepRequest(params: object, account: Account,
  config: Config, firstUrlPath: string, secondUrlPathFn: UrlPathFn): Promise<object> {
  const firstRequest = await buildSignedRequest(params, account, config, firstUrlPath) as Request
  const firstResult: TransactionContainer =
    new TransactionContainer(await req.post(firstRequest.url, firstRequest.payload))
  const signature = account.signTransaction(firstResult.transaction)
  const secondRequest = buildRequest({ signature }, config, secondUrlPathFn(firstResult)) as Request
  return req.post(secondRequest.url,  secondRequest.payload)
}
