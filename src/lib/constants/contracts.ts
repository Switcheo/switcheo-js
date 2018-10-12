import { Blockchain } from './blockchains'
import { Network } from './networks'

export type ContractHashes = {
  [key in Blockchain]: VersionedContractsByNetwork
}
interface VersionedContractsByNetwork {
  [Network.DevNet]: {
    V2: string,
  },
  [Network.TestNet]: {
    V2: string,
  },
  [Network.MainNet]: {
    V2: string,
  },
}
export const CONTRACT_HASHES: ContractHashes = {
  [Blockchain.Neo]: {
    [Network.DevNet]: {
      V2: 'c7327ee3ddcc7e547f20d939be6091e44cbf3397',
    },
    [Network.TestNet]: {
      V2: 'a195c1549e7da61b8da315765a790ac7e7633b82',
    },
    [Network.MainNet]: {
      V2: '91b83e96f2a7c4fdf0c1688441ec61986c7cae26',
    },
  },
  [Blockchain.Ethereum]: {
    [Network.DevNet]: {
      V2: '0xd569a65e32ca2d78d456687ec352072bb689f05c',
    },
    [Network.TestNet]: {
      V2: '0xa3f9592a90ecd9b3dfa17068f9eb34a46d4ae335',
    },
    [Network.MainNet]: {
      V2: '0xa3f9592a90ecd9b3dfa17068f9eb34a46d4ae335',
    },
  },
  [Blockchain.Qtum]: {
    [Network.DevNet]: {
      V2: '',
    },
    [Network.TestNet]: {
      V2: '',
    },
    [Network.MainNet]: {
      V2: '',
    },
  },
}
