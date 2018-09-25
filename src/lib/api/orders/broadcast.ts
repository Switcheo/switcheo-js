import { Order } from '../../models/order'
import { Account, Config } from '../../switcheo'
import TransactionContainer from '../../models/transactionContainer'

import { buildRequest } from '../helpers'
import req from '../../req'

export type BroadcastOrderParams = Order

export async function broadcast(config: Config,
  order: BroadcastOrderParams, account: Account): Promise<Order> {
  const request: OrderBroadcastRequest = await buildOrderBroadcastRequest(config, order, account)
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
    makes: SignedTransactionMap
  }
}

export async function buildOrderBroadcastRequest(config: Config,
  order: BroadcastOrderParams, account: Account): Promise<OrderBroadcastRequest> {
  const signatures: { fills: SignedTransactionMap, makes: SignedTransactionMap } = {
    fills: await buildSignedTransactionMap(order.fills, account),
    makes: await buildSignedTransactionMap(order.makes, account),
  }
  return buildRequest(
    config,
    `/orders/${order.id}/broadcast`,
    { signatures }
  ) as Promise<OrderBroadcastRequest>
}

function buildSignedTransactionMap(transactionContainers: ReadonlyArray<TransactionContainer>,
  account: Account): Promise<SignedTransactionMap> {
  const promises: ReadonlyArray<Promise<string>> =
    transactionContainers.map((item: TransactionContainer): Promise<string> =>
      account.signTransaction(item.transaction)
    )
  return Promise.all(promises).then((result: ReadonlyArray<string>) => {
    const map: SignedTransactionMap = {}
    result.forEach((value: string, index: number): void => {
      map[transactionContainers[index].id] = value
    })
    return map
  })
}
