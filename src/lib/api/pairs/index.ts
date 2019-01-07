import { Config } from '../../switcheo/config'
import req from '../../req'

export interface PairsParams {
  readonly showDetails: boolean
  readonly showInactive: boolean
}

export type PairsGetResponse = ReadonlyArray<string> |
  ReadonlyArray<{ pair: string, precision: number }>

export function get(config: Config, params: PairsParams): Promise<PairsGetResponse> {
  return req.get(config.url + '/exchange/pairs', params)
}
