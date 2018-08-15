import Fill from './fill'
import Make from './make'

export type OrderSide = 'buy' | 'sell'
export type OrderType = 'limit'

export default interface Order {
  readonly id: string
  readonly fills: ReadonlyArray<Fill>
  readonly makes: ReadonlyArray<Make>
}
