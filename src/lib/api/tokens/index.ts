import { Config } from '../../switcheo/config'
import req from '../../req'
import { AssetSymbol } from '../../models/assets'

export interface TokenParams {
  readonly showInactive: boolean
  readonly showListingDetails: boolean
  readonly showUsdValue: boolean
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
    isStablecoin: boolean
  }
}

export function get(config: Config, params: TokenParams): Promise<TokensGetResponse> {
  return req.get(config.url + '/exchange/tokens', params)
}
