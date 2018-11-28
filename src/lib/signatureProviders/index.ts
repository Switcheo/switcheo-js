import Web3 from 'web3'
import { NeoTransaction } from '../models/transaction/neoTransaction'
import { EthTransaction } from '../models/transaction/ethTransaction'

export enum SignatureProviderType {
  PrivateKey = 'privateKey',
  Ledger = 'ledger',
  Trezor = 'trezor',
  Metamask = 'metamask',
  O3 = 'o3',
  Trust = 'trust',
}

export interface SignatureProvider {
  readonly address: string
  readonly displayAddress: string
  readonly type: SignatureProviderType | string
  signParams(params: {}): Promise<string>
  signMessage(message: string): Promise<string>
  signTransaction(transaction: NeoTransaction | EthTransaction): Promise<string>
  sendTransaction(transaction: NeoTransaction | EthTransaction): Promise<string>
}

export interface Web3Provider extends SignatureProvider {
  readonly web3: Web3
}

export * from './neoPrivateKeyProvider'
export * from './neoLedgerProvider'
export * from './neoO3Provider'
export * from './ethPrivateKeyProvider'
export * from './ethLedgerProvider'
export * from './metamaskProvider'
export * from './ethTrezorProvider'
export * from './ethTrustProvider'
export * from './ethIMTokenProvider'
