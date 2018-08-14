import SwitcheoAccount from '../../switcheo/switcheo-account'
import SwitcheoConfig from '../../switcheo/switcheo-config'
import req from '../../req'

export default async function listBalances(account: SwitcheoAccount,
  config: SwitcheoConfig): Promise<object> {
  const contractHash = config.getContractHash(account.blockchain)
  return req.get(config.url + '/balances', {
    addresses: [account.address],
    contractHashes: [contractHash],
  })
}
