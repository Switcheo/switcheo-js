import { Order } from '../../models/order'
import { Account, Config } from '../../switcheo'
import TransactionContainer from '../../models/transaction-container'

import { buildRequest } from '../helpers'
import req from '../../req'

export type BroadcastOrderParams = Order

export default async function broadcastOrder(order: BroadcastOrderParams,
  account: Account, config: Config): Promise<Order> {
  const request = await buildOrderBroadcastRequest(order, account, config)
  return req.post(request.url, request.payload)
}

interface OrderBroadcastRequest extends Request {
  readonly payload: OrderBroadcastRequestPayload
}

interface SignedTransactionMap {
  [id: string]: string
}

interface OrderBroadcastRequestPayload {
  readonly signatures: {
    fills: SignedTransactionMap,
    makes: SignedTransactionMap
  }
}

export async function buildOrderBroadcastRequest(order: BroadcastOrderParams,
  account: Account, config: Config): Promise<OrderBroadcastRequest> {
  const signatures = {
    fills: buildSignedTransactionMap(order.fills, account),
    makes: buildSignedTransactionMap(order.makes, account),
  }
  return buildRequest(
    { signatures },
    config,
    `/orders/${order.id}/broadcast`
  ) as Promise<OrderBroadcastRequest>
}

function buildSignedTransactionMap(transactionContainers: ReadonlyArray<TransactionContainer>,
  account: Account): SignedTransactionMap {
  const map: SignedTransactionMap = {}
  transactionContainers.forEach((item) => {
    map[item.id] = account.signTransaction(item.transaction)
  })
  return map
}
