import { Blockchain } from '../constants/blockchains'
import { encodeMessage, stringifyParams } from '../utils'
import { wallet as neoWallet, tx as neoTx } from '@cityofzion/neon-js'
import Transaction from '../models/transaction'

export interface SwitcheoAccountParams {
  readonly address: string
  readonly privateKey: string
  readonly blockchain: Blockchain
}

export default class SwitcheoAccount {
  public address!: string
  public privateKey?: string
  public blockchain: Blockchain

  constructor({ address, privateKey, blockchain }: SwitcheoAccountParams) {
    this.setAddress(address)
    this.setPrivateKey(privateKey)
    this.blockchain = blockchain
  }

  public signParams(params: object): string {
    const payload = stringifyParams(params)
    if (payload.length > 252) {
      throw new Error('Cannot sign a message more than 252 characters in length')
    }
    const encodedPayload = encodeMessage(payload)
    return this.signMessage(encodedPayload)
  }

  public signMessage(message: string): string {
    if (this.privateKey === undefined) {
      throw new Error('Private key must be provided to sign a message')
    }
    return neoWallet.generateSignature(message, this.privateKey)
  }

  public signTransaction(transaction: Transaction): string {
    const serializedTxn = neoTx.serializeTransaction(transaction, false)
    return this.signMessage(serializedTxn)
  }

  private setAddress(address: string): void {
    this.address = new neoWallet.Account(address).scriptHash
  }

  private setPrivateKey(privateKey: string | undefined): void {
    if (privateKey === undefined) { return }
    this.privateKey = new neoWallet.Account(privateKey).privateKey
  }
}
