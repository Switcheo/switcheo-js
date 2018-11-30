import { Config } from '../../switcheo/config'
import req from '../../req'

export interface TokenParams {
  readonly showInactive: string
  readonly showListingDetails: string
  readonly showUsdValue: string
}

export function get(config: Config, params: TokenParams): Promise<object> {
  return req.get(config.url + '/exchange/tokens', params)
}
