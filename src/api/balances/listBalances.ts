import { get } from '../helpers'

export const listBalances = async (c, { addresses, contractHashes }) => {
  const apiParams = { addresses, contractHashes }

  return get(`${c.url}/v2/balances`, apiParams)
}
