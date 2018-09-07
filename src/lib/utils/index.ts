import humps from 'humps'
import stableStringify from 'json-stable-stringify'
import { BigNumber } from 'bignumber.js'
import { u as neonUtils } from '@cityofzion/neon-core'
import { ASSET_PRECISION, AssetSymbol } from '../constants/assets'

export function toAssetAmount(amount: number, assetSymbol: AssetSymbol): string {
  const value = new BigNumber(amount)
  const assetPrecision: any = ASSET_PRECISION[assetSymbol]
  const assetMultiplier = Math.pow(10, assetPrecision)
  return value.times(assetMultiplier).toFixed(0)
}

export function encodeMessage(message: string): string {
  const messageHex = neonUtils.str2hexstring(message)
  const messageLengthHex = neonUtils.num2VarInt(messageHex.length / 2)
  const encodedMessage = `010001f0${messageLengthHex}${messageHex}0000`
  return encodedMessage
}

export function stringifyParams(params: object): string {
  const decamelizedParams = humps.decamelizeKeys(params)
  // ensure that params are sorted in alphabetical order
  return stableStringify(decamelizedParams)
}
