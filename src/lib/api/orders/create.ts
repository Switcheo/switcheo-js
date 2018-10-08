import BigNumber from 'bignumber.js'
import { buildSignedRequest } from '../helpers'
import { Request, SignedRequestPayload } from '../common'

import { Order, OrderSide, OrderType } from '../../models/order'
import req from '../../req'
import { Account, Config } from '../../switcheo'

export interface CreateOrderParams {
  readonly pair: string
  readonly side: OrderSide
  readonly price: string
  readonly wantAmount: string
  readonly useNativeTokens: boolean
  readonly orderType: OrderType
}

export async function create(config: Config, account: Account,
  orderParams: CreateOrderParams): Promise<Order> {
  const request: OrderCreationRequest =
    await buildOrderCreationRequest(config, account, orderParams)
  const response: any = await req.post(request.url, request.payload)
  return new Order(response)
}

export interface OrderCreationRequest extends Request {
  readonly payload: OrderCreationRequestPayload
}

interface OrderCreationRequestPayload extends SignedRequestPayload {
  blockchain: string
  pair: string
  side: string
  price: string
  wantAmount: string
  useNativeTokens: boolean
  orderType: string
  contractHash: string
}

export function buildOrderCreationRequest(config: Config, account: Account,
  orderParams: CreateOrderParams): Promise<OrderCreationRequest> {
  const params: object = {
    blockchain: account.blockchain,
    contractHash: config.getContractHash(account.blockchain),
    orderType: orderParams.orderType,
    pair: orderParams.pair,
    price: new BigNumber(orderParams.price).toFixed(8),
    side: orderParams.side,
    useNativeTokens: orderParams.useNativeTokens,
    wantAmount: orderParams.wantAmount,
  }
  return buildSignedRequest(config, account, '/orders', params) as Promise<OrderCreationRequest>
}
