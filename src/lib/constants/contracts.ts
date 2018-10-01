import { Blockchain } from './blockchains'
import { Network } from './networks'

type ContractHashes = {
  [key in Blockchain]: VersionedContractsByNetwork
}
interface VersionedContractsByNetwork {
  [Network.TestNet]: {
    V2: string,
  },
  [Network.MainNet]: {
    V2: string,
  },
}
export const CONTRACT_HASHES: ContractHashes = {
  [Blockchain.Neo]: {
    [Network.TestNet]: {
      V2: 'a195c1549e7da61b8da315765a790ac7e7633b82',
    },
    [Network.MainNet]: {
      V2: '91b83e96f2a7c4fdf0c1688441ec61986c7cae26',
    },
  },
  [Blockchain.Ethereum]: {
    [Network.TestNet]: {
      V2: '0xa3f9592a90ecd9b3dfa17068f9eb34a46d4ae335',
    },
    [Network.MainNet]: {
      V2: '0xa3f9592a90ecd9b3dfa17068f9eb34a46d4ae335',
    },
  },
  [Blockchain.Qtum]: {
    [Network.TestNet]: {
      V2: '',
    },
    [Network.MainNet]: {
      V2: '',
    },
  },
}
