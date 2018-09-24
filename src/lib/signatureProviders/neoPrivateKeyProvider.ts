import { wallet as neonWallet } from '@cityofzion/neon-core'
import { NeoTransaction } from '../models/transaction'
import { SignatureProvider } from '.'

export class NeoPrivateKeyProvider implements SignatureProvider {
  public readonly address: string
  public readonly displayAddress: string
  private readonly account: neonWallet.Account

  constructor(key: string) {
    this.account = new neonWallet.Account(key)
    this.address = this.account.scriptHash
    this.displayAddress = this.account.address
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
}
