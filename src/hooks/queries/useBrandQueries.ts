/**
 * Brand Management Query Hooks
 * TanStack Query hooks for brand management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { brandApi } from '@/lib/api/platform-new'
import type {
  BrandListParams,
  CreateBrandRequest,
  UpdateBrandRequest,
} from '@/lib/types/platform-updated'

// Query Keys
export const brandQueryKeys = {
  all: ['brands'] as const,
  lists: () => [...brandQueryKeys.all, 'list'] as const,
  list: (filters: BrandListParams) => [...brandQueryKeys.lists(), filters] as const,
  details: () => [...brandQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...brandQueryKeys.details(), id] as const,
}

// Brand Hooks
export function useBrands(params: BrandListParams) {
  return useQuery({
    queryKey: brandQueryKeys.list(params),
    queryFn: () => brandApi.list(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: brandQueryKeys.detail(id),
    queryFn: () => brandApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useCreateBrand() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBrandRequest) => brandApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandQueryKeys.all })
      console.log('Brand created successfully!')
    },
    onError: error => {
      console.error('Failed to create brand:', error)
    },
  })
}

export function useUpdateBrand() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBrandRequest }) =>
      brandApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: brandQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: brandQueryKeys.detail(id) })
      console.log('Brand updated successfully!')
    },
    onError: error => {
      console.error('Failed to update brand:', error)
    },
  })
}

export function useUpdateBrandStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      brandApi.updateStatus(id, isActive),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: brandQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: brandQueryKeys.detail(id) })
      console.log('Brand status updated successfully!')
    },
    onError: error => {
      console.error('Failed to update brand status:', error)
    },
  })
}

export function useDeleteBrand() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => brandApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandQueryKeys.all })
      console.log('Brand deleted successfully!')
    },
    onError: error => {
      console.error('Failed to delete brand:', error)
    },
  })
}
