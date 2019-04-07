import { performMultistepRequest } from '../helpers'

import { Account, Config } from '../../switcheo'
import { ApprovedSpender } from '../../models/approvedSpender'
import TransactionContainer from '../../models/transactionContainer'

export interface ApproveSpenderParams {
  readonly address: string
  readonly spenderAddress: string
  readonly contractHash: string
}

export function approveSpender(config: Config, account: Account,
  approveSpenderParams: ApproveSpenderParams): Promise<ApprovedSpender> {
  return performMultistepRequest(
    config,
    account,
    '/approved_spenders',
    (result: TransactionContainer) => `/approved_spenders/${result.id}/broadcast`,
    approveSpenderParams
  ) as Promise<ApprovedSpender>
}
