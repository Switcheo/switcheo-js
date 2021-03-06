import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs2'
import { JsonRpc, Api } from 'eosjs2'
import { EosTransaction } from '../models/transaction'
import { Network } from '../constants/networks'
import { SignatureProvider, SignatureProviderType } from '.'
import { EosProvider } from './eosProvider'

ScatterJS.plugins(new ScatterEOS())

export class EosScatterProvider implements SignatureProvider, EosProvider {
  // Checks if the Scatter wallet is present
  public static async isPresent(_network: Network): Promise<boolean> {
    const network: ScatterJS.Network = EosScatterProvider.getScatterNetwork(_network)
    const connected: boolean = await ScatterJS.connect('Switcheo Exchange', { network })
    return !!connected
  }

  // Creates a EosPrivateKeyProvider asynchronously
  public static async init(_network: Network): Promise<EosScatterProvider> {
    const network: ScatterJS.Network = EosScatterProvider.getScatterNetwork(_network)

    if (_network !== Network.MainNet) {
      const added: boolean = await ScatterJS.scatter.suggestNetwork(network)
      if (!added) throw new Error('Could not connect to correct network!')
    }

    const connected: boolean = await ScatterJS.connect('Switcheo Exchange', { network })
    if (!connected) throw new Error('Could not detect Scatter!')

    const id: string = await ScatterJS.login()
    if (!id) throw new Error('No identity could be found!')

    const account: ScatterJS.Account = ScatterJS.account('eos')
    if (!account) throw new Error('No account could be found!')

    const rpc: JsonRpc = new JsonRpc(network.fullhost())
    const provider: Api = ScatterJS.eos(network, Api, { rpc, beta3: true })

    return new EosScatterProvider(account, provider)
  }

  private static getScatterNetwork(network: Network): ScatterJS.Network {
    const chainId: string = network === Network.MainNet ?
      'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' : // mainnet
      'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473' // jungle
    const host: string = network === Network.MainNet ?
      'nodes.get-scatter.com' : // mainnet
      'jungle.obolus.com' // jungle

    return ScatterJS.Network.fromJson({
      blockchain: 'eos',
      chainId,
      host,
      port: 443,
      protocol: 'https',
    })
  }

  public readonly publicKey: string
  public readonly address: string
  public readonly displayAddress: string
  public readonly type: SignatureProviderType
  private readonly provider: Api
  private readonly account: ScatterJS.Account

  constructor(account: ScatterJS.Account, provider: any) {
    this.account = account
    this.provider = provider
    this.type = SignatureProviderType.Scatter
    this.address = account.name
    this.displayAddress = `${account.name}@${account.authority}`
    this.publicKey = account.publicKey
  }

  public signParams(params: { message?: string }): Promise<string> {
    if (params.message) {
      return ScatterJS.scatter.getArbitrarySignature(this.account.publicKey, params.message)
    }
    return Promise.reject(new Error('signParams() is not implemented for EOS!'))
  }

  public signMessage(message: string): Promise<string> {
    return ScatterJS.scatter.getArbitrarySignature(this.account.publicKey, message)
  }

  public async signTransaction(transaction: EosTransaction): Promise<string> {
    const txn: {
      serializedTransaction: Uint8Array
      signatures: ReadonlyArray<string>,
    } = await this.provider.transact(
      this.insertAuth(transaction),
      { ...this.options(), broadcast: false }
    )
    return {
      serializedTransaction: (txn.serializedTransaction as any).toString('hex'),
      signatures: txn.signatures,
    } as any // not sure why signTransaction method signature returns string
  }

  public sendTransaction(transaction: EosTransaction): Promise<string> {
    return this.provider.transact(
      this.insertAuth(transaction),
      { ...this.options(), broadcast: true }
    )
  }

  private options(): {} {
    return {
      blocksBehind: 3,
      expireSeconds: 30,
      sign: true,
    }
  }

  private insertAuth(transaction: EosTransaction): EosTransaction {
    transaction.actions[0].authorization = [{
      actor: this.account.name,
      permission: this.account.authority,
    }]
    return transaction
  }
}
