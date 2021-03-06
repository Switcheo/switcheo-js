import { wallet as neonWallet } from '@cityofzion/neon-core'

import { buildRequest, Request, SignedRequestPayload } from '../helpers'

import { Blockchain } from '../../constants'
import { Order, OrderSide, OrderType } from '../../models/order'
import req from '../../req'
import { SignatureProviderType } from '../../signatureProviders'
import { Account, Config } from '../../switcheo'
import { approveSpender } from '../approvedSpenders'

export interface CreateOrderParams {
  readonly pair: string
  readonly side: OrderSide
  readonly price: string
  readonly quantity?: string
  readonly wantAmount?: string
  readonly useNativeTokens: boolean
  readonly orderType: OrderType
  readonly otcAddress?: string
  readonly otcMakeId?: string
  readonly receivingAddress?: string
  readonly worstAcceptablePrice?: string
  readonly handleApprovalProcess?: boolean
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
  otcAddress?: string
  otcMakeId?: string
}

export async function create(config: Config, account: Account,
  orderParams: CreateOrderParams): Promise<Order> {
  const apiKey: string = await account.getApiKey(config)

  const request: OrderCreationRequest =
    buildOrderCreationRequest(config, account, orderParams)
  const source: string | undefined =
    getProviderSourceOrDefault(account.provider.type as SignatureProviderType, config.source)
  try {
    const response: any =
        await req.post(request.url, request.payload, {
          Authorization: `Token ${apiKey}`,
          ...(source && { 'X-Referral-Source': source }),
        })
    return new Order(response)
  } catch (error) {
    const { errorCode, errorObject } = error
    if (orderParams.handleApprovalProcess && errorCode === 10208) {
      const { spender_address: spenderAddress } = errorObject
      try {
        await approveSpender(config, account, {
          address: account.address,
          contractHash: config.getContractHash(account.blockchain),
          spenderAddress,
        })
        return create(config, account, orderParams)
      } catch (err) {
        if (err.message === 'insufficient funds for gas * price + value') {
          throw new Error(
            'Not enough ETH found in your wallet to approve spender. ' +
            'Please deposit more ETH in your wallet balance. ')
        }
        throw err
      }
    }
    throw error
  }
}

export function buildOrderCreationRequest(config: Config, account: Account,
  orderParams: CreateOrderParams): OrderCreationRequest {
  let params: {
    address: string
    blockchain: string
    contractHash: string
  } & CreateOrderParams = {
    address: account.address,
    blockchain: account.blockchain,
    contractHash: config.getContractHash(account.blockchain),
    ...orderParams,
  }
  if (params.otcAddress) {
    params = {
      ...params,
      otcAddress: getScriptHashFromAddress(params.blockchain, params.otcAddress),
    }
  }
  return buildRequest(config, '/orders', params) as OrderCreationRequest
}

function getProviderSourceOrDefault(type: SignatureProviderType,
                                    defaultSource?: string): string | undefined {
  switch (type) {
    case SignatureProviderType.Coinbase: return 'coinbase-web'
    case SignatureProviderType.IM: return 'imtoken-web'
    case SignatureProviderType.O3: return 'o3-web'
    case SignatureProviderType.Trust: return 'trust-web'
    default: return defaultSource
  }
}

export function getScriptHashFromAddress(blockchain: string, address: string): string {
  switch (blockchain) {
    case Blockchain.Neo: return neonWallet.getScriptHashFromAddress(address)
    case Blockchain.Ethereum: return address.toLowerCase()
    default: return address
  }
}
