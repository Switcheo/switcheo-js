import Web3 from 'web3'
import { Transaction } from '../models/transaction'

export enum SignatureProviderType {
  PrivateKey = 'privateKey',
  Ledger = 'ledger',
  Trezor = 'trezor',
  Metamask = 'metamask',
  O3 = 'o3',
  Trust = 'trust',
  IM = 'im',
  Coinbase = 'coinbase',
  Scatter = 'scatter',
}

export interface SignatureProvider {
  readonly address: string
  readonly displayAddress: string
  readonly type: SignatureProviderType | string
  signParams(params: {}): Promise<string>
  signMessage(message: string): Promise<string>
  signTransaction(transaction: Transaction): Promise<string>
  sendTransaction(transaction: Transaction): Promise<string>
}

export interface Web3Provider extends SignatureProvider {
  readonly web3: Web3
}

export * from './neoPrivateKeyProvider'
export * from './neoLedgerProvider'
export * from './neoO3Provider'
export * from './eosScatterProvider'
export * from './ethPrivateKeyProvider'
export * from './ethLedgerProvider'
export * from './ethTrezorProvider'
export * from './ethTrustProvider'
export * from './ethIMTokenProvider'
export * from './ethCoinbaseProvider'
export * from './metamaskProvider'
export * from './ontPrivateKeyProvider'
export * from './qtumPrivateKeyProvider'
