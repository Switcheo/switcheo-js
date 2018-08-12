import { listBalances as _listBalances } from '../../api/balances'

export const listBalances = async (c, listBalancesParams) => {
  return _listBalances(c, listBalancesParams)
}
