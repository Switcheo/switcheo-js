import Web3 from 'web3'

import { SignatureProviderType, Web3Provider } from './index'
import { EthTransaction } from '../models/transaction'
import { stringifyParams } from '../utils'
import { toHex } from './utils'

export class EthWeb3Provider implements Web3Provider {
  public readonly web3: Web3
  public readonly address: string
  public readonly displayAddress: string
  public readonly type: SignatureProviderType | string

  protected constructor(type: SignatureProviderType, web3: Web3, address: string) {
    this.type = type
    this.web3 = web3
    this.address = address
    this.displayAddress = address
  }

  public sendTransaction(transaction: EthTransaction): Promise<string> {
    return new Promise(async (resolve, reject) => { // tslint:disable-line:typedef
      this.web3.currentProvider.sendAsync({
        id: new Date().getTime(),
        jsonrpc: '2.0',
        method: 'eth_sendTransaction',
        params: [transaction],
      }, (err: Error | null, res: any): void => { // tslint:disable-line
        if (err) reject(err)
        else if (res.error) reject(res.error)
        else resolve(res.result)
      })
    })
  }

  public signMessage(message: string): Promise<string> {
    return new Promise(async (resolve, reject) => { // tslint:disable-line:typedef
      this.web3.currentProvider.sendAsync({
        id: new Date().getTime(),
        jsonrpc: '2.0',
        method: 'personal_sign',
        params: [message, this.address],
            }, (err: Error | null, res: any): void => { // tslint:disable-line
        if (err) reject(err)
        else if (res.error) reject(res.error)
        else resolve(res.result)
      })
    })
  }

  public signParams(params: {}): Promise<string> {
    return this.signMessage(`0x${toHex(stringifyParams(params))}`)
  }

  public signTransaction(_transaction: EthTransaction): Promise<string> {
    return Promise.reject('signTransaction() not implemented for Ethereum!')
  }
}
