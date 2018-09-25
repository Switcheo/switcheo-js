import { performMultistepRequest } from '../helpers'

import { Account, Config } from '../../switcheo'
import { Order } from '../../models/order'
import TransactionContainer from '../../models/transactionContainer'

export interface MakeCancellationParams {
  readonly orderId: string
}

export function make(config: Config,
  cancellationParams: MakeCancellationParams, account: Account): Promise<Order> {
  return performMultistepRequest(
    config,
    '/cancellations',
    (result: TransactionContainer) => `/cancellations/${result.id}/broadcast`,
    cancellationParams,
    account
  ) as Promise<Order>
}
