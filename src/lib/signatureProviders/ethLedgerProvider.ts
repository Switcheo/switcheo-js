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

  // Creates a EthLedgerProvider asynchronously
  public static async init(
    web3: Web3
  ): Promise<EthLedgerProvider> {
    const supported: boolean = await TransportU2F.isSupported()
    if (!supported) {
      throw new Error('Your browser does not support the ledger! Please use Google Chrome.')
    }
    const transport: Transport = await TransportU2F.create(1000, 1000)
    const ledger: Eth = new Eth(transport, 'switcheoEth')
    await ledger.getAddress('44\'/60\'/0\'/0', false, false) // ping something

    return new EthLedgerProvider(ledger, web3)
  }

  public address: string
  public displayAddress: string
  public readonly web3: Web3
  public bip32Path: string
  public readonly type: SignatureProviderType

  private readonly ledger: Eth

  private constructor(ledger: Eth, web3: Web3) {
    this.type = SignatureProviderType.Ledger
    this.web3 = web3
    this.ledger = ledger
    this.bip32Path = ''
    this.address = ''
    this.displayAddress = ''
  }

  public async listAddresses(
    pathDerivation: string,
    start: number,
    end: number
  ): Promise<ReadonlyArray<string>> {
    const addresses: string[] = [] // tslint:disable-line
    for (let i: number = start; i < end; i += 1) {
      const { address } = await this.ledger.getAddress(
        pathDerivation.replace('x', i.toString()), false, false)
      addresses.push(address)
    }
    return addresses
  }

  public async connect(bip32Path: string): Promise<void> {
    this.bip32Path = bip32Path
    const { address } = await this.ledger.getAddress(bip32Path, false, false)
    this.address = address.toLowerCase()
    this.displayAddress = address
  }

  public signParams(params: {}): Promise<string> {
    const message: string = Buffer.from(stringifyParams(params)).toString('hex')
    return this.signMessage(message)
  }

  public async signMessage(message: string): Promise<string> {
    await this.ensureValidConnection()

    const { r, s, v } = await this.ledger.signPersonalMessage(
      this.bip32Path, message.replace(/^0x/, ''))
    return combineEthSignature({ r, s, v })
  }

  public async signTransaction(transaction: EthTransaction): Promise<string> {
    await this.ensureValidConnection()

    const hexTransaction: string = this.serializeTransaction(transaction)
    const { r, s, v } = await this.ledger.signTransaction(this.bip32Path, hexTransaction)
    return combineEthSignature({ r, s, v })
  }

  public sendTransaction(transaction: any): Promise<string> {
    return new Promise(async (resolve, reject) => { // tslint:disable-line
      await this.ensureValidConnection()

      const txn: any = {
        chainId: transaction.chainId,
        data: transaction.data,
        gasLimit: transaction.gas,
        gasPrice: transaction.gasPrice,
        nonce: transaction.nonce,
        to: transaction.to,
        value: transaction.value,
        r: '0x00', // tslint:disable-line:object-literal-sort-keys
        s: '0x00',
        v: '0x01',
      }

      const hexTransaction: string = this.serializeTransaction(txn)
      const { r, s, v } = await this.ledger.signTransaction(this.bip32Path, hexTransaction)

      const signedTxn: any = {
        ...txn,
        r: `0x${r}`,
        s: `0x${s}`,
        v: `0x${v}`,
      }

      const signedTransaction: string = this.serializeTransaction(signedTxn)

      return this.web3.eth.sendRawTransaction(
        `0x${signedTransaction}`, (error: Error, hash: string): void => {
          if (error) reject(error)
          else resolve(hash)
        })
    })
  }

  private serializeTransaction(transaction: any): string {
    return new EthereumTx(transaction).serialize().toString('hex')
  }

  private async ensureValidConnection(): Promise<void> {
    const { address } = await this.ledger.getAddress(this.bip32Path, false, false)
    if (address === '' || address.toLowerCase() !== this.address) {
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
