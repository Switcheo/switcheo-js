import { Fill } from './fill'
import { Make } from './make'

export type OrderSide = 'buy' | 'sell'
export type OrderType = 'limit' | 'market'

interface FillOrMake {
  id: string
  txn: object
}

interface OrderParams {
  id: string
  fills: ReadonlyArray<FillOrMake>
  makes: ReadonlyArray<FillOrMake>
}
export class Order {
  public readonly id: string
  public readonly fills: ReadonlyArray<Fill>
  public readonly makes: ReadonlyArray<Make>

  constructor(tx: OrderParams) {
    this.id = tx.id
    this.fills = tx.fills.map((f: FillOrMake) => new Fill(f))
    this.makes = tx.makes.map((m: FillOrMake) => new Make(m))
  }
}
