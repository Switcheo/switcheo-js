import BigNumber from 'bignumber.js'

import { buildRequest, performMultistepRequest, Request } from '../helpers'
import { BalancesWithdrawResponse } from '../balances'
import { FailureResponse, SuccessResponse } from '..'

import { Account, Config } from '../../switcheo'
import req from '../../req'
import { Blockchain } from '../../constants'
import { AssetLike } from '../../models/assets'
import TransactionContainer from '../../models/transactionContainer'
import { WalletTransfer } from '../../models/walletTransfer'

export interface WalletTransferParams {
  readonly fromAddress: string
  readonly toAddress: string
  readonly amount: string
  readonly assetId: string
  readonly blockchain: Blockchain
  readonly contractHash: string
}

export async function create(config: Config, account: Account, address: string,
  asset: AssetLike, amount: BigNumber | string): Promise<BalancesWithdrawResponse> {
  const params: WalletTransferParams = {
    amount: new BigNumber(amount).times(10 ** asset.decimals).toFixed(0),
    assetId: asset.scriptHash,
    blockchain: account.blockchain,
    contractHash: config.getContractHash(asset.blockchain),
    fromAddress: account.address,
    toAddress: address,
  }

  return performMultistepRequest<BalancesWithdrawResponse>(
    config,
    account,
    '/wallet_transfers',
    (result: TransactionContainer) => `/withdrawals/${result.id}/broadcast`,
    params
  )
}

export interface WalletTransfersIncompleteWithdrawalsParams {
  readonly fromAddresses: ReadonlyArray<string>
  readonly contractHashes: ReadonlyArray<string>
}

export type WalletTransfersIncompleteWithdrawalsSuccessResponse = ReadonlyArray<WalletTransfer>
type WalletTransfersIncompleteWithdrawalsResponse =
  WalletTransfersIncompleteWithdrawalsSuccessResponse | FailureResponse

export async function getIncompleteWithdrawals(config: Config, accounts:
  Account | ReadonlyArray<Account>): Promise<WalletTransfersIncompleteWithdrawalsResponse> {

  const wrappedAccounts: ReadonlyArray<Account> = Array.isArray(accounts) ? accounts : [accounts]
  const fromAddresses: ReadonlyArray<string> =
    wrappedAccounts.map((account: Account) => account.address)
  const blockchains: ReadonlyArray<Blockchain> =
    wrappedAccounts.map((account: Account) => account.blockchain)
  const contractHashes: ReadonlyArray<string> = config.getContractHashes(blockchains)

  const params: WalletTransfersIncompleteWithdrawalsParams = {
    contractHashes,
    fromAddresses,
  }

  const request: Request<{}> =
    buildRequest(config, '/wallet_transfers/incomplete_withdrawals', params) as Request<{}>

  return req.get(request.url, request.payload)
}

export type WalletTransfersTransferResponse = SuccessResponse | FailureResponse

export function transfer(config: Config, account: Account,
id: string): Promise<WalletTransfersTransferResponse> {
  return performMultistepRequest(
    config,
    account,
    `/wallet_transfers/${id}/create_transfer`,
    (result: TransactionContainer) => `/wallet_transfers/${result.id}/broadcast_transfer`,
    {}
  )
}
