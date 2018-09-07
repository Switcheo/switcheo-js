import { Account, Config } from '../../switcheo'
import req from '../../req'

export default async function listBalances(accounts:
  Account | ReadonlyArray<Account>, config: Config): Promise<object> {
  const wrappedAccounts = Array.isArray(accounts) ? accounts : [accounts]
  const addresses = wrappedAccounts.map(account => account.address)
  const blockchains = wrappedAccounts.map(account => account.blockchain)
  const contractHashes = config.getContractHashes(blockchains)

  return req.get(config.url + '/balances', { addresses, contractHashes })
}
