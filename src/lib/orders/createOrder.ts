import { getTimestamp } from '../../api/common'
import { executeCreateOrder, planCreateOrder } from '../../api/orders'
import { CreateOrderParams } from '../types'

export const createOrder = async (c, orderParams: CreateOrderParams, account) => {
  const timestamp = await getTimestamp(c)

  const order = await planCreateOrder(c, { ...orderParams, timestamp }, account)
  return executeCreateOrder(c, order, account)
}
