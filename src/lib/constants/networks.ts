export const TEST_NET = 'TestNet'
export const MAIN_NET = 'MainNet'

export type Network = 'TestNet' | 'MainNet'

export const NETWORKS = {
  [TEST_NET]: {
    V2: {
      apiUrl: 'https://test-api.switcheo.network/v2',
    },
  },
  [MAIN_NET]: {
    V2: {
      apiUrl: 'https://api.switcheo.network/v2',
    },
  },
}
