import { broadcast } from './broadcast'
import { create, CreateOrderParams } from './create'
import { get, ListOrdersParams } from './get'
import { make } from './make'

import { Order } from '../../models/order'
import { Account, Config } from '../../switcheo'

export interface Orders {
  broadcast: (config: Config, account: Account, order: Order) => Promise<Order>
  create: (config: Config, account: Account, orderParams: CreateOrderParams) => Promise<Order>
  get: (config: Config, account: Account, listOrdersParams: ListOrdersParams) => Promise<object>
  make: (config: Config, account: Account, orderParams: CreateOrderParams) => Promise <Order>
}

export const orders: Orders = { broadcast, create, get, make }
