import { networks as qtum, Wallet as qtumWallet, Insight } from 'qtumjs-wallet'
import bitcoinMessage from 'bitcoinjs-message'
import { SignatureProvider, SignatureProviderType } from '.'
import { stringifyParams } from '../utils'
import { QtumTransaction } from '../models/transaction/qtumTransaction'
import { Network } from '../constants/networks'

export class QtumPrivateKeyProvider implements SignatureProvider {
  public readonly address: string
  public readonly displayAddress: string
  public readonly type: SignatureProviderType
  private readonly account: qtumWallet

  constructor(network: Network, key: string) {
    this.type = SignatureProviderType.PrivateKey
    this.account = (network === Network.MainNet ? qtum.mainnet : qtum.testnet).fromWIF(key)
    this.address = this.account.address.toLowerCase()
    this.displayAddress = this.account.address
  }

  public signParams(params: {}): Promise<string> {
    const payload: string = stringifyParams(params)
    return this.signMessage(payload)
  }

  public signMessage(message: string): Promise<string> {
    return Promise.resolve(bitcoinMessage.sign(
      message, this.account.keyPair.d.toBuffer(32),
      this.account.keyPair.compressed, '\x19Qtum Signed Message:\n')
    )
  }

  public signTransaction(transaction: QtumTransaction): Promise<string> {
    const { to, encodedData, amount, gasLimit, gasPrice, feeRate } = transaction

    if (encodedData) {
      return this.account.generateContractSendTx(to, encodedData, {
        amount, feeRate, gasLimit, gasPrice,
      })
    }

    return this.account.generateTx(to, amount, {
      feeRate,
    })
  }

  public async sendTransaction(transaction: QtumTransaction): Promise<string> {
    const { to, encodedData, amount, gasLimit, gasPrice, feeRate } = transaction

    let result: Insight.ISendRawTxResult

    if (encodedData) {
      result = await this.account.contractSend(to, encodedData, {
        amount, feeRate, gasLimit, gasPrice,
      })
    } else {
      result = await this.account.send(to, amount, {
        feeRate,
      })
    }

    return result.txid
  }
}
