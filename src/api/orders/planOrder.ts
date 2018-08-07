import { post } from '../../api/helpers'
import { signParams } from '../../utils'

export const planOrder = (c, {
    pair, blockchain, side, price, wantAmount,
    useNativeTokens, orderType, timestamp,
  }, account) => {
  const contractHash =  c.contractHash
  const address = account.scriptHash
  const privateKey = account.privateKey

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
