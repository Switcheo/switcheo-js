import Web3 from 'web3'

import { SignatureProviderType, Web3Provider } from './index'
import { EthTransaction } from '../models/transaction'
import { stringifyParams } from '../utils'

export class EthTrustProvider implements Web3Provider {
  public static async init(web3: Web3): Promise<EthTrustProvider> {
    const addresses: ReadonlyArray<string> = web3.eth.accounts
    return new EthTrustProvider(web3, addresses[0].toLowerCase())
  }

  public readonly web3: Web3
  public readonly address: string
  public readonly displayAddress: string
  public readonly type: SignatureProviderType | string

  private constructor(web3: Web3, address: string) {
    this.type = SignatureProviderType.Trust
    this.web3 = web3
    this.address = address
    this.displayAddress = address
  }

  public sendTransaction(transaction: EthTransaction): Promise<string> {
    return new Promise(async (resolve, reject) => { // tslint:disable-line:typedef
      this.web3.eth.sendTransaction(
        transaction,
        (error: Error, hash: string): void => {
          if (error) reject(error)
          else resolve(hash)
        })
    })
  }

  public signMessage(message: string): Promise<string> {
    return new Promise(async (resolve, reject) => { // tslint:disable-line:typedef
      this.web3.eth.sign(this.address, message, (err: Error | null, res: any): void => { // tslint:disable-line
        if (err) reject(err)
        else if (res.error) reject(res.error)
        else resolve(res.result)
      })
    })
  }

  public signParams(params: {}): Promise<string> {
    return this.signMessage(stringifyParams(params))
  }

  public signTransaction(_transaction: EthTransaction): Promise<string> {
    return Promise.reject('signTransaction() not implemented for Ethereum!')
  }
}
