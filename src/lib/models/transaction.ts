import { tx as neonTx } from '@cityofzion/neon-core'

export type Transaction = neonTx.Transaction // TODO: add eth

export type TransactionLike = Partial<neonTx.InvocationTransactionLike>

export class NeoTransaction extends neonTx.InvocationTransaction {}
