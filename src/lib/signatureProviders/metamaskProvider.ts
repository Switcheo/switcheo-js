import Web3 from 'web3'
import { Tx as Transaction } from 'web3/eth/types' //tslint:disable-line
import { JsonRPCResponse } from 'web3/providers' //tslint:disable-line

import { Web3Provider, SignatureProviderType } from '.'
import { stringifyParams } from '../utils'

export class MetamaskProvider implements Web3Provider {
  public static async init(web3: Web3): Promise<MetamaskProvider> {
    const addresses: ReadonlyArray<string> = await web3.eth.getAccounts()
    if (addresses.length === 0) {
      this.throwMetaMaskLockedError()
    }
    return new MetamaskProvider(web3, addresses[0].toLowerCase())
  }

  private static throwMetaMaskLockedError(): void {
    throw new Error('MetaMask locked! ' +
      'Please click the extension icon to unlock it and try again.')
  }

  public readonly address: string
  public readonly displayAddress: string
  public readonly web3: Web3
  public readonly type: SignatureProviderType

  private constructor(web3: Web3, address: string) {
    this.type = SignatureProviderType.Metamask
    this.web3 = web3
    this.address = address
    this.displayAddress = address
  }

  public signParams(params: {}): Promise<string> {
    const msgParams: ReadonlyArray<object> = [
      {
        name: 'API Request',
        type: 'string',
        value: stringifyParams(params),
      },
    ]
    return new Promise(async (resolve, reject) => { // tslint:disable-line
      try {
        await this.ensureAccountUnchanged()
      } catch (err) {
        reject(err)
      }
      this.web3.currentProvider.send({
        id: new Date().getTime(),
        jsonrpc: '2.0',
        method: 'eth_signTypedData',
        params: [msgParams, this.address],
      }, (err: Error, res: JsonRPCResponse): void => { // tslint:disable-line
        if (err) reject(err)
        else if (res.error) reject(res.error)
        else resolve(res.result)
      })
    })
  }

  public signMessage(message: string): Promise<string> {
    // return this.web3.eth.sign(this.web3.utils.hexToAscii(message), this.address)
    return new Promise(async (resolve, reject) => { // tslint:disable-line
      try {
        await this.ensureAccountUnchanged()
      } catch (err) {
        reject(err)
      }
      this.web3.currentProvider.send({
        id: new Date().getTime(),
        jsonrpc: '2.0',
        method: 'personal_sign',
        params: [this.address, message],
      }, (err: Error, res: JsonRPCResponse): void => { // tslint:disable-line
        if (err) reject(err)
        else if (res.error) reject(res.error)
        else resolve(res.result)
      })
    })
  }

  public signTransaction(_transaction: Transaction): Promise<string> {
    return Promise.reject('signTransaction() not implemented for NEO!')
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
    if (!accounts) MetamaskProvider.throwMetaMaskLockedError()
    return accounts[0]
  }

  private async ensureAccountUnchanged(): Promise<void> {
    const address: string | null = await this.getCurrentAccount()
    if (!address || address.toLowerCase() !== this.address) {
      throw new Error('MetaMask account changed in extension! ' +
        'Please repeat authentication by re-connecting your wallet.')
    }
  }
}
