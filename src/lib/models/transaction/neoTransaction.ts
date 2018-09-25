import { tx as neonTx } from '@cityofzion/neon-core'

export type NeoTransactionLike = Partial<neonTx.InvocationTransactionLike>

export class NeoTransaction extends neonTx.InvocationTransaction {}
