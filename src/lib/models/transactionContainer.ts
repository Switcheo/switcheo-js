import { Transaction, TransactionLike, NeoTransaction, EthTransaction } from './transaction'
import { EthTransactionLike } from './transaction/ethTransaction'
import { NeoTransactionLike } from './transaction/neoTransaction'

interface SwitcheoResponse {
  id: string
}

interface SwitcheoGenericResponse extends SwitcheoResponse {
  transaction: TransactionLike
}

interface SwitcheoOrderResponse extends SwitcheoResponse {
  txn: TransactionLike
}

type SwitcheoModelWithTransaction = SwitcheoGenericResponse | SwitcheoOrderResponse

function isEthTransactionLike(object: any): object is EthTransactionLike {
  return object && object.chainId !== undefined
}

export default class TransactionContainer {
  public readonly id: string
  public readonly transaction: Transaction | null

  constructor(tx: SwitcheoModelWithTransaction) {
    this.id = tx.id
    const transactionParams: TransactionLike =
      (tx as SwitcheoGenericResponse).transaction || (tx as SwitcheoOrderResponse).txn
    if (transactionParams) {
      this.transaction = isEthTransactionLike(transactionParams) ?
        transactionParams as EthTransaction :
        new NeoTransaction(transactionParams as NeoTransactionLike)
    } else {
      this.transaction = null
    }
  }
}
