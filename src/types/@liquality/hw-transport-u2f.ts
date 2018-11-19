declare module '@liquality/hw-transport-u2f' {
  import Transport from '@ledgerhq/hw-transport'

  class TransportU2F extends Transport {
    public static open(_: any, _openTimeout?: number): Promise<TransportU2F>

    constructor()
  }

  export default TransportU2F
}
