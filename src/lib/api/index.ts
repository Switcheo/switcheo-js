import * as announcementMessage from './announcementMessage'
import * as balances from './balances'
import * as cancellations from './cancellations'
import * as fees from './fees'
import * as network from './network'
import { orders, Orders } from './orders'
import * as pairs from './pairs'
import * as tickers from './tickers'

export const api: {
  announcementMessage: typeof announcementMessage;
  balances: typeof balances;
  cancellations: typeof cancellations;
  fees: typeof fees;
  network: typeof network;
  orders: Orders;
  pairs: typeof pairs;
  tickers: typeof tickers;
} = {
  announcementMessage,
  balances,
  cancellations,
  fees,
  network,
  orders,
  pairs,
  tickers,
}
