import { Account, Config } from '../../switcheo'
import req from '../../req'
import { wallet as neonWallet } from '@cityofzion/neon-core'

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
