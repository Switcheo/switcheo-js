import { Blockchain } from '../constants/blockchains'
import { CONTRACT_HASHES } from '../constants/contracts'
import { Network, NETWORKS } from '../constants/networks'

export class Config {
  public readonly net!: Network
  public readonly url!: string

  constructor({ net, url }: { readonly net?: Network, readonly url?: string }) {
    this.net = net ? net : Network.TestNet
    this.url = url ? url : NETWORKS[this.net].V2.apiUrl
  }

  public getContractHash(blockchain: Blockchain): string {
    return CONTRACT_HASHES[blockchain][this.net].V2
  }

  public getContractHashes(blockchains: ReadonlyArray<Blockchain>): ReadonlyArray<string> {
    return blockchains.map((blockchain: Blockchain) => this.getContractHash(blockchain))
  }
}
