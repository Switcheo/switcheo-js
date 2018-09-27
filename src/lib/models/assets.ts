import { Blockchain } from '../constants/blockchains'

export interface AssetLike {
  blockchain: Blockchain
  scriptHash: string
  decimals: number
}

export type AssetSymbol = string
