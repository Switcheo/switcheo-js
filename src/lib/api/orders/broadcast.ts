import { Order } from '../../models/order'
import { Account, Config } from '../../switcheo'
import TransactionContainer from '../../models/transactionContainer'

import { buildRequest, signItem } from '../helpers'
import req from '../../req'

export type BroadcastOrderParams = Order

export async function broadcast(config: Config, account: Account,
  order: BroadcastOrderParams): Promise<Order> {
  const request: OrderBroadcastRequest = await buildOrderBroadcastRequest(config, account, order)
  return req.post(request.url, request.payload)
}

export interface OrderBroadcastRequest extends Request {
  readonly payload: OrderBroadcastRequestPayload
}

interface SignedTransactionMap {
  [id: string]: string
}

interface OrderBroadcastRequestPayload {
  readonly signatures: {
    fills: SignedTransactionMap,
    fillGroups: SignedTransactionMap,
    makes: SignedTransactionMap,
    txn: { signature?: string, transaction_hash?: string },
  }
}

export async function buildOrderBroadcastRequest(config: Config, account: Account,
  order: BroadcastOrderParams): Promise<OrderBroadcastRequest> {
  const payload: OrderBroadcastRequestPayload = {
    signatures: {
      fillGroups: await buildSignedTransactionMap(config, account, order.fillGroups),
      fills: await buildSignedTransactionMap(config, account, order.fills),
      makes: await buildSignedTransactionMap(config, account, order.makes),
      txn: await signItem(config, account, order.txn),
    },
  }
  const request: OrderBroadcastRequest = buildRequest(
    config,
    `/orders/${order.id}/broadcast`,
    payload
  ) as OrderBroadcastRequest
  return request
}

async function buildSignedTransactionMap(config: Config, account: Account,
  transactionContainers: ReadonlyArray<TransactionContainer>): Promise<SignedTransactionMap> {
  const signedTransactionMap: SignedTransactionMap = {}
  for (const transactionContainer of transactionContainers) {
    const signature: string = (await signItem(config, account, transactionContainer)).signature!
    signedTransactionMap[transactionContainer.id.toString()] = signature
  }
  return signedTransactionMap
}
