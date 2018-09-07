import { Network } from '../constants/networks'
import fees from '../api/fees'
import saveOrder, { SaveOrderParams } from '../api/save-order'
import saveCancellation, { SaveCancellationParams } from '../api/save-cancellation'
import listBalances from '../api/list-balances'
import listOrders, { ListOrdersParams } from '../api/list-orders'
import listPairs from '../api/list-pairs'
import tickersLast24Hours from '../api/tickers-last-24-hours'
import Order from '../models/order'
import SwitcheoAccount, { SwitcheoAccountParams } from './switcheo-account'
import SwitcheoConfig from './switcheo-config'

export default class Switcheo {
  public static createAccount({ address, privateKey, blockchain }:
    SwitcheoAccountParams): SwitcheoAccount {
    return new SwitcheoAccount({ address, privateKey, blockchain })
  }

  public config: SwitcheoConfig

  constructor({ net }: { readonly net?: Network } = {}) {
    this.config = new SwitcheoConfig({ net })
  }

  public async saveOrder(params: SaveOrderParams,
    account: SwitcheoAccount): Promise<Order> {
    return saveOrder(params, account, this.config)
  }

  public async cancelOrder(params: SaveCancellationParams,
    account: SwitcheoAccount): Promise<Order> {
    return saveCancellation(params, account, this.config)
  }

  public async listBalances(accounts:
    SwitcheoAccount | ReadonlyArray<SwitcheoAccount>): Promise<object> {
    return listBalances(accounts, this.config)
  }

  public async listOrders(params: ListOrdersParams, account: SwitcheoAccount): Promise<object> {
    return listOrders(params, account, this.config)
  }

  public async listPairs(): Promise<object> {
    return listPairs(this.config)
  }

  public async tickersLast24Hours(): Promise<object> {
    return tickersLast24Hours(this.config)
  }

  public async fees(): Promise<object> {
    return fees(this.config)
  }
}
