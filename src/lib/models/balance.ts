import { Blockchain } from '../constants'
import { AssetSymbol } from './assets'

export enum EventType {
    Deposit = 'deposit',
    Withdrawal = 'withdrawal',
}

export enum Status {
    Confirming = 'confirming',
    Expired = 'expired',
    Pending = 'pending',
    Success = 'success',
    Cancelled = 'cancelled', // WalletTransfer
}

export interface Balance {
  id: string
  status: Status
  blockchain: Blockchain
  eventType: EventType
  contractHash: string
  address: string
  amount: number
  assetId: string
  groupIndex: number
  reasonCode: number
  transactionHash: string
  approvalTransactionHash: string
  createdAt: string
  updatedAt: string
}
export interface History {
  id: string
  status: Status
  amount: string
  assetId: string
  assetSymbol: AssetSymbol
  blockchain: Blockchain
  eventType: EventType
  feeAssetSymbol: AssetSymbol
  feeAssetId: string
  feeAmount: string
  networkFeeAssetSymbol: AssetSymbol
  networkFeeAssetId: string
  networkFeeAmount: string
  transactionHash: string
  timestamp: number
}
