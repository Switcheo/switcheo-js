import { Config } from '../../switcheo'
import req from '../../req'

export interface GetSwapPricingParams {
  readonly pair: string
}

export interface SwapPricingGetResponse {
  buy: SwapPricingXYKValues
  sell: SwapPricingXYKValues
}

export interface SwapPricingXYKValues {
  x: string
  y: string
  k: string
}

export function getSwapPricing(config: Config,
  params: GetSwapPricingParams): Promise<SwapPricingGetResponse> {
  return req.get(config.url + '/exchange/swap_pricing', params)
}
