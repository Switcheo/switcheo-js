import humps from 'humps'
import stableStringify from 'json-stable-stringify'

export function stringifyParams(params: object): string {
  const decamelizedParams: object = humps.decamelizeKeys(params)
  // ensure that params are sorted in alphabetical order
  return stableStringify(decamelizedParams)
}
