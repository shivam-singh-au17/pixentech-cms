/**
 * Unified Data Management System
 * Central export point for all data hooks with cache invalidation and real-time updates
 */

// ===== GAMES =====
export * from './useGames'

// Re-export the most commonly used hooks
export {
  useGames,
  useGameOptions,
  useGame,
  useCreateGame,
  useUpdateGame,
  useDeleteGame,
  useToggleGameStatus,
  useRefreshGames,
  gameQueryKeys,
} from './useGames'

// ===== PLATFORM DATA =====
// Export unified platform data hook
export * from './usePlatformData'

// Use existing React Query hooks instead of duplicates
export {
  usePlatforms,
  usePlatform,
  useCreatePlatform,
  useUpdatePlatform,
  useDeletePlatform,
  platformQueryKeys,
  useOperators,
  useOperator,
  useCreateOperator,
  useUpdateOperator,
  useDeleteOperator,
  operatorQueryKeys,
  useBrands,
  useBrand,
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
  brandQueryKeys,
} from '../queries/usePlatformQueries'

// ===== OPERATOR GAMES =====
export {
  useOperatorGames,
  useOperatorGame,
  useCreateOperatorGame,
  useUpdateOperatorGame,
  useDeleteOperatorGame,
  operatorGameKeys,
} from '../queries/useOperatorGameQueries'

// ===== USERS =====
export {
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  userKeys,
} from '../queries/useUserQueries'

// ===== HIERARCHICAL DATA HOOKS =====
export { useHierarchicalPlatformData } from '../useHierarchicalPlatformData'

// ===== CACHE MANAGEMENT =====

import { useQueryClient } from '@tanstack/react-query'
import { gameQueryKeys } from './useGames'
import { platformQueryKeys, operatorQueryKeys, brandQueryKeys } from '../queries/usePlatformQueries'
import { operatorGameKeys } from '../queries/useOperatorGameQueries'
import { userKeys } from '../queries/useUserQueries'

/**
 * Unified cache invalidation hook
 * Provides utilities to refresh all data when changes occur
 */
export function useCacheManager() {
  const queryClient = useQueryClient()

  return {
    // Individual data type refreshers
    refreshGames: () => {
      queryClient.invalidateQueries({ queryKey: gameQueryKeys.all })
    },

    refreshPlatforms: () => {
      queryClient.invalidateQueries({ queryKey: platformQueryKeys.all })
    },

    refreshOperators: () => {
      queryClient.invalidateQueries({ queryKey: operatorQueryKeys.all })
    },

    refreshBrands: () => {
      queryClient.invalidateQueries({ queryKey: brandQueryKeys.all })
    },

    refreshOperatorGames: () => {
      queryClient.invalidateQueries({ queryKey: operatorGameKeys.all })
    },

    refreshUsers: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },

    // Hierarchical refresher
    refreshHierarchicalData: () => {
      queryClient.invalidateQueries({ queryKey: platformQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: operatorQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: brandQueryKeys.all })
    },

    // Master refresh - invalidates ALL cached data
    refreshAll: () => {
      queryClient.invalidateQueries({ queryKey: gameQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: platformQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: operatorQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: brandQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: operatorGameKeys.all })
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },

    // Clear all cache (nuclear option)
    clearAllCache: () => {
      queryClient.clear()
    },

    // Get cache stats for debugging
    getCacheStats: () => {
      return {
        cacheSize: queryClient.getQueryCache().getAll().length,
        queries: queryClient
          .getQueryCache()
          .getAll()
          .map(query => ({
            key: query.queryKey,
            status: query.state.status,
            lastUpdated: query.state.dataUpdatedAt,
          })),
      }
    },
  }
}

/**
 * Real-time data sync hook
 * Automatically refreshes data based on user activity and focus
 */
export function useRealTimeSync(
  options: {
    enableWindowFocus?: boolean
    enableVisibilityChange?: boolean
    refreshInterval?: number
  } = {}
) {
  const cacheManager = useCacheManager()
  const {
    enableWindowFocus = true,
    enableVisibilityChange = true,
    refreshInterval = 5 * 60 * 1000, // 5 minutes
  } = options

  // Window focus handler
  React.useEffect(() => {
    if (!enableWindowFocus) return

    const handleFocus = () => {
      console.log('🔄 Window focused - refreshing critical data')
      cacheManager.refreshHierarchicalData()
      cacheManager.refreshGames()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [enableWindowFocus, cacheManager])

  // Visibility change handler
  React.useEffect(() => {
    if (!enableVisibilityChange) return

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔄 Tab visible - refreshing data')
        cacheManager.refreshAll()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [enableVisibilityChange, cacheManager])

  // Periodic refresh
  React.useEffect(() => {
    if (!refreshInterval) return

    const interval = setInterval(() => {
      console.log('🔄 Periodic refresh')
      cacheManager.refreshHierarchicalData()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval, cacheManager])

  return cacheManager
}

// Import React for hooks
import React from 'react'
