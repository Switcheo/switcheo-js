import { EthTransaction, EthTransactionLike } from './ethTransaction'
import { NeoTransaction, NeoTransactionLike } from './neoTransaction'

export type Transaction = NeoTransaction | EthTransaction

export type TransactionLike = NeoTransactionLike | EthTransactionLike

export { EthTransaction, NeoTransaction }
