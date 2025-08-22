/**
 * Unified Platform Data Management
 * Centralized React Query hooks for platform, operator, and brand operations with cache invalidation
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { platformApi, operatorApi, brandApi } from '@/lib/api/platform-new'
import { apiClient } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

// Platform Query Keys
export const platformQueryKeys = {
  all: ['platforms'] as const,
  lists: () => [...platformQueryKeys.all, 'list'] as const,
  list: (params: any = {}) => [...platformQueryKeys.lists(), params] as const,
  details: () => [...platformQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...platformQueryKeys.details(), id] as const,
  options: () => [...platformQueryKeys.all, 'options'] as const,
}

// Operator Query Keys
export const operatorQueryKeys = {
  all: ['operators'] as const,
  lists: () => [...operatorQueryKeys.all, 'list'] as const,
  list: (params: any = {}) => [...operatorQueryKeys.lists(), params] as const,
  details: () => [...operatorQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...operatorQueryKeys.details(), id] as const,
  options: (platformId?: string) => [...operatorQueryKeys.all, 'options', platformId] as const,
}

// Brand Query Keys
export const brandQueryKeys = {
  all: ['brands'] as const,
  lists: () => [...brandQueryKeys.all, 'list'] as const,
  list: (params: any = {}) => [...brandQueryKeys.lists(), params] as const,
  details: () => [...brandQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...brandQueryKeys.details(), id] as const,
  options: (operatorId?: string) => [...brandQueryKeys.all, 'options', operatorId] as const,
}

/**
 * Authentication-aware query enabler
 */
const useAuthReady = () => {
  const { token } = apiClient.getTokens()
  return !!token
}

// ==================== PLATFORM HOOKS ====================

/**
 * Hook to fetch platforms list
 */
export function usePlatforms(params: any = {}, enabled: boolean = true) {
  const isAuthReady = useAuthReady()

  return useQuery({
    queryKey: platformQueryKeys.list(params),
    queryFn: async () => {
      const { token } = apiClient.getTokens()
      if (!token) {
        throw new Error('Authentication required')
      }
      return platformApi.list(params)
    },
    enabled: enabled && isAuthReady,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })
}

/**
 * Hook to fetch platform options for dropdowns
 */
export function usePlatformOptions(enabled: boolean = true) {
  const isAuthReady = useAuthReady()

  return useQuery({
    queryKey: platformQueryKeys.options(),
    queryFn: async () => {
      const { token } = apiClient.getTokens()
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await platformApi.list({})

      return {
        platforms: response.platforms || [],
        options: (response.platforms || []).map(platform => ({
          id: platform._id,
          value: platform._id,
          label: platform.platformName,
        })),
      }
    },
    enabled: enabled && isAuthReady,
    staleTime: 2 * 60 * 1000, // 2 minutes for options
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })
}

// ==================== OPERATOR HOOKS ====================

/**
 * Hook to fetch operators list (with optional platform filter)
 */
export function useOperators(params: { platformId?: string } = {}, enabled: boolean = true) {
  const isAuthReady = useAuthReady()

  return useQuery({
    queryKey: operatorQueryKeys.list(params),
    queryFn: async () => {
      const { token } = apiClient.getTokens()
      if (!token) {
        throw new Error('Authentication required')
      }

      // Convert platformId to the correct API parameter name
      const apiParams = params.platformId ? { platforms: params.platformId } : {}
      return operatorApi.list(apiParams)
    },
    enabled: enabled && isAuthReady,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })
}

/**
 * Hook to fetch operator options for dropdowns (filtered by platform)
 */
export function useOperatorOptions(platformId?: string, enabled: boolean = true) {
  const isAuthReady = useAuthReady()

  return useQuery({
    queryKey: operatorQueryKeys.options(platformId),
    queryFn: async () => {
      const { token } = apiClient.getTokens()
      if (!token) {
        throw new Error('Authentication required')
      }

      const params = platformId ? { platforms: platformId } : {}
      const response = await operatorApi.list(params)

      return {
        operators: response.operators || [],
        options: (response.operators || []).map(operator => ({
          id: operator._id,
          value: operator._id,
          label: operator.operatorName,
          platformId: operator.platform,
        })),
      }
    },
    enabled: enabled && isAuthReady,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })
}

// ==================== BRAND HOOKS ====================

/**
 * Hook to fetch brands list (with optional operator filter)
 */
export function useBrands(params: { operatorId?: string } = {}, enabled: boolean = true) {
  const isAuthReady = useAuthReady()

  return useQuery({
    queryKey: brandQueryKeys.list(params),
    queryFn: async () => {
      const { token } = apiClient.getTokens()
      if (!token) {
        throw new Error('Authentication required')
      }

      // Convert operatorId to the correct API parameter name
      const apiParams = params.operatorId ? { operators: params.operatorId } : {}
      return brandApi.list(apiParams)
    },
    enabled: enabled && isAuthReady,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })
}

/**
 * Hook to fetch brand options for dropdowns (filtered by operator)
 */
export function useBrandOptions(operatorId?: string, enabled: boolean = true) {
  const isAuthReady = useAuthReady()

  return useQuery({
    queryKey: brandQueryKeys.options(operatorId),
    queryFn: async () => {
      const { token } = apiClient.getTokens()
      if (!token) {
        throw new Error('Authentication required')
      }

      const params = operatorId ? { operators: operatorId } : {}
      const response = await brandApi.list(params)

      return {
        brands: response.brands || [],
        options: (response.brands || []).map(brand => ({
          id: brand._id,
          value: brand._id,
          label: brand.brandName,
          operatorId: brand.operator,
        })),
      }
    },
    enabled: enabled && isAuthReady,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })
}

// ==================== HIERARCHICAL DATA HOOK ====================

/**
 * Hook to get hierarchical platform -> operator -> brand data
 */
export function useHierarchicalData(
  params: {
    selectedPlatform?: string
    selectedOperator?: string
    autoFetch?: boolean
  } = {}
) {
  const { selectedPlatform, selectedOperator, autoFetch = true } = params

  const platforms = usePlatformOptions(autoFetch)
  const operators = useOperatorOptions(selectedPlatform, autoFetch && !!selectedPlatform)
  const brands = useBrandOptions(selectedOperator, autoFetch && !!selectedOperator)

  return {
    // Platform data
    platforms: platforms.data?.platforms || [],
    platformOptions: platforms.data?.options || [],
    platformsLoading: platforms.isLoading,
    platformsError: platforms.error,

    // Operator data
    operators: operators.data?.operators || [],
    operatorOptions: operators.data?.options || [],
    operatorsLoading: operators.isLoading,
    operatorsError: operators.error,

    // Brand data
    brands: brands.data?.brands || [],
    brandOptions: brands.data?.options || [],
    brandsLoading: brands.isLoading,
    brandsError: brands.error,

    // Combined loading state
    isLoading: platforms.isLoading || operators.isLoading || brands.isLoading,
    hasError: !!platforms.error || !!operators.error || !!brands.error,

    // Refetch functions
    refetchPlatforms: platforms.refetch,
    refetchOperators: operators.refetch,
    refetchBrands: brands.refetch,
    refetchAll: () => {
      platforms.refetch()
      operators.refetch()
      brands.refetch()
    },
  }
}

// ==================== MUTATION HOOKS ====================

/**
 * Hook to create platform
 */
export function useCreatePlatform() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  return useMutation({
    mutationFn: (data: any) => platformApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformQueryKeys.all })
      success('Platform created successfully!')
    },
    onError: (err: any) => {
      error(err?.message || 'Failed to create platform')
    },
  })
}

/**
 * Hook to create operator
 */
export function useCreateOperator() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  return useMutation({
    mutationFn: (data: any) => operatorApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: operatorQueryKeys.all })
      success('Operator created successfully!')
    },
    onError: (err: any) => {
      error(err?.message || 'Failed to create operator')
    },
  })
}

/**
 * Hook to create brand
 */
export function useCreateBrand() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  return useMutation({
    mutationFn: (data: any) => brandApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandQueryKeys.all })
      success('Brand created successfully!')
    },
    onError: (err: any) => {
      error(err?.message || 'Failed to create brand')
    },
  })
}

// ==================== UTILITY HOOKS ====================

/**
 * Utility hook to refresh all platform-related data
 */
export function useRefreshPlatformData() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: platformQueryKeys.all })
    queryClient.invalidateQueries({ queryKey: operatorQueryKeys.all })
    queryClient.invalidateQueries({ queryKey: brandQueryKeys.all })
  }
}

/**
 * Unified Platform Data Hook
 * Provides a single interface for accessing platform, operator, and brand data
 * Compatible with existing component interfaces
 */
export function usePlatformData(
  options: {
    autoFetch?: boolean
    fetchPlatforms?: boolean
    fetchOperators?: boolean
    fetchBrands?: boolean
    selectedPlatform?: string
    selectedOperator?: string
  } = {}
) {
  const {
    autoFetch = true,
    fetchPlatforms = true,
    fetchOperators = true,
    fetchBrands = true,
    selectedPlatform,
    selectedOperator,
  } = options

  // Get platform data
  const {
    data: platformsResponse,
    isLoading: platformsLoading,
    refetch: refetchPlatforms,
  } = usePlatforms({}, fetchPlatforms && autoFetch)

  const { data: platformOptionsData, isLoading: platformOptionsLoading } = usePlatformOptions(
    fetchPlatforms && autoFetch
  )

  // Get operator data
  const {
    data: operatorsResponse,
    isLoading: operatorsLoading,
    refetch: refetchOperators,
  } = useOperators({ platformId: selectedPlatform }, fetchOperators && autoFetch)

  const { data: operatorOptionsData, isLoading: operatorOptionsLoading } = useOperatorOptions(
    selectedPlatform,
    fetchOperators && autoFetch
  )

  // Get brand data
  const {
    data: brandsResponse,
    isLoading: brandsLoading,
    refetch: refetchBrands,
  } = useBrands({ operatorId: selectedOperator }, fetchBrands && autoFetch)

  const { data: brandOptionsData, isLoading: brandOptionsLoading } = useBrandOptions(
    selectedOperator,
    fetchBrands && autoFetch
  )

  // Extract the options arrays and data from the responses
  const platformOptions = platformOptionsData?.options || []
  const operatorOptions = operatorOptionsData?.options || []
  const brandOptions = brandOptionsData?.options || []

  // Extract arrays from the API responses
  const platforms = platformsResponse?.platforms || []
  const operators = operatorsResponse?.operators || []
  const brands = brandsResponse?.brands || []

  // Combined loading state
  const isLoading =
    platformsLoading ||
    platformOptionsLoading ||
    operatorsLoading ||
    operatorOptionsLoading ||
    brandsLoading ||
    brandOptionsLoading

  // Refetch all function
  const refetchAll = () => {
    refetchPlatforms()
    refetchOperators()
    refetchBrands()
  }

  return {
    // Data
    platforms,
    operators,
    brands,

    // Options for dropdowns
    platformOptions,
    operatorOptions,
    brandOptions,

    // Loading states
    isLoading,
    platformsLoading,
    operatorsLoading,
    brandsLoading,
    platformOptionsLoading,
    operatorOptionsLoading,
    brandOptionsLoading,

    // Refetch functions
    refetchAll,
    refetchPlatforms,
    refetchOperators,
    refetchBrands,
  }
}
