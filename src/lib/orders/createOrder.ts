import { getTimestamp } from '../../api/common'
import { executeCreateOrder, planCreateOrder } from '../../api/orders'

export const createOrder = async (c, orderParams, account) => {
  const timestamp = await getTimestamp(c)
  const order = await planCreateOrder(c, { ...orderParams, timestamp }, account)
  return executeCreateOrder(c, order, account)
}
