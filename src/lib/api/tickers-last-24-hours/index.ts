import SwitcheoConfig from '../../switcheo/switcheo-config'
import req from '../../req'

export default async function tickersLast24Hours(config: SwitcheoConfig): Promise<object> {
  return req.get(config.url + '/tickers/last_24_hours')
}
