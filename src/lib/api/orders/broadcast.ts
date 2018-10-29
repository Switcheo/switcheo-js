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
  }
}

export async function buildOrderBroadcastRequest(config: Config, account: Account,
  order: BroadcastOrderParams): Promise<OrderBroadcastRequest> {
  const payload: OrderBroadcastRequestPayload = {
    signatures: {
      fillGroups: await buildSignedTransactionMap(config, account, order.fillGroups),
      fills: await buildSignedTransactionMap(config, account, order.fills),
      makes: await buildSignedTransactionMap(config, account, order.makes),
    },
  }
  const request: OrderBroadcastRequest = buildRequest(
    config,
    `/orders/${order.id}/broadcast`,
    payload
  ) as OrderBroadcastRequest
  return request
}

function buildSignedTransactionMap(config: Config, account: Account,
  transactionContainers: ReadonlyArray<TransactionContainer>): Promise<SignedTransactionMap> {
  const promises: ReadonlyArray<Promise<{ signature?: string }>> =
    transactionContainers.map((item: TransactionContainer): Promise<{ signature?: string }> =>
      signItem(config, account, item)
    )
  return Promise.all(promises).then((result: ReadonlyArray<{ signature?: string }>) => {
    const map: SignedTransactionMap = {}
    result.forEach((value: { signature?: string }, index: number): void => {
      map[transactionContainers[index].id] = value.signature!
    })
    return map
  })
}
