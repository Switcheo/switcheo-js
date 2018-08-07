import fetch from 'node-fetch'
import { convertHashToUrlParams, stringifyParams } from '../utils'

const handleJSONResponse = async (response) => {
  if (response.ok) return response.json()

  try {
    const { error } = await response.json()
    throw new Error(error)
  } catch (err) {
    throw new Error(err)
  }
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
