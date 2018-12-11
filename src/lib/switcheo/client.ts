import { MakeOrderParams } from '../api/orders/make'
import { ListOrdersParams } from '../api/orders/get'
import { MakeCancellationParams } from '../api/cancellations'
import {
  AnnoucementMessageGetResponse,
  api,
  BalancesGetResponse,
  FeesGetResponse,
  NetworkGetBestNeoNodeResponse,
  PairsGetResponse,
  TickersGetCandlesticksResponse,
  TickersGetLast24HoursResponse,
  TickersGetSparklineResponse,
  TokensGetResponse
} from '../api'
import { GetCandlesticksParams } from '../api/tickers'
import { TokenParams } from '../api/tokens'
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
    return api.orders.make(this.config, account, params)
  }

  public cancelOrder(params: MakeCancellationParams,
    account: Account): Promise<Order> {
    return api.cancellations.make(this.config, account, params)
  }

  public getBalances(accounts:
    Account | ReadonlyArray<Account>): Promise<BalancesGetResponse> {
    return api.balances.get(this.config, accounts)
  }

  public getOrders(params: ListOrdersParams, account: Account): Promise<object> {
    return api.orders.get(this.config, account, params)
  }

  public getPairs(): Promise<PairsGetResponse> {
    return api.pairs.get(this.config)
  }

  public getFees(): Promise<FeesGetResponse> {
    return api.fees.get(this.config)
  }

  public getAnnouncementMessage(): Promise<AnnoucementMessageGetResponse> {
    return api.announcementMessage.get(this.config)
  }

  public getTokens(params: TokenParams): Promise<TokensGetResponse> {
    return api.tokens.get(this.config, params)
  }

  public getBestNeoNode(): Promise<NetworkGetBestNeoNodeResponse> {
    return api.network.getBestNeoNode(this.config)
  }

  public getLast24Hours(): Promise<TickersGetLast24HoursResponse> {
    return api.tickers.getLast24Hours(this.config)
  }

  public getSparkline(): Promise<TickersGetSparklineResponse> {
    return api.tickers.getSparkline(this.config)
  }

  public getCandlesticks(params: GetCandlesticksParams): Promise<TickersGetCandlesticksResponse> {
    return api.tickers.getCandlesticks(this.config, params)
  }
}
