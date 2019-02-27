import { Blockchain } from '../constants'
import { Transaction } from './transaction'
import TransactionContainer from './transactionContainer'

interface SweepParams {
  readonly id: string
  readonly blockchain: Blockchain // primary blockchain
  readonly address: string
  readonly counterpartyAddress: string
  readonly offerAssetIds: ReadonlyArray<string>
  readonly offerAmounts: ReadonlyArray<string>
  readonly wantAssetId: ReadonlyArray<string>
  readonly wantAmount: ReadonlyArray<string>
  readonly txn: Partial<Transaction>
}

export class Sweep extends TransactionContainer {
  public readonly id!: string
  public readonly blockchain!: Blockchain // primary blockchain
  public readonly address!: string
  public readonly counterpartyAddress!: string
  public readonly offerAssetIds!: ReadonlyArray<string>
  public readonly offerAmounts!: ReadonlyArray<string>
  public readonly wantAssetId!: ReadonlyArray<string>
  public readonly wantAmount!: ReadonlyArray<string>

  constructor(params: SweepParams) {
    super(params, params.blockchain)
    Object.assign(this, params)
  }
}
