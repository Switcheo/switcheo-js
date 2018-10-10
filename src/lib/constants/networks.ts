export enum Network {
  DevNet = 'DevNet',
  TestNet = 'TestNet',
  MainNet = 'MainNet',
}

interface Networks {
  [Network.DevNet]: {
    [version: string]: {
      [apiUrl: string]: string
    }
  },
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
  [Network.DevNet]: {
    V2: {
      apiUrl: 'https://dev-api.switcheo.network/v2',
    },
  },
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
