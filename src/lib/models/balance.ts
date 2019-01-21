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
}

export interface Balance {
  address: string
  amount: number
  approvalTransactionHash: string
  assetId: string
  blockchain: Blockchain
  contractHash: string
  createdAt: string
  eventType: EventType
  groupIndex: number
  id: string
  reasonCode: number
  status: Status
  transactionHash: string
  updatedAt: string
}

export interface History {
  amount: string
  assetId: string
  assetSymbol: AssetSymbol
  blockchain: Blockchain
  eventType: EventType
  feeAssetSymbol: AssetSymbol
  feeAssetId: string
  feeAmount: string
  id: string
  status: Status
  timestamp: number
  transactionHash: string
}
