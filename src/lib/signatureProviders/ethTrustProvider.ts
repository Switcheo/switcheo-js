import Web3 from 'web3'

import { EthWeb3Provider } from './ethWeb3Provider'
import { SignatureProviderType } from './index'

export class EthTrustProvider extends EthWeb3Provider {
  public static async init(web3: Web3): Promise<EthTrustProvider> {
    const addresses: ReadonlyArray<string> = web3.eth.accounts
    return new EthTrustProvider(SignatureProviderType.Trust, web3, addresses[0].toLowerCase())
  }

  public static isConnected(): boolean {
    return window.web3 && (window.web3.currentProvider as any).isTrust
  }
}
