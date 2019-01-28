import { Blockchain } from '../constants'
import { AssetSymbol } from './assets'

enum TransferType {
  Withdrawal = 'withdrawal',
}

export enum WalletTransferStatus {
  Pending = 'pending',
  Confirming = 'confirming',
  Success = 'success',
  Expired = 'expired',
}

export interface WalletTransfer {
  fromAddress: string
  toAddress: string
  amount: number
  assetId: string
  assetSymbol: AssetSymbol
  blockchain: Blockchain
  contractHash: string
  createdAt: string
  transferType: TransferType
  id: string
  balanceId: string
  status: WalletTransferStatus
  isBalanceStatusActive: boolean
  transactionHash: string
  updatedAt: string
  isConfirmed: boolean
}
