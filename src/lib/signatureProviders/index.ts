import { tx as neonTx } from '@cityofzion/neon-core'

export interface SignatureProvider {
  readonly address: string
  readonly displayAddress: string
  signMessage(message: string): string
  signTransaction(transaction: neonTx.Transaction): string
}

export * from './neoPrivateKeyProvider'
export * from './metamaskProvider'
