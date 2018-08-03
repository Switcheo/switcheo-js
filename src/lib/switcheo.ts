import { wallet } from '@cityofzion/neon-js'

class Switcheo {
  // privateKey: string;
  constructor(public privateKey: string) {
    const account = new wallet.Account(privateKey)
    console.log(account.privateKey)
    this.privateKey = account.privateKey
  }
}

export { Switcheo }
