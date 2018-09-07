import SwitcheoConfig from '../../switcheo/switcheo-config'
import req from '../../req'

export default async function getFees(config: SwitcheoConfig): Promise<object> {
  return req.get(config.url + '/fees')
}
