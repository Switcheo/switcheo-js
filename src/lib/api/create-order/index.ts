import { AssetSymbol } from '../../constants/assets'
import { toAssetAmount } from '../../utils'
import { buildSignedRequest } from '../helpers'
import { Request, SignedRequestPayload } from '../common'

import Order, { OrderSide, OrderType } from '../../models/order'
import req from '../../req'
import SwitcheoAccount from '../../switcheo/switcheo-account'
import SwitcheoConfig from '../../switcheo/switcheo-config'

export interface CreateOrderParams {
  readonly pair: string
  readonly side: OrderSide
  readonly price: number
  readonly wantAmount: number
  readonly useNativeTokens: boolean
  readonly orderType: OrderType
}

export default async function createOrder(orderParams: CreateOrderParams,
  account: SwitcheoAccount, config: SwitcheoConfig): Promise<Order> {
  const request = await buildOrderCreationRequest(orderParams, account, config)
  return req.post(request.url, request.payload)
}

interface OrderCreationRequest extends Request {
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
  const assetSymbols = pair.split('_')
  const wantAssetSymbol = assetSymbols[side === 'buy' ? 0 : 1] as AssetSymbol
  return toAssetAmount(orderParams.wantAmount, wantAssetSymbol)
}

export async function buildOrderCreationRequest(orderParams: CreateOrderParams,
  account: SwitcheoAccount, config: SwitcheoConfig): Promise<OrderCreationRequest> {
  const params = {
    blockchain: account.blockchain,
    contractHash: config.getContractHash(account.blockchain),
    orderType: orderParams.orderType,
    pair: orderParams.pair,
    price: orderParams.price.toFixed(8),
    side: orderParams.side,
    useNativeTokens: orderParams.useNativeTokens,
    wantAmount: getWantAmount(orderParams),
  }
  return buildSignedRequest(params, account, config, '/orders') as Promise<OrderCreationRequest>
}
