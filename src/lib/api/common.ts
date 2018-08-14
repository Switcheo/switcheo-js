export interface Request {
  readonly url: string
  readonly payload: object
}

export interface SignedRequestPayload {
  readonly timestamp: number
  readonly signature: string
  readonly address: string
}
