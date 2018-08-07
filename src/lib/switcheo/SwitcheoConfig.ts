import { CONTRACT_HASHES, MAIN_NET, TEST_NET } from '../../constants'

class SwitcheoConfig {
  public readonly url: string
  public readonly blockchain: Blockchain
  public readonly contractHash: string

  constructor(blockchain: Blockchain, net: Net) {
    const baseConfig = { blockchain }

    const mainNetConfig = {
      ...baseConfig,
      contractHash: CONTRACT_HASHES[blockchain].MainNet,
      url: 'https://api.switcheo.network',
    }

    const testNetConfig = {
      ...baseConfig,
      contractHash: CONTRACT_HASHES[blockchain].TestNet,
      url: 'https://test-api.switcheo.network',
    }

    let config
    switch (net) {
      case MAIN_NET:
        // tslint:disable-next-line no-object-mutation
        config = mainNetConfig
        break
      case TEST_NET:
        // tslint:disable-next-line no-object-mutation
        config = testNetConfig
        break
      default:
        // tslint:disable-next-line no-object-mutation
        config = testNetConfig
    }

    this.blockchain = config.blockchain
    this.contractHash = config.contractHash
    this.url = config.url
  }
}

export default SwitcheoConfig
