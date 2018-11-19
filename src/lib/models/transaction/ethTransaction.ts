import { Transaction as ethTx } from 'ethereum-types'

export type EthTransactionLike = ethTx

export interface EthTransaction extends ethTx {
  sha256: string
  rlpEncoded?: string
  message?: string
}
