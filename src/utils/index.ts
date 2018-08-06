import { tx, u, wallet } from '@cityofzion/neon-js'
import stringify from 'json-stable-stringify'
import { mapKeys, snakeCase } from 'lodash'

const signMessage = (message, privateKey) => {
  return wallet.generateSignature(message, privateKey)
}

const encodeMessage = (message) => {
  const messageHex = u.str2hexstring(message)
  const messageLengthHex = (messageHex.length / 2).toString(16).padStart(2, '0')
  const encodedMessage = `010001f0${messageLengthHex}${messageHex}0000`
  return encodedMessage
}

export const signTransaction = (transaction, privateKey) => {
  const serializedTxn = tx.serializeTransaction(transaction, false)
  return signMessage(serializedTxn, privateKey)
}

const convertKeysToSnakeCase = (obj) => {
  return mapKeys(obj, (_, k: string) => snakeCase(k))
}

export const stringifyParams = (params) => {
  const snakeCaseParams = convertKeysToSnakeCase(params)
  // use stringify from json-stable-stringify to ensure that
  // params are sorted in alphabetical order
  return stringify(snakeCaseParams)
}

export const mapPairToUrlParam = (key, value) => {
  if (Array.isArray(value)) {
    return value.map(() => `${key}[]=${value}`).join('&')
  }
  return `${key}=${value}`
}

export const convertHashToUrlParams = (params) => {
  const snakeCaseParams = convertKeysToSnakeCase(params)
  return Object.keys(snakeCaseParams)
    .map(key => mapPairToUrlParam(key, snakeCaseParams[key])).join('&')
}

export const signParams = (params, privateKey) => {
  const payload = stringifyParams(params)
  if (payload.length > 252) {
    throw new Error('Cannot sign a message more than 252 characters in length')
  }
  const encodedPayload = encodeMessage(payload)
  return signMessage(encodedPayload, privateKey)
}
