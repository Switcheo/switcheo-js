import { test, GenericTestContext } from 'ava'
import { NeoPrivateKeyProvider } from '../signatureProviders/neoPrivateKeyProvider'
import { Blockchain } from '../constants'

import { Account } from './account'

const PRIVATE_KEY: string = 'cd7b887c29a110e0ce53e81d6dd02805fc7b912718ff8b6659d8da42887342bd'

test('account.signParams', async (t: GenericTestContext<any>) => {
  const provider: NeoPrivateKeyProvider = new NeoPrivateKeyProvider(PRIVATE_KEY)
  const account: Account = new Account({ blockchain: Blockchain.Neo, provider })
  const signature: string = await account.signParams({ abc: '123', def: 'ghi' })
  const expectedSignature: string = '69e2aeccd8b21fbd0a18b795227789ff57b14daaf928f5d1b' +
  '3514c8c014a59d141b011794128d54697bde2a85704b08345a96370d82f587f1d35b804f35907f8'
  const expectedAddress: string = '87cf67daa0c1e9b6caa1443cf5555b09cb3f8e5f'

  t.is(signature, expectedSignature)
  t.is(account.address, expectedAddress)
})
