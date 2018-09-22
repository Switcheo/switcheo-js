import { Account, Config } from '../../switcheo'
import req from '../../req'
import { wallet as neonWallet } from '@cityofzion/neon-core'
import { Blockchain } from '../../constants'
import { performMultistepRequest } from '../helpers'
import BigNumber from 'bignumber.js'

interface AssetLike {
  blockchain: Blockchain
  scriptHash: string
  decimals: number
}

interface TransferParams {
  readonly blockchain: Blockchain
  readonly contractHash: string
  readonly assetId: string
  readonly amount: string
}

export function get(config: Config,
  accounts: Account | ReadonlyArray<Account>): Promise<object> {
  const wrappedAccounts = Array.isArray(accounts) ? accounts : [accounts]
  const addresses = wrappedAccounts.map(account => account.address)
  const blockchains = wrappedAccounts.map(account => account.blockchain)
  const contractHashes = config.getContractHashes(blockchains)

  return req.get(config.url + '/balances', { addresses, contractHashes })
}

export function getNeoAssets(config: Config, account: Account): Promise<object> {
  const url: string =
    `${config.url}/address/balance/${neonWallet.getAddressFromScriptHash(account.address)}`
  return req.get(url)
}

export function deposit(config: Config, account: Account,
  asset: AssetLike, amount: BigNumber | string): Promise<any> {
  const amountWithoutPrecision: string =
    new BigNumber(amount).times(10 ** asset.decimals).toString()

  if (asset.blockchain === Blockchain.Neo) {
    return depositNeoAsset(config, account, asset.scriptHash, amountWithoutPrecision)
  }

  throw new Error('Not yet implemented for this blockchain!')
}

export function withdraw(config: Config, account: Account,
  asset: AssetLike, amount: BigNumber | string): Promise<any> {
  const amountWithoutPrecision: string =
    new BigNumber(amount).times(10 ** asset.decimals).toString()

  if (asset.blockchain === Blockchain.Neo) {
    return withdrawNeoAsset(config, account, asset.scriptHash, amountWithoutPrecision)
  }

  throw new Error('Not yet implemented for this blockchain!')
}

function depositNeoAsset(config: Config, account: Account,
  assetId: string, amount: string): Promise<any> {
  const contractHash: string = config.getContractHash(Blockchain.Neo)
  const params: TransferParams = { blockchain: Blockchain.Neo, contractHash, assetId, amount }

  return performMultistepRequest(
    config,
    '/deposits',
    result => `/deposits/${result.id}/broadcast`,
    params,
    account
  ) as Promise<any>
}

function withdrawNeoAsset(config: Config, account: Account,
  assetId: string, amount: string): Promise<any> {
  const contractHash: string = config.getContractHash(Blockchain.Neo)
  const params: TransferParams = { blockchain: Blockchain.Neo, contractHash, assetId, amount }

  return performMultistepRequest(
    config,
    '/withdrawals',
    result => `/withdrawals/${result.id}/broadcast`,
    params,
    account
  ) as Promise<any>
}
