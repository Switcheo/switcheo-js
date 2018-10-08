import { performMultistepRequest } from '../helpers'

import { Account, Config } from '../../switcheo'
import { Order } from '../../models/order'
import TransactionContainer from '../../models/transactionContainer'

export interface MakeCancellationParams {
  readonly orderId: string
}

export function make(config: Config, account: Account,
  cancellationParams: MakeCancellationParams): Promise<Order> {
  return performMultistepRequest(
    config,
    account,
    '/cancellations',
    (result: TransactionContainer) => `/cancellations/${result.id}/broadcast`,
    cancellationParams
  ) as Promise<Order>
}
