# switcheo-js

Switcheo Library

https://github.com/bitjson/typescript-starter

### Develop
- `npm run info`: "Display information about the package scripts",
- `npm run watch`: "Watch and rebuild the project on save, then rerun relevant tests",
- `npm run build`: "Clean and rebuild the project",

- `npm run fix`: "Try to automatically fix any linting problems",
- `npm run test`: "Lint and unit test the project",
- `npm run cov`: "Rebuild, run tests, then create and open the coverage report",
- `npm run doc`: "Generate HTML API documentation and open it in a browser",
- `npm run doc:json`: "Generate API documentation in typedoc JSON format",
- `npm run version`: "Bump package.json version, update CHANGELOG.md, tag release",
- `npm run reset`: "Delete all untracked files and reset the repo to the last commit",
- `npm run prepare-release`: "One-step: clean, build, test, publish docs, and prep a release"


# Usage

Getting started - Create an order
```js
import { Switcheo } from 'switcheo-js'

// defaults mode to 0:privatekey
const config = { blockchain: 'neo', privateKey: 'privatekey', net: 'TestNet' }

// initialise switcheo instance with account
const switcheo = new Switcheo()
switcheo.fetchLastPrice('SWTH_NEO', resolution, contractHash)
switcheo.setAccount(config)
// or
const switcheo = new Switcheo(config)

const orderParams = {
  pair: 'SWTH_NEO',
  blockchain: 'neo',
  side: 'buy',
  price: 0.00046858,
  wantAmount: 2155448375,
  useNativeTokens: true,
  orderType: 'limit',
}
// creates an order
try {
  const response = switcheo.createOrder(orderParams)  
} catch (err) {
  // handle error
}


// Or you don't feel like passing private key to Switcheo Object
const switcheo = new Switcheo({ blockchain: 'neo', net: 'TestNet' })

try {
  // const orderParams = ...
  const timestampSignature = '2f2e2a76ec2f2e2a76ec2f2e2a76ec2f2e2a76ec'
  const unsignedOrder = await switcheo.planOrder(orderParams, timestampSignature)
  // ... do signature logic
  // const orderSignatures = signArray(msg, privateKey)
  const response = await switcheo.executeOrder(signedOrders, ordersSignature)
} catch (err) {
  // handle error
}
```

Ledger
```js
// @param {number} mode - one of [0: privatekey, 1: encryptedkey, 2: ledger]
switcheo.setAccount({ blockchain: 'neo', mode: 2, net: 'TestNet' })

const orderParams = {
  pair: 'SWTH_NEO',
  blockchain: 'neo',
  side: 'buy',
  price: 0.00046858,
  wantAmount: 2155448375,
  useNativeTokens: true,
  orderType: 'limit',
}

// creates an order
switcheo.createOrder(orderParams)
  .then(response => console.log(response)) // success
  .catch(err => console.error(err)) // failure
```

Lib misc
```js
// utils.ts
const getLedgerSignature = (msg) => {
  // ...
  const ledger = await NeonLedger.init()
  const signature = ledger.getSignature(data)
  // ...
}

// createOrder.ts
import { tx, u, wallet } from '@cityofzion/neon-js'
import stringify from 'json-stable-stringify'
import { signWithLedger, signArray } from './utils'
import { planOrders, executeOrders } from './api/orders'

const getSignature = (s, msg, optionalSignature = null) => {
  if (optionalSignature) return optionalSignature
  switch (s.config.mode) {
    case PRIVATE_KEY_MODE:
    case ENCRYPTED_KEY_MODE: {
      return wallet.generateSignature(msg, s.account.privateKey)
    }
    case PRIVATE_KEY_MODE: {
      return getLedgerSignature(msg)
    }
    default:
      throw new Error('createOrder: mode not supported')
  }
}

const planOrder/createOrder = (s, orderParams, optionalSignature) => {
  // ... inside deeply nested logic
  // const signature = signArray(msg, { privateKey, optionalSignature })
  const signature = getSignature(s, stringify(orderParams), optionalSignature)
  // ...
}

export const createOrder = (s, orderParams) => {
  const orders = await planOrders(s, orderParams)
  return executeOrder(s, orders)
}
```
