export interface RawError {
  message: string
  response: {
    data: {
      error: string
    },
    status: number
    config: {
      headers: string,
      method: string,
      payload: string,
      url: string
    }
  }
}

function getErrorMessage(error: RawError): string {
  if (error.response && error.response.data && error.response.data.error) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.data.error
  }
  return error.message
}

export default class RequestError extends Error {
  public rawError: RawError

  constructor(error: RawError) {
    super(getErrorMessage(error))
    this.rawError = error
  }
}
