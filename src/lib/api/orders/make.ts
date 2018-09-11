import { Account, Config } from '../../switcheo'
import { Order } from '../../models/order'
import { create, CreateOrderParams } from './create'
import { broadcast } from './broadcast'

export type MakeOrderParams = CreateOrderParams

export async function make(config: Config,
  orderParams: MakeOrderParams, account: Account): Promise<Order> {
  const order = await create(config, orderParams, account)
  return broadcast(config, order, account)
}
