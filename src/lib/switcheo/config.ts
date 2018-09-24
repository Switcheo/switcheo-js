import { Blockchain } from '../constants/blockchains'
import { CONTRACT_HASHES } from '../constants/contracts'
import { Network, NETWORKS } from '../constants/networks'

export class Config {
  public net!: Network
  public url!: string

  constructor({ net }: { readonly net?: Network }) {
    const selectedNet: Network = net ? net : Network.TestNet
    this.net = selectedNet
    this.url = NETWORKS[this.net].V2.apiUrl
  }

  public getContractHash(blockchain: Blockchain): string {
    return CONTRACT_HASHES[blockchain][this.net].V2
  }

  public getContractHashes(blockchains: ReadonlyArray<Blockchain>): ReadonlyArray<string> {
    return blockchains.map((blockchain: Blockchain) => this.getContractHash(blockchain))
  }
}
