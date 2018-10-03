import { Config } from '../../switcheo/config'
import req from '../../req'

export function get(config: Config): Promise<object> {
  return req.get(config.url + '/exchange/announcement_message')
}
