/**
 * Utility functions for data formatting and processing
 */

/**
 * Format number with comma separators
 */
export const commaSeparated = (num: number | string): string => {
  if (num === null || num === undefined || num === '') return '0'

  const numValue = Number(num)
  if (isNaN(numValue)) return '0'

  return numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Format number with specified decimal places
 */
export const setNumberFormat = (number: number | string, decimal: number): string => {
  // Handle null, undefined, or empty values
  if (number === null || number === undefined || number === '') {
    return '0.' + '0'.repeat(decimal)
  }

  const numValue = Number(number)

  // Handle NaN values
  if (isNaN(numValue)) {
    return '0.' + '0'.repeat(decimal)
  }

  // Handle invalid decimal parameter
  if (isNaN(decimal) || decimal < 0) {
    return numValue.toFixed(2)
  }

  return numValue.toFixed(decimal)
}

/**
 * Convert large numbers to millions/thousands format
 */
export const convertToMillions = (value: number): string => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M'
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K'
  }
  return value.toString()
}

/**
 * Format currency with symbol
 */
export const formatCurrency = (amount: number | string, currency: string = 'INR'): string => {
  const symbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
  }

  const symbol = symbols[currency] || currency

  // Handle null, undefined, or NaN values
  if (amount === null || amount === undefined || amount === '') {
    return `${symbol}0.00`
  }

  const numAmount = Number(amount)
  if (isNaN(numAmount)) {
    return `${symbol}0.00`
  }

  const formatted = setNumberFormat(numAmount, 2)
  return `${symbol}${formatted}`
}

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

/**
 * Generate chart colors
 */
export const getChartColors = (count: number): string[] => {
  const baseColors = [
    'rgba(59, 130, 246, 0.8)', // Blue
    'rgba(16, 185, 129, 0.8)', // Green
    'rgba(245, 101, 101, 0.8)', // Red
    'rgba(251, 191, 36, 0.8)', // Yellow
    'rgba(139, 92, 246, 0.8)', // Purple
    'rgba(236, 72, 153, 0.8)', // Pink
    'rgba(14, 165, 233, 0.8)', // Sky
    'rgba(34, 197, 94, 0.8)', // Emerald
  ]

  const colors = []
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length])
  }

  return colors
}

/**
 * Generate chart border colors
 */
export const getChartBorderColors = (count: number): string[] => {
  const baseBorderColors = [
    'rgba(59, 130, 246, 1)', // Blue
    'rgba(16, 185, 129, 1)', // Green
    'rgba(245, 101, 101, 1)', // Red
    'rgba(251, 191, 36, 1)', // Yellow
    'rgba(139, 92, 246, 1)', // Purple
    'rgba(236, 72, 153, 1)', // Pink
    'rgba(14, 165, 233, 1)', // Sky
    'rgba(34, 197, 94, 1)', // Emerald
  ]

  const colors = []
  for (let i = 0; i < count; i++) {
    colors.push(baseBorderColors[i % baseBorderColors.length])
  }

  return colors
}

/**
 * Process hourly data for charts
 */
export const processHourlyData = (data: any[], field: string) => {
  return data
    .map(item => ({
      x: Number(item.hour),
      y: Number(setNumberFormat(item[field] || 0, 2)),
    }))
    .sort((a, b) => a.x - b.x)
}

/**
 * Group unique players by brand
 */
export const groupUniquePlayersByBrand = (players: any[]) => {
  const grouped = players.reduce(
    (acc, player) => {
      if (!acc[player.brandName]) {
        acc[player.brandName] = new Set()
      }
      acc[player.brandName].add(player.externalPlayerId)
      return acc
    },
    {} as Record<string, Set<string>>
  )

  return Object.keys(grouped).map(brand => ({
    x: brand,
    y: grouped[brand].size,
  }))
}

/**
 * Process turnover by operator data
 */
export const processTurnoverByOperator = (data: any[]) => {
  const grouped: Record<string, number> = {}

  data.forEach(item => {
    grouped[item.brandName] = (grouped[item.brandName] || 0) + item.betAmount
  })

  return grouped
}
