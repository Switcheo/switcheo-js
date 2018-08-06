import fetch from 'node-fetch'
import { convertHashToUrlParams, stringifyParams } from '../utils'

const handleJSONResponse = async (response) => {
  if (response.ok) return response.json()
  let jsonErr
  try {
    // when error message is not a json (not 422), we try to use text
    jsonErr = await response.json()
  } catch (e) {
    throw new Error(e)
  }
  throw new Error(jsonErr.error)
}

export const get = async (url, params = null) => {
  const parsedUrl = params ? `${url}?${convertHashToUrlParams(params)}` : url
  return fetch(parsedUrl).then(handleJSONResponse)
}

export const post = async (url, params) => {
  return fetch(url, {
    body: stringifyParams(params),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  }).then(handleJSONResponse)
}
