import { tx as neonTx } from '@cityofzion/neon-core'
import { Transaction, TransactionLike, NeoTransaction } from './transaction'

interface SwitcheoResponse {
  id: string
}

interface SwitcheoGenericResponse extends SwitcheoResponse {
  transaction: Partial<neonTx.InvocationTransactionLike>
}

interface SwitcheoMakeOrFillResponse extends SwitcheoResponse {
  txn: Partial<neonTx.InvocationTransactionLike>
}

type SwitcheoModelWithTransaction = SwitcheoGenericResponse | SwitcheoMakeOrFillResponse

export default class TransactionContainer {
  public readonly id: string
  public readonly transaction: Transaction

  constructor(tx: SwitcheoModelWithTransaction) {
    this.id = tx.id
    const transactionParams: TransactionLike =
      (tx as SwitcheoGenericResponse).transaction || (tx as SwitcheoMakeOrFillResponse).txn
    this.transaction = new NeoTransaction(transactionParams)
  }
}
