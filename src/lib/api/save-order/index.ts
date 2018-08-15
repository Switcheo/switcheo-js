import createOrder, { CreateOrderParams } from '../create-order'
import Order from '../../models/order'
import SwitcheoAccount from '../../switcheo/switcheo-account'
import SwitcheoConfig from '../../switcheo/switcheo-config'
import broadcastOrder from '../broadcast-order'

export type SaveOrderParams = CreateOrderParams

export default async function saveOrder(orderParams: SaveOrderParams,
  account: SwitcheoAccount, config: SwitcheoConfig): Promise<Order> {
  const order = await createOrder(orderParams, account, config)
  return broadcastOrder(order, account, config)
}
