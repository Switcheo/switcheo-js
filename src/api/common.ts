import { get } from '../api/helpers'

export const getTimestamp = async (c) => {
  const { timestamp }  = await get(`${c.url}/v2/exchange/timestamp`)
  return timestamp
}
