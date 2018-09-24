import axios from 'axios'
import humps from 'humps'
import { stringifyParams } from '../utils'
import RequestError, { RawError } from './request-error'

interface Response {
  readonly status: number,
  readonly data: object
}

export default class Req {
  public static async handleResponse(response: Response): Promise<any> {
    // return humps.camelizeKeys(response.data)
    return humps.camelizeKeys(response.data, (key: string, convert: (str: string) => string) => {
      return /^[A-Z0-9_]+$/.test(key) ? key : convert(key)
    })
  }

  public static handleError(error: object): never {
    const rawError: RawError = error as RawError
    throw new RequestError(rawError)
  }

  public static async get(url: string, params?: object): Promise<any> {
    return axios.get(buildGetUrl(url, params))
      .then(this.handleResponse)
      .catch(this.handleError)
  }

  public static async post(url: string, params: object): Promise<any> {
    return axios.post(url, stringifyParams(params), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(this.handleResponse)
      .catch(this.handleError)
  }

  public static async fetchTimestamp(config: { readonly url: string }): Promise<number> {
    const { timestamp } = await this.get(config.url + '/exchange/timestamp')
    return timestamp
  }
}

function buildGetUrl(url: string, params?: object): string {
  if (params === undefined) {
    return url
  }
  return url + '?' + buildGetParams(params)
}

interface Params {
  readonly [key: string]: ReadonlyArray<any> | any
}

function buildGetParams(params: object): string {
  const decamelizedParams: Params = humps.decamelizeKeys(params) as Params
  const paramKeys: ReadonlyArray<string> = Object.keys(decamelizedParams)
  const urlParams: ReadonlyArray<string> =
    paramKeys.map((key: string) => mapPairToUrlParam(key, decamelizedParams[key]))
  return urlParams.join('&')
}

function mapPairToUrlParam(key: string, value: ReadonlyArray<any> | any): string {
  if (Array.isArray(value)) {
    return value.map((v: any) => `${key}[]=${v}`).join('&')
  }
  return `${key}=${value}`
}
