import { Account, Config } from '../../switcheo'
import { Order } from '../../models/order'
import createOrder, { CreateOrderParams } from '../create-order'
import broadcastOrder from '../broadcast-order'

export type SaveOrderParams = CreateOrderParams

export default async function saveOrder(orderParams: SaveOrderParams,
  account: Account, config: Config): Promise<Order> {
  const order = await createOrder(orderParams, account, config)
  return broadcastOrder(order, account, config)
}
