import { post } from '../../api/helpers'
import { signParams } from '../../utils'

export const planOrder = (s, {
  pair, blockchain, side, price, wantAmount,
  useNativeTokens, orderType, timestamp,
}) => {
  const contractHash =  s.config.contractHash
  const address = s.account.scriptHash
  const privateKey = s.account.privateKey

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
  return post(`${s.config.url}/v2/orders`, apiParams)
}
