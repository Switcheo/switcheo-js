import { buildRequest, Request, SignedRequestPayload } from '../helpers'
import req from '../../req'
import { Account, Config } from '../../switcheo'
import { Sweep } from '../../models/sweep'

export type SweepCreationRequest = Request<SweepCreationRequestPayload>

interface SweepCreationRequestPayload extends SignedRequestPayload {
  blockchain: string
}

export async function create(config: Config, account: Account): Promise<Sweep> {
  const apiKey: string = await account.getApiKey(config)
  const request: SweepCreationRequest = buildSweepCreationRequest(config, account)
  const response: any =
    await req.post(request.url, request.payload, { Authorization: `Token ${apiKey}` })
  return new Sweep(response)
}

export function buildSweepCreationRequest(config: Config, account: Account): SweepCreationRequest {
  const params: {
    address: string
    blockchain: string
    contractHash: string
  } = {
    address: account.address,
    blockchain: account.blockchain,
    contractHash: config.getContractHash(account.blockchain),
  }
  return buildRequest(config, '/sweeps', params) as SweepCreationRequest
}
