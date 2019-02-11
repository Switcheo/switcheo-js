declare module 'bip44-constants'
declare module 'bitcoinjs-message' {
  function sign(message: string, privateKey: Buffer, compressed: boolean, messagePrefix?: string): string
}
