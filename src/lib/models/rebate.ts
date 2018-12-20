import { OrderSide } from './order'

export interface History {
  pair: string
  side: OrderSide
  price: string
  offerAmount: string
  filledAmount: string
  rebateAmount: string
  rebateAsset: string
  orderCreatedAt: number
  transactionHash: string
}
