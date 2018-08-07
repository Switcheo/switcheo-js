import { wallet } from '@cityofzion/neon-js'
import { getTimestamp } from '../../api/common'
import { broadcastOrder, planOrder } from '../../api/orders'
import { NEO as BLOCKCHAIN_NEO } from '../../constants'
import SwitcheoConfig from './SwitcheoConfig'

class Switcheo {
  // tslint:disable-next-line readonly-keyword
  public account: wallet.Account
  // tslint:disable-next-line readonly-keyword
  public config: SwitcheoConfig

  constructor({ privateKey, blockchain = BLOCKCHAIN_NEO, net = 'TestNet' }: {
    readonly privateKey: string,
    readonly blockchain?: Blockchain,
    readonly net?: Net,
  }) {
    this.config = new SwitcheoConfig(blockchain, net)
    // TODO: remove account property in Switcheo Class
    this.account = new wallet.Account(privateKey)
  }

  // TODO: change this to createOrder
  public async planOrder(orderParams): Promise<object> {
    const timestamp = await getTimestamp(this)
    const order = await planOrder(this, { ...orderParams, timestamp })
    return broadcastOrder(this, order)
  }
}

export { Switcheo }
