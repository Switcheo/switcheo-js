import BigNumber from 'bignumber.js'
import { wallet as neonWallet } from '@cityofzion/neon-core'

import { Account, Config } from '../../switcheo'
import req from '../../req'
import { Blockchain } from '../../constants'
import { buildSignedRequest, performMultistepRequest } from '../helpers'
import { Request } from '../common'
import { AssetLike } from '../../models/assets'
import TransactionContainer from '../../models/transactionContainer'

interface TransferParams {
  readonly blockchain: Blockchain
  readonly contractHash: string
  readonly assetId: string
  readonly amount: string
}

export function get(config: Config,
  accounts: Account | ReadonlyArray<Account>): Promise<object> {
  const wrappedAccounts: ReadonlyArray<Account> = Array.isArray(accounts) ? accounts : [accounts]
  const addresses: ReadonlyArray<string> =
    wrappedAccounts.map((account: Account) => account.address)
  const blockchains: ReadonlyArray<Blockchain> =
    wrappedAccounts.map((account: Account) => account.blockchain)
  const contractHashes: ReadonlyArray<string> = config.getContractHashes(blockchains)

  return req.get(config.url + '/balances', { addresses, contractHashes })
}

export function history(config: Config,
  accounts: Account | ReadonlyArray<Account>): Promise<object> {
  const wrappedAccounts: ReadonlyArray<Account> = Array.isArray(accounts) ? accounts : [accounts]
  const addresses: ReadonlyArray<string> =
    wrappedAccounts.map((account: Account) => account.address)
  const blockchains: ReadonlyArray<Blockchain> =
    wrappedAccounts.map((account: Account) => account.blockchain)
  const contractHashes: ReadonlyArray<string> = config.getContractHashes(blockchains)

  return req.get(config.url + '/balances/history', { addresses, contractHashes })
}

export function getNeoAssets(config: Config, account: Account): Promise<object> {
  const url: string =
    `${config.url}/address/balance/${neonWallet.getAddressFromScriptHash(account.address)}`
  return req.get(url)
}

export function deposit(config: Config, account: Account,
  asset: AssetLike, amount: BigNumber | string): Promise<any> {
  const params: TransferParams = {
    amount: new BigNumber(amount).times(10 ** asset.decimals).toString(),
    assetId: asset.scriptHash,
    blockchain: asset.blockchain,
    contractHash: config.getContractHash(asset.blockchain),
  }

  return performMultistepRequest(
    config,
    '/deposits',
    (result: TransactionContainer) => `/deposits/${result.id}/broadcast`,
    params,
    account
  ) as Promise<any>
}

export async function withdraw(config: Config, account: Account,
  asset: AssetLike, amount: BigNumber | string): Promise<any> {
  const params: TransferParams = {
    amount: new BigNumber(amount).times(10 ** asset.decimals).toString(),
    assetId: asset.scriptHash,
    blockchain: Blockchain.Neo,
    contractHash: config.getContractHash(asset.blockchain),
  }

  if (asset.blockchain === Blockchain.Neo) return withdrawNeo(config, account, params)

  if (asset.blockchain === Blockchain.Ethereum) return withdrawEth(config, account, params)

  return Promise.reject('Invalid blockchain passed to withdraw()!')
}

async function withdrawNeo(config: Config, account: Account, params: TransferParams): Promise<any> {
  const createRequest: Request =
    await buildSignedRequest(config, '/withdrawals', params, account) as Request
  const createResult: { id: string } = await req.post(createRequest.url, createRequest.payload)

  const executeRequest: Request = await buildSignedRequest(
    config, `/withdrawals/${createResult.id}/broadcast`,
    { id: createResult.id }, account) as Request
  return req.post(executeRequest.url, executeRequest.payload)
}

function withdrawEth(config: Config, account: Account, params: TransferParams): Promise<any> {
  return performMultistepRequest(
    config,
    '/withdrawals',
    (result: TransactionContainer) => `/withdrawals/${result.id}/broadcast`,
    params,
    account
  ) as Promise<any>
}
