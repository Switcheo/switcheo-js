import bip39 from 'bip39'
import hdkey from 'hdkey'
import bip44Constants from 'bip44-constants'

import { Blockchain } from '../constants'

function getCoinType(blockchain: Blockchain): number {
  return bip44Constants[blockchain.toUpperCase()] - 0x80000000
}

type GenerateWalletResult = Record<Blockchain.Neo | Blockchain.Ethereum | 'mnemonic', string>

export class SwitcheoHDWallet {
  public static generateWallet(_mnemonic?: string): GenerateWalletResult {
    const mnemonic: string = _mnemonic || bip39.generateMnemonic()

    const seed: Buffer = bip39.mnemonicToSeed(mnemonic)
    const root: hdkey = hdkey.fromMasterSeed(seed)

    const ethKey: string = this._getKey(root, getCoinType(Blockchain.Ethereum))
    const neoKey: string = this._getKey(root, getCoinType(Blockchain.Neo))

    return {
      [Blockchain.Ethereum]: ethKey,
      [Blockchain.Neo]: neoKey,
      mnemonic,
    }
  }

  private static _getKey = (root: hdkey, coinType: number): string => {
    // m/purpose'/coin_type'/account'/change/address_index
    const addrNode: any = root.derive(`m/44'/${coinType}'/0'/0/0`)

    return addrNode._privateKey.toString('hex')
  }
}
