import Config from '../../switcheo/config'
import req from '../../req'

export default async function listPairs(config: Config): Promise<object> {
  return req.get(config.url + '/exchange/pairs')
}
