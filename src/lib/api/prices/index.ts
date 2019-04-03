import { Config } from '../../switcheo'
import req from '../../req'

export interface GetSwapPricingParams {
  readonly pair: string
  readonly side: string
}

export interface SwapPricingGetResponse {
  x: string
  y: string
  k: string
}

export function getSwapPricing(config: Config,
  params: GetSwapPricingParams): Promise<SwapPricingGetResponse> {
  return req.get(config.url + 'exchange/swap_pricing', params)
}
