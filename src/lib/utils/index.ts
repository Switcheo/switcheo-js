import humps from 'humps'
import stableStringify from 'json-stable-stringify'

export function stringifyParams(params: {}): string {
  const decamelizedParams: {} = humps.decamelizeKeys(params)
  // ensure that params are sorted in alphabetical order
  return stableStringify(decamelizedParams)
}
