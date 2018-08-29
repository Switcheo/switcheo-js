# switcheo-js

Switcheo Library

https://github.com/bitjson/typescript-starter

### Develop
- `yarn info`: "Display information about the package scripts",
- `yarn watch`: "Watch and rebuild the project on save, then rerun relevant tests",
- `yarn build`: "Clean and rebuild the project",

- `yarn fix`: "Try to automatically fix any linting problems",
- `yarn test`: "Lint and unit test the project",
- `yarn cov`: "Rebuild, run tests, then create and open the coverage report",
- `yarn doc`: "Generate HTML API documentation and open it in a browser",
- `yarn doc:json`: "Generate API documentation in typedoc JSON format",
- `yarn version`: "Bump package.json version, update CHANGELOG.md, tag release",
- `yarn reset`: "Delete all untracked files and reset the repo to the last commit",
- `yarn prepare-release`: "One-step: clean, build, test, publish docs, and prep a release"


NOTE: `"prepare": "yarn run build",` is needed for projects targeting this lib as a git repo

# Usage

Getting started
```js
import { Switcheo } from 'switcheo-js'

const switcheo: Switcheo = new Switcheo({
  net: TEST_NET,
})

switcheo.listPairs()
```
