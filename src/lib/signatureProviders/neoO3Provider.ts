import { wallet as neonWallet } from '@cityofzion/neon-core'
import { NeoTransaction } from '../models/transaction'
import { SignatureProvider, SignatureProviderType } from '.'
import { encodeNeoMessage } from './utils'
import { stringifyParams } from '../utils'
import { o3 } from '../utils/o3'

/**
 * Usage:
 * // Create a new NeoO3Provider asynchronously using init()
 */
export class NeoO3Provider implements SignatureProvider {
  // Creates a NeoO3Provider asynchronously
  public static init(connect: boolean = false): Promise<NeoO3Provider> {
    return new Promise((resolve: any, reject: any): any => {
      const providerCallback: (response: object) => void = (response: any): void => {
        if (response.command === 'init') {
          if (connect) {
            o3.requestToConnect()
          } else { // skip connect
            return resolve()
          }
        }
        if (response.command === 'requestToConnect') {
          if (response.error) {
            // tslint:disable-next-line no-console
            console.error(JSON.stringify(response.error)) // eslint-disable-line no-console
            reject(new Error('Failed to connect to O3 wallet!'))
          } else {
            const neoO3Provider: NeoO3Provider = new NeoO3Provider(
              response.data.publicKey.toLowerCase(),
              response.sessionID
            )
            resolve(neoO3Provider)
          }
        }
      }
      try {
        o3.init(providerCallback)
      } catch (error) {
        throw new Error('Error initializing O3 wallet! ' + error)
      }
    })
  }

  public readonly address: string
  public readonly displayAddress: string
  public readonly publicKey: string
  public readonly type: SignatureProviderType
  public readonly o3SessionID: string

  private constructor(publicKey: string, o3SessionID: string) {
    this.type = SignatureProviderType.O3
    this.publicKey = publicKey
    this.address = neonWallet.getScriptHashFromPublicKey(publicKey)
    this.displayAddress = neonWallet.getAddressFromScriptHash(this.address)
    this.o3SessionID = o3SessionID
  }

  public signParams(params: object): Promise<string> {
    const payload: string = stringifyParams(params)
    if (payload.length > 252) {
      throw new Error(
        'Cannot sign a message more than 252 characters in length'
      )
    }
    const encodedPayload: string = encodeNeoMessage(payload)
    return this.signMessage(encodedPayload)
  }

  public signMessage(message: string): Promise<string> {
    return this.getO3Signature(message, this.o3SessionID)
  }

  public async signTransaction(transaction: NeoTransaction): Promise<string> {
    const serializedTxn: string = transaction.serialize(false)
    return this.getO3Signature(serializedTxn, this.o3SessionID)
  }

  public sendTransaction(_transaction: NeoTransaction): Promise<string> {
    return Promise.reject('sendTransaction() not implemented for NEO!')
  }

  /**
   * Gets a signature of the given message using O3 API.
   * @param {string} txn - The txn to be signed, serialized as a hex string
   * @param {string} sessionID - The O3 session ID
   * @return {Promise<string>} Signature
   */
  private getO3Signature(txn: string, sessionID: string): Promise<string> {
    return new Promise((resolve: any, reject: any): any => {
      const callback: (response: any) => any = (response: any): any => {
        try {
          if (!response || response.error) {
            // tslint:disable-next-line no-console
            console.warn(response && JSON.stringify(response.error))
            reject(
              new Error(`Could not connect to O3 wallet! Please try reconnecting.
              <${response && JSON.stringify(response.error)}>`)
            )
          }
          if (response.command === 'init') {
            o3.verifySession(sessionID)
          }
          if (response.command === 'verifySession') {
            o3.requestToSignRawTransaction(txn)
          }
          if (response.command === 'requestToSign') {
            resolve(response.data.signatureData)
          }
        } catch (err) {
          reject(err)
        }
      }
      o3.init(callback)
    })
  }
}
