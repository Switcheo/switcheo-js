import BigNumber from 'bignumber.js'
import { pick } from 'lodash'

import { buildRequest, performMultistepRequest, Request, UrlPathFn, signItem } from '../helpers'
import { BalancesWithdrawResponse } from '../balances'
import { FailureResponse, SuccessResponse } from '..'

import { Account, Config } from '../../switcheo'
import req from '../../req'
import { Blockchain } from '../../constants'
import { AssetLike } from '../../models/assets'
import TransactionContainer from '../../models/transactionContainer'
import { WalletTransfer } from '../../models/walletTransfer'
import { EthTransaction } from '../../models'

export interface WalletTransferParams {
  readonly email: string
  readonly token: string
  readonly otp: string
  readonly fromAddress: string
  readonly toAddress: string
  readonly amount: string
  readonly assetId: string
  readonly blockchain: Blockchain
  readonly contractHash: string
}

export interface WalletTransferCreateParams {
  readonly email: string
  readonly token: string
  readonly otp: string
  readonly account: Account
  readonly address: string
  readonly asset: AssetLike
  readonly amount: BigNumber | string
}

export async function create(config: Config, _params: WalletTransferCreateParams):
Promise<BalancesWithdrawResponse> {
  const { email, token, otp, account, address, asset, amount } = _params
  const params: WalletTransferParams = {
    amount: new BigNumber(amount).times(10 ** asset.decimals).toFixed(0),
    assetId: asset.scriptHash,
    blockchain: account.blockchain,
    contractHash: config.getContractHash(asset.blockchain),
    email,
    fromAddress: account.address,
    otp,
    toAddress: address,
    token,
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

export interface TransferParams {
  readonly email: string
  readonly token: string
  readonly id: string
  readonly blockchain: Blockchain
}
export async function transfer(config: Config, account: Account, params: TransferParams
): Promise<WalletTransfersTransferResponse> {
  const { email, token, id, blockchain } = params
  const apiKey: string = await account.getApiKey(config)

  const firstUrlPath: string = `/wallet_transfers/${id}/create_transfer`
  const secondUrlPathFn: UrlPathFn =
    (result: TransactionContainer): string => `/wallet_transfers/${result.id}/broadcast_transfer`

  const firstRequest: Request<{}> =
    await buildRequest(config, firstUrlPath, { address: account.address, email, token })

  const firstResult: TransactionContainer =
    new TransactionContainer(
      await req.post(firstRequest.url, firstRequest.payload, { Authorization: `Token ${apiKey}` }),
      blockchain)

  let payload: {} = { email, token }

  if (blockchain === Blockchain.Neo) {
    payload = { ...payload, ...await signItem(config, account, firstResult) }
  } else if (blockchain === Blockchain.Ethereum) {
    const signTransactionParams: EthTransaction = pick(
      firstResult.transaction as EthTransaction,
      'chainId', 'data', 'from', 'gas', 'gasPrice', 'nonce', 'to', 'value')
    const signature: string = await account.signTransaction(signTransactionParams)

    payload = { ...payload, signature }
  }

  const secondRequest: Request<{}> =
    buildRequest(config, secondUrlPathFn(firstResult), payload)
  return req.post(secondRequest.url, secondRequest.payload, { Authorization: `Token ${apiKey}` })
}

export interface ResendWithdrawalVerificationParams {
  readonly email: string
  readonly token: string
  readonly id: string
}

export function resendWithdrawalVerification(
  config: Config, params: ResendWithdrawalVerificationParams): Promise<object> {
  return req.post(config.url + `/wallet_transfers/${params.id}/new_confirm_token`, params)
}

export interface CancelWithdrawalParams {
  readonly email: string
  readonly token: string
  readonly id: string
}

export function cancelWithdrawal(
  config: Config, params: CancelWithdrawalParams): Promise<object> {
  return req.post(config.url + `/wallet_transfers/${params.id}/cancel`, params)
}
