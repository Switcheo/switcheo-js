
import { SignatureProvider } from './index'

export interface EosProvider extends SignatureProvider {
  publicKey: string
}
