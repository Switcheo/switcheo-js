export interface SwitcheoConstructor {
  readonly privateKey: string,
  readonly blockchain?: Blockchain,
  readonly net?: Net
}

export interface SwitcheoConfig {
  readonly url: string,
  readonly blockchain: Blockchain,
  readonly contractHash: string,
}
