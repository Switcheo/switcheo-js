import * as announcementMessage from './announcementMessage'
import * as balances from './balances'
import * as cancellations from './cancellations'
import * as fees from './fees'
import * as network from './network'
import { orders, Orders } from './orders'
import * as pairs from './pairs'
import * as rebates from './rebates'
import * as tickers from './tickers'
import * as tokens from './tokens'
import * as user from './user'
import * as walletTransfers from './walletTransfers'
export * from './responses'

export const api: {
  announcementMessage: typeof announcementMessage;
  balances: typeof balances;
  cancellations: typeof cancellations;
  fees: typeof fees;
  network: typeof network;
  orders: Orders;
  pairs: typeof pairs;
  rebates: typeof rebates
  tickers: typeof tickers;
  tokens: typeof tokens;
  user: typeof user;
  walletTransfers: typeof walletTransfers;
} = {
  announcementMessage,
  balances,
  cancellations,
  fees,
  network,
  orders,
  pairs,
  rebates,
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
