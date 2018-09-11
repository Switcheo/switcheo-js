import { Config } from '../../switcheo/config'
import req from '../../req'

export function list(config: Config): Promise<object> {
  return req.get(config.url + '/exchange/pairs')
}
