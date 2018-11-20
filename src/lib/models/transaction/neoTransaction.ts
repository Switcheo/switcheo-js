import { tx as neonTx } from '@cityofzion/neon-core'
import { InvocationTransaction } from '@cityofzion/neon-core/lib/tx' // tslint:disable-line

export type NeoTransactionLike = Partial<neonTx.InvocationTransactionLike>

export { InvocationTransaction as NeoTransaction }
