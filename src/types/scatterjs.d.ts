declare module 'scatterjs-core' {
  import { Api } from 'eosjs2'

  class Network {
    static placeholder(): Network
    static fromJson({}): Network
    fullhost(): string
  }

  interface Account {
    name: string
    authority: string
    publicKey: string
    blockchain: string
    chainId: string
  }

  function account(type: string): Account
  function plugins(plugins: {}): void
  function connect(name: string, params: {}): boolean
  function login(): string

  function eos(network: Network, api: any, options: {}): Api

  const scatter: {
    suggestNetwork: (network: Network) => boolean
    getArbitrarySignature: (publicKey: string, message: string) => Promise<string>
  }
}

declare module 'scatterjs-plugin-eosjs'
declare module 'scatterjs-plugin-eosjs2'
