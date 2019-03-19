import BigNumber from 'bignumber.js'
import { wallet as neonWallet } from '@cityofzion/neon-core'

import { Account, Config } from '../../switcheo'
import req from '../../req'
import { Blockchain, Network } from '../../constants'
import { performMultistepRequest } from '../helpers'
import { AssetLike, AssetSymbol } from '../../models/assets'
import TransactionContainer from '../../models/transactionContainer'
import { Balance, History } from '../../models/balance'
import { AssetSymbolStringObj } from '../../types'
import { FailureResponse, SuccessDepositResponse } from '../index'

interface TransferParams {
  readonly blockchain: Blockchain
  readonly contractHash: string
  readonly assetId: string
  readonly amount: string
  readonly balance?: string
}

export interface BalancesGetResponse {
  readonly confirmed: AssetSymbolStringObj
  readonly confirming: AssetSymbolStringObj
  readonly locked: AssetSymbolStringObj
}

export function get(config: Config,
  accounts: Account | ReadonlyArray<Account>): Promise<BalancesGetResponse> {
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

export type BalancesHistoryResponse = ReadonlyArray<History>

export function history(config: Config, accounts: Account | ReadonlyArray<Account>,
  params: TransferHistoryParams = {}): Promise<BalancesHistoryResponse> {

  const wrappedAccounts: ReadonlyArray<Account> = Array.isArray(accounts) ? accounts : [accounts]
  const addresses: ReadonlyArray<string> =
    wrappedAccounts.map((account: Account) => account.address)
  const blockchains: ReadonlyArray<Blockchain> =
    wrappedAccounts.map((account: Account) => account.blockchain)
  const contractHashes: ReadonlyArray<string> = config.getContractHashes(blockchains)

  return req.get(config.url + '/balances/history', { ...params, addresses, contractHashes })
}

export interface Unspent {
  readonly index: number
  readonly txid: string
  readonly value: number
}
export type BalancesGetNeoAssetsResponse = {
    [key in AssetSymbol]: {
      readonly balance: number
      readonly unspent: ReadonlyArray<Unspent>
    }
} & {
  readonly address: string
  readonly net: Network
}
export function getNeoAssets(config: Config,
                             account: Account): Promise<BalancesGetNeoAssetsResponse> {
  const url: string =
    `${config.url}/address/balance/${neonWallet.getAddressFromScriptHash(account.address)}`
  return req.get(url)
}

export interface BalancesDepositParams {
  readonly balance?: string
}

export type BalancesDepositResponse = SuccessDepositResponse | FailureResponse

export function deposit(
  config: Config, account: Account, asset: AssetLike, amount: BigNumber | string,
  params: BalancesDepositParams
): Promise<BalancesDepositResponse> {
  const { balance } = params
  let transferParams: TransferParams = {
    amount: new BigNumber(amount).times(10 ** asset.decimals).toFixed(0),
    assetId: asset.scriptHash,
    blockchain: asset.blockchain,
    contractHash: config.getContractHash(asset.blockchain),
  }
  if (balance) {
    transferParams = {
      ...transferParams,
      balance: new BigNumber(balance).times(10 ** asset.decimals).toFixed(0),
    }
  }

  return performMultistepRequest(
    config,
    account,
    '/deposits',
    (result: TransactionContainer) => `/deposits/${result.id}/broadcast`,
    transferParams
  )
}

export interface BalancesSwitcheoDepositParams {
  readonly email: string
  readonly token: string
  readonly balance?: string
}

export async function switcheoDeposit(
  config: Config, account: Account, asset: AssetLike, amount: BigNumber | string,
  params: BalancesSwitcheoDepositParams
): Promise<BalancesDepositResponse> {
  const { email, token } = params
  const contractHash: string = config.getContractHash(asset.blockchain)
  await req.post(
    config.url + '/users/deposit_lock',
    { email, token, assetId: asset.scriptHash, blockchain: asset.blockchain, contractHash })
  return deposit(config, account, asset, amount, params)
}

export type BalancesWithdrawSuccessResponse = Balance
export type BalancesWithdrawResponse = BalancesWithdrawSuccessResponse | FailureResponse

export async function withdraw(config: Config, account: Account,
  asset: AssetLike, amount: BigNumber | string): Promise<BalancesWithdrawResponse> {
  const params: TransferParams = {
    amount: new BigNumber(amount).times(10 ** asset.decimals).toFixed(0),
    assetId: asset.scriptHash,
    blockchain: account.blockchain,
    contractHash: config.getContractHash(asset.blockchain),
  }

  return performMultistepRequest<BalancesWithdrawResponse>(
    config,
    account,
    '/withdrawals',
    (result: TransactionContainer) => `/withdrawals/${result.id}/broadcast`,
    params
  )
}
