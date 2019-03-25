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
      V2: 'd524fbb2f83f396368bc0183f5e543cae54ef532',
    },
    [Network.TestNet]: {
      V2: 'aff38ca20ef96a7b86618d86f1bd3879db78c8bb',
    },
    [Network.MainNet]: {
      V2: 'a32bcf5d7082f740a4007b16e812cf66a457c3d4',
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
