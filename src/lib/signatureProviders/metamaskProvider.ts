import Web3 from 'web3'
import { Tx as Transaction } from 'web3/eth/types' //tslint:disable-line

import { Web3Provider, SignatureProviderType } from '.'
import { combineEthSignature } from './utils'

export class MetamaskProvider implements Web3Provider {
  public static init(web3: Web3): Promise<MetamaskProvider> {
    return web3.eth.getAccounts().then(
      (addresses: ReadonlyArray<string>): MetamaskProvider =>
        new MetamaskProvider(web3, addresses[0])
    )
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

  public async signMessage(message: string): Promise<string> {
    await this.ensureAccountUnchanged()
    return this.web3.eth.sign(message, this.address)
  }

  public async signTransaction(transaction: Transaction): Promise<string> {
    await this.ensureAccountUnchanged()
    const { tx } = await this.web3.eth.signTransaction(transaction, this.address)
    const { r, s, v } = tx
    return combineEthSignature({ r, s, v })
  }

  private async getCurrentAccount(): Promise<string> {
    const accounts: ReadonlyArray<string> = await this.web3.eth.getAccounts()
    return accounts[0]
  }

  private async ensureAccountUnchanged(): Promise<void> {
    const address: string = await this.getCurrentAccount()
    if (address !== this.address) {
      throw new Error('MetaMask account changed in extension! ' +
        'Please repeat authentication by re-connecting your wallet.')
    }
  }
}
