import { TxData } from 'ethereum-types'

export type EthTransactionLike = TxData

export interface EthTransaction extends TxData {
  sha256: string
  rlpEncoded?: string
  message?: string
}
