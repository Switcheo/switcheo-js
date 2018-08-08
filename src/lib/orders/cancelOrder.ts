import { getTimestamp } from '../../api/common'
import { executeCancelOrder, planCancelOrder } from '../../api/orders'
import { CancelOrderParams } from '../../lib/types'

export const cancelOrder = async (c, cancelOrderParams: CancelOrderParams, account) => {
  const timestamp = await getTimestamp(c)
  const order = await planCancelOrder(c, { ...cancelOrderParams, timestamp }, account)

  return executeCancelOrder(c, { id: order.id, transaction: order.transaction }, account)
}
