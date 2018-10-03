import { MakeOrderParams } from '../api/orders/make'
import { ListOrdersParams } from '../api/orders/get'
import { MakeCancellationParams } from '../api/cancellations'
import { api } from '../api'
import { GetCandlesticksParams } from '../api/tickers'
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

  public getBalances(accounts:
    Account | ReadonlyArray<Account>): Promise<object> {
    return api.balances.get(this.config, accounts)
  }

  public getOrders(params: ListOrdersParams, account: Account): Promise<object> {
    return api.orders.get(this.config, params, account)
  }

  public getPairs(): Promise<object> {
    return api.pairs.get(this.config)
  }

  public getFees(): Promise<object> {
    return api.fees.get(this.config)
  }

  public getAnnouncementMessage(): Promise<object> {
    return api.announcementMessage.get(this.config)
  }

  public getBestNeoNode(): Promise<object> {
    return api.network.getBestNeoNode(this.config)
  }

  public getLast24Hours(): Promise<object> {
    return api.tickers.getLast24Hours(this.config)
  }

  public getCandlesticks(params: GetCandlesticksParams): Promise<object> {
    return api.tickers.getCandlesticks(this.config, params)
  }
}
