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
      V2: '0xab5cde2584bb0fdffbba36543d21a7829746f364',
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
      V2: '',
    },
    [Network.TestNet]: {
      V2: '',
    },
    [Network.MainNet]: {
      V2: '',
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
