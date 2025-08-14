/**
 * TanStack Query hooks for Transaction Reports
 * Provides optimized data fetching with caching, loading states, and error handling
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useAppSelector } from '@/store/hooks'
import { useEffect, useState } from 'react'
import { getTransactionReports, getTransactionDetails } from '@/lib/api/transaction'
import type { TransactionFilter } from '@/lib/types/transaction'

// Query Keys Factory
export const transactionQueryKeys = {
  all: ['transactions'] as const,
  list: (filters: TransactionFilter) => [...transactionQueryKeys.all, 'list', filters] as const,
  details: (betTxnId: string) => [...transactionQueryKeys.all, 'details', betTxnId] as const,
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

// Transaction Reports List Query Hook
export const useTransactionReports = (filters: TransactionFilter) => {
  const isAuthReady = useAuthReady()

  return useQuery({
    queryKey: transactionQueryKeys.list(filters),
    queryFn: () => getTransactionReports(filters),
    enabled: isAuthReady, // Only run when auth is fully ready
    staleTime: 1000 * 60 * 2, // 2 minutes (transactions are more real-time)
    placeholderData: keepPreviousData, // Keep previous data while fetching new
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// Transaction Details Query Hook
export const useTransactionDetails = (betTxnId: string, enabled: boolean = true) => {
  const isAuthReady = useAuthReady()

  return useQuery({
    queryKey: transactionQueryKeys.details(betTxnId),
    queryFn: () => getTransactionDetails(betTxnId),
    enabled: isAuthReady && enabled && !!betTxnId, // Only run when auth is ready and betTxnId is provided
    staleTime: 1000 * 60 * 5, // 5 minutes (transaction details are relatively static)
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
