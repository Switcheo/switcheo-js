import { test } from 'ava'
import Switcheo from './index'

const ADDRESS = '87cf67daa0c1e9b6caa1443cf5555b09cb3f8e5f'
const PRIVATE_KEY = 'cd7b887c29a110e0ce53e81d6dd02805fc7b912718ff8b6659d8da42887342bd'

test('switcheo.config for TestNet', (t) => {
  const switcheo = new Switcheo()
  t.is(switcheo.config.net, 'TestNet')
  t.is(switcheo.config.getContractHash('neo'), 'a195c1549e7da61b8da315765a790ac7e7633b82')
  t.is(switcheo.config.url, 'https://test-api.switcheo.network/v2')
})

test('switcheo.config for MainNet', (t) => {
  const switcheo = new Switcheo({ net: 'MainNet' })
  t.is(switcheo.config.net, 'MainNet')
  t.is(switcheo.config.getContractHash('neo'), '91b83e96f2a7c4fdf0c1688441ec61986c7cae26')
  t.is(switcheo.config.url, 'https://api.switcheo.network/v2')
})

test('Switcheo.createAccount', (t) => {
  const account = Switcheo.createAccount({
    address: ADDRESS,
    blockchain: 'neo',
    privateKey: PRIVATE_KEY,
  })
  t.is(account.address, ADDRESS)
  t.is(account.privateKey, PRIVATE_KEY)
  t.is(account.blockchain, 'neo')
})
