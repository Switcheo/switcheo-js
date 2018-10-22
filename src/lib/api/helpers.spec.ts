import { test, GenericTestContext } from 'ava'
import { buildSignedRequestPayload, SignedRequestPayload } from './helpers'
import { createAccountAndConfig } from '../spec/helpers'

test('buildSignedRequest', async (t: GenericTestContext<any>) => {
  const { account, config } = createAccountAndConfig()
  const payload: SignedRequestPayload = await buildSignedRequestPayload(
    config,
    account,
    {
      orderType: 'limit',
      pair: 'SWTH_NEO',
      price: '0.00100000',
      side: 'buy',
      useNativeTokens: true,
      wantAmount: '12000000000',
    }
  )

  t.true(payload.timestamp !== undefined)
  t.true(payload.signature !== undefined)
})
