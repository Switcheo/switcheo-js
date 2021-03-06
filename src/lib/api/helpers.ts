import { Account, Config } from '../switcheo'
import req from '../req'
import { Blockchain } from '../constants'
import TransactionContainer from '../models/transactionContainer'
import { EthTransaction } from '../models/transaction/ethTransaction'

export interface Request<T> {
  readonly url: string
  readonly payload: T
}

export interface SignedRequestPayload {
  readonly timestamp: number
  readonly signature: string
  readonly address: string
}

export type UrlPathFn = (result: TransactionContainer) => string

export function buildRequest(config: Config, urlPath: string, payload: {}): Request<{}> {
  return { url: config.url + urlPath, payload }
}

export async function buildSignedRequest(config: Config, account: Account,
  urlPath: string, params: {}): Promise<Request<SignedRequestPayload>> {
  const payload: SignedRequestPayload = await buildSignedRequestPayload(config, account, params)
  return buildRequest(config, urlPath, payload) as Request<SignedRequestPayload>
}

export async function buildSignedRequestPayload(config: Config,
  account: Account, params: {}): Promise<SignedRequestPayload> {
  const timestamp: number = await req.fetchTimestamp(config)
  const signature: string = await account.signParams({ ...params, timestamp })
  return { ...params, timestamp, signature, address: account.address }
}

export async function performRequest(config: Config, account: Account,
  urlPath: string, params: {}): Promise<{}> {
  const request: Request<{}> = await buildSignedRequest(config, account, urlPath, params)
  return req.post(request.url, request.payload)
}

export async function performMultistepRequest<R>(config: Config, account: Account,
  firstUrlPath: string, secondUrlPathFn: UrlPathFn, params: {}): Promise<R> {
  // Check whether account has an api key first if not, request it
  const apiKey: string = await account.getApiKey(config)

  const firstRequest: Request<{}> =
    await buildRequest(config, firstUrlPath, { ...params, address: account.address })

  const firstResult: TransactionContainer =
    new TransactionContainer(
      await req.post(firstRequest.url, firstRequest.payload, { Authorization: `Token ${apiKey}` }),
      account.blockchain)
  const payload: {} = await signItem(config, account, firstResult)

  const secondRequest: Request<{}> =
    buildRequest(config, secondUrlPathFn(firstResult), payload)
  return req.post(secondRequest.url, secondRequest.payload)
}

// Signs the result of an API request.
// TODO: verify the transaction items before signing.
export async function signItem(config: Config, account: Account, item: TransactionContainer):
  Promise<{ signature?: string, transaction_hash?: string }> {
  if (account.blockchain === Blockchain.Ethereum) {
    if (!item.transaction) return { signature: '' }
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
  // else NEO blockchain
  return item.transaction ?
    // standard txn signing:
    { signature: await account.signTransaction(item.transaction) as string } :
    // neo withdrawals don't require a second txn signature:
    buildSignedRequestPayload(config, account, { id: item.id })
}
