import { Config } from '../../switcheo/config'
import req from '../../req'

export function getLast24Hours(config: Config): Promise<object> {
  return req.get(config.url + '/tickers/last_24_hours')
}
