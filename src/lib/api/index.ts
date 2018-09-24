import * as balances from './balances'
import * as cancellations from './cancellations'
import * as fees from './fees'
import * as network from './network'
import { orders } from './orders'
import * as pairs from './pairs'
import * as tickers from './tickers'

// TODO: Is it correct to put any here?
export const api: any = { balances, cancellations, fees, network, orders, pairs, tickers }
