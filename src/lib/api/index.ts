import * as announcementMessage from './announcementMessage'
import * as approvedSpenders from './approvedSpenders';
import * as balances from './balances'
import * as cancellations from './cancellations'
import * as fees from './fees'
import * as network from './network'
import * as offers from './offers'
import { orders, Orders } from './orders'
import * as pairs from './pairs'
import * as rebates from './rebates'
import { sweeps, Sweeps } from './sweeps'
import * as tickers from './tickers'
import * as tokens from './tokens'
import * as user from './user'
import * as walletTransfers from './walletTransfers'
export * from './responses'

export const api: {
  announcementMessage: typeof announcementMessage
  approvedSpenders: typeof approvedSpenders
  balances: typeof balances
  cancellations: typeof cancellations
  fees: typeof fees
  network: typeof network
  offers: typeof offers
  orders: Orders
  pairs: typeof pairs
  rebates: typeof rebates
  sweeps: Sweeps
  tickers: typeof tickers
  tokens: typeof tokens
  user: typeof user
  walletTransfers: typeof walletTransfers
} = {
  announcementMessage,
  approvedSpenders,
  balances,
  cancellations,
  fees,
  network,
  offers,
  orders,
  pairs,
  rebates,
  sweeps,
  tickers,
  tokens,
  user,
  walletTransfers,
}

export interface SuccessResponse {
  result: 'ok'
}

export interface SuccessDepositResponse {
  result: 'ok'
  transactionHash: string
}

export interface FailureResponse {
  error: string
}
