/**
 * Summary Utils
 * Utility functions for formatting and processing summary data
 */

import { format } from 'date-fns'
import type { ExportField } from '@/lib/types/summary'

// Safe date formatting with validation
export const formatDateSafe = (
  value: string | null | undefined,
  formatStr = 'dd MMM yyyy'
): string => {
  if (!value) return 'No Date'

  const dateValue = new Date(value)
  if (isNaN(dateValue.getTime())) {
    return 'Invalid Date'
  }

  return format(dateValue, formatStr)
}

// Format currency values
export const formatCurrency = (value: number, currency = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Format percentage
export const formatPercentage = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  return `${numValue.toFixed(2)}%`
}

// Format large numbers
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-IN').format(value)
}

// Calculate win rate
export const calculateWinRate = (wonRounds: number, totalRounds: number): number => {
  return totalRounds > 0 ? (wonRounds / totalRounds) * 100 : 0
}

// Get RTP color class based on value
export const getRTPColorClass = (rtp: string): string => {
  const rtpValue = parseFloat(rtp)
  if (rtpValue >= 95) return 'text-green-600 font-semibold'
  if (rtpValue >= 85) return 'text-yellow-600 font-semibold'
  return 'text-red-600 font-semibold'
}

// Get GGR color class based on value
export const getGGRColorClass = (ggr: number): string => {
  if (ggr > 0) return 'text-green-600 font-semibold'
  if (ggr < 0) return 'text-red-600 font-semibold'
  return 'text-gray-600'
}

// Export field definitions
export const dailySummaryExportFields: ExportField[] = [
  { key: 'date', label: 'Date', format: value => format(new Date(value), 'dd/MM/yyyy') },
  { key: 'totalRounds', label: 'Total Rounds', format: formatNumber },
  { key: 'wonRounds', label: 'Won Rounds', format: formatNumber },
  { key: 'totalBet', label: 'Total Bet', format: value => formatCurrency(value) },
  { key: 'totalWin', label: 'Total Win', format: value => formatCurrency(value) },
  { key: 'ggr', label: 'GGR', format: value => formatCurrency(value) },
  { key: 'rtp', label: 'RTP %', format: formatPercentage },
]

export const gameSummaryExportFields: ExportField[] = [
  { key: 'gameAlias', label: 'Game' },
  { key: 'platform', label: 'Platform' },
  { key: 'operator', label: 'Operator' },
  { key: 'totalRounds', label: 'Total Rounds', format: formatNumber },
  { key: 'wonRounds', label: 'Won Rounds', format: formatNumber },
  { key: 'totalBet', label: 'Total Bet', format: value => formatCurrency(value) },
  { key: 'totalWin', label: 'Total Win', format: value => formatCurrency(value) },
  { key: 'ggr', label: 'GGR', format: value => formatCurrency(value) },
  { key: 'rtp', label: 'RTP %', format: formatPercentage },
]

export const playerSummaryExportFields: ExportField[] = [
  { key: 'externalPlayerId', label: 'Player ID', format: value => value || 'Anonymous' },
  { key: 'platform', label: 'Platform' },
  { key: 'operator', label: 'Operator' },
  { key: 'totalRounds', label: 'Total Rounds', format: formatNumber },
  { key: 'wonRounds', label: 'Won Rounds', format: formatNumber },
  { key: 'totalBet', label: 'Total Bet', format: value => formatCurrency(value) },
  { key: 'totalWin', label: 'Total Win', format: value => formatCurrency(value) },
  { key: 'ggr', label: 'GGR', format: value => formatCurrency(value) },
  { key: 'rtp', label: 'RTP %', format: formatPercentage },
]

export const playerGameSummaryExportFields: ExportField[] = [
  { key: 'externalPlayerId', label: 'Player ID', format: value => value || 'Anonymous' },
  { key: 'gameAlias', label: 'Game' },
  { key: 'totalRounds', label: 'Total Rounds', format: formatNumber },
  { key: 'wonRounds', label: 'Won Rounds', format: formatNumber },
  { key: 'totalBet', label: 'Total Bet', format: value => formatCurrency(value) },
  { key: 'totalWin', label: 'Total Win', format: value => formatCurrency(value) },
  { key: 'ggr', label: 'GGR', format: value => formatCurrency(value) },
  { key: 'rtp', label: 'RTP %', format: formatPercentage },
]

// Export to CSV function
export const exportToCSV = <T>(data: T[], fields: ExportField[], filename: string): void => {
  if (data.length === 0) {
    alert('No data to export')
    return
  }

  // Create CSV header
  const headers = fields.map(field => field.label).join(',')

  // Create CSV rows
  const rows = data.map(item => {
    return fields
      .map(field => {
        const value = (item as any)[field.key]
        const formattedValue = field.format ? field.format(value) : value
        // Escape commas and quotes in CSV
        return `"${String(formattedValue).replace(/"/g, '""')}"`
      })
      .join(',')
  })

  // Combine headers and rows
  const csvContent = [headers, ...rows].join('\n')

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Calculate summary statistics
export const calculateSummaryStats = (data: any[]) => {
  if (data.length === 0) return null

  const totals = data.reduce(
    (acc, item) => ({
      totalRounds: acc.totalRounds + item.totalRounds,
      wonRounds: acc.wonRounds + item.wonRounds,
      totalBet: acc.totalBet + item.totalBet,
      totalWin: acc.totalWin + item.totalWin,
      ggr: acc.ggr + item.ggr,
    }),
    {
      totalRounds: 0,
      wonRounds: 0,
      totalBet: 0,
      totalWin: 0,
      ggr: 0,
    }
  )

  const avgRTP = totals.totalBet > 0 ? (totals.totalWin / totals.totalBet) * 100 : 0
  const winRate = totals.totalRounds > 0 ? (totals.wonRounds / totals.totalRounds) * 100 : 0

  return {
    ...totals,
    avgRTP,
    winRate,
  }
}
