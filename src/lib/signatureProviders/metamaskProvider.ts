import Web3 from 'web3'
import { EthTransaction as Transaction } from '../models/transaction/ethTransaction'

import { Web3Provider, SignatureProviderType } from '.'
import { stringifyParams } from '../utils'

export class MetamaskProvider implements Web3Provider {
  public static async init(web3: Web3): Promise<MetamaskProvider> {
    // @ts-ignore we now using old version of web3 with no typescript
    const addresses: ReadonlyArray<string> = web3.eth.accounts
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
    return this.signMessage(stringifyParams(params))
  }

  public signMessage(message: string): Promise<string> {
    // return this.web3.eth.sign(this.web3.utils.hexToAscii(message), this.address)
    return new Promise(async (resolve, reject) => { // tslint:disable-line
      try {
        await this.ensureAccountUnchanged()
      } catch (err) {
        reject(err)
      }
      this.web3.currentProvider.sendAsync({
        id: new Date().getTime(),
        jsonrpc: '2.0',
        method: 'personal_sign',
        params: [this.address, message],
      }, (err: Error | null, res: any): void => { // tslint:disable-line
        if (err) reject(err)
        else if (res.error) reject(res.error)
        else resolve(res.result)
      })
    })
  }

  public signTransaction(_transaction: Transaction): Promise<string> {
    return Promise.reject('signTransaction() not implemented for MetaMask!')
  }

  public sendTransaction(transaction: Transaction): Promise<string> {
    return new Promise(async (resolve, reject) => { // tslint:disable-line
      await this.ensureAccountUnchanged()
      return this.web3.eth.sendTransaction(
        transaction,
        (error: Error, hash: string): void => {
          if (error) reject(error)
          else resolve(hash)
        })
    })
  }

  private async getCurrentAccount(): Promise<string | null> {
    // @ts-ignore we now using old version of web3 with no typescript
    const accounts: ReadonlyArray<string> = this.web3.eth.accounts
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
