import { useEffect, useCallback } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import {
  fetchGamesList,
  selectGames,
  selectGameOptions,
  selectPlatformOptions,
  selectOperatorOptions,
  selectBrandOptions,
  selectGamesLoading,
  selectGamesError,
  selectShouldFetchGames,
  clearError,
} from '@/store/slices/gamesSlice'

/**
 * Custom hook to manage games data
 * Automatically fetches games list if not available or stale
 * Returns games data and utilities
 */
export const useGames = (
  options: {
    autoFetch?: boolean
    platform?: string
    operator?: string
    brand?: string
    isActive?: boolean
  } = {}
) => {
  const dispatch = useAppDispatch()

  // Selectors
  const games = useAppSelector(selectGames)
  const gameOptions = useAppSelector(selectGameOptions)
  const platformOptions = useAppSelector(selectPlatformOptions)
  const operatorOptions = useAppSelector(selectOperatorOptions)
  const brandOptions = useAppSelector(selectBrandOptions)
  const loading = useAppSelector(selectGamesLoading)
  const error = useAppSelector(selectGamesError)
  const shouldFetch = useAppSelector(selectShouldFetchGames)

  const { autoFetch = true, platform, operator, brand, isActive } = options

  // Fetch games data
  const fetchGames = useCallback(
    (forceRefresh = false) => {
      dispatch(
        fetchGamesList({
          platform,
          operator,
          brand,
          isActive,
          forceRefresh,
        })
      )
    },
    [dispatch, platform, operator, brand, isActive]
  )

  // Clear error
  const clearGamesError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  // Auto-fetch effect
  useEffect(() => {
    if (autoFetch && shouldFetch && !loading) {
      fetchGames()
    }
  }, [autoFetch, shouldFetch, loading, fetchGames])

  return {
    // Data
    games,
    gameOptions,
    platformOptions,
    operatorOptions,
    brandOptions,

    // State
    loading,
    error,
    isEmpty: games.length === 0,

    // Actions
    fetchGames,
    refresh: () => fetchGames(true),
    clearError: clearGamesError,
  }
}

/**
 * Hook to get only game options for dropdowns
 * Lighter version that just returns the processed options
 */
export const useGameOptions = () => {
  const { gameOptions, loading, error } = useGames()

  return {
    gameOptions,
    loading,
    error,
  }
}

/**
 * Hook to get all filter options
 * Returns all available filter options for forms
 */
export const useFilterOptions = () => {
  const { gameOptions, platformOptions, operatorOptions, brandOptions, loading, error } = useGames()

  return {
    gameOptions,
    platformOptions,
    operatorOptions,
    brandOptions,
    loading,
    error,
  }
}
