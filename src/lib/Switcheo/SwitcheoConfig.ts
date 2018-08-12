import { CONTRACT_HASHES, MAIN_NET, NEO as BLOCKCHAIN_NEO,
  NETWORKS, TEST_NET } from '../../constants'
import { Blockchain, Net } from '../../lib/types'

class SwitcheoConfig {
  public readonly url: string
  public readonly blockchain: Blockchain
  public readonly contractHash: string

  constructor(blockchain: Blockchain, net: Net) {
    const baseConfig = { blockchain }

    const mainNetConfig = {
      ...baseConfig,
      contractHash: CONTRACT_HASHES[blockchain][MAIN_NET],
      url: NETWORKS[BLOCKCHAIN_NEO][MAIN_NET].api,
    }

    const testNetConfig = {
      ...baseConfig,
      contractHash: CONTRACT_HASHES[blockchain][TEST_NET],
      url: NETWORKS[BLOCKCHAIN_NEO][TEST_NET].api,
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
