import Web3 from 'web3'

import { SignatureProvider } from '.'

export interface Web3Provider extends SignatureProvider {
  readonly web3: Web3
}
