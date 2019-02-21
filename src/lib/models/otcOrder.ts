export interface OtcOrder {
  baseAsset: string
  blockchain: string
  id: string
  makerAddress: string
  price: string
  proceeds: string
  quantity: string
  side: string
  status: string
  takerAddress: string
  timestamp: number
  tradeAsset: string
}
