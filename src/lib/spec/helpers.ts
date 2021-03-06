import { Client } from '../switcheo'
import { Account } from '../switcheo/account'
import { Config } from '../switcheo/config'
import { Blockchain } from '../constants'
import { NeoPrivateKeyProvider } from '../signatureProviders/neoPrivateKeyProvider'

// const ADDRESS = '87cf67daa0c1e9b6caa1443cf5555b09cb3f8e5f'
const PRIVATE_KEY: string = 'cd7b887c29a110e0ce53e81d6dd02805fc7b912718ff8b6659d8da42887342bd'

export function createAccountAndConfig(): { account: Account, config: Config } {
  const switcheo: Client = new Client()
  const provider: NeoPrivateKeyProvider = new NeoPrivateKeyProvider(PRIVATE_KEY)
  const account: Account = new Account({ blockchain: Blockchain.Neo, provider })
  return { account, config: switcheo.config }
}
