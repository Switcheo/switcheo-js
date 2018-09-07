import Account from '../../switcheo/account'
import Config from '../../switcheo/config'
import req from '../../req'

export interface ListOrdersParams {
  readonly pair?: string
}

export default async function listOrders(listOrdersParams: ListOrdersParams,
  account: Account, config: Config): Promise<object> {
  const contractHash = config.getContractHash(account.blockchain)
  return req.get(config.url + '/orders', {
    address: account.address,
    contractHash,
    pair: listOrdersParams.pair,
  })
}
