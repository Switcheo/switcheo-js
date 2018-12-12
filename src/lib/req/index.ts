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

interface SwitcheoError extends Error {
  errorMessage?: string
  errorCode?: number
}

interface AxiosSwitcheoError {
  error: string
  error_message: string
  error_code: number
}

function formSwitcheoError(error: AxiosSwitcheoError): SwitcheoError {
  const switcheoError: SwitcheoError = new Error() as SwitcheoError

  switcheoError.message = error.error
  switcheoError.errorMessage = error.error_message
  switcheoError.errorCode = error.error_code

  return switcheoError
}

function extractSwitcheoError(error: AxiosError): SwitcheoError {
  if (error.response && error.response.data && error.response.data.error) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return formSwitcheoError(error.response.data)
  }

  return new Error(error.message)
}

export default class Req {
  public static async handleResponse(response: Response): Promise<any> {
    // return humps.camelizeKeys(response.data)
    return humps.camelizeKeys(response.data, (key: string, convert: (str: string) => string) => {
      return /^[A-Z0-9_]+$/.test(key) ? key : convert(key)
    })
  }

  public static handleError(error: AxiosError): never {
    throw extractSwitcheoError(error)
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
