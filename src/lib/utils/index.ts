import { BigNumber } from 'bignumber.js'
import { ASSET_PRECISION, AssetSymbol } from '../constants/assets'

export function toAssetAmount(amount: number, assetSymbol: AssetSymbol): string {
  const value: BigNumber = new BigNumber(amount)
  const assetPrecision: any = ASSET_PRECISION[assetSymbol]
  const assetMultiplier: number = Math.pow(10, assetPrecision)
  return value.times(assetMultiplier).toFixed(0)
}
