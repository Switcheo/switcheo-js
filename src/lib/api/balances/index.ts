import { Account, Config } from '../../switcheo'
import req from '../../req'

export function list(config: Config,
  accounts: Account | ReadonlyArray<Account>): Promise<object> {
  const wrappedAccounts = Array.isArray(accounts) ? accounts : [accounts]
  const addresses = wrappedAccounts.map(account => account.address)
  const blockchains = wrappedAccounts.map(account => account.blockchain)
  const contractHashes = config.getContractHashes(blockchains)

  return req.get(config.url + '/balances', { addresses, contractHashes })
}
