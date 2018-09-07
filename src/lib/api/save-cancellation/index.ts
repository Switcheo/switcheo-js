import { performMultistepRequest } from '../helpers'

import { Account, Config } from '../../switcheo'
import { Order } from '../../models/order'

export interface SaveCancellationParams {
  readonly orderId: string
}

export default async function saveCancellation(cancellationParams: SaveCancellationParams,
  account: Account, config: Config): Promise<Order> {
  return performMultistepRequest(
    cancellationParams,
    account,
    config,
    '/cancellations',
    result => `/cancellations/${result.id}/broadcast`
  ) as Promise<Order>
}
