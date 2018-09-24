import { test, GenericTestContext } from 'ava'
import { Blockchain, Network } from '../constants'

import { Client } from '.'

test('switcheo.config for TestNet', (t: GenericTestContext<any>) => {
  const switcheo: Client = new Client()
  t.is(switcheo.config.net, 'TestNet')
  t.is(switcheo.config.getContractHash(Blockchain.Neo), 'a195c1549e7da61b8da315765a790ac7e7633b82')
  t.is(switcheo.config.url, 'https://test-api.switcheo.network/v2')
})

test('switcheo.config for MainNet', (t: GenericTestContext<any>) => {
  const switcheo: Client = new Client({ net: Network.MainNet })
  t.is(switcheo.config.net, 'MainNet')
  t.is(switcheo.config.getContractHash(Blockchain.Neo), '91b83e96f2a7c4fdf0c1688441ec61986c7cae26')
  t.is(switcheo.config.url, 'https://api.switcheo.network/v2')
})
