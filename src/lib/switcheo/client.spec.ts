import { test, GenericTestContext } from 'ava'
import { Blockchain, Network } from '../constants'

import { Client } from '.'

test('switcheo.config for TestNet', (t: GenericTestContext<any>) => {
  const switcheo: Client = new Client()
  t.is(switcheo.config.net, 'TestNet')
  t.is(switcheo.config.getContractHash(Blockchain.Neo), '58efbb3cca7f436a55b1a05c0f36788d2d9a032e')
  t.is(switcheo.config.url, 'https://test-api.switcheo.network/v2')
})

test('switcheo.config for MainNet', (t: GenericTestContext<any>) => {
  const switcheo: Client = new Client({ net: Network.MainNet })
  t.is(switcheo.config.net, 'MainNet')
  t.is(switcheo.config.getContractHash(Blockchain.Neo), 'a32bcf5d7082f740a4007b16e812cf66a457c3d4')
  t.is(switcheo.config.url, 'https://api.switcheo.network/v2')
})
