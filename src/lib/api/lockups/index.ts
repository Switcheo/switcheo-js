import BigNumber from 'bignumber.js'

import { buildRequest, Request } from '../helpers'
import req from '../../req'
import { AssetLike } from '../../models/assets'
import { Account, Config } from '../../switcheo'
import { LockupType } from '../../models'

export type LockupCreationRequest = Request<LockupCreationRequestPayload>
interface LockupCreationRequestPayload {
  blockchain: string
  contractHash: string
  address: string
  assetId: string
  amount: string
}

export async function create(config: Config, account: Account,
  asset: AssetLike, amount: BigNumber | string): Promise<object> {
  const apiKey: string = await account.getApiKey(config)
  const request: LockupCreationRequest = buildLockupCreationRequest(config, account, asset, amount)
  return req.post(request.url, request.payload, {
    Authorization: `Token ${apiKey}`,
  })
}

export function buildLockupCreationRequest(config: Config, account: Account,
  asset: AssetLike, amount: BigNumber | string): LockupCreationRequest {
  const params: {
    address: string
    blockchain: string
    contractHash: string
    amount: string
    assetId: string
  } = {
    address: account.address,
    amount: new BigNumber(amount).times(10 ** asset.decimals).toFixed(0),
    assetId: asset.scriptHash,
    blockchain: account.blockchain,
    contractHash: config.getContractHash(asset.blockchain),
  }
  return buildRequest(config, '/lockups', params) as LockupCreationRequest
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
