/**
 * Summary Reports Types
 * Type definitions for all summary report APIs
 */

export interface BaseSummaryFilter {
  startDate: Date
  endDate: Date
  platform?: string
  operator?: string
  brand?: string
  currency?: string
  pageNo?: number
  pageSize?: number
  sortDirection?: number
}

export interface DailySummaryFilter extends BaseSummaryFilter {
  gameAlias?: string
}

export interface GameSummaryFilter extends BaseSummaryFilter {
  gameAlias?: string
}

export interface PlayerSummaryFilter extends BaseSummaryFilter {
  externalPlayerId?: string
}

export interface PlayerGameSummaryFilter extends BaseSummaryFilter {
  gameAlias?: string
  externalPlayerId?: string
}

// Response Types
export interface DailySummaryData {
  totalRounds: number
  wonRounds: number
  totalBet: number
  totalWin: number
  date: string
  platform: string
  operator: string
  rtp: string
  ggr: number
}

export interface GameSummaryData {
  totalRounds: number
  wonRounds: number
  totalBet: number
  totalWin: number
  gameAlias: string
  platform: string
  operator: string
  rtp: string
  ggr: number
}

export interface PlayerSummaryData {
  totalRounds: number
  totalBet: number
  totalWin: number
  wonRounds: number
  externalPlayerId: string | null
  platform: string
  operator: string
  rtp: string
  ggr: number
}

export interface PlayerGameSummaryData {
  totalRounds: number
  wonRounds: number
  totalBet: number
  totalWin: number
  externalPlayerId: string | null
  gameAlias: string
  platform: string
  operator: string
  rtp: string
  ggr: number
}

export interface SummaryApiResponse<T> {
  data: T[]
  limit: number
  page: number
  total: number
}

// Filter Options
export interface FilterOption {
  id: string
  label: string
}

export interface GameOption {
  gameAlias: string
  gameName: string
}

// Export data types
export interface ExportField {
  key: string
  label: string
  format?: (value: any) => string
}
