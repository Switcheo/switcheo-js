import { Config } from '../../switcheo/config'
import req from '../../req'

export interface ValidateUserParams {
  readonly email: string
}

export function validateUser(config: Config, params: ValidateUserParams): Promise<object> {
  return req.post(config.url + '/users/validate', params)
}

export interface CreateUserParams {
  readonly email: string
  readonly passwordHash: string
  readonly encryptedMnemonic: string
  readonly mnemonicHash: string
  readonly newsletter: boolean
}

export function createUser(config: Config, params: CreateUserParams): Promise<object> {
  return req.post(config.url + '/users', params)
}

export interface VerifyEmailParams {
  readonly confirmToken: string
}

export function verifyEmail(config: Config, params: VerifyEmailParams): Promise<object> {
  return req.post(config.url + '/users/verify_email', params)
}

export interface GetEncryptedMnemonicParams {
  readonly email: string
  readonly passwordHash: string
}

export function getEncryptedMnemonic(
  config: Config, params: GetEncryptedMnemonicParams): Promise<object> {
  return req.post(config.url + '/users/retrieve_key', params)
}

export interface ResetPasswordParams {
  readonly email: string
  readonly passwordHash: string
  readonly encryptedMnemonic: string
  readonly mnemonicHash: string
}

export function resetPassword(
  config: Config, params: ResetPasswordParams): Promise<object> {
  return req.post(config.url + '/users/reset_password', params)
}
