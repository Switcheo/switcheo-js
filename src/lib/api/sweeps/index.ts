import { broadcast } from './broadcast'
import { create } from './create'
import { make } from './make'

import { Sweep } from '../../models/sweep'
import { Account, Config } from '../../switcheo'

export interface Sweeps {
  broadcast: (config: Config, account: Account, sweep: Sweep) => Promise<Sweep>
  create: (config: Config, account: Account) => Promise<Sweep>
  make: (config: Config, account: Account) => Promise <Sweep>
}

export const sweeps: Sweeps = { broadcast, create, make }
