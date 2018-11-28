import Web3 from 'web3'
import { EthTransaction as Transaction } from '../models/transaction/ethTransaction'

import { Web3Provider, SignatureProviderType } from '.'
import { stringifyParams } from '../utils'

export class EthIMTokenProvider implements Web3Provider {
  public static async init(web3: Web3, address: string): Promise<EthIMTokenProvider> {
    if (!address) {
      throw new Error('No IM Wallet found.')
    }
    return new EthIMTokenProvider(web3, address.toLowerCase())
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
    return new Promise(async (resolve, reject) => { // tslint:disable-line
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
      return this.web3.eth.sendTransaction(
        transaction,
        (error: Error, hash: string): void => {
          if (error) reject(error)
          else resolve(hash)
        })
    })
  }
}
