import EthereumTx from 'ethereumjs-tx'
import Web3 from 'web3'
import { EthTransaction } from '../models/transaction'
import { SignatureProvider, SignatureProviderType } from '.'
import { combineEthSignature } from './utils'
import { stringifyParams } from '../utils'
import { isNodeJS } from '../utils/detect'
// @ts-ignore
import * as _TrezorConnect from 'trezor-connect'

// trezor currently only supports browser
let TrezorConnect: typeof _TrezorConnect = {} // tslint:disable-line
if (!isNodeJS) TrezorConnect = require('trezor-connect').default // tslint:disable-line

export class EthTrezorProvider implements SignatureProvider {
  public readonly address: string
  public readonly displayAddress: string
  public readonly web3: Web3
  public readonly bip32Path: string
  public readonly type: SignatureProviderType

  public constructor(web3: Web3, address: string, bip32Path: string) {
    this.type = SignatureProviderType.Trezor
    this.web3 = web3
    this.bip32Path = bip32Path
    this.address = address.toLowerCase()
    this.displayAddress = address
  }

  public signParams(params: {}): Promise<string> {
    return this.signMessage(Buffer.from(stringifyParams(params)).toString('hex'))
  }

  public async signMessage(hexMessage: string): Promise<string> {
    return TrezorConnect.ethereumSignMessage({
      hex: true,
      message: hexMessage,
      path: this.bip32Path,
    }).then((result: { success: boolean; payload: any }) => {
      const { success, payload } = result
      if (success) return `0x${payload.signature}`
      // else Error
      throw new Error(payload.error)
    })
  }

  public async signTransaction(transaction: EthTransaction): Promise<string> {
    const { payload } = await TrezorConnect.ethereumSignTransaction({
      path: this.bip32Path,
      transaction: this.getTrezorTransaction(transaction),
    })

    const { r, s, v } = payload
    return combineEthSignature({ r, s, v })
  }

  public sendTransaction(transaction: EthTransaction): Promise<string> {
    return new Promise(async (resolve, reject) => { // tslint:disable-line
      const { payload } = await TrezorConnect.ethereumSignTransaction({
        path: this.bip32Path,
        transaction: this.getTrezorTransaction(transaction),
      })

      const signedTransaction: string = this.serializeTransaction(
        {
          ...transaction,
          ...payload,
        }
      )

      return this.web3.eth.sendRawTransaction(
        `0x${signedTransaction}`,
        (error: Error, hash: string): void => {
          if (error) reject(error)
          else resolve(hash)
        }
      )
    })
  }

  private getTrezorTransaction(transaction: any): any {
    return {
      chainId: transaction.chainId,
      data: transaction.data,
      gasLimit: transaction.gas,
      gasPrice: transaction.gasPrice,
      nonce: transaction.nonce,
      to: transaction.to,
      value: transaction.value,
    }
  }

  private serializeTransaction(transaction: any): string {
    return new EthereumTx(transaction).serialize().toString('hex')
  }
}
