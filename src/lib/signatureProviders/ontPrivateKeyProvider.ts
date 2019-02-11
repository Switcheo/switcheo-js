
import { Crypto } from 'ontology-ts-sdk'
import { OntTransaction } from '../models/transaction'
import { SignatureProvider, SignatureProviderType } from '.'
import { encodeOntMessage } from './utils'
import { stringifyParams } from '../utils'

export class OntPrivateKeyProvider implements SignatureProvider {
  public readonly address: string
  public readonly displayAddress: string
  public readonly type: SignatureProviderType
  private readonly privateKey: Crypto.PrivateKey

  constructor(key: string) {
    this.type = SignatureProviderType.PrivateKey
    this.privateKey = Crypto.PrivateKey.deserializeWIF(key)

    const publicKey: Crypto.PublicKey = this.privateKey.getPublicKey()
    this.address = Crypto.Address.fromPubKey(publicKey).value
    this.displayAddress = this.address
  }

  public signParams(params: {}): Promise<string> {
    const payload: string = stringifyParams(params)
    if (payload.length > 252) {
      throw new Error('Cannot sign a message more than 252 characters in length')
    }
    const encodedPayload: string = encodeOntMessage(payload)
    return this.signMessage(encodedPayload)
  }

  public signMessage(message: string): Promise<string> {
    if (this.privateKey === undefined) {
      throw new Error('Private key must be provided to sign a message')
    }
    return this.privateKey.signAsync(message).then((signature: Crypto.Signature) => signature.value)
  }

  public signTransaction(transaction: OntTransaction): Promise<string> {
    const serializedTxn: string = transaction.serializeUnsignedData()
    return this.signMessage(serializedTxn)
  }

  public sendTransaction(_transaction: OntTransaction): Promise<string> {
    return Promise.reject('sendTransaction() not implemented for ONT!')
  }
}
