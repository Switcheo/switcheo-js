import { Account, Config } from '../../switcheo'
import req from '../../req'
import { AssetSymbol } from '../../models/assets'
import { History } from '../../models/rebate'

export type RebatesGetResponse = {
  [key in AssetSymbol]: { paid: number, unpaid: number }
}

export function get(config: Config,
  accounts: Account | ReadonlyArray<Account>): Promise<RebatesGetResponse> {
  const wrappedAccounts: ReadonlyArray<Account> = Array.isArray(accounts) ? accounts : [accounts]
  const addresses: ReadonlyArray<string> =
    wrappedAccounts.map((account: Account) => account.address)

  return req.get(config.url + '/rebates', { addresses })
}

export type RebatesHistoryResponse = ReadonlyArray<History>

export function history(config: Config, accounts: Account | ReadonlyArray<Account>):
Promise<RebatesHistoryResponse> {
  const wrappedAccounts: ReadonlyArray<Account> = Array.isArray(accounts) ? accounts : [accounts]
  const addresses: ReadonlyArray<string> =
    wrappedAccounts.map((account: Account) => account.address)

  return req.get(config.url + '/rebates/history', { addresses })
}
