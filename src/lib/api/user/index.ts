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

export interface ValidateEmailTokenParams {
  readonly confirmToken: string
}

export function validateEmailToken(config: Config, params: ValidateEmailTokenParams):
Promise<object> {
  return req.post(config.url + '/users/validate_email_token', params)
}

export interface NewPhoneParams {
  readonly confirmToken: string
  readonly phone: string
}

export function newPhone(config: Config, params: NewPhoneParams): Promise<object> {
  return req.post(config.url + '/users/new_phone', params)
}

export interface VerifyNewPhoneParams {
  readonly confirmToken: string
  readonly phoneVerifyToken: string
}

export function verifyNewPhone(config: Config, params: VerifyNewPhoneParams): Promise<object> {
  return req.post(config.url + '/users/verify_new_phone', params)
}

export interface ChangePhoneParams {
  readonly email: string
  readonly token: string
  readonly phone: string
}

export function changePhone(config: Config, params: ChangePhoneParams): Promise<object> {
  return req.post(config.url + '/users/change_phone', params)
}

export interface VerifyChangePhoneParams {
  readonly email: string
  readonly token: string
  readonly phoneVerifyToken: string
}

export function verifyChangePhone(config: Config, params: VerifyChangePhoneParams):
Promise<object> {
  return req.post(config.url + '/users/verify_change_phone', params)
}

export interface LoginUserParams {
  readonly email: string
  readonly passwordHash: string
  readonly otp: string
}

export function loginUser(
  config: Config, params: LoginUserParams): Promise<object> {
  return req.post(config.url + '/users/login', params)
}

export interface VerifyWithdrawalParams {
  readonly email: string
  readonly passwordHash: string
  readonly otp: string
  readonly confirmToken: string
}

export function verifyWithdrawal(config: Config, params: VerifyWithdrawalParams): Promise<object> {
  return req.post(config.url + '/users/verify_transfer', params)
}

export interface LogoutUserParams {
  readonly email: string
  readonly token: string
}

export function logoutUser(
  config: Config, params: LogoutUserParams): Promise<object> {
  return req.post(config.url + '/users/logout', params)
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
  readonly mnemonicHash: string
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
  return req.get(
    config.url + '/users/otp_is_enabled',
    { ...params, email: encodeURIComponent(params.email) })
}
