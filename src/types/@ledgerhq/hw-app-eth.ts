declare module '@ledgerhq/hw-app-eth' {
  import Transport from '@ledgerhq/hw-transport'

  export default class Eth {
    public transport: Transport

    constructor(transport: Transport, scrambleKey?: string)

    public getAddress(
      path: string,
      boolDisplay?: boolean,
      boolChaincode?: boolean
    ): Promise<{
      publicKey: string,
      address: string,
      chainCode?: string
    }>

    public signTransaction(
      path: string,
      rawTxHex: string
    ): Promise<{
      s: string,
      v: string,
      r: string
    }>

    public signPersonalMessage(
      path: string,
      messageHex: string
    ): Promise<{
      v: number,
      s: string,
      r: string
    }>

    public getAppConfiguration(): Promise<{
      arbitraryDataEnabled: number,
      version: string
    }>
  }
}
