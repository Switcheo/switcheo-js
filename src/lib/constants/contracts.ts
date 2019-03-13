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
      V2: '7bab4511608301fec820627a9d6a102d89a21794',
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
      V2: '0x6ee18298fd6bc2979df9d27569842435a7d55e65',
    },
    [Network.TestNet]: {
      V2: '0x607af5164d95bd293dbe2b994c7d8aef6bec03bf',
    },
    [Network.MainNet]: {
      V2: '0xba3ed686cc32ffa8664628b1e96d8022e40543de',
    },
  },
  [Blockchain.Eos]: {
    [Network.DevNet]: {
      V2: 'obolusswitc4',
    },
    [Network.TestNet]: {
      V2: 'obolusswitc4',
    },
    [Network.MainNet]: {
      V2: 'obolusswitc4',
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
  [Blockchain.Ontology]: {
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
  [Blockchain.Zilliqa]: {
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
