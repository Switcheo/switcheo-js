import { Fill } from './fill'
import { FillGroup } from './fillGroup'
import { Make } from './make'
import { Blockchain } from '../constants'

export type OrderSide = 'buy' | 'sell'
export type OrderType = 'limit' | 'market' | 'otc'

interface OrderComponent {
  id: string
  txn: {}
}

interface OrderParams {
  id: string
  blockchain: Blockchain
  fills: ReadonlyArray<OrderComponent>
  fillGroups?: ReadonlyArray<OrderComponent>
  makes: ReadonlyArray<OrderComponent>
}
export class Order {
  public readonly id: string
  public readonly blockchain: Blockchain
  public readonly fills: ReadonlyArray<Fill>
  public readonly fillGroups: ReadonlyArray<FillGroup>
  public readonly makes: ReadonlyArray<Make>

  constructor(tx: OrderParams) {
    this.id = tx.id
    this.blockchain = tx.blockchain
    this.fills = tx.fills.map((f: OrderComponent) => new Fill(f, tx.blockchain))
    this.makes = tx.makes.map((m: OrderComponent) => new Make(m, tx.blockchain))
    this.fillGroups = tx.fillGroups ?
      tx.fillGroups.map((m: OrderComponent) => new FillGroup(m, tx.blockchain)) : []
  }
}
