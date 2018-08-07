import { signTransaction } from '../../utils'
import { post } from '../helpers'

export const executeCancelOrder = async (c, { transaction, id }, account) => {
  const { privateKey } = account

  const signature = signTransaction(transaction, privateKey)

  return post(`${c.url}/v2/cancellations/${id}/broadcast`, { signature })
}
