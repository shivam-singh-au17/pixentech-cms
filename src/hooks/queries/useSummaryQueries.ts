/**
 * TanStack Query hooks for Summary Reports and Dashboard
 * Provides optimized data fetching with caching, loading states, and error handling
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useAppSelector } from '@/store/hooks'
import { useEffect, useState } from 'react'
import {
  getDailySummary,
  getGameSummary,
  getPlayerSummary,
  getPlayerGameSummary,
} from '@/lib/api/summary'
import { getDashboardChartData, getWinnersReport, getContributorsReport } from '@/lib/api/dashboard'
import type {
  DailySummaryFilter,
  GameSummaryFilter,
  PlayerSummaryFilter,
  PlayerGameSummaryFilter,
  SummaryApiResponse,
} from '@/lib/types/summary'
import type { DashboardFilter, DashboardChartData } from '@/lib/api/dashboard'

// Query Keys Factory
export const summaryQueryKeys = {
  all: ['summary'] as const,
  dailySummary: (filters: DailySummaryFilter) =>
    [...summaryQueryKeys.all, 'daily', filters] as const,
  gameSummary: (filters: GameSummaryFilter) => [...summaryQueryKeys.all, 'game', filters] as const,
  playerSummary: (filters: PlayerSummaryFilter) =>
    [...summaryQueryKeys.all, 'player', filters] as const,
  playerGameSummary: (filters: PlayerGameSummaryFilter) =>
    [...summaryQueryKeys.all, 'playerGame', filters] as const,
}

export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  chartData: (filters: DashboardFilter) =>
    [...dashboardQueryKeys.all, 'chartData', filters] as const,
  winners: (filters: DashboardFilter) => [...dashboardQueryKeys.all, 'winners', filters] as const,
  contributors: (filters: DashboardFilter) =>
    [...dashboardQueryKeys.all, 'contributors', filters] as const,
}

// Helper function to check if authentication is ready for API calls
const useAuthReady = () => {
  const { isAuthenticated, token } = useAppSelector(state => state.auth)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (isAuthenticated && token) {
      // Add a small delay to ensure API client has been updated
      const timer = setTimeout(() => {
        setIsReady(true)
      }, 100)

      return () => clearTimeout(timer)
    } else {
      setIsReady(false)
    }
  }, [isAuthenticated, token])

  return isReady
}

// Daily Summary Query Hook
export const useDailySummary = (filters: DailySummaryFilter) => {
  const isAuthReady = useAuthReady()

  return useQuery({
    queryKey: summaryQueryKeys.dailySummary(filters),
    queryFn: () => getDailySummary(filters),
    enabled: isAuthReady, // Only run when auth is fully ready
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData, // Keep previous data while fetching new
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// Game Summary Query Hook
export const useGameSummary = (filters: GameSummaryFilter) => {
  const isAuthReady = useAuthReady()

  return useQuery({
    queryKey: summaryQueryKeys.gameSummary(filters),
    queryFn: () => getGameSummary(filters),
    enabled: isAuthReady, // Only run when auth is fully ready
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// Player Summary Query Hook
export const usePlayerSummary = (filters: PlayerSummaryFilter) => {
  const isAuthReady = useAuthReady()

  return useQuery({
    queryKey: summaryQueryKeys.playerSummary(filters),
    queryFn: () => getPlayerSummary(filters),
    enabled: isAuthReady, // Only run when auth is fully ready
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// Player Game Summary Query Hook
export const usePlayerGameSummary = (filters: PlayerGameSummaryFilter) => {
  const isAuthReady = useAuthReady()

  return useQuery({
    queryKey: summaryQueryKeys.playerGameSummary(filters),
    queryFn: () => getPlayerGameSummary(filters),
    enabled: isAuthReady, // Only run when auth is fully ready
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// Dashboard Chart Data Query Hook
export const useDashboardChartData = (filters: DashboardFilter) => {
  const isAuthReady = useAuthReady()

  return useQuery({
    queryKey: dashboardQueryKeys.chartData(filters),
    queryFn: () => getDashboardChartData(filters),
    enabled: isAuthReady, // Only run when auth is fully ready
    staleTime: 1000 * 60 * 2, // 2 minutes (shorter for dashboard real-time feel)
    placeholderData: keepPreviousData,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// Utility hook for derived data
export const useSummaryData = <T extends SummaryApiResponse<any>>(
  queryResult: ReturnType<typeof useQuery<T>>,
  pageSize: number = 50
) => {
  return {
    data: queryResult.data?.data || [],
    totalPages: queryResult.data ? Math.ceil(queryResult.data.limit / pageSize) : 1,
    totalCount: queryResult.data?.limit || 0,
    isLoading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    isError: queryResult.isError,
    error: queryResult.error,
    isPlaceholderData: queryResult.isPlaceholderData,
  }
}

// Utility hook for dashboard data
export const useDashboardData = (queryResult: ReturnType<typeof useQuery<DashboardChartData>>) => {
  return {
    data: queryResult.data || null,
    isLoading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    isError: queryResult.isError,
    error: queryResult.error,
    isPlaceholderData: queryResult.isPlaceholderData,
    refetch: queryResult.refetch,
  }
}

/**
 * Hook for Winners Report data
 */
export const useWinnersReport = (filters: DashboardFilter) => {
  const isReady = useAuthReady()

  return useQuery({
    queryKey: dashboardQueryKeys.winners(filters),
    queryFn: () => getWinnersReport(filters),
    enabled: isReady,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: keepPreviousData,
  })
}

/**
 * Hook for Contributors Report data
 */
export const useContributorsReport = (filters: DashboardFilter) => {
  const isReady = useAuthReady()

  return useQuery({
    queryKey: dashboardQueryKeys.contributors(filters),
    queryFn: () => getContributorsReport(filters),
    enabled: isReady,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: keepPreviousData,
  })
}
