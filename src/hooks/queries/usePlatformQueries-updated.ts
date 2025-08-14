/**
 * Updated Platform Query Hooks
 * Simplified query hooks for platform options
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { platformApi } from '@/lib/api/platform-new'
import type {
  PlatformListParams,
  CreatePlatformRequest,
  UpdatePlatformRequest,
} from '@/lib/types/platform-updated'

// Query Keys
export const platformQueryKeys = {
  all: ['platforms'] as const,
  lists: () => [...platformQueryKeys.all, 'list'] as const,
  list: (filters: PlatformListParams) => [...platformQueryKeys.lists(), filters] as const,
  details: () => [...platformQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...platformQueryKeys.details(), id] as const,
}

// Platform Hooks
export function usePlatforms(params: PlatformListParams) {
  return useQuery({
    queryKey: platformQueryKeys.list(params),
    queryFn: () => platformApi.list(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function usePlatform(id: string) {
  return useQuery({
    queryKey: platformQueryKeys.detail(id),
    queryFn: () => platformApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useCreatePlatform() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePlatformRequest) => platformApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformQueryKeys.all })
      console.log('Platform created successfully!')
    },
    onError: error => {
      console.error('Failed to create platform:', error)
    },
  })
}

export function useUpdatePlatform() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlatformRequest }) =>
      platformApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: platformQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: platformQueryKeys.detail(id) })
      console.log('Platform updated successfully!')
    },
    onError: error => {
      console.error('Failed to update platform:', error)
    },
  })
}

export function useDeletePlatform() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => platformApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformQueryKeys.all })
      console.log('Platform deleted successfully!')
    },
    onError: error => {
      console.error('Failed to delete platform:', error)
    },
  })
}

// Utility Hook for Platform Options
export function usePlatformOptions() {
  return useQuery({
    queryKey: ['platform-options'],
    queryFn: () => platformApi.list({ pageNo: 1, pageSize: 100, sortDirection: 1 }),
    select: data =>
      data.platforms.map(platform => ({
        id: platform._id,
        label: platform.platformName,
      })),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}
