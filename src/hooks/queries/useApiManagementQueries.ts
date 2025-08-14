/**
 * API Management React Query Hooks
 * Provides data fetching and mutation hooks for API management operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  apiManagementApi,
  type ApiManagementListParams,
  type CreateApiManagementData,
  type UpdateApiManagementData,
} from '@/lib/api/apiManagement'
import { apiClient } from '@/lib/api'

// Query Keys
export const apiManagementKeys = {
  all: ['apiManagement'] as const,
  lists: () => [...apiManagementKeys.all, 'list'] as const,
  list: (params: ApiManagementListParams) => [...apiManagementKeys.lists(), params] as const,
  details: () => [...apiManagementKeys.all, 'detail'] as const,
  detail: (id: string) => [...apiManagementKeys.details(), id] as const,
}

/**
 * Hook to fetch API endpoints list
 */
export function useApiManagement(params: ApiManagementListParams = {}, enabled: boolean = true) {
  // Add default pagination parameters
  const queryParams = {
    pageNo: 1,
    pageSize: 50,
    ...params,
  }

  return useQuery({
    queryKey: apiManagementKeys.list(queryParams),
    queryFn: async () => {
      // Ensure API client has token before making request
      const { token } = apiClient.getTokens()
      if (!token) {
        throw new Error('Authentication required')
      }
      return apiManagementApi.list(queryParams)
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Hook to fetch single API endpoint
 */
export function useApiManagementItem(id: string) {
  return useQuery({
    queryKey: apiManagementKeys.detail(id),
    queryFn: () => apiManagementApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Hook to create API endpoint
 */
export function useCreateApiManagement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateApiManagementData) => apiManagementApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch API management list
      queryClient.invalidateQueries({ queryKey: apiManagementKeys.lists() })
    },
  })
}

/**
 * Hook to update API endpoint
 */
export function useUpdateApiManagement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateApiManagementData }) =>
      apiManagementApi.update(id, data),
    onSuccess: (data, variables) => {
      // Invalidate lists and update specific item cache
      queryClient.invalidateQueries({ queryKey: apiManagementKeys.lists() })
      queryClient.setQueryData(apiManagementKeys.detail(variables.id), data)
    },
  })
}

/**
 * Hook to delete API endpoint
 */
export function useDeleteApiManagement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiManagementApi.delete(id),
    onSuccess: (_, id) => {
      // Invalidate lists and remove specific item from cache
      queryClient.invalidateQueries({ queryKey: apiManagementKeys.lists() })
      queryClient.removeQueries({ queryKey: apiManagementKeys.detail(id) })
    },
  })
}

/**
 * Hook to toggle API endpoint status
 */
export function useToggleApiManagementStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiManagementApi.toggleStatus(id),
    onSuccess: (data, id) => {
      // Invalidate lists and update specific item cache
      queryClient.invalidateQueries({ queryKey: apiManagementKeys.lists() })
      queryClient.setQueryData(apiManagementKeys.detail(id), data)
    },
  })
}

/**
 * Hook to bulk update API endpoints
 */
export function useBulkUpdateApiManagement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ids, updates }: { ids: string[]; updates: Partial<CreateApiManagementData> }) =>
      apiManagementApi.bulkUpdate(ids, updates),
    onSuccess: () => {
      // Invalidate all lists
      queryClient.invalidateQueries({ queryKey: apiManagementKeys.lists() })
    },
  })
}

/**
 * Hook to export API endpoints data
 */
export function useExportApiManagement() {
  return useMutation({
    mutationFn: (params: ApiManagementListParams = {}) => apiManagementApi.export(params),
    onSuccess: blob => {
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `api-management-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    },
  })
}
