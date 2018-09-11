import { Config } from '../../switcheo/config'
import req from '../../req'

export function bestNeoNode(config: Config): Promise<object> {
  return req.get(config.url + '/network/best_node')
}
