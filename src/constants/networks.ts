import { NEO as BLOCKCHAIN_NEO } from './blockchains'
import { MAIN_NET, TEST_NET } from './nets'

export const NETWORKS = {
  [BLOCKCHAIN_NEO]: {
    [MAIN_NET]: {
      api: 'https://api.switcheo.network',
    },
    [TEST_NET]: {
      api: 'https://test-api.switcheo.network',
    },
  },
}
