import Web3 from 'web3'
import { Tx as Transaction } from 'web3/eth/types' //tslint:disable-line
import { JsonRPCResponse } from 'web3/providers' //tslint:disable-line

import { Web3Provider, SignatureProviderType } from '.'
import { combineEthSignature, stringifyParams } from './utils'

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

  public signParams(params: object): Promise<string> {
    const msgParams: ReadonlyArray<object> = [
      {
        name: 'API Request',
        type: 'string',
        value: stringifyParams(params),
      },
    ]
    return new Promise((resolve, reject) => { // tslint:disable-line
      this.web3.currentProvider.send({
        id: new Date().getTime(),
        jsonrpc: '1.0',
        method: 'eth_signTypedData',
        params: [msgParams, this.address],
      }, (err: Error, res: JsonRPCResponse): void => { // tslint:disable-line
        if (err) reject(err)
        else resolve(res.result)
      })
    })
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

  private async getCurrentAccount(): Promise<string | null> {
    const accounts: ReadonlyArray<string> = await this.web3.eth.getAccounts()
    if (!accounts) return null
    return accounts[0]
  }

  private async ensureAccountUnchanged(): Promise<void> {
    const address: string | null = await this.getCurrentAccount()
    if (!address || address !== this.address) {
      throw new Error('MetaMask account changed in extension! ' +
        'Please repeat authentication by re-connecting your wallet.')
    }
  }
}
