import { u } from '@cityofzion/neon-core'
import TransportU2F from '@liquality/hw-transport-u2f'

// FIXME: only included minimal set of typings to make this library work
// as the ledger library has no typedefs
type TransportStatusError = Error & {
  name: string
  statusCode: number
  statusText: string | ReadonlyArray<string>
  smsg: string
  statusCodeStr: string
  message: string
}

enum StatusCodes {
  Ok = 0x9000,
  TransactionTooBig = 0x6d08,
  AppClosed = 0x6e00,
  TransactionDeniedByUser = 0x6985,
  TransactionAttributeUsageTypeDecodingError = 0x6d07,
}

/**
 * Usage:
 * Call open() before calling any other function to sign or get public key
 * Call close() after you are done
 * This class works for NEO only
 */
export default class Ledger {
  /**
   * Initialises by listing devices and trying to find a ledger device connected.
   * Throws an error if no ledgers detected or unable to connect.
   * @return {Promise<Ledger>}
   */
  public static async init(): Promise<Ledger> {
    const supported: boolean = await TransportU2F.isSupported()
    if (!supported) {
      throw new Error('Your browser does not support the ledger! Please use Google Chrome.')
    }
    console.log(TransportU2F, supported)
    const paths: ReadonlyArray<any> = await Ledger.list()
    console.log(paths)
    if (paths.length === 0) throw new Error('USB Error: No ledger device found.')
    const ledger: Ledger = new Ledger(paths[0])
    return ledger.open()
  }

  public static async list(): Promise<ReadonlyArray<any>> {
    return TransportU2F.list()
  }

  public path: string
  public device: TransportU2F | null

  constructor(path: string) {
    this.path = path
    this.device = null
  }

  /**
   * Opens an connection with the selected ledger. Or raise error
   * @return {Promise<Ledger>}
   */
  public async open(): Promise<Ledger> {
    try {
      this.device = await TransportU2F.open(this.path)
      this.device!.setScrambleKey('NEO')
      return this
    } catch (err) {
      throw this.evalTransportError(err)
    }
  }

  /**
   * Closes the connection between the Ledger and the wallet.
   * @return {Promise<void>}}
   */
  public close(): Promise<void> {
    if (this.device) return this.device.close()
    return Promise.resolve()
  }

  /**
   * Retrieves the public key of an address index from the Ledger.
   * @param {number} [addressIndex] - Index that you want to retrieve the public key from.
   * @return {Promise<string>} Public Key (Unencoded)
   */
  public async getPublicKey(addressIndex: number = 0): Promise<string> {
    const res: Buffer = await this.send('80040000', this.bip44(addressIndex), [StatusCodes.Ok])
    return res.toString('hex').substring(0, 130)
  }

  /**
   * Sends a message with params over to the Ledger.
   * @param {string} params - params as a hexstring
   * @param {string} msg - Message as a hexstring
   * @param {number[]} statusList - Statuses to return
   * @return {Promise<Buffer>} return value decoded to ASCII string
   */
  public async send(params: string, msg: string, statusList: ReadonlyArray<number>):
    Promise<Buffer> {
    if (params.length !== 8) throw new Error('params requires 4 bytes')
    const [cla, ins, p1, p2]: ReadonlyArray<number> = params
      .match(/.{1,2}/g)!
      .map((i: string): number => parseInt(i, 16))

    try {
      return await this.device!.send(
        cla,
        ins,
        p1,
        p2,
        Buffer.from(msg, 'hex'),
        statusList
      )
    } catch (err) {
      throw this.evalTransportError(err)
    }
  }

  /**
   * Gets the ECDH signature of the data from Ledger using acct
   * @param {string} data - The data TODO: more descriptive
   * @param {number} addressIndex - addressIndex TODO: more descriptive
   * @return {Promise<string>}
   */
  public async getSignature(data: string, addressIndex: number = 0): Promise<string> {
    let newData: string = data
    newData += this.bip44(addressIndex)
    let response: Buffer | number | null = null
    const chunks: ReadonlyArray<string> = newData.match(/.{1,500}/g) || []
    if (!chunks.length) throw new Error(`Invalid data provided: ${newData}`)
    for (let i: number = 0; i < chunks.length; i += 1) {
      const p: string = i === chunks.length - 1 ? '80' : '00'
      const chunk: string = chunks[i]
      const params: string = `8002${p}00`
      const [err, res]: [TransportStatusError | null, Buffer | number] =
        await asyncWrap(this.send(params, chunk, [StatusCodes.Ok]))
      if (err) throw this.evalTransportError(err)
      response = res
    }
    if (response === 0x9000) {
      throw new Error('No more data but Ledger did not return signature!')
    }
    return this.assembleSignature((response as Buffer | null)!.toString('hex'))
  }

  /* *************** */
  /* PRIVATE METHODS */
  /* *************** */

  /**
   * The signature is returned from the ledger in a DER format
   * @param {string} response - Signature in DER format
   */
  private assembleSignature(response: string): string {
    const ss: u.StringStream = new u.StringStream(response)
    // The first byte is format. It is usually 0x30 (SEQ) or 0x31 (SET)
    // The second byte represents the total length of the DER module.
    ss.read(2)
    // Now we read each field off
    // Each field is encoded with a type byte, length byte followed by the data itself
    ss.read(1) // Read and drop the type
    const r: string = ss.readVarBytes()
    ss.read(1)
    const s: string = ss.readVarBytes()

    // We will need to ensure both integers are 32 bytes long
    const integers: ReadonlyArray<string> = [r, s].map((i: string) => {
      let j: string = i
      if (i.length < 64) {
        j = i.padStart(64, '0')
      }
      if (i.length > 64) {
        j = i.substr(-64)
      }
      return j
    })

    return integers.join('')
  }

  /**
   * Evaluates Transport Error thrown and rewrite the error message to be more user friendly.
   * @param {TransportStatusError} err
   * @return {TransportStatusError}
   */
  private evalTransportError(error: TransportStatusError): TransportStatusError {
    switch (error.statusCode) {
      case StatusCodes.AppClosed:
        error.message = 'Your NEO app is closed! Please login.'
        break
      case StatusCodes.TransactionTooBig:
        error.message = 'Your transaction is too big for the ledger to sign!'
        break
      case StatusCodes.TransactionDeniedByUser:
        error.message = 'You have denied the transaction on your ledger.'
        break
      case StatusCodes.TransactionAttributeUsageTypeDecodingError:
        error.message = 'Error parsing transaction. Make sure your NEO app version is up to date.'
        break
      default:
        break
    }
    return error
  }

  /**
   * Path derivation based on BIP44
   * @param {number} addressIndex
   * @return {string} the BIP44 compliant path
   */
  private bip44(addressIndex: number = 0): string {
    const addressIndexHex: string = addressIndex.toString(16)
    return (
      // Purpose: constant set to 44' (or 0x8000002C) following the BIP43 recommendation
      '8000002C' +
      // Registered coin type: https://github.com/satoshilabs/slips/blob/master/slip-0044.md
      '80000378' +
      // Account: This level splits the key space into independent user identities,
      // so the wallet never mixes the coins across different accounts.
      '80000000' +
      // Change: Constant 0 is used for external chain and constant 1 for internal chain
      // (also known as change addresses).
      // External chain is used for addresses that are meant to be visible outside of the wallet
      // (e.g. for receiving payments)
      // We use 0 because this is for external
      '00000000' +
      // Index: Addresses are numbered from index 0 in sequentially increasing manner.
      // This number is used as child index in BIP32 derivation.
      '0'.repeat(8 - addressIndexHex.length) + addressIndexHex
    )
  }
}

// Helper functions

const asyncWrap: (promise: Promise<any>) => Promise<[null, Buffer | number]> =
  (promise: Promise<any>): Promise<any> => promise
    .then((data: Buffer): [null, Buffer | number] => [null, data])
