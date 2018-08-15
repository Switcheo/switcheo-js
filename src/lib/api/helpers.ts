import SwitcheoAccount from '../switcheo/switcheo-account'
import SwitcheoConfig from '../switcheo/switcheo-config'
import TransactionContainer from '../models/transaction-container'
import req from '../req'

import { Request } from './common'

export type UrlPathFn = (result: TransactionContainer) => string

export function buildRequest(payload: object, config: SwitcheoConfig, urlPath: string): object {
  return { url: config.url + urlPath, payload }
}

export async function buildSignedRequest(params: object, account: SwitcheoAccount,
  config: SwitcheoConfig, urlPath: string): Promise<object> {
  const payload = await buildSignedRequestPayload(params, account, config)
  return buildRequest(payload, config, urlPath)
}

export async function buildSignedRequestPayload(params: object, account: SwitcheoAccount,
  config: SwitcheoConfig): Promise<object> {
  const timestamp = await req.fetchTimestamp(config)
  const signableParams = { ...params, timestamp }
  const signature = account.signParams(signableParams)
  return { ...signableParams, signature, address: account.address }
}

export async function performMultistepRequest(params: object, account: SwitcheoAccount,
  config: SwitcheoConfig, firstUrlPath: string, secondUrlPathFn: UrlPathFn): Promise<object> {
  const firstRequest = await buildSignedRequest(params, account, config, firstUrlPath) as Request
  const firstResult: TransactionContainer = await req.post(firstRequest.url, firstRequest.payload)
  const signature = account.signTransaction(firstResult.transaction)
  const secondRequest = buildRequest({ signature }, config, secondUrlPathFn(firstResult)) as Request
  return req.post(secondRequest.url,  secondRequest.payload)
}
