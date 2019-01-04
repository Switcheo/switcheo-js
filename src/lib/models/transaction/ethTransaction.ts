import { TxData } from 'ethereum-types'

export type EthTransactionLike = TxData

export interface EthTransaction extends TxData {
  chainId: number
  data: string
  from: string
  to: string,
  value: string,
  gas: string
  gasPrice: string
  sha256?: string
  rlpEncoded?: string
  message?: string
  r?: string
  s?: string
  v?: string
}
