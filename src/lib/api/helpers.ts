import { Account, Config } from '../switcheo'
import TransactionContainer from '../models/transactionContainer'
import { EthTransaction } from '../models/transaction/ethTransaction'
import req from '../req'
import { Blockchain } from '../constants'

import { Request } from './common'

export type UrlPathFn = (result: TransactionContainer) => string

export function buildRequest(config: Config, urlPath: string, payload: object): object {
  return { url: config.url + urlPath, payload }
}

export async function buildSignedRequest(config: Config, account: Account,
  urlPath: string, params: object): Promise<object> {
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

export async function performMultistepRequest(config: Config, account: Account,
  firstUrlPath: string, secondUrlPathFn: UrlPathFn, params: object): Promise<object> {
  const firstRequest: Request =
    await buildSignedRequest(config, account, firstUrlPath, params) as Request
  const firstResult: TransactionContainer =
    new TransactionContainer(await req.post(firstRequest.url, firstRequest.payload))

  const payload: object = await signItem(config, account, firstResult)
  const secondRequest: Request =
    buildRequest(config, secondUrlPathFn(firstResult), payload) as Request
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
      { transaction_hash: await account.sendTransaction(item.transaction) }
  }

  return item.transaction ?
    // standard txn signing:
    { signature: await account.signTransaction(item.transaction) } :
    // neo withdrawals don't require a second txn signature:
    buildSignedRequestPayload(config, account, { id: item.id })
}
