import { Tx as ethTx } from 'web3/eth/types' // tslint:disable-line

export type EthTransactionLike = ethTx

export interface EthTransaction extends ethTx {
  rlpEncoded: string
  sha256: string
}
