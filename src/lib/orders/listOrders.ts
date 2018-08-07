import { listOrders as _listOrders } from '../../api/orders'

export const listOrders = async (c, orderParams) => {
  return _listOrders(c, orderParams)
}
