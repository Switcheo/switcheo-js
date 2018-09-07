import { Config } from '../../switcheo/config'
import req from '../../req'

export default async function tickersLast24Hours(config: Config): Promise<object> {
  return req.get(config.url + '/tickers/last_24_hours')
}
