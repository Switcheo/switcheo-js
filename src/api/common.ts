import { get } from '../api/helpers'

export const getTimestamp = async (s) => {
  const { timestamp }  = await get(`${s.config.url}/v2/exchange/timestamp`)
  return timestamp
}
