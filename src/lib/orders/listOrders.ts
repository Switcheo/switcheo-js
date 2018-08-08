import { listOrders as _listOrders } from '../../api/orders'

export const listOrders = async (c, listOrderParams) => {
  return _listOrders(c, listOrderParams)
}
