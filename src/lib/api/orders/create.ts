import { buildRequest, Request, SignedRequestPayload } from '../helpers'

import req from '../../req'
import { Order, OrderSide, OrderType } from '../../models/order'
import { Account, Config } from '../../switcheo'

export interface CreateOrderParams {
  readonly pair: string
  readonly side: OrderSide
  readonly price: string
  readonly quantity?: string
  readonly wantAmount?: string
  readonly useNativeTokens: boolean
  readonly orderType: OrderType
}

export type OrderCreationRequest = Request<OrderCreationRequestPayload>

interface OrderCreationRequestPayload extends SignedRequestPayload {
  blockchain: string
  pair: string
  side: string
  price: string
  quantity?: string
  wantAmount?: string
  useNativeTokens: boolean
  orderType: string
  contractHash: string
}

export async function create(config: Config, account: Account,
  orderParams: CreateOrderParams): Promise<Order> {
  // Check whether account has an api key first if not, request it
  const apiKey: string = account.hasValidApiKey() ? account.apiKey.key :
    await account.refreshApiKey(config)

  if (!apiKey) throw new Error('Could not create an API key.')

  const request: OrderCreationRequest =
    buildOrderCreationRequest(config, account, orderParams)
  const response: any =
      await req.post(request.url, request.payload, { Authorization: `Token ${apiKey}` })
  return new Order(response)
}

export function buildOrderCreationRequest(config: Config, account: Account,
  orderParams: CreateOrderParams): OrderCreationRequest {
  const params: {} = {
    address: account.address,
    blockchain: account.blockchain,
    contractHash: config.getContractHash(account.blockchain),
    ...orderParams,
  }
  return buildRequest(config, '/orders', params) as OrderCreationRequest
}
