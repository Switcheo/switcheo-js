import { performMultistepRequest } from '../helpers'

import Account from '../../switcheo/account'
import Config from '../../switcheo/config'
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
