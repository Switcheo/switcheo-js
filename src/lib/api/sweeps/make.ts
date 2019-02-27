import { Account, Config } from '../../switcheo'
import { Sweep } from '../../models/sweep'
import TransactionContainer from '../../models/transactionContainer'
import { performMultistepRequest } from '../helpers'

export function make(config: Config, account: Account): Promise<Sweep> {
  return performMultistepRequest(
    config,
    account,
    '/sweeps',
    (result: TransactionContainer) => `/sweeps/${result.id}/broadcast`,
    {
      blockchain: account.blockchain,
    }
  )
}
