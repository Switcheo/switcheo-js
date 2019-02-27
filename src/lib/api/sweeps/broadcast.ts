import { Account, Config } from '../../switcheo'
import { Sweep } from '../../models/sweep'

import { buildRequest, signItem } from '../helpers'
import req from '../../req'

export type BroadcastSweepParams = Sweep

export async function broadcast(config: Config, account: Account,
  sweep: BroadcastSweepParams): Promise<Sweep> {
  const request: SweepBroadcastRequest = await buildSweepBroadcastRequest(config, account, sweep)
  return req.post(request.url, request.payload)
}

export interface SweepBroadcastRequest extends Request {
  readonly payload: SweepBroadcastRequestPayload
}

interface SweepBroadcastRequestPayload {
  readonly signature: string
}

export async function buildSweepBroadcastRequest(config: Config, account: Account,
  sweep: BroadcastSweepParams): Promise<SweepBroadcastRequest> {

  const payload: SweepBroadcastRequestPayload = {
    signature: (await signItem(config, account, sweep)).signature!,
  }

  const request: SweepBroadcastRequest = buildRequest(
    config,
    `/sweeps/${sweep.id}/broadcast`,
    payload
  ) as SweepBroadcastRequest

  return request
}
