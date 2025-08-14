/**
 * Dashboard API Service
 * Handles all dashboard-related API calls
 */

import { apiClient } from './client'
import { API_ENDPOINTS } from './config'

export interface DashboardFilter {
  startDate: Date
  endDate: Date
  currency: string
  gameAlias?: string
  externalPlayerId?: string
}

export interface DashboardChartData {
  turnOverByOperator: Array<{
    brandName: string
    betCounts: number
    betAmount: number
    winAmount: number
    margin: number
    brandId: string
  }>
  turnOverByGameAlias: Array<{
    brandName: string
    betCounts: number
    betAmount: number
    winAmount: number
    margin: number
    gameAlias: string
  }>
  turnOverByPlayer: Array<{
    brandName: string
    betCounts: number
    betAmount: number
    winAmount: number
    margin: number
    externalPlayerId: string
    brandId: string
  }>
  betsGGRTurnOver: Array<{
    betCounts: number
    updatedAt: string
    betAmount: number
    winAmount: number
    hour: string
    ggr: number
    margin: number
  }>
  uniquePlayers: {
    data: Array<{
      brandName: string
      brand: string
      externalPlayerId: string
    }>
    uap: number
  }
  generic: {
    betCounts: number
    updatedAt: string
    betAmount: number
    winAmount: number
    ggr: number
    margin: number
    ggrInPercentage: number
  }
}

export interface WinnersContributorsData {
  data: Array<{
    _id: {
      externalPlayerId: string | null
    }
    betCounts: number
    betAmount: number
    winAmount: number
    externalPlayerId: string | null
    marginInAmount: number
    marginInPercentage: number
  }>
}

export interface GameListResponse {
  data: Array<{
    _id: string
    platform: string
    operator: string
    brand: string
    isActive: boolean
    gameMode?: string
    gameName: string
    gameAlias: string
    launchPath: string
    icon: string
    gameType: string
    minBet?: number
    maxBet?: number
    defaultBet?: number
    homeURL?: string
  }>
  limit: number
  page: number
}

/**
 * Get dashboard chart data with filters
 */
export const getDashboardChartData = async (
  filter: DashboardFilter
): Promise<DashboardChartData> => {
  const params = new URLSearchParams({
    startTime: filter.startDate.toISOString(),
    endTime: filter.endDate.toISOString(),
    playerCurrencyCode: filter.currency,
  })

  if (filter.gameAlias && filter.gameAlias !== 'ALL') {
    params.append('gameAlias', filter.gameAlias)
  }

  if (filter.externalPlayerId) {
    params.append('externalPlayerId', filter.externalPlayerId)
  }

  const response = await apiClient.get(
    API_ENDPOINTS.REPORTS.DASHBOARD_CHART_SUMMARY,
    Object.fromEntries(params)
  )
  return response
}

/**
 * Get operator game list
 */
export const getOperatorGameList = async (params: {
  limit?: number
  page?: number
  platform?: string
  operator?: string
  brand?: string
  isActive?: boolean
}): Promise<GameListResponse> => {
  const queryParams = new URLSearchParams({
    pageNo: (params.page || 1).toString(),
    pageSize: (params.limit || 500).toString(),
    sortDirection: '1',
  })

  if (params.platform && params.platform !== 'ALL') {
    queryParams.append('platform', params.platform)
  }

  if (params.operator && params.operator !== 'ALL') {
    queryParams.append('operator', params.operator)
  }

  if (params.brand && params.brand !== 'ALL') {
    queryParams.append('brand', params.brand)
  }

  if (params.isActive !== undefined) {
    queryParams.append('isActive', params.isActive.toString())
  }

  const response = await apiClient.get(
    API_ENDPOINTS.OPERATOR_GAME.LIST,
    Object.fromEntries(queryParams)
  )
  return response
}

/**
 * Get Winners report data
 */
export const getWinnersReport = async (
  filter: DashboardFilter
): Promise<WinnersContributorsData> => {
  const params = new URLSearchParams({
    startTime: filter.startDate.toISOString(),
    endTime: filter.endDate.toISOString(),
    playerCurrencyCode: filter.currency,
    type: 'winners',
  })

  const response = await apiClient.get(
    API_ENDPOINTS.REPORTS.WINNERS_CONTRIBUTORS,
    Object.fromEntries(params)
  )
  return response
}

/**
 * Get Contributors report data
 */
export const getContributorsReport = async (
  filter: DashboardFilter
): Promise<WinnersContributorsData> => {
  const params = new URLSearchParams({
    startTime: filter.startDate.toISOString(),
    endTime: filter.endDate.toISOString(),
    playerCurrencyCode: filter.currency,
    type: 'contributors',
  })

  const response = await apiClient.get(
    API_ENDPOINTS.REPORTS.WINNERS_CONTRIBUTORS,
    Object.fromEntries(params)
  )
  return response
}
