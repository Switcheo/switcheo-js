import { Blockchain } from '../constants/blockchains'
import { CONTRACT_HASHES } from '../constants/contracts'
import { Network, NETWORKS, TEST_NET } from '../constants/networks'

export default class Config {
  public net!: Network
  public url!: string

  constructor({ net }: { readonly net?: Network }) {
    const selectedNet = net ? net : TEST_NET
    this.net = selectedNet
    this.url = NETWORKS[this.net].V2.apiUrl
  }

  public getContractHash(blockchain: Blockchain): string {
    return CONTRACT_HASHES[blockchain][this.net].V2
  }

  public getContractHashes(blockchains: ReadonlyArray<Blockchain>): ReadonlyArray<string> {
    return blockchains.map(blockchain => this.getContractHash(blockchain))
  }
}
