import { Config } from '../../switcheo/config'
import req from '../../req'

export interface TickersGetLast24HoursResponse {
  close: string
  high: string
  low: string
  open: string
  pair: string
  quoteVolume: string
  volume: string
}

export function getLast24Hours(config: Config): Promise<TickersGetLast24HoursResponse> {
  return req.get(config.url + '/tickers/last_24_hours')
}

export interface TickersGetSparklineResponse {
  [key: string]: ReadonlyArray<number>
}

export function getSparkline(config: Config): Promise<TickersGetSparklineResponse> {
  return req.get(config.url + '/tickers/sparkline')
}

export interface GetCandlesticksParams {
  readonly pair: string
  readonly start_time: number
  readonly end_time: number
  readonly interval: number
  readonly contract_hash?: string
}
export type TickersGetCandlesticksResponse = ReadonlyArray<{
  close: string
  high: string
  low: string
  open: string
  quoteVolume: string
  time: number
  volume: string
}>

export function getCandlesticks(
  config: Config,
  params: GetCandlesticksParams
): Promise<TickersGetCandlesticksResponse> {
  return req.get(config.url + '/tickers/candlesticks', params)
}
