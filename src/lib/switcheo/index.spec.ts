import { test } from 'ava'
import Switcheo from './index'
import { Blockchain } from '../constants'

test('switcheo.config for TestNet', (t) => {
  const switcheo = new Switcheo()
  t.is(switcheo.config.net, 'TestNet')
  t.is(switcheo.config.getContractHash(Blockchain.Neo), 'a195c1549e7da61b8da315765a790ac7e7633b82')
  t.is(switcheo.config.url, 'https://test-api.switcheo.network/v2')
})

test('switcheo.config for MainNet', (t) => {
  const switcheo = new Switcheo({ net: 'MainNet' })
  t.is(switcheo.config.net, 'MainNet')
  t.is(switcheo.config.getContractHash(Blockchain.Neo), '91b83e96f2a7c4fdf0c1688441ec61986c7cae26')
  t.is(switcheo.config.url, 'https://api.switcheo.network/v2')
})
