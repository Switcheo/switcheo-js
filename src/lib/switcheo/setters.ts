import { wallet } from '@cityofzion/neon-js'
import { CONTRACT_HASHES, MAIN_NET, TEST_NET } from '../../constants'
import { SwitcheoConfig } from './typings'

// Note: cannot be arrow function because of lexical scope
function setConfig(blockchain: Blockchain, net: Net): void {
  const baseConfig = { blockchain }

  const mainNetConfig: SwitcheoConfig = {
    ...baseConfig,
    contractHash: CONTRACT_HASHES[blockchain].MainNet,
    url: 'https://api.switcheo.network',
  }

  const testNetConfig: SwitcheoConfig = {
    ...baseConfig,
    contractHash: CONTRACT_HASHES[blockchain].TestNet,
    url: 'https://test-api.switcheo.network',
  }

  switch (net) {
    case MAIN_NET:
      // tslint:disable-next-line no-object-mutation
      this.config = mainNetConfig
      break
    case TEST_NET:
      // tslint:disable-next-line no-object-mutation
      this.config = testNetConfig
      break
    default:
      // tslint:disable-next-line no-object-mutation
      this.config = testNetConfig
  }
}

// Note: cannot be arrow function because of lexical scope
function setAccount(privateKey: string): void {
  const _account = new wallet.Account(privateKey)
  // tslint:disable-next-line no-object-mutation
  this.account = _account
}

export { setConfig, setAccount }
