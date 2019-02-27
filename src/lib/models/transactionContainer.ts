import { Transaction, NeoTransaction } from './transaction'
import { Blockchain } from '../constants'

interface SwitcheoResponse {
  id: string
}

interface SwitcheoGenericResponse extends SwitcheoResponse {
  transaction: Partial<Transaction>
}

interface SwitcheoOrderResponse extends SwitcheoResponse {
  txn: Partial<Transaction>
}

export type SwitcheoModelWithTransaction = SwitcheoGenericResponse | SwitcheoOrderResponse

function formatTransaction(transactionParams: Partial<Transaction>,
  blockchain: Blockchain): Transaction | null {
  if (!transactionParams) return null

  switch (blockchain) {
    case Blockchain.Neo: return new NeoTransaction(transactionParams as Partial<NeoTransaction>)
    default: return transactionParams as Transaction
  }
}

export default class TransactionContainer {
  public readonly id: string
  public readonly transaction: Transaction | null

  constructor(model: SwitcheoModelWithTransaction, blockchain: Blockchain) {
    this.id = model.id

    const transactionParams: Partial<Transaction> =
      (model as SwitcheoGenericResponse).transaction || (model as SwitcheoOrderResponse).txn

    this.transaction = formatTransaction(transactionParams, blockchain)
  }
}
