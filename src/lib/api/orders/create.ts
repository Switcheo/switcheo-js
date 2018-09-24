import { AssetSymbol } from '../../constants/assets'
import { toAssetAmount } from '../../utils'
import { buildSignedRequest } from '../helpers'
import { Request, SignedRequestPayload } from '../common'

import { Order, OrderSide, OrderType } from '../../models/order'
import req from '../../req'
import { Account, Config } from '../../switcheo'

export interface CreateOrderParams {
  readonly pair: string
  readonly side: OrderSide
  readonly price: number
  readonly wantAmount: number
  readonly useNativeTokens: boolean
  readonly orderType: OrderType
}

export async function create(config: Config,
  orderParams: CreateOrderParams, account: Account): Promise<Order> {
  const request: OrderCreationRequest =
    await buildOrderCreationRequest(config, orderParams, account)
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

function getWantAmount(orderParams: CreateOrderParams): string {
  const { pair, side } = orderParams
  const assetSymbols: ReadonlyArray<string> = pair.split('_')
  const wantAssetSymbol: AssetSymbol = assetSymbols[side === 'buy' ? 0 : 1] as AssetSymbol
  return toAssetAmount(orderParams.wantAmount, wantAssetSymbol)
}

export function buildOrderCreationRequest(config: Config,
  orderParams: CreateOrderParams, account: Account): Promise<OrderCreationRequest> {
  const params: object = {
    blockchain: account.blockchain,
    contractHash: config.getContractHash(account.blockchain),
    orderType: orderParams.orderType,
    pair: orderParams.pair,
    price: orderParams.price.toFixed(8),
    side: orderParams.side,
    useNativeTokens: orderParams.useNativeTokens,
    wantAmount: getWantAmount(orderParams),
  }
  return buildSignedRequest(config, '/orders', params, account) as Promise<OrderCreationRequest>
}
