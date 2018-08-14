import humps from 'humps'
import stableStringify from 'json-stable-stringify'
import { BigNumber } from 'bignumber.js'
import { u as neoUtils } from '@cityofzion/neon-js'
import { ASSET_PRECISION, AssetSymbol } from '../constants/assets'

export function toAssetAmount(amount: number, assetSymbol: AssetSymbol): string {
  const value = new BigNumber(amount)
  const assetPrecision: any = ASSET_PRECISION[assetSymbol]
  const assetMultiplier = Math.pow(10, assetPrecision)
  return value.times(assetMultiplier).toFixed(0)
}

export function encodeMessage(message: string): string {
  const messageHex = neoUtils.str2hexstring(message)
  const messageLengthHex = (messageHex.length / 2).toString(16).padStart(2, '0')
  const encodedMessage = `010001f0${messageLengthHex}${messageHex}0000`
  return encodedMessage
}

export function stringifyParams(params: object): string {
  const decamelizedParams = humps.decamelizeKeys(params)
  // ensure that params are sorted in alphabetical order
  return stableStringify(decamelizedParams)
}
