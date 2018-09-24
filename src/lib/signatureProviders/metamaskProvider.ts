import { NeoTransaction } from '../models/transaction'
import { SignatureProvider } from '.'

export class MetamaskProvider implements SignatureProvider {
  public readonly address: string
  public readonly displayAddress: string
  private account: neonWallet.Account

  constructor(key: string) {
    this.account = new neonWallet.Account(key)
    this.address = this.account.scriptHash
    this.displayAddress = this.account.address
  }

  public signMessage(message: string): string {
  }

  public signTransaction(transaction: Transaction): string {
  }
}
