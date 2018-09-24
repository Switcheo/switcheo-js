import Web3 from 'web3'
import Accounts, { Account } from 'web3/eth/accounts' //tslint:disable-line
import { Tx as Transaction } from 'web3/eth/types' //tslint:disable-line

import { SignatureProvider } from '.'
import { combineEthSignature } from './utils'

export class MetamaskProvider implements SignatureProvider {
  public readonly address: string
  public readonly displayAddress: string
  private readonly web3: Web3
  private readonly account: Account

  constructor(web3: Web3) {
    this.web3 = web3
    this.account = this.getCurrentAccount()
    this.address = this.account.address
    this.displayAddress = this.account.address
  }

  public signMessage(message: string): Promise<string> {
    this.ensureAccountUnchanged()
    return this.web3.eth.sign(message, this.address)
  }

  public async signTransaction(transaction: Transaction): Promise<string> {
    this.ensureAccountUnchanged()
    const { tx } = await this.web3.eth.signTransaction(transaction, this.address)
    const { r, s, v } = tx
    return combineEthSignature({ r, s, v })
  }

  private getCurrentAccount(): Account {
    const accounts: Accounts = this.web3.eth.accounts
    return (accounts as any)[0] as Account
  }

  private ensureAccountUnchanged(): void {
    if (this.getCurrentAccount().address !== this.address) {
      throw new Error('MetaMask account changed in extension! ' +
        'Please repeat authentication by re-connecting your wallet.')
    }
  }
}
