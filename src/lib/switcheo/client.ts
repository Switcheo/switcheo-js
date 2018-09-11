import { MakeOrderParams } from '../api/orders/make'
import { ListOrdersParams } from '../api/orders/list'
import { MakeCancellationParams } from '../api/cancellations'
import { api } from '../api'
import { Order } from '../models/order'
import { Network } from '../constants'
import { Account } from './account'
import { Config } from './config'

export class Client {
  public config: Config

  constructor({ net }: { readonly net?: Network } = {}) {
    this.config = new Config({ net })
  }

  public makeOrder(params: MakeOrderParams,
    account: Account): Promise<Order> {
    return api.orders.make(this.config, params, account)
  }

  public cancelOrder(params: MakeCancellationParams,
    account: Account): Promise<Order> {
    return api.cancellations.make(this.config, params, account)
  }

  public listBalances(accounts:
    Account | ReadonlyArray<Account>): Promise<object> {
    return api.balances.list(this.config, accounts)
  }

  public listOrders(params: ListOrdersParams, account: Account): Promise<object> {
    return api.orders.list(this.config, params, account)
  }

  public listPairs(): Promise<object> {
    return api.pairs.list(this.config)
  }

  public getFees(): Promise<object> {
    return api.fees.get(this.config)
  }

  public getBestNeoNode(): Promise<object> {
    return api.network.bestNeoNode(this.config)
  }

  public tickersLast24Hours(): Promise<object> {
    return api.tickers.last24Hours(this.config)
  }
}
