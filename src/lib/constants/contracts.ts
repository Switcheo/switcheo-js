import { Blockchain } from './blockchains'
import { MAIN_NET, TEST_NET } from './networks'

type ContractHashes = {
  [key in Blockchain]: VersionedContractsByNetwork
}
interface VersionedContractsByNetwork {
  [TEST_NET]: {
    V2: string,
  },
  [MAIN_NET]: {
    V2: string,
  },
}
export const CONTRACT_HASHES: ContractHashes = {
  [Blockchain.Neo]: {
    [TEST_NET]: {
      V2: 'a195c1549e7da61b8da315765a790ac7e7633b82',
    },
    [MAIN_NET]: {
      V2: '91b83e96f2a7c4fdf0c1688441ec61986c7cae26',
    },
  },
  [Blockchain.Ethereum]: {
    [TEST_NET]: {
      V2: '',
    },
    [MAIN_NET]: {
      V2: '',
    },
  },
  [Blockchain.Qtum]: {
    [TEST_NET]: {
      V2: '',
    },
    [MAIN_NET]: {
      V2: '',
    },
  },
}
