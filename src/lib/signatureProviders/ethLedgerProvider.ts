import Eth from '@ledgerhq/hw-app-eth'
import Transport from '@ledgerhq/hw-transport'
import TransportU2F from '@ledgerhq/hw-transport-u2f'
import EthereumTx from 'ethereumjs-tx'
import Web3 from 'web3'
import { EthTransaction } from '../models/transaction'
import { SignatureProvider, SignatureProviderType } from '.'
import { combineEthSignature } from './utils'
import { stringifyParams } from '../utils'

/**
 * Usage:
 * // Create a new EthLedgerProvider asynchronously using init(bip32Path)
 */
export class EthLedgerProvider implements SignatureProvider {
  // Creates a NeoLedgerProvider asynchronously
  public static async init(web3: Web3, bip32Path: string): Promise<EthLedgerProvider> {
    const supported: boolean = await TransportU2F.isSupported()
    if (!supported) {
      throw new Error('Your browser does not support the ledger! Please use Google Chrome.')
    }
    const transport: Transport = await TransportU2F.create(1000, 1000)
    const ledger: Eth = new Eth(transport, 'switcheoEth')
    const { address } = await ledger.getAddress(bip32Path, false, false)
    return new EthLedgerProvider(web3, address, bip32Path, ledger)
  }

  public readonly address: string
  public readonly displayAddress: string
  public readonly web3: Web3
  public readonly bip32Path: string
  public readonly type: SignatureProviderType

  private readonly ledger: Eth

  private constructor(web3: Web3, address: string, bip32Path: string, ledger: Eth) {
    this.type = SignatureProviderType.Ledger
    this.web3 = web3
    this.bip32Path = bip32Path
    this.address = address.toLowerCase()
    this.displayAddress = address
    this.ledger = ledger
  }

  public signParams(params: {}): Promise<string> {
    return this.signMessage(stringifyParams(params))
  }

  public async signMessage(message: string): Promise<string> {
    await this.ensureValidConnection()
    const hexMessage: string = Buffer.from(message).toString('hex')

    const { r, s, v } = await this.ledger.signPersonalMessage(this.bip32Path, hexMessage)
    return combineEthSignature({ r, s, v: v - 27 })
  }

  public async signTransaction(transaction: EthTransaction): Promise<string> {
    await this.ensureValidConnection()

    const hexTransaction: string = this.serializeTransaction(transaction)
    const { r, s, v } = await this.ledger.signTransaction(this.bip32Path, hexTransaction)
    return combineEthSignature({ r, s, v })
  }

  public sendTransaction(transaction: EthTransaction): Promise<string> {
    return new Promise(async (resolve, reject) => { // tslint:disable-line
      const signedTransaction: string = await this.signTransaction(transaction)
      return this.web3.eth.sendRawTransaction(
        signedTransaction, (error: Error, hash: string): void => {
          if (error) reject(error)
          else resolve(hash)
        })
    })
  }

  private serializeTransaction(transaction: EthTransaction): string {
    return new EthereumTx(transaction).serialize().toString('hex')
  }

  private async ensureValidConnection(): Promise<void> {
    const { address } = await this.ledger.getAddress(this.bip32Path, false, false)
    if (address.toLowerCase() !== this.address) {
      throw new Error(
        'Ledger configuration changed! ' +
        'Please repeat authentication by re-connecting your ledger.'
      )
    }
    const { arbitraryDataEnabled } = await this.ledger.getAppConfiguration()
    if (!arbitraryDataEnabled) {
      throw new Error(
        'Please enable "Contract Data" in your Ethereum Ledger App settings.'
      )
    }
  }
}
