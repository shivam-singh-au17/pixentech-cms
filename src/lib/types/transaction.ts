/**
 * Transaction Report Types
 * Type definitions for transaction reports data
 */

// Base transaction interface
export interface TransactionReport {
  _id: string
  roundId: string
  betTxnId: string
  platform: string
  operator: string
  brand: string
  balance: number
  externalPlayerId: string
  status: 'credit_completed' | 'debit_completed' | 'pending' | 'failed'
  isFreeBet: boolean
  isCompleted: boolean
  betAmount: number
  gameAlias: string
  playerCurrencyCode: string
  buyBonus: boolean
  betAmtConverted: {
    INR: number
    USD: number
    EUR: number
  }
  createdAt: string
  updatedAt: string
  winAmount?: number
  winAmtConverted?: {
    INR: number
    USD: number
    EUR: number
  }
}

// Detailed transaction interface (for single transaction view)
export interface DetailedTransactionReport {
  rounds: {
    _id: string
    roundId: string
    betTxnId: string
    playerSessionId: string
    platform: {
      _id: string
      platformName: string
      id: string
    }
    operator: {
      _id: string
      operatorName: string
      id: string
    }
    brand: {
      _id: string
      brandName: string
      id: string
    }
    balance: number
    externalPlayerId: string
    user: string
    status: string
    isFreeBet: boolean
    isCompleted: boolean
    betAmount: number
    gameAlias: string
    operatorGame: string
    playerCurrencyCode: string
    platformTransactionId: string
    buyBonus: boolean
    betAmtConverted: {
      INR: number
      USD: number
      EUR: number
    }
    isNewBe: boolean
    createdAt: string
    updatedAt: string
    winAmount?: number
    winAmtConverted?: {
      INR: number
      USD: number
      EUR: number
    }
    id: string
    betInfo?: {
      playerId: string
      betId: string
      roundId: string
      gameMode: string
      payout: number
      payoutMultiplier: number
      betAmount: number
      gameCode: string
      createdAt: string
      nonce: number
      currency: string
      winChance?: number
      state?: any
      cashOutAt: number
      btnIndex: number
      targetMultiplier?: number
      crashMultiplier?: number
      clientSeed: string
      hash: string
      hashedServerSeed: string
      seed: string
      serverSeed?: string
      active: boolean
    }
  }
}

// Transaction filters interface
export interface TransactionFilter {
  startDate: Date
  endDate: Date
  platform?: string
  operator?: string
  brand?: string
  gameAlias?: string
  status?: string
  externalPlayerId?: string
  roundId?: string
  betTxnId?: string
  pageNo?: number
  pageSize?: number
  sortDirection?: number
}

// API response for transaction list
export interface TransactionListResponse {
  data: TransactionReport[]
  limit: number
  page: number
  totalCount?: number
}

// Transaction status options
export const TRANSACTION_STATUS_OPTIONS = [
  { id: 'ALL', label: 'All Status' },
  { id: 'credit_completed', label: 'Credit Completed' },
  { id: 'debit_completed', label: 'Debit Completed' },
  { id: 'pending', label: 'Pending' },
  { id: 'failed', label: 'Failed' },
] as const

// Transaction export fields
export const transactionExportFields = [
  { key: 'betTxnId', label: 'Bet Transaction ID' },
  { key: 'roundId', label: 'Round ID' },
  { key: 'externalPlayerId', label: 'Player ID' },
  { key: 'gameAlias', label: 'Game' },
  { key: 'platform', label: 'Platform' },
  { key: 'operator', label: 'Operator' },
  { key: 'brand', label: 'Brand' },
  { key: 'betAmount', label: 'Bet Amount' },
  { key: 'winAmount', label: 'Win Amount' },
  { key: 'balance', label: 'Balance' },
  { key: 'status', label: 'Status' },
  { key: 'playerCurrencyCode', label: 'Currency' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'updatedAt', label: 'Updated At' },
] as const
