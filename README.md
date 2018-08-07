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

const config = { blockchain: 'neo', net: 'TestNet', mode: 'privateKey' }

// initialise switcheo instance with account
const switcheo = new Switcheo(config)
switcheo.fetchLastPrice({ 'SWTH_NEO', resolution, contractHash })

const account: SwitcheoAccount = switcheo.createAccount({ key: 'encryptedkey', passphrase: 'passphrase' })

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
  const response = switcheo.createOrder(orderParams, account)  
} catch (err) {
  // handle error
}
```

Ledger
```js
// @param {number} mode - one of [0: privatekey, 1: encryptedkey, 2: ledger]
const account = switcheo.createAccount({ blockchain: 'neo', net: 'TestNet', mode: 'ledger' })

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
  const response = switcheo.createOrder(orderParams, account)  
} catch (err) {
  // handle error
}
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

const getSignature = (msg, account) => {
  if (account.isLedgerMode) {
    return getLedgerSignature(msg)
  }
  return wallet.generateSignature(msg, account.privateKey)
}

const planOrder/executeOrder = (orderParams, account) => {
  // ... inside deeply nested logic
  const signature = getSignature(stringify(orderParams), account)
  // ...
}

export const createOrder = (orderParams, account) => {
  const orders = await planOrders(orderParams, account)
  return executeOrder(orders, account)
}
```
