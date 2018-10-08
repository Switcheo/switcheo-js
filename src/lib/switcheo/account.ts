import { Transaction } from '../models/transaction'
import { Blockchain } from '../constants/blockchains'
import { SignatureProvider } from '../signatureProviders'

export interface AccountParams {
  provider: SignatureProvider
  blockchain: Blockchain
}

export class Account {
  public readonly blockchain: Blockchain
  public readonly address: string
  public readonly displayAddress: string
  public readonly provider: SignatureProvider

  constructor({ blockchain, provider }: AccountParams) {
    this.blockchain = blockchain
    this.provider = provider
    this.address = this.provider.address
    this.displayAddress = this.provider.displayAddress
  }

  public signParams(params: object): Promise<string> {
    return this.provider.signParams(params)
  }

  public signMessage(message: string): Promise<string> {
    return this.provider.signMessage(message)
  }

  public signTransaction(transaction: Transaction): Promise<string> {
    return this.provider.signTransaction(transaction)
  }

  public sendTransaction(transaction: Transaction): Promise<string> {
    return this.provider.sendTransaction(transaction)
  }
}
