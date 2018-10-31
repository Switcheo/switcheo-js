import Web3 from 'web3'
import { Tx as Transaction } from 'web3/eth/types' //tslint:disable-line
import { JsonRPCResponse } from 'web3/providers' //tslint:disable-line

import { Web3Provider, SignatureProviderType } from '.'
import { stringifyParams } from '../utils'

export class EthPrivateKeyProvider implements Web3Provider {
  public static async init(web3: Web3): Promise<EthPrivateKeyProvider> {
    const addresses: ReadonlyArray<string> = await web3.eth.getAccounts()
    if (addresses.length === 0) {
      this.throwNoAddressInitializedError()
    }
    return new EthPrivateKeyProvider(web3, addresses[0].toLowerCase())
  }

  private static throwNoAddressInitializedError(): void {
    throw new Error('Address detection failed! ' +
      'Please try again.')
  }

  public readonly address: string
  public readonly displayAddress: string
  public readonly web3: Web3
  public readonly type: SignatureProviderType

  private constructor(web3: Web3, address: string) {
    this.type = SignatureProviderType.PrivateKey
    this.web3 = web3
    this.address = address
    this.displayAddress = address
  }

  public signParams(params: {}): Promise<string> {
    return this.signMessage(stringifyParams(params))
  }

  public signMessage(message: string): Promise<string> {
    return new Promise(async (resolve, reject) => { // tslint:disable-line
      try {
        await this.ensureAccountUnchanged()
      } catch (err) {
        reject(err)
      }
      this.web3.currentProvider.send({
        id: new Date().getTime(),
        jsonrpc: '2.0',
        method: 'eth_sign',
        params: [this.address, message],
      }, (err: Error, res: JsonRPCResponse): void => { // tslint:disable-line
        if (err) reject(err)
        else if (res.error) reject(res.error)
        else resolve(res.result)
      })
    })
  }

  public signTransaction(_transaction: Transaction): Promise<string> {
    return Promise.reject('signTransaction() not implemented for Ethereum!')
  }

  public sendTransaction(transaction: Transaction): Promise<string> {
    return new Promise(async (resolve, reject) => { // tslint:disable-line
      await this.ensureAccountUnchanged()
      return this.web3.eth.sendTransaction(transaction, (error: Error, hash: string): void => {
        if (error) reject(error)
        else resolve(hash)
      })
    })
  }

  private async getCurrentAccount(): Promise<string | null> {
    const accounts: ReadonlyArray<string> = await this.web3.eth.getAccounts()
    if (!accounts) EthPrivateKeyProvider.throwNoAddressInitializedError()
    return accounts[0]
  }

  private async ensureAccountUnchanged(): Promise<void> {
    const address: string | null = await this.getCurrentAccount()
    if (!address || address.toLowerCase() !== this.address) {
      throw new Error('Account changed! ' +
        'Please repeat authentication by re-connecting your wallet.')
    }
  }
}
