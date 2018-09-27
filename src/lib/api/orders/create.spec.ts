import { buildOrderCreationRequest, OrderCreationRequest } from './create'
import { createAccountAndConfig } from '../../spec/helpers'
import { test, GenericTestContext } from 'ava'

test('buildOrderCreationRequest', async (t: GenericTestContext<any>) => {
  const { account, config } = createAccountAndConfig()
  const request: OrderCreationRequest = await buildOrderCreationRequest(
    config,
    {
      orderType: 'limit',
      pair: 'SWTH_NEO',
      price: '0.001',
      side: 'buy',
      useNativeTokens: true,
      wantAmount: '12000000000',
    },
    account
  )

  const { payload } = request

  t.is(request.url, 'https://test-api.switcheo.network/v2/orders')
  t.is(payload.address, '87cf67daa0c1e9b6caa1443cf5555b09cb3f8e5f')
  t.is(payload.blockchain, 'neo')
  t.is(payload.contractHash, 'a195c1549e7da61b8da315765a790ac7e7633b82')
  t.is(payload.orderType, 'limit')
  t.is(payload.pair, 'SWTH_NEO')
  t.is(payload.price, '0.00100000')
  t.is(payload.side, 'buy')
  t.true(payload.timestamp !== undefined)
  t.true(payload.signature !== undefined)
  t.true(payload.useNativeTokens)
  t.is(payload.wantAmount, '12000000000')
})
