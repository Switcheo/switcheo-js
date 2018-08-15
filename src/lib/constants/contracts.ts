import { NEO } from './blockchains'
import { MAIN_NET, TEST_NET } from './networks'

export const CONTRACT_HASHES = {
  [NEO]: {
    [TEST_NET]: {
      V2: 'a195c1549e7da61b8da315765a790ac7e7633b82',
    },
    [MAIN_NET]: {
      V2: '91b83e96f2a7c4fdf0c1688441ec61986c7cae26',
    },
  },
}
