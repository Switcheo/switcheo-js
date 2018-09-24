import { tx as neonTx } from '@cityofzion/neon-core'
import { Tx as ethTransaction } from 'web3/eth/types' //tslint:disable-line

export interface SignatureProvider {
  readonly address: string
  readonly displayAddress: string
  signMessage(message: string): Promise<string>
  signTransaction(transaction: neonTx.Transaction | ethTransaction): Promise<string>
}

export * from './neoPrivateKeyProvider'
export * from './metamaskProvider'
