import { useEffect, useCallback } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import {
  fetchPlatformsList,
  fetchOperatorsList,
  fetchBrandsList,
  selectPlatforms,
  selectOperators,
  selectBrands,
  selectPlatformOptions,
  selectOperatorOptions,
  selectBrandOptions,
  selectPlatformsLoading,
  selectOperatorsLoading,
  selectBrandsLoading,
  selectPlatformsError,
  selectOperatorsError,
  selectBrandsError,
  selectShouldFetchPlatforms,
  selectShouldFetchOperators,
  selectShouldFetchBrands,
  clearPlatformsError,
  clearOperatorsError,
  clearBrandsError,
} from '@/store/slices/platformDataSlice'

/**
 * Custom hook to manage platform data
 * Automatically fetches platform/operator/brand data if not available or stale
 * Returns data and utilities for all three entities
 */
export const usePlatformData = (
  options: {
    autoFetch?: boolean
    fetchPlatforms?: boolean
    fetchOperators?: boolean
    fetchBrands?: boolean
  } = {}
) => {
  const {
    autoFetch = true,
    fetchPlatforms = true,
    fetchOperators = true,
    fetchBrands = true,
  } = options

  const dispatch = useAppDispatch()

  // Selectors
  const platforms = useAppSelector(selectPlatforms)
  const operators = useAppSelector(selectOperators)
  const brands = useAppSelector(selectBrands)

  const platformOptions = useAppSelector(selectPlatformOptions)
  const operatorOptions = useAppSelector(selectOperatorOptions)
  const brandOptions = useAppSelector(selectBrandOptions)

  const platformsLoading = useAppSelector(selectPlatformsLoading)
  const operatorsLoading = useAppSelector(selectOperatorsLoading)
  const brandsLoading = useAppSelector(selectBrandsLoading)

  const platformsError = useAppSelector(selectPlatformsError)
  const operatorsError = useAppSelector(selectOperatorsError)
  const brandsError = useAppSelector(selectBrandsError)

  const shouldFetchPlatforms = useAppSelector(selectShouldFetchPlatforms)
  const shouldFetchOperators = useAppSelector(selectShouldFetchOperators)
  const shouldFetchBrands = useAppSelector(selectShouldFetchBrands)

  // Get auth state
  const { isAuthenticated, token } = useAppSelector(state => state.auth)

  // Auto-fetch logic - only when authenticated
  useEffect(() => {
    if (!autoFetch || !isAuthenticated || !token) return

    if (fetchPlatforms && shouldFetchPlatforms) {
      dispatch(fetchPlatformsList())
    }

    if (fetchOperators && shouldFetchOperators) {
      dispatch(fetchOperatorsList())
    }

    if (fetchBrands && shouldFetchBrands) {
      dispatch(fetchBrandsList())
    }
  }, [
    autoFetch,
    isAuthenticated,
    token,
    fetchPlatforms,
    fetchOperators,
    fetchBrands,
    shouldFetchPlatforms,
    shouldFetchOperators,
    shouldFetchBrands,
    dispatch,
  ])

  // Manual fetch functions - with auth checks
  const refetchPlatforms = useCallback(() => {
    if (isAuthenticated && token) {
      dispatch(fetchPlatformsList())
    }
  }, [dispatch, isAuthenticated, token])

  const refetchOperators = useCallback(() => {
    if (isAuthenticated && token) {
      dispatch(fetchOperatorsList())
    }
  }, [dispatch, isAuthenticated, token])

  const refetchBrands = useCallback(() => {
    if (isAuthenticated && token) {
      dispatch(fetchBrandsList())
    }
  }, [dispatch, isAuthenticated, token])

  const refetchAll = useCallback(() => {
    if (!isAuthenticated || !token) return

    if (fetchPlatforms) dispatch(fetchPlatformsList())
    if (fetchOperators) dispatch(fetchOperatorsList())
    if (fetchBrands) dispatch(fetchBrandsList())
  }, [dispatch, fetchPlatforms, fetchOperators, fetchBrands, isAuthenticated, token])

  // Error clearing functions
  const clearPlatformsErr = useCallback(() => {
    dispatch(clearPlatformsError())
  }, [dispatch])

  const clearOperatorsErr = useCallback(() => {
    dispatch(clearOperatorsError())
  }, [dispatch])

  const clearBrandsErr = useCallback(() => {
    dispatch(clearBrandsError())
  }, [dispatch])

  return {
    // Raw data
    platforms,
    operators,
    brands,

    // Filter options for dropdowns
    platformOptions,
    operatorOptions,
    brandOptions,

    // Loading states
    platformsLoading,
    operatorsLoading,
    brandsLoading,
    isLoading: platformsLoading || operatorsLoading || brandsLoading,

    // Error states
    platformsError,
    operatorsError,
    brandsError,
    hasError: !!(platformsError || operatorsError || brandsError),

    // Fetch controls
    refetchPlatforms,
    refetchOperators,
    refetchBrands,
    refetchAll,

    // Error controls
    clearPlatformsError: clearPlatformsErr,
    clearOperatorsError: clearOperatorsErr,
    clearBrandsError: clearBrandsErr,

    // Computed properties
    isEmpty: platforms.length === 0 && operators.length === 0 && brands.length === 0,
    isReady: !platformsLoading && !operatorsLoading && !brandsLoading,
  }
}

/**
 * Hook for just platform options (lightweight)
 */
export const usePlatformOptions = () => {
  const dispatch = useAppDispatch()
  const platformOptions = useAppSelector(selectPlatformOptions)
  const platformsLoading = useAppSelector(selectPlatformsLoading)
  const shouldFetch = useAppSelector(selectShouldFetchPlatforms)

  useEffect(() => {
    if (shouldFetch) {
      dispatch(fetchPlatformsList())
    }
  }, [shouldFetch, dispatch])

  return {
    platformOptions,
    loading: platformsLoading,
    refetch: () => dispatch(fetchPlatformsList()),
  }
}

/**
 * Hook for just operator options (lightweight)
 */
export const useOperatorOptions = () => {
  const dispatch = useAppDispatch()
  const operatorOptions = useAppSelector(selectOperatorOptions)
  const operatorsLoading = useAppSelector(selectOperatorsLoading)
  const shouldFetch = useAppSelector(selectShouldFetchOperators)

  useEffect(() => {
    if (shouldFetch) {
      dispatch(fetchOperatorsList())
    }
  }, [shouldFetch, dispatch])

  return {
    operatorOptions,
    loading: operatorsLoading,
    refetch: () => dispatch(fetchOperatorsList()),
  }
}

/**
 * Hook for just brand options (lightweight)
 */
export const useBrandOptions = () => {
  const dispatch = useAppDispatch()
  const brandOptions = useAppSelector(selectBrandOptions)
  const brandsLoading = useAppSelector(selectBrandsLoading)
  const shouldFetch = useAppSelector(selectShouldFetchBrands)

  useEffect(() => {
    if (shouldFetch) {
      dispatch(fetchBrandsList())
    }
  }, [shouldFetch, dispatch])

  return {
    brandOptions,
    loading: brandsLoading,
    refetch: () => dispatch(fetchBrandsList()),
  }
}
