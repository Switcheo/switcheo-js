import { buildOrderBroadcastRequest, OrderBroadcastRequest } from './broadcast'
import { Order } from '../../models/order'
import { createAccountAndConfig } from '../../spec/helpers'
import { test, GenericTestContext } from 'ava'

// tslint:disable-next-line:max-line-length
const orderCreationResponse: string = '{"id":"6fff7986-2e17-4848-a622-62155c201e9f","blockchain":"neo","contract_hash":"a195c1549e7da61b8da315765a790ac7e7633b82","address":"b9e9b9178d7eeeb612777d5482c39bcaf9d23ee7","side":"buy","offer_asset_id":"c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b","want_asset_id":"ab38352559b8b203bde5fddfa0b07d8b2525e132","offer_amount":"12000000","want_amount":"12000000000","transfer_amount":"0","priority_gas_amount":"0","use_native_token":true,"native_fee_transfer_amount":0,"deposit_txn":null,"created_at":"2018-08-13T08:49:12.432Z","status":"pending","fills":[],"makes":[{"id":"d7d0648d-06ad-4765-9ccf-ac3219ac7e2f","offer_hash":null,"available_amount":null,"offer_asset_id":"c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b","offer_amount":"12000000","want_asset_id":"ab38352559b8b203bde5fddfa0b07d8b2525e132","want_amount":"12000000000","filled_amount":null,"txn":{"offerHash":"2c64cb51088e2a6c4cbebc69d9239360a0cc24ee9c1db40fdcdd697107be9e60","hash":"2ad2420486afdbf352f01d0beb22d89829dd8324e4894a3814ac8d72f579b02c","sha256":"d008fbe99992ae87877ba0945186b06f294afa5770f1cb1a13556c84a7eec2d4","invoke":{"scriptHash":"a195c1549e7da61b8da315765a790ac7e7633b82","operation":"makeOffer","args":["e73ed2f9ca9bc382547d7712b6ee7e8d17b9e9b9","9b7cffdaa674beae0f930ebe6085af9093e5fe56b34a5c220ccdcf6efc336fc5",12000000,"32e125258b7db0a0dffde5bd03b2b859253538ab",12000000000,"64376430363438642d303661642d343736352d396363662d616333323139616337653266"]},"type":209,"version":1,"attributes":[{"usage":32,"data":"e73ed2f9ca9bc382547d7712b6ee7e8d17b9e9b9"}],"inputs":[{"prevHash":"2c0fc51c8221fc35c01a3abfb524dc90f85d5412e677461f41c26b64b069607b","prevIndex":0},{"prevHash":"0cf986077cd854a8a82e4ccdb50e3516808bd055a4fb7c0bab80f47c9f3a64cc","prevIndex":10}],"outputs":[{"assetId":"602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7","scriptHash":"e707714512577b42f9a011f8b870625429f93573","value":1e-8}],"scripts":[],"script":"2464376430363438642d303661642d343736352d396363662d61633332313961633765326608007841cb020000001432e125258b7db0a0dffde5bd03b2b859253538ab08001bb70000000000209b7cffdaa674beae0f930ebe6085af9093e5fe56b34a5c220ccdcf6efc336fc514e73ed2f9ca9bc382547d7712b6ee7e8d17b9e9b956c1096d616b654f6666657267823b63e7c70a795a7615a38d1ba67d9e54c195a1","gas":0},"cancel_txn":null,"price":"0.001","status":"pending","created_at":"2018-08-13T08:49:12.446Z","transaction_hash":"2ad2420486afdbf352f01d0beb22d89829dd8324e4894a3814ac8d72f579b02c","trades":[]}]}'

const order: Order = new Order(JSON.parse(orderCreationResponse))

test('broadcastOrderCreationRequest', async (t: GenericTestContext<any>) => {
  const { account, config } = createAccountAndConfig()
  const request: OrderBroadcastRequest = await buildOrderBroadcastRequest(config, order, account)

  const { payload } = request

  t.is(order.id, '6fff7986-2e17-4848-a622-62155c201e9f')
  t.is(request.url, `https://test-api.switcheo.network/v2/orders/${order.id}/broadcast`)
  t.deepEqual(payload.signatures.fills, {})
  t.deepEqual(payload.signatures.makes, {
    'd7d0648d-06ad-4765-9ccf-ac3219ac7e2f':
    // tslint:disable-next-line:max-line-length
    '1b3bff680ac3f09e06976cd89ae20c1b6313befc85867b4a9b253491894f1a2417e48fdc6721e4e65e6f7c20be8deaff5e3c454caeb30750361657aad2ccdd36',
  })
})
