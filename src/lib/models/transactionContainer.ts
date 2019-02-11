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

type SwitcheoModelWithTransaction = SwitcheoGenericResponse | SwitcheoOrderResponse

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

  constructor(tx: SwitcheoModelWithTransaction, blockchain: Blockchain) {
    this.id = tx.id

    const transactionParams: Partial<Transaction> =
      (tx as SwitcheoGenericResponse).transaction || (tx as SwitcheoOrderResponse).txn

    this.transaction = formatTransaction(transactionParams, blockchain)
  }
}
