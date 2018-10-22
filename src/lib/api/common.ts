export interface Request<T> {
  readonly url: string
  readonly payload: T
}

export interface SignedRequestPayload {
  readonly timestamp: number
  readonly signature: string
  readonly address: string
}
