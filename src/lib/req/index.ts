import axios, { AxiosError } from 'axios'
import humps from 'humps'
import { stringifyParams } from '../utils'

interface Params {
  readonly [key: string]: ReadonlyArray<any> | any
}

interface Response {
  readonly status: number,
  readonly data: {}
}

function buildGetUrl(url: string, params?: {}): string {
  if (params === undefined) {
    return url
  }
  return url + '?' + buildGetParams(params)
}

function buildGetParams(params: {}): string {
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

function extractErrorMessage(error: AxiosError): string {
  if (error.response && error.response.data && error.response.data.error) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.data.error
  }
  return error.message
}

export default class Req {
  public static async handleResponse(response: Response): Promise<any> {
    // return humps.camelizeKeys(response.data)
    return humps.camelizeKeys(response.data, (key: string, convert: (str: string) => string) => {
      return /^[A-Z0-9_]+$/.test(key) ? key : convert(key)
    })
  }

  public static handleError(error: AxiosError): never {
    throw new Error(extractErrorMessage(error))
  }

  public static async get(url: string, params?: {}): Promise<any> {
    return axios.get(buildGetUrl(url, params))
      .then(this.handleResponse)
      .catch(this.handleError)
  }

  public static async post(url: string, params: {}, headers: {} = {}): Promise<any> {
    return axios.post(url, stringifyParams(params), {
      headers: {
        ...headers,
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
