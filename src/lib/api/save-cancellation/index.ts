import { performMultistepRequest } from '../helpers'

import SwitcheoAccount from '../../switcheo/switcheo-account'
import SwitcheoConfig from '../../switcheo/switcheo-config'
import Order from '../../models/order'

export interface SaveCancellationParams {
  readonly orderId: string
}

export default async function saveCancellation(cancellationParams: SaveCancellationParams,
  account: SwitcheoAccount, config: SwitcheoConfig): Promise<Order> {
  return performMultistepRequest(
    cancellationParams,
    account,
    config,
    '/cancellations',
    result => `/cancellations/${result.id}/broadcast`
  ) as Promise<Order>
}
