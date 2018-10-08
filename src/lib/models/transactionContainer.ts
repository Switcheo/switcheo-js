import { Transaction, TransactionLike, NeoTransaction, EthTransaction } from './transaction'
import { EthTransactionLike } from './transaction/ethTransaction'
import { NeoTransactionLike } from './transaction/neoTransaction'

interface SwitcheoResponse {
  id: string
}

interface SwitcheoGenericResponse extends SwitcheoResponse {
  transaction: TransactionLike
}

interface SwitcheoMakeOrFillResponse extends SwitcheoResponse {
  txn: TransactionLike
}

type SwitcheoModelWithTransaction = SwitcheoGenericResponse | SwitcheoMakeOrFillResponse

function isEthTransactionLike(object: any): object is EthTransactionLike {
  return object && object.chainId !== undefined
}

export default class TransactionContainer {
  public readonly id: string
  public readonly transaction: Transaction

  constructor(tx: SwitcheoModelWithTransaction) {
    this.id = tx.id
    const transactionParams: TransactionLike =
      (tx as SwitcheoGenericResponse).transaction || (tx as SwitcheoMakeOrFillResponse).txn
    this.transaction = isEthTransactionLike(transactionParams) ?
      transactionParams as EthTransaction :
      new NeoTransaction(transactionParams as NeoTransactionLike)
  }
}
