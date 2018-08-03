import { wallet } from '@cityofzion/neon-js'
import { CONTRACT_HASHES, NEO as BLOCKCHAIN_NEO } from '../../constants'

interface Account {
  readonly privateKey: string,
  readonly address: string,
}

interface Config {
  readonly url: string,
  readonly blockchain: string,
  readonly contractHash: string,
}

class Switcheo {
  public readonly account: Account
  public readonly config: Config

  constructor({ privateKey, blockchain = BLOCKCHAIN_NEO, net = 'TestNet' }:
    { readonly privateKey: string, readonly blockchain?: string, readonly net?: string }) {

    const _account = new wallet.Account(privateKey)

    this.account = {
      address: _account.address,
      privateKey: _account.privateKey,
    }

    const defaultConfig = { blockchain }

    const mainNetConfig = {
      ...defaultConfig,
      contractHash: CONTRACT_HASHES[blockchain].MainNet,
      url: 'https://api.switcheo.network',
    }

    const testNetConfig = {
      ...defaultConfig,
      contractHash: CONTRACT_HASHES[blockchain].TestNet,
      url: 'https://test-api.switcheo.network',
    }

    switch (net) {
      case 'MainNet':
        this.config = mainNetConfig
        break
      case 'TestNet':
        this.config = testNetConfig
        break
      default:
        this.config = testNetConfig
    }
  }

  public printMsg(): void {
    // tslint:disable-next-line no-console
    console.log('hello world')
  }
}

export { Switcheo }
