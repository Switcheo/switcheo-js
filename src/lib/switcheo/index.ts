import { wallet } from '@cityofzion/neon-js'
import { NEO as BLOCKCHAIN_NEO } from '../../constants'
import { Blockchain, CancelOrderParams, CreateOrderParams,
  ListBalancesParams, ListOrderParams, Net } from '../../lib/types'
import { listBalances } from '../balances'
import { cancelOrder, createOrder, listOrders  } from '../orders'
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

  public async createOrder(createOrderParams: CreateOrderParams, account): Promise<object> {
    return createOrder(this.config, createOrderParams, account)
  }

  public async cancelOrder(cancelOrderParams: CancelOrderParams, account): Promise<object> {
    return cancelOrder(this.config, cancelOrderParams, account)
  }

  public async listOrders(listOrderParams: ListOrderParams): Promise<object> {
    return listOrders(this.config, listOrderParams)
  }

  public async listBalances(listBalancesParams: ListBalancesParams): Promise<object> {
    return listBalances(this.config, listBalancesParams)
  }
}

export { Switcheo }
