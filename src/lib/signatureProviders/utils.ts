import { u as neonUtils } from '@cityofzion/neon-core'

export function encodeNeoMessage(message: string): string {
  const messageHex: string = neonUtils.str2hexstring(message)
  const messageLengthHex: string = neonUtils.num2VarInt(messageHex.length / 2)
  const encodedMessage: string = `010001f0${messageLengthHex}${messageHex}0000`
  return encodedMessage
}

export function combineEthSignature({ v, r, s }: { v: string, r: string, s: string }): string {
  let vNum: number = parseInt(v, 16)
  vNum = vNum < 2 ? vNum : 1 - (vNum % 2)
  return '0x' +
    r.slice(2).padStart(64, '0') +
    s.slice(2).padStart(64, '0') +
    (vNum + 27).toString(16)
}
