/**
 * Summary Reports API Service
 * API calls for all summary report endpoints
 */

import { apiClient } from './client'
import { API_ENDPOINTS } from './config'
import type {
  DailySummaryFilter,
  GameSummaryFilter,
  PlayerSummaryFilter,
  PlayerGameSummaryFilter,
  DailySummaryData,
  GameSummaryData,
  PlayerSummaryData,
  PlayerGameSummaryData,
  SummaryApiResponse,
} from '@/lib/types/summary'

// Helper function to build query parameters
const buildQueryParams = (params: Record<string, any>): URLSearchParams => {
  const queryParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (value instanceof Date) {
        queryParams.append(key, value.toISOString())
      } else if (
        key === 'platform' ||
        key === 'operator' ||
        key === 'brand' ||
        key === 'gameAlias'
      ) {
        if (value !== 'ALL') {
          queryParams.append(key, value.toString())
        }
      } else {
        queryParams.append(key, value.toString())
      }
    }
  })

  return queryParams
}

// Daily Summary API
export const getDailySummary = async (
  filters: DailySummaryFilter
): Promise<SummaryApiResponse<DailySummaryData>> => {
  const params = {
    startTime: filters.startDate,
    endTime: filters.endDate,
    platform: filters.platform,
    operator: filters.operator,
    brand: filters.brand,
    gameAlias: filters.gameAlias,
    playerCurrencyCode: filters.currency || 'INR',
    sortDirection: filters.sortDirection || -1,
    pageNo: filters.pageNo || 1,
    pageSize: filters.pageSize || 50,
  }

  const queryParams = buildQueryParams(params)
  const response = await apiClient.get(
    API_ENDPOINTS.REPORTS.DAILY_SUMMARY,
    Object.fromEntries(queryParams)
  )
  return response
}

// Game Summary API
export const getGameSummary = async (
  filters: GameSummaryFilter
): Promise<SummaryApiResponse<GameSummaryData>> => {
  const params = {
    startTime: filters.startDate,
    endTime: filters.endDate,
    platform: filters.platform,
    operator: filters.operator,
    brand: filters.brand,
    gameAlias: filters.gameAlias,
    playerCurrencyCode: filters.currency || 'INR',
    sortDirection: filters.sortDirection || -1,
    pageNo: filters.pageNo || 1,
    pageSize: filters.pageSize || 50,
  }

  const queryParams = buildQueryParams(params)
  const response = await apiClient.get(
    API_ENDPOINTS.REPORTS.GAME_SUMMARY,
    Object.fromEntries(queryParams)
  )
  return response
}

// Player Summary API
export const getPlayerSummary = async (
  filters: PlayerSummaryFilter
): Promise<SummaryApiResponse<PlayerSummaryData>> => {
  const params = {
    startTime: filters.startDate,
    endTime: filters.endDate,
    platform: filters.platform,
    operator: filters.operator,
    brand: filters.brand,
    externalPlayerId: filters.externalPlayerId,
    playerCurrencyCode: filters.currency || 'INR',
    sortDirection: filters.sortDirection || -1,
    pageNo: filters.pageNo || 1,
    pageSize: filters.pageSize || 50,
  }

  const queryParams = buildQueryParams(params)
  const response = await apiClient.get(
    API_ENDPOINTS.REPORTS.PLAYER_SUMMARY,
    Object.fromEntries(queryParams)
  )
  return response
}

// Player Game Summary API
export const getPlayerGameSummary = async (
  filters: PlayerGameSummaryFilter
): Promise<SummaryApiResponse<PlayerGameSummaryData>> => {
  const params = {
    startTime: filters.startDate,
    endTime: filters.endDate,
    platform: filters.platform,
    operator: filters.operator,
    brand: filters.brand,
    gameAlias: filters.gameAlias,
    externalPlayerId: filters.externalPlayerId,
    playerCurrencyCode: filters.currency || 'INR',
    sortDirection: filters.sortDirection || -1,
    pageNo: filters.pageNo || 1,
    pageSize: filters.pageSize || 50,
  }

  const queryParams = buildQueryParams(params)
  const response = await apiClient.get(
    API_ENDPOINTS.REPORTS.PLAYER_GAME_SUMMARY,
    Object.fromEntries(queryParams)
  )
  return response
}
