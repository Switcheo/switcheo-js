import Web3 from 'web3'
import { tx as neonTx } from '@cityofzion/neon-core'
import { Tx as ethTransaction } from 'web3/eth/types' //tslint:disable-line

export interface SignatureProvider {
  readonly address: string
  readonly displayAddress: string
  signMessage(message: string): Promise<string>
  signTransaction(transaction: neonTx.Transaction | ethTransaction): Promise<string>
}

export interface Web3Provider extends SignatureProvider {
  readonly web3: Web3
}

export * from './neoPrivateKeyProvider'
export * from './metamaskProvider'
