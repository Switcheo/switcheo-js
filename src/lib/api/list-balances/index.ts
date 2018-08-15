import SwitcheoAccount from '../../switcheo/switcheo-account'
import SwitcheoConfig from '../../switcheo/switcheo-config'
import req from '../../req'

export default async function listBalances(accounts:
  SwitcheoAccount | ReadonlyArray<SwitcheoAccount>, config: SwitcheoConfig): Promise<object> {
  const wrappedAccounts = Array.isArray(accounts) ? accounts : [accounts]
  const addresses = wrappedAccounts.map(account => account.address)
  const blockchains = wrappedAccounts.map(account => account.blockchain)
  const contractHashes = config.getContractHashes(blockchains)

  return req.get(config.url + '/balances', { addresses, contractHashes })
}
