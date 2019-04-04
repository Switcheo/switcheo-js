import BigNumber from 'bignumber.js'

import { buildRequest, Request } from '../helpers'
import req from '../../req'
import { AssetLike } from '../../models/assets'
import { Account, Config } from '../../switcheo'
import { LockupType } from '../../models'

export type LockupCreationRequest = Request<LockupCreationRequestPayload>
interface LockupCreationRequestPayload {
  contractHash: string
  address: string
  amount: string
}

export async function create(config: Config, account: Account,
  asset: AssetLike, amount: BigNumber | string, lockupType: LockupType): Promise<object> {
  const apiKey: string = await account.getApiKey(config)
  const request: LockupCreationRequest =
    buildLockupCreationRequest(config, account, asset, amount, lockupType)
  return req.post(request.url, request.payload, {
    Authorization: `Token ${apiKey}`,
  })
}

export function buildLockupCreationRequest(config: Config, account: Account,
  asset: AssetLike, amount: BigNumber | string, lockupType: LockupType): LockupCreationRequest {
  const params: {
    lockupType: LockupType
    address: string
    contractHash: string
    amount: string
  } = {
    address: account.address,
    amount: new BigNumber(amount).times(10 ** asset.decimals).toFixed(0),
    contractHash: config.getContractHash(asset.blockchain),
    lockupType,
  }
  return buildRequest(config, '/lockups', params) as LockupCreationRequest
}

export async function withdraw(config: Config, account: Account, id: string): Promise<object> {
  const apiKey: string = await account.getApiKey(config)
  return req.post(config.url + `/lockups/${id}/withdraw`, {}, {
    Authorization: `Token ${apiKey}`,
  })
}

export async function get(config: Config): Promise<object> {
  return req.get(config.url + '/lockups')
}

export function history(config: Config, account: Account,
  asset: AssetLike, lockupType: LockupType): Promise<object> {
  const historyParams: {
    address: string
    blockchain: string
    contractHash: string
    assetId: string
    lockupType: LockupType,
  } = {
    address: account.address,
    assetId: asset.scriptHash,
    blockchain: account.blockchain,
    contractHash: config.getContractHash(asset.blockchain),
    lockupType,
  }
  return req.get(config.url + '/lockups/history', historyParams)
}