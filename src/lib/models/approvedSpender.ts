interface ApprovedSpenderParams {
  address: string
  spender: string
}
export class ApprovedSpender {
  public readonly address: string
  public readonly spender: string 

  constructor(tx: ApprovedSpenderParams) {
    this.address = tx.address
    this.spender = tx.spender
  }
}
