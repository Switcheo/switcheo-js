import { Config } from '../../switcheo'
import req from '../../req'

export default async function getFees(config: Config): Promise<object> {
  return req.get(config.url + '/fees')
}
