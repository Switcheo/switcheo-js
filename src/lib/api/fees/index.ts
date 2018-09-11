import { Config } from '../../switcheo'
import req from '../../req'

export function get(config: Config): Promise<object> {
  return req.get(config.url + '/fees')
}
