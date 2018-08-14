import { Network } from '../constants/networks'

import saveOrder, { SaveOrderParams } from '../api/save-order'
import saveCancellation, { SaveCancellationParams } from '../api/save-cancellation'
import listBalances from '../api/list-balances'
import Order from '../models/Order'
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

  public async listBalances(account: SwitcheoAccount): Promise<object> {
    return listBalances(account, this.config)
  }
}
