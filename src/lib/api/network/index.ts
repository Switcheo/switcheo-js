import { Config } from '../../switcheo/config'
import req from '../../req'
import { Network } from '../../constants'

export interface NetworkGetBestNeoNodeResponse {
  net: Network
  node: string
}

export function getBestNeoNode(config: Config): Promise<NetworkGetBestNeoNodeResponse> {
  return req.get(config.url + '/network/best_node')
}
