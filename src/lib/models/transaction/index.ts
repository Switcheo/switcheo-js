import { EthTransaction } from './ethTransaction'
import { EosTransaction } from './eosTransaction'
import { NeoTransaction } from './neoTransaction'
import { OntTransaction } from './ontTransaction'
import { QtumTransaction } from './qtumTransaction'

export type Transaction = NeoTransaction | EthTransaction | EosTransaction
  | QtumTransaction | OntTransaction

export { EthTransaction, EosTransaction, NeoTransaction, QtumTransaction, OntTransaction }
