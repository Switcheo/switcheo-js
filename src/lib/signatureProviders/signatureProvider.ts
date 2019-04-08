import { SignatureProviderType } from '.'

import { Transaction } from '../models/transaction'

export interface SignatureProvider {
  readonly address: string
  readonly displayAddress: string
  readonly type: SignatureProviderType | string
  signParams(params: {}): Promise<string>
  signMessage(message: string): Promise<string>
  signTransaction(transaction: Transaction): Promise<string>
  sendTransaction(transaction: Transaction): Promise<string>
}
