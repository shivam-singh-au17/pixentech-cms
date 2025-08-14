/**
 * Transaction Report Utility Functions
 * Helper functions for formatting and processing transaction data
 */

import type { TransactionReport } from '@/lib/types/transaction'

/**
 * Format currency amount with symbol
 */
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  if (typeof amount !== 'number' || isNaN(amount)) return '0.00'

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })

  return formatter.format(amount)
}

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  if (typeof num !== 'number' || isNaN(num)) return '0'
  return new Intl.NumberFormat('en-IN').format(num)
}

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'

  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
    }).format(date)
  } catch (error) {
    return 'Invalid Date'
  }
}

/**
 * Format date for display (safe version)
 */
export const formatDateSafe = (dateString?: string | null): string => {
  if (!dateString) return 'N/A'
  return formatDate(dateString)
}

/**
 * Get status color class
 */
export const getStatusColorClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'credit_completed':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'debit_completed':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'pending':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'failed':
      return 'text-red-600 bg-red-50 border-red-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

/**
 * Get status display text
 */
export const getStatusDisplayText = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'credit_completed':
      return 'Credit Completed'
    case 'debit_completed':
      return 'Debit Completed'
    case 'pending':
      return 'Pending'
    case 'failed':
      return 'Failed'
    default:
      return status
  }
}

/**
 * Calculate profit/loss
 */
export const calculateProfitLoss = (betAmount: number, winAmount: number = 0): number => {
  return winAmount - betAmount
}

/**
 * Get profit/loss color class
 */
export const getProfitLossColorClass = (profitLoss: number): string => {
  if (profitLoss > 0) return 'text-green-600'
  if (profitLoss < 0) return 'text-red-600'
  return 'text-gray-600'
}

/**
 * Format profit/loss with sign
 */
export const formatProfitLoss = (profitLoss: number, currency: string = 'INR'): string => {
  const sign = profitLoss >= 0 ? '+' : ''
  return `${sign}${formatCurrency(profitLoss, currency)}`
}

/**
 * Get multiplier from win and bet amounts
 */
export const calculateMultiplier = (betAmount: number, winAmount: number = 0): number => {
  if (betAmount === 0) return 0
  return winAmount / betAmount
}

/**
 * Format multiplier
 */
export const formatMultiplier = (multiplier: number): string => {
  return `${multiplier.toFixed(2)}x`
}

/**
 * Get current day date range helper
 */
export const getCurrentDayRange = () => {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
  return { startOfDay, endOfDay }
}

/**
 * Transaction export fields for CSV/Excel export
 */
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

/**
 * Prepare transaction data for export
 */
export const prepareTransactionExportData = (transactions: TransactionReport[]) => {
  return transactions.map(transaction => ({
    'Bet Transaction ID': transaction.betTxnId,
    'Round ID': transaction.roundId,
    'Player ID': transaction.externalPlayerId,
    Game: transaction.gameAlias,
    Platform: transaction.platform,
    Operator: transaction.operator,
    Brand: transaction.brand,
    'Bet Amount': transaction.betAmount,
    'Win Amount': transaction.winAmount || 0,
    Balance: transaction.balance,
    Status: getStatusDisplayText(transaction.status),
    Currency: transaction.playerCurrencyCode,
    'Created At': formatDate(transaction.createdAt),
    'Updated At': formatDate(transaction.updatedAt),
    'Profit/Loss': calculateProfitLoss(transaction.betAmount, transaction.winAmount || 0),
    Multiplier: formatMultiplier(
      calculateMultiplier(transaction.betAmount, transaction.winAmount || 0)
    ),
  }))
}
