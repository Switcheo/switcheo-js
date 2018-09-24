// export type Network = 'TestNet' | 'MainNet'

export enum Network {
  TestNet = 'TestNet',
  MainNet = 'MainNet',
}

interface Networks {
  [Network.TestNet]: {
    [version: string]: {
      [apiUrl: string]: string
    }
  },
  [Network.MainNet]: {
    [version: string]: {
      [apiUrl: string]: string
    }
  }
}

export const NETWORKS: Networks = {
  [Network.TestNet]: {
    V2: {
      apiUrl: 'https://test-api.switcheo.network/v2',
    },
  },
  [Network.MainNet]: {
    V2: {
      apiUrl: 'https://api.switcheo.network/v2',
    },
  },
}
