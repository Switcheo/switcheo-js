import { Account, Config } from '../switcheo'
import TransactionContainer from '../models/transactionContainer'
import { EthTransaction } from '../models/transaction/ethTransaction'
import req from '../req'
import { Blockchain } from '../constants'

import { Request } from './common'

export type UrlPathFn = (result: TransactionContainer) => string

export function buildRequest(config: Config, urlPath: string, payload: object): Request {
  return { url: config.url + urlPath, payload }
}

export async function buildSignedRequest(config: Config, account: Account,
  urlPath: string, params: object): Promise<Request> {
  const payload: object = await buildSignedRequestPayload(config, account, params)
  return buildRequest(config, urlPath, payload)
}

async function buildSignedRequestPayload(config: Config,
  account: Account, params: object): Promise<object> {
  const timestamp: number = await req.fetchTimestamp(config)
  const signableParams: object = { ...params, timestamp }
  const signature: string = await account.signParams(signableParams)
  return { ...signableParams, signature, address: account.address }
}

export async function performRequest(config: Config, account: Account,
  urlPath: string, params: object): Promise<object> {
  const request: Request = await buildSignedRequest(config, account, urlPath, params)
  return req.post(request.url, request.payload)
}

export async function performMultistepRequest(config: Config, account: Account,
  firstUrlPath: string, secondUrlPathFn: UrlPathFn, params: object): Promise<object> {
  // Check whether account has an api key first if not, request it
  const apiKey: string = account.hasValidApiKey() ? account.apiKey.key :
    await account.refreshApiKey(config)

  if (!apiKey) throw Error('Invaid API key')

  const firstRequest: Request =
    await buildRequest(config, firstUrlPath, { ...params, address: account.address })

  const firstResult: TransactionContainer =
    new TransactionContainer(await
      req.post(firstRequest.url, firstRequest.payload, { Authorization: `Token ${apiKey}` }))

  const payload: object = await signItem(config, account, firstResult)
  const secondRequest: Request =
    buildRequest(config, secondUrlPathFn(firstResult), payload)
  return req.post(secondRequest.url, secondRequest.payload)
}

// Signs the result of an API request.
// TODO: verify the transaction items before signing.
export async function signItem(config: Config, account: Account, item: TransactionContainer):
  Promise<{ signature?: string, transaction_hash?: string }> {
  if (account.blockchain === Blockchain.Ethereum) {
    const { message } = (item.transaction as EthTransaction)
    // NOTE: MetaMask does not support signing of transactions without broadcasting,
    // see: https://github.com/MetaMask/metamask-extension/issues/3475.
    // Therefore for the Ethereum blockchain, we return a *transaction hash*
    // when full transaction signing is required, rather than just a signature to
    // be attached and broadcasted by the operator (as in NEO, et al).
    return message ?
      // standard message signing:
      { signature: await account.signMessage(message) } :
      // eth txns (deposits) are sent immediately!:
      { transaction_hash: await account.sendTransaction(item.transaction!) }
  }

  return item.transaction ?
    // standard txn signing:
    { signature: await account.signTransaction(item.transaction) } :
    // neo withdrawals don't require a second txn signature:
    buildSignedRequestPayload(config, account, { id: item.id })
}
