import { CreateOrderParams } from '../../lib/types'
import { signParams } from '../../utils'
import { post } from '../helpers'

export const planCreateOrder = (c, {
    pair, blockchain, side, price, wantAmount,
    useNativeTokens, orderType, timestamp,
  }: CreateOrderParams, account) => {
  const { contractHash } =  c
  const address = account.scriptHash
  const { privateKey } = account

  const signableParams = {
    blockchain,
    contractHash,
    orderType,
    pair,
    price,
    side,
    timestamp,
    useNativeTokens,
    wantAmount,
  }

  const signature = signParams(signableParams, privateKey)
  const apiParams = { ...signableParams, address, signature }
  return post(`${c.url}/v2/orders`, apiParams)
}
