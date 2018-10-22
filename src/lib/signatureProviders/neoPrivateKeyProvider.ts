import { wallet as neonWallet } from '@cityofzion/neon-core'
import { NeoTransaction } from '../models/transaction'
import { SignatureProvider, SignatureProviderType } from '.'
import { encodeNeoMessage } from './utils'
import { stringifyParams } from '../utils'

export class NeoPrivateKeyProvider implements SignatureProvider {
  public readonly address: string
  public readonly displayAddress: string
  public readonly type: SignatureProviderType
  private readonly account: neonWallet.Account

  constructor(key: string) {
    this.type = SignatureProviderType.PrivateKey
    this.account = new neonWallet.Account(key)
    this.address = this.account.scriptHash
    this.displayAddress = this.account.address
  }

  public signParams(params: {}): Promise<string> {
    const payload: string = stringifyParams(params)
    if (payload.length > 252) {
      throw new Error('Cannot sign a message more than 252 characters in length')
    }
    const encodedPayload: string = encodeNeoMessage(payload)
    return this.signMessage(encodedPayload)
  }

  public signMessage(message: string): Promise<string> {
    if (this.account.privateKey === undefined) {
      throw new Error('Private key must be provided to sign a message')
    }
    return Promise.resolve(neonWallet.generateSignature(message, this.account.privateKey))
  }

  public signTransaction(transaction: NeoTransaction): Promise<string> {
    const serializedTxn: string = transaction.serialize(false)
    return this.signMessage(serializedTxn)
  }

  public sendTransaction(_transaction: NeoTransaction): Promise<string> {
    return Promise.reject('sendTransaction() not implemented for NEO!')
  }
}
