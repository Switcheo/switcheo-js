import { Config } from '../../switcheo/config'
import req from '../../req'

export type PairsGetResponse = ReadonlyArray<string>

export function get(config: Config): Promise<PairsGetResponse> {
  return req.get(config.url + '/exchange/pairs')
}
