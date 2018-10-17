import BigNumber from 'bignumber.js'
import { wallet as neonWallet } from '@cityofzion/neon-core'

import { Account, Config } from '../../switcheo'
import req from '../../req'
import { Blockchain } from '../../constants'
import { performMultistepRequest } from '../helpers'
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
interface TransferHistoryParams {
  readonly limit?: number
  readonly offset?: number
  readonly eventTypes?: ReadonlyArray<string>
}

export function history(config: Config, accounts: Account | ReadonlyArray<Account>,
  params: TransferHistoryParams = {}): Promise<object> {

  const wrappedAccounts: ReadonlyArray<Account> = Array.isArray(accounts) ? accounts : [accounts]
  const addresses: ReadonlyArray<string> =
    wrappedAccounts.map((account: Account) => account.address)
  const blockchains: ReadonlyArray<Blockchain> =
    wrappedAccounts.map((account: Account) => account.blockchain)
  const contractHashes: ReadonlyArray<string> = config.getContractHashes(blockchains)

  return req.get(config.url + '/balances/history', { ...params, addresses, contractHashes })
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
    account,
    '/deposits',
    (result: TransactionContainer) => `/deposits/${result.id}/broadcast`,
    params
  ) as Promise<any>
}

export async function withdraw(config: Config, account: Account,
  asset: AssetLike, amount: BigNumber | string): Promise<any> {
  const params: TransferParams = {
    amount: new BigNumber(amount).times(10 ** asset.decimals).toString(),
    assetId: asset.scriptHash,
    blockchain: account.blockchain,
    contractHash: config.getContractHash(asset.blockchain),
  }

  return performMultistepRequest(
    config,
    account,
    '/withdrawals',
    (result: TransactionContainer) => `/withdrawals/${result.id}/broadcast`,
    params
  ) as Promise<any>
}
