import { Account, Config } from '../../switcheo'
import { Order } from '../../models/order'
import { create, CreateOrderParams } from './create'
import { broadcast } from './broadcast'

export type MakeOrderParams = CreateOrderParams

export async function make(config: Config, account: Account,
  orderParams: MakeOrderParams): Promise<Order> {
  const order: Order = await create(config, account, orderParams)
  return broadcast(config, account, order)
}
