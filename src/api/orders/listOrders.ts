import { get } from '../helpers'

export const listOrders = async (c, { address, pair }) => {
  const { contractHash } = c
  const apiParams = { address, pair, contractHash }

  return get(`${c.url}/v2/orders`, apiParams)
}
