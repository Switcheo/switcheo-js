import { signParams } from '../../utils'
import { post } from '../helpers'

export const planCancelOrder = async (c, { orderId, timestamp }, account) => {
  const address = account.scriptHash
  const { privateKey } = account
  const signableParams = { orderId, timestamp }

  const signature = signParams(signableParams, privateKey)
  const apiParams = { ...signableParams, signature, address }

  return post(`${c.url}/v2/cancellations`, apiParams)
}
