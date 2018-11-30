import { Config } from '../../switcheo/config'
import req from '../../req'

export interface TokenParams {
  readonly show_inactive: string
  readonly show_listing_details: string
  readonly show_usd_value: string
}

export function get(config: Config, params: TokenParams): Promise<object> {
  return req.get(config.url + '/exchange/tokens', params)
}
