import { Config } from '../../switcheo/config'
import req from '../../req'
import { AssetSymbol } from '../../models/assets'

export interface TokenParams {
  readonly showInactive: string
  readonly showListingDetails: string
  readonly showUsdValue: string
}
export type TokensGetResponse = {
  [key in AssetSymbol]: {
    symbol: AssetSymbol
    name: string
    type: string
    hash: string
    decimals: number
    precision: number
    minimumQuantity: string
    tradingActive: boolean
  }
}

export function get(config: Config, params: TokenParams): Promise<TokensGetResponse> {
  return req.get(config.url + '/exchange/tokens', params)
}
