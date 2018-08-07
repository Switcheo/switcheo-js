import { getTimestamp } from '../../api/common'
import { executeCancelOrder, planCancelOrder } from '../../api/orders'

export const cancelOrder = async (c, orderParams, account) => {
  const timestamp = await getTimestamp(c)
  const order = await planCancelOrder(c, { ...orderParams, timestamp }, account)

  return executeCancelOrder(c, { id: order.id, transaction: order.transaction }, account)
}
