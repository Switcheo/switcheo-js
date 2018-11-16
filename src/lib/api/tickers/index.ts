import { Config } from '../../switcheo/config'
import req from '../../req'

export function getLast24Hours(config: Config): Promise<object> {
  return req.get(config.url + '/tickers/last_24_hours')
}

export function getSparkline(config: Config): Promise<object> {
  return req.get(config.url + '/tickers/sparkline')
}

export interface GetCandlesticksParams {
  readonly pair: string
  readonly start_time: number
  readonly end_time: number
  readonly interval: number
  readonly contract_hash?: string
}

export function getCandlesticks(config: Config, params: GetCandlesticksParams): Promise<object> {
  return req.get(config.url + '/tickers/candlesticks', params)
}
