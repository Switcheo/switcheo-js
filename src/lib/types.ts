import { AssetSymbol } from './models/assets'
import { Blockchain } from './constants'

export type AssetSymbolStringObj = {[key in AssetSymbol]: number}

export type BlockchainNumberObj = {[key in Blockchain]: number}
export type BlockchainStringObj = {[key in Blockchain]: string}
