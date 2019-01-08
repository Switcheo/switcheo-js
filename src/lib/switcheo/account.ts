import { Transaction } from '../models/transaction'
import { Blockchain } from '../constants/blockchains'
import { SignatureProvider } from '../signatureProviders'
import { Config } from './config'
import { performRequest } from '../api/helpers'

export interface AccountParams {
  provider: SignatureProvider
  blockchain: Blockchain
  apiKey?: ApiKey
}

export interface ApiKey {
  key: string
  expiresAt: number
}

export class Account {
  public readonly blockchain: Blockchain
  public readonly address: string
  public readonly displayAddress: string
  public readonly provider: SignatureProvider
  public readonly apiKey: ApiKey = { key: '', expiresAt: 0 }

  constructor({ blockchain, provider }: AccountParams) {
    this.blockchain = blockchain
    this.provider = provider
    this.address = this.provider.address
    this.displayAddress = this.provider.displayAddress
  }

  public signParams(params: {}): Promise<string> {
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

  public async getApiKey(config: Config): Promise<string> {
    const apiKey: string = this.hasValidApiKey() ? this.apiKey.key :
      await this.refreshApiKey(config)
    if (!apiKey) throw new Error('Could not create an API key.')
    return apiKey
  }

  public hasValidApiKey(): boolean {
    return this.apiKey &&
      // treated as expired 60s before expiry date
      (new Date((this.apiKey.expiresAt - 60) * 1000) > new Date())
  }

  public async refreshApiKey(config: Config): Promise<string> {
    const result: ApiKey =
      await performRequest(config, this, '/api_keys', {
        blockchain: this.blockchain,
        message: 'Create API Key for the next 30 minutes',
      }) as ApiKey

    this.apiKey.key = result.key
    this.apiKey.expiresAt = result.expiresAt
    return Promise.resolve(this.apiKey.key)
  }
}
