import SwitcheoAccount from '../../switcheo/switcheo-account'
import SwitcheoConfig from '../../switcheo/switcheo-config'
import req from '../../req'

export interface ListOrdersParams {
  readonly pair?: string
}

export default async function listOrders(listOrdersParams: ListOrdersParams,
  account: SwitcheoAccount, config: SwitcheoConfig): Promise<object> {
  const contractHash = config.getContractHash(account.blockchain)
  return req.get(config.url + '/orders', {
    address: account.address,
    contractHash,
    pair: listOrdersParams.pair,
  })
}
