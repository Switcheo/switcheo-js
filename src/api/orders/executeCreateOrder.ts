import { signTransaction } from '../../utils'
import { post } from '../helpers'

const signArray = (array, privateKey) =>
  array.reduce((map, item) => {
    map[item.id] = signTransaction(item.txn, privateKey)
    return map
  }, {})

export const executeCreateOrder = (c, order, account) => {
  const { fills, makes } = order
  const privateKey = account.privateKey

  const signatures = {
    fills: signArray(fills, privateKey),
    makes: signArray(makes, privateKey),
  }

  return post(`${c.url}/v2/orders/${order.id}/broadcast`, { signatures })
}
