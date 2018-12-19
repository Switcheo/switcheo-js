# Switcheo JS

Switcheo JS is a Javascript client library for interfacing with the Switcheo Exchange API.

As the library is written in TypeScript, TypeScript annotations are available by default.

# Usage

## Getting started

Import the Client to call any available Switcheo API [endpoint](https://docs.switcheo.network):

```js
import { Client, Network } from 'switcheo-js'

const switcheo: Client = new Client({
  net: Network.TestNet,
})

const Pairs = switcheo.listPairs()
```

An alternative way of accessing the functions is through the lower level `api` and `Config` objects:

```ts
import { Account, api, Config, Network } from 'switcheo-js'

const config: Config = new Config({ net: Network.TestNet, source: 'my-api' })
const params: CreateOrderParams = { ... }
const account: Account = new Account(...)

const Order = await api.orders.make(config, account, params)
```

### Development

- `yarn build`: "Clean and rebuild the project",
- `yarn lint`: "Lint the project",
- `yarn test`: "Lint and unit test the project",
- `yarn reset`: "Delete all untracked files and reset the repo to the last commit",
- `yarn prepare-release`: "One-step: clean, build, test, publish docs, and prep a release"

NOTE: `"prepare": "yarn run build",` is needed for projects targeting this lib as a git repo
