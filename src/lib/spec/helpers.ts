import Switcheo from '../switcheo'
import SwitcheoAccount from '../switcheo/switcheo-account'
import SwitcheoConfig from '../switcheo/switcheo-config'

const ADDRESS = '87cf67daa0c1e9b6caa1443cf5555b09cb3f8e5f'
const PRIVATE_KEY = 'cd7b887c29a110e0ce53e81d6dd02805fc7b912718ff8b6659d8da42887342bd'

export function createAccountAndConfig(): { account: SwitcheoAccount, config: SwitcheoConfig } {
  const switcheo = new Switcheo()
  const account = Switcheo.createAccount({
    address: ADDRESS,
    blockchain: 'neo',
    privateKey: PRIVATE_KEY,
  })
  return { account, config: switcheo.config }
}
