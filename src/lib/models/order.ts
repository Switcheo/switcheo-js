import { Fill } from './fill'
import { FillGroup } from './fillGroup'
import { Make } from './make'

export type OrderSide = 'buy' | 'sell'
export type OrderType = 'limit' | 'market' | 'otc'

interface OrderComponent {
  id: string
  txn: {}
}

interface OrderParams {
  id: string
  fills: ReadonlyArray<OrderComponent>
  fillGroups?: ReadonlyArray<OrderComponent>
  makes: ReadonlyArray<OrderComponent>
}
export class Order {
  public readonly id: string
  public readonly fills: ReadonlyArray<Fill>
  public readonly fillGroups: ReadonlyArray<FillGroup>
  public readonly makes: ReadonlyArray<Make>

  constructor(tx: OrderParams) {
    this.id = tx.id
    this.fills = tx.fills.map((f: OrderComponent) => new Fill(f))
    this.makes = tx.makes.map((m: OrderComponent) => new Make(m))
    this.fillGroups = tx.fillGroups ?
      tx.fillGroups.map((m: OrderComponent) => new FillGroup(m)) : []
  }
}
