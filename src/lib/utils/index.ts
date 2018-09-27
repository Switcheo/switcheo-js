import { BigNumber } from 'bignumber.js'
import humps from 'humps'
import stableStringify from 'json-stable-stringify'
import { ASSET_PRECISION, AssetSymbol } from '../constants/assets'

export function toAssetAmount(amount: number, assetSymbol: AssetSymbol): string {
  const value: BigNumber = new BigNumber(amount)
  const assetPrecision: any = ASSET_PRECISION[assetSymbol]
  const assetMultiplier: number = Math.pow(10, assetPrecision)
  return value.times(assetMultiplier).toFixed(0)
}

export function stringifyParams(params: object): string {
  const decamelizedParams: object = humps.decamelizeKeys(params)
  // ensure that params are sorted in alphabetical order
  return stableStringify(decamelizedParams)
}
