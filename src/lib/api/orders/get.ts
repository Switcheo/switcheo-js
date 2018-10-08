import { Account, Config } from '../../switcheo'
import req from '../../req'

export interface ListOrdersParams {
  readonly pair?: string
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
