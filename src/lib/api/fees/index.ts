import { Config } from '../../switcheo'
import req from '../../req'
import { AssetSymbol } from '../../models/assets'
import { BlockchainNumberObj, BlockchainStringObj } from '../../types'

export interface FeesGetResponse {
  enforceNativeFees: ReadonlyArray<AssetSymbol>
  feeAddress: BlockchainStringObj
  maker: { default: number }
  maxTakerFeeRatio: BlockchainNumberObj
  nativeFeeAssetId: string
  nativeFeeDiscount: number
  nativeFeeExchangeRates: BlockchainStringObj
  networkFeeSubsidyThreshold: BlockchainNumberObj
  networkFees: BlockchainStringObj
  networkFeesForWdl: BlockchainStringObj
  taker: { default: number }
}

export function get(config: Config): Promise<FeesGetResponse> {
  return req.get(config.url + '/fees')
}
