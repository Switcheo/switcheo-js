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
  readonly neoAddress: string
  readonly ethAddress: string
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

export interface RetrieveKeyWithUserParams {
  readonly email: string
  readonly passwordHash: string
}

export function retrieveKeyWithUser(
  config: Config, params: RetrieveKeyWithUserParams): Promise<object> {
  return req.post(config.url + '/users/retrieve_key_with_user', params)
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

export interface GenerateOtpParams {
  readonly email: string
  readonly passwordHash: string
}

export function generateOtp(
  config: Config, params: GenerateOtpParams): Promise<object> {
  return req.post(config.url + '/users/generate_otp', params)
}

export interface EnableOtpParams {
  readonly email: string
  readonly passwordHash: string
  readonly otp: string
}

export function enableOtp(
  config: Config, params: EnableOtpParams): Promise<object> {
  return req.post(config.url + '/users/enable_otp', params)
}

export interface DisableOtpParams {
  readonly email: string
  readonly passwordHash: string
  readonly otp: string
}

export function disableOtp(
  config: Config, params: DisableOtpParams): Promise<object> {
  return req.post(config.url + '/users/disable_otp', params)
}

export interface OtpIsEnabledParams {
  readonly email: string
}

export function otpIsEnabled(
  config: Config, params: OtpIsEnabledParams): Promise<object> {
  return req.get(config.url + '/users/otp_is_enabled', params)
}
