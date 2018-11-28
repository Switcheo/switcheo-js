import { u as neonUtils } from '@cityofzion/neon-core'

export function encodeNeoMessage(message: string): string {
  const messageHex: string = neonUtils.str2hexstring(message)
  const messageLengthHex: string = neonUtils.num2VarInt(messageHex.length / 2)
  const encodedMessage: string = `010001f0${messageLengthHex}${messageHex}0000`
  return encodedMessage
}

export function combineEthSignature({ v, r, s }:
    { v: string | number, r: string, s: string }): string {
  let vNum: number = typeof(v) === 'number' ? v : parseInt(v, 16)
  if (vNum >= 27) vNum -= 27
  return '0x' +
    r.replace(/^0x/, '').padStart(64, '0') +
    s.replace(/^0x/, '').padStart(64, '0') +
    vNum.toString(16).padStart(2, '0')
}

export function toHex(message: string): string {
  return Buffer.from(message).toString('hex')
}
