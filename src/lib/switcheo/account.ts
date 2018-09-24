import { Transaction } from '../models/transaction'
import { Blockchain } from '../constants/blockchains'
import { encodeMessage, stringifyParams } from '../utils'
import { SignatureProvider } from '../signatureProviders'

export interface AccountParams {
  provider: SignatureProvider
  blockchain: Blockchain
}

export class Account {
  public readonly blockchain: Blockchain
  public readonly address: string
  public readonly displayAddress: string
  private readonly provider: SignatureProvider

  constructor({ blockchain, provider }: AccountParams) {
    this.blockchain = blockchain
    this.provider = provider
    this.address = this.provider.address
    this.displayAddress = this.provider.displayAddress
  }

  public signParams(params: object): Promise<string> {
    const payload: string = stringifyParams(params)
    if (payload.length > 252) {
      throw new Error('Cannot sign a message more than 252 characters in length')
    }
    const encodedPayload: string = encodeMessage(payload)
    return this.signMessage(encodedPayload)
  }

  public signMessage(message: string): Promise<string> {
    return this.provider.signMessage(message)
  }

  public signTransaction(transaction: Transaction): Promise<string> {
    return this.provider.signTransaction(transaction)
  }
}
