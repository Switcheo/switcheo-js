import { performMultistepRequest } from '../helpers'

import { Account, Config } from '../../switcheo'
import { Order } from '../../models/order'

export interface MakeCancellationParams {
  readonly orderId: string
}

export function make(config: Config,
  cancellationParams: MakeCancellationParams, account: Account): Promise<Order> {
  return performMultistepRequest(
    config,
    '/cancellations',
    result => `/cancellations/${result.id}/broadcast`,
    cancellationParams,
    account
  ) as Promise<Order>
}
