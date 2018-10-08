import Web3 from 'web3'
import { tx as neonTx } from '@cityofzion/neon-core'
import { Tx as ethTransaction } from 'web3/eth/types' //tslint:disable-line

export enum SignatureProviderType {
  PrivateKey = 'privateKey',
  Ledger = 'ledger',
  Metamask = 'metamask',
}

export interface SignatureProvider {
  readonly address: string
  readonly displayAddress: string
  readonly type: SignatureProviderType | string
  signParams(params: object): Promise<string>
  signMessage(message: string): Promise<string>
  signTransaction(transaction: neonTx.Transaction | ethTransaction): Promise<string>
  sendTransaction(transaction: neonTx.Transaction | ethTransaction): Promise<string>
}

export interface Web3Provider extends SignatureProvider {
  readonly web3: Web3
}

export * from './neoPrivateKeyProvider'
export * from './neoLedgerProvider'
export * from './metamaskProvider'
