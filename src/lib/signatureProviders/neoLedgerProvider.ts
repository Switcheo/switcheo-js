import { wallet as neonWallet } from '@cityofzion/neon-core'
import { NeoTransaction } from '../models/transaction'
import { SignatureProvider, SignatureProviderType } from '.'
import { encodeNeoMessage } from './utils'
import { stringifyParams } from '../utils'
import Ledger from '../utils/neoLedger'

/**
 * Usage:
 * // Create a new NeoLedgerProvider asynchronously using init()
 */
export class NeoLedgerProvider implements SignatureProvider {
  // Creates a NeoLedgerProvider asynchronously
  public static async init(): Promise<NeoLedgerProvider> {
    const ledger: Ledger = await Ledger.init()

    try {
      const publicKey: string = await ledger.getPublicKey()
      return new NeoLedgerProvider(publicKey)
    } finally {
      await ledger.close()
    }
  }

  public readonly address: string
  public readonly displayAddress: string
  public readonly publicKey: string
  public readonly type: SignatureProviderType

  private constructor(publicKey: string) {
    this.type = SignatureProviderType.Ledger
    this.publicKey = publicKey
    this.address = neonWallet.getScriptHashFromPublicKey(publicKey)
    this.displayAddress = neonWallet.getAddressFromScriptHash(this.address)
  }

  public signParams(params: object): Promise<string> {
    const payload: string = stringifyParams(params)
    if (payload.length > 252) {
      throw new Error('Cannot sign a message more than 252 characters in length')
    }
    const encodedPayload: string = encodeNeoMessage(payload)
    return this.signMessage(encodedPayload)
  }

  public async signMessage(message: string): Promise<string> {
    await this.ensurePublicKeyUnchanged()

    const ledger: Ledger = await Ledger.init()
    try {
      return ledger.getSignature(message)
    } finally {
      await ledger.close()
    }
  }

  public async signTransaction(transaction: NeoTransaction): Promise<string> {
    await this.ensurePublicKeyUnchanged()

    const serializedTxn: string = transaction.serialize(false)
    const ledger: Ledger = await Ledger.init()
    try {
      return ledger.getSignature(serializedTxn)
    } finally {
      await ledger.close()
    }
  }

  public async isConnected(): Promise<boolean> {
    const publicKey: string = await this.getPublicKey()
    return this.publicKey === publicKey
  }

  private async ensurePublicKeyUnchanged(): Promise<void> {
    const isConnected: boolean = await this.isConnected()
    if (!isConnected) {
      throw new Error(
        'Ledger address changed! ' +
          'Please repeat authentication by re-connecting your ledger.'
      )
    }
  }

  private async getPublicKey(): Promise<string> {
    const ledger: Ledger = await Ledger.init()
    try {
      return ledger.getPublicKey()
    } finally {
      await ledger.close()
    }
  }
}
