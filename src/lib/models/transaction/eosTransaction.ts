export interface EosTransaction {
  actions: ReadonlyArray<{
    account: string
    name: string
    authorization: ReadonlyArray<{
      actor: string
      permission: string
    }>
    data: object
  }>
}
