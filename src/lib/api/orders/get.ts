import { Account, Config } from '../../switcheo'
import req from '../../req'
import { Blockchain } from '../../constants'
import { wallet as neonWallet } from '@cityofzion/neon-core'
import { OtcOffer } from '../../models'
import { OtcOrder } from '../../models/otcOrder'

export interface ListOrdersParams {
  readonly pair?: string
}

export interface ShowOrderParams {
  readonly includeTxns?: boolean
}

export function get(config: Config, account: Account,
  listOrdersParams: ListOrdersParams): Promise<object> {
  const contractHash: string = config.getContractHash(account.blockchain)
  return req.get(config.url + '/orders', {
    address: account.address,
    contractHash,
    pair: listOrdersParams.pair,
  })
}

export interface OrdersGetOtcParams {
  readonly pair?: string
}

export type OrdersGetOtcResponse = ReadonlyArray<OtcOrder>

export async function getOtc(config: Config, accounts: Account | ReadonlyArray<Account>,
                             params: OrdersGetOtcParams): Promise<OrdersGetOtcResponse> {
  const tempAccounts: ReadonlyArray<Account> = Array.isArray(accounts) ? accounts : [accounts]
  const offers: ReadonlyArray<OtcOffer> = await req.get(config.url + '/orders/otc', {
    address: tempAccounts.map((account: Account): string => (account.address)),
    blockchain: tempAccounts.map((account: Account): string => (account.blockchain)),
    contractHash: tempAccounts.map((account: Account): string => (
      config.getContractHash(account.blockchain))
    ),
    ...params,
  })
  return offers.map((offer: OtcOffer): OtcOffer => ({
    ...offer,
    makerAddress: offer.blockchain === Blockchain.Neo
      ? neonWallet.getAddressFromScriptHash(offer.makerAddress)
      : offer.makerAddress,
    takerAddress: offer.blockchain === Blockchain.Neo
      ? neonWallet.getAddressFromScriptHash(offer.takerAddress)
      : offer.takerAddress,
  }))
}

export async function show(config: Config, id: string, params: ShowOrderParams):
  Promise<object> {
  return req.get(config.url + '/orders/' + id + '/', params)
}
