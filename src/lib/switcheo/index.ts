import { wallet } from '@cityofzion/neon-js'
import { Blockchain, NEO as BLOCKCHAIN_NEO } from '../../constants'
import { cancelOrder, createOrder } from '../orders'
import SwitcheoConfig from './SwitcheoConfig'

class Switcheo {
  // tslint:disable-next-line readonly-keyword
  public config: SwitcheoConfig

  constructor({ blockchain = BLOCKCHAIN_NEO, net = 'TestNet' }: {
    readonly blockchain?: Blockchain,
    readonly net?: Net,
  }) {
    this.config = new SwitcheoConfig(blockchain, net)
  }

  // TODO: change wallet.Account type to something like Switcheo.Account type
  // that could potentially take in "wallet.Account | LedgerAccount | EthAccount"
  public createAccount({ privateKey }: { readonly privateKey: string }): wallet.Account {
    return new wallet.Account(privateKey)
  }

  public async createOrder(orderParams, account): Promise<object> {
    return createOrder(this.config, orderParams, account)
  }

  public async cancelOrder(orderParams, account): Promise<object> {
    return cancelOrder(this.config, orderParams, account)
  }
}

export { Switcheo }
