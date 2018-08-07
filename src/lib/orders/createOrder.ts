import { getTimestamp } from '../../api/common'
import { broadcastOrder, planOrder } from '../../api/orders'

export const createOrder = async (c, orderParams, account) => {
  const timestamp = await getTimestamp(c)
  const order = await planOrder(c, { ...orderParams, timestamp }, account)
  return broadcastOrder(c, order, account)
}
