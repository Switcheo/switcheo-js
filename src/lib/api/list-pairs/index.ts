import SwitcheoConfig from '../../switcheo/switcheo-config'
import req from '../../req'

export default async function listPairs(config: SwitcheoConfig): Promise<object> {
  return req.get(config.url + '/exchange/pairs')
}
