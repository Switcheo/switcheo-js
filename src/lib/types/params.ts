import { Blockchain } from '../types/index'

export interface CreateOrderParams {
  readonly pair: string,
  readonly blockchain: Blockchain,
  readonly side: string,
  readonly price: number,
  readonly wantAmount: number,
  readonly useNativeTokens: boolean,
  readonly orderType: string,
  readonly timestamp?: Date,
}

export interface CancelOrderParams {
  readonly orderId: number,
  readonly timestamp?: Date,
}

export interface ListOrderParams {
  readonly address: string,
  readonly pair?: string,
}
