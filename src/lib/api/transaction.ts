/**
 * Transaction Reports API Service
 * Handles all transaction report-related API calls
 */

import { apiClient } from './client'
import { API_ENDPOINTS } from './config'
import type {
  TransactionFilter,
  TransactionListResponse,
  DetailedTransactionReport,
} from '@/lib/types/transaction'

// Helper function to build query parameters (same pattern as summary API)
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
        key === 'gameAlias' ||
        key === 'status'
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

/**
 * Get transaction reports list with filters
 */
export const getTransactionReports = async (
  filters: TransactionFilter
): Promise<TransactionListResponse> => {
  try {
    console.log('Input filters:', filters)

    // Ensure we have valid dates
    if (!filters.startDate || !filters.endDate) {
      console.error('Missing dates:', { startDate: filters.startDate, endDate: filters.endDate })
      throw new Error('Start date and end date are required')
    }

    // Build query parameters using the same pattern as summary APIs
    const params = {
      startTime: filters.startDate,
      endTime: filters.endDate,
      sortDirection: filters.sortDirection || -1,
      pageNo: filters.pageNo || 1,
      pageSize: filters.pageSize || 10,
      platform: filters.platform,
      operator: filters.operator,
      brand: filters.brand,
      gameAlias: filters.gameAlias,
      status: filters.status,
      externalPlayerId: filters.externalPlayerId,
      roundId: filters.roundId,
      betTxnId: filters.betTxnId,
    }

    const queryParams = buildQueryParams(params)
    console.log('Built query params:', Object.fromEntries(queryParams))

    const response = await apiClient.get(
      API_ENDPOINTS.TRANSACTION_REPORTS.LIST,
      Object.fromEntries(queryParams)
    )

    console.log('Transaction Reports API - Response:', response)

    console.log('Transaction Reports API - Response:', response)

    // Ensure we return the expected format
    return {
      data: response.data || [],
      limit: response.limit || params.pageSize,
      page: response.page || params.pageNo,
      totalCount: response.totalCount,
    }
  } catch (error) {
    console.error('Error fetching transaction reports:', error)
    throw error
  }
}

/**
 * Get detailed transaction report by bet transaction ID
 */
export const getTransactionDetails = async (
  betTxnId: string
): Promise<DetailedTransactionReport> => {
  try {
    console.log('Transaction Details API - Request for betTxnId:', betTxnId)

    // Ensure betTxnId is provided
    if (!betTxnId) {
      throw new Error('betTxnId is required')
    }

    const response = await apiClient.get(API_ENDPOINTS.TRANSACTION_REPORTS.DETAILS, { betTxnId })

    console.log('Transaction Details API - Response:', response)

    return response
  } catch (error) {
    console.error('Error fetching transaction details:', error)
    throw error
  }
}
