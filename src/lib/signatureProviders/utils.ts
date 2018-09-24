export function combineEthSignature({ v, r, s }: { v: string, r: string, s: string }): string {
  let vNum: number = parseInt(v, 16)
  vNum = vNum < 2 ? vNum : 1 - (vNum % 2)
  return '0x' +
    r.slice(2).padStart(64, '0') +
    s.slice(2).padStart(64, '0') +
    (vNum + 27).toString(16)
}
