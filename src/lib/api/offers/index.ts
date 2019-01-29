import { wallet as neonWallet } from '@cityofzion/neon-core'

import { Blockchain } from '../../constants'
import { OtcOffer } from '../../models/otcOffer'
import req from '../../req'
import { Account } from '../../switcheo'
import { Config } from '../../switcheo/config'

export interface OffersGetOtcParams {
  readonly pair?: string
}

export type OffersGetOtcResponse = ReadonlyArray<OtcOffer>

export async function getOtc(config: Config, accounts: Account | ReadonlyArray<Account>,
                             params: OffersGetOtcParams): Promise<OffersGetOtcResponse> {
  const tempAccounts: ReadonlyArray<Account> = Array.isArray(accounts) ? accounts : [accounts]
  const offers: ReadonlyArray<OtcOffer> = await req.get(config.url + '/offers/otc', {
    address: tempAccounts.map((account: Account): string => (account.address)),
    blockchain: tempAccounts.map((account: Account): string => (account.blockchain)),
    contractHash: tempAccounts.map((account: Account): string => (
      config.getContractHash(account.blockchain))
    ),
    ...params,
  })
  return offers.map((offer: OtcOffer): OtcOffer => ({
    ...offer,
    address: offer.blockchain === Blockchain.Neo
      ? neonWallet.getAddressFromScriptHash(offer.address)
      : offer.address,
  }))
}
