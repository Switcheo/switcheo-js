import { wallet } from '@cityofzion/neon-js'
import { getTimestamp } from '../../api/common'
import { broadcastOrder, planOrder } from '../../api/orders'
import { NEO as BLOCKCHAIN_NEO } from '../../constants'
import { setAccount, setConfig } from './setters'
import { SwitcheoConfig, SwitcheoConstructor } from './typings'

// Because we are dynamically adding class method properties, typescript needs to know about them
interface Switcheo {
  // tslint:disable-next-line no-method-signature
  setConfig(blockchain: Blockchain, net: Net): void
  // tslint:disable-next-line no-method-signature
  setAccount(privateKey: string): void
}

class Switcheo {
  // tslint:disable-next-line readonly-keyword
  public account: wallet.Account
  // tslint:disable-next-line readonly-keyword
  public config: SwitcheoConfig
  // public setConfig: object

  constructor({ privateKey, blockchain = BLOCKCHAIN_NEO, net = 'TestNet' }: SwitcheoConstructor) {
    this.setAccount(privateKey)
    this.setConfig(blockchain, net)
  }

  // TODO: change this to createOrder
  public async planOrder(orderParams): Promise<object> {
    const timestamp = await getTimestamp(this)
    const order = await planOrder(this, { ...orderParams, timestamp })
    return broadcastOrder(this, order)
  }
}

// Is there a better way to export class method properties into separate files?

// tslint:disable-next-line no-object-mutation
Switcheo.prototype.setConfig = setConfig
// tslint:disable-next-line no-object-mutation
Switcheo.prototype.setAccount = setAccount

export { Switcheo }
