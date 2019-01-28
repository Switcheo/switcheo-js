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

export async function transfer(config: Config, account: Account,
id: string, blockchain: Blockchain): Promise<WalletTransfersTransferResponse> {
  const apiKey: string = await account.getApiKey(config)

  const firstUrlPath: string = `/wallet_transfers/${id}/create_transfer`
  const secondUrlPathFn: UrlPathFn =
    (result: TransactionContainer): string => `/wallet_transfers/${result.id}/broadcast_transfer`

  const firstRequest: Request<{}> =
    await buildRequest(config, firstUrlPath, { address: account.address })

  const firstResult: TransactionContainer =
    new TransactionContainer(await
      req.post(firstRequest.url, firstRequest.payload, { Authorization: `Token ${apiKey}` }))

  let payload: {} = {}

  if (blockchain === Blockchain.Neo) {
    payload = await signItem(config, account, firstResult)
  } else if (blockchain === Blockchain.Ethereum) {
    const signTransactionParams: EthTransaction = pick(
      firstResult.transaction as EthTransaction,
      'chainId', 'data', 'from', 'gas', 'gasPrice', 'nonce', 'to', 'value')
    const signature: string = await account.signTransaction(signTransactionParams)

    payload = { signature }
  }

  const secondRequest: Request<{}> =
    buildRequest(config, secondUrlPathFn(firstResult), payload)
  return req.post(secondRequest.url, secondRequest.payload)
}

export interface VerifyWithdrawalParams {
  readonly passwordHash: string
  readonly confirmToken: string
}

export function verifyWithdrawal(config: Config, params: VerifyWithdrawalParams): Promise<object> {
  return req.post(config.url + '/wallet_transfers/verify_transfer', params)
}
