/**
 * Platform Management Query Hooks using TanStack Query
 * Simple version without toast notifications
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { platformApi, operatorApi, brandApi } from '@/lib/api/platform-new'
import { DEFAULT_PLATFORM_ID } from '@/lib/constants/platform'
import type {
  CreatePlatformRequest,
  UpdatePlatformRequest,
  PlatformListParams,
  CreateOperatorRequest,
  UpdateOperatorRequest,
  OperatorListParams,
  CreateBrandRequest,
  UpdateBrandRequest,
  BrandListParams,
  SelectOption,
} from '@/lib/types/platform-updated'

// Query Keys
export const platformQueryKeys = {
  all: ['platforms'] as const,
  lists: () => [...platformQueryKeys.all, 'list'] as const,
  list: (filters: PlatformListParams) => [...platformQueryKeys.lists(), filters] as const,
  details: () => [...platformQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...platformQueryKeys.details(), id] as const,
}

export const operatorQueryKeys = {
  all: ['operators'] as const,
  lists: () => [...operatorQueryKeys.all, 'list'] as const,
  list: (filters: OperatorListParams) => [...operatorQueryKeys.lists(), filters] as const,
  details: () => [...operatorQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...operatorQueryKeys.details(), id] as const,
}

export const brandQueryKeys = {
  all: ['brands'] as const,
  lists: () => [...brandQueryKeys.all, 'list'] as const,
  list: (filters: BrandListParams) => [...brandQueryKeys.lists(), filters] as const,
  details: () => [...brandQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...brandQueryKeys.details(), id] as const,
}

// Platform Hooks
export function usePlatforms(params: PlatformListParams = {}) {
  return useQuery({
    queryKey: platformQueryKeys.list(params),
    queryFn: () => platformApi.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
    },
    onError: (error: any) => {
      console.error('Failed to create platform:', error)
    },
  })
}

export function useUpdatePlatform() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlatformRequest }) =>
      platformApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformQueryKeys.all })
    },
    onError: (error: any) => {
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
    },
    onError: (error: any) => {
      console.error('Failed to delete platform:', error)
    },
  })
}

// Operator Hooks
export function useOperators(params: OperatorListParams = {}) {
  return useQuery({
    queryKey: operatorQueryKeys.list(params),
    queryFn: () => operatorApi.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useOperator(id: string) {
  return useQuery({
    queryKey: operatorQueryKeys.detail(id),
    queryFn: () => operatorApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useCreateOperator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOperatorRequest) => operatorApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: operatorQueryKeys.all })
    },
    onError: (error: any) => {
      console.error('Failed to create operator:', error)
    },
  })
}

export function useUpdateOperator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOperatorRequest }) =>
      operatorApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: operatorQueryKeys.all })
    },
    onError: (error: any) => {
      console.error('Failed to update operator:', error)
    },
  })
}

export function useDeleteOperator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => operatorApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: operatorQueryKeys.all })
    },
    onError: (error: any) => {
      console.error('Failed to delete operator:', error)
    },
  })
}

// Brand Hooks
export function useBrands(params: BrandListParams = {}) {
  return useQuery({
    queryKey: brandQueryKeys.list(params),
    queryFn: () => brandApi.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
    },
    onError: (error: any) => {
      console.error('Failed to create brand:', error)
    },
  })
}

export function useUpdateBrand() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBrandRequest }) =>
      brandApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandQueryKeys.all })
    },
    onError: (error: any) => {
      console.error('Failed to update brand:', error)
    },
  })
}

export function useUpdateBrandStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      brandApi.updateStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandQueryKeys.all })
    },
    onError: (error: any) => {
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
    },
    onError: (error: any) => {
      console.error('Failed to delete brand:', error)
    },
  })
}

// Option Hooks for Dropdowns
export function usePlatformOptions() {
  return useQuery({
    queryKey: ['platform-options'],
    queryFn: () => platformApi.list({ pageSize: 100 }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    select: data =>
      [
        { value: 'ALL', label: 'All Platforms' },
        ...data.platforms.map((platform: any) => ({
          value: platform._id,
          label: platform.platformName,
        })),
      ] as SelectOption[],
  })
}

export function useOperatorOptions(platformId?: string) {
  return useQuery({
    queryKey: ['operator-options', platformId],
    queryFn: () =>
      operatorApi.list({
        platforms: platformId && platformId !== 'ALL' ? platformId : DEFAULT_PLATFORM_ID,
        pageSize: 100,
      }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!platformId,
    select: data =>
      [
        { value: 'ALL', label: 'All Operators' },
        ...data.operators.map((operator: any) => ({
          value: operator._id,
          label: operator.operatorName,
        })),
      ] as SelectOption[],
  })
}

export function useBrandOptions(platformId?: string, operatorId?: string) {
  return useQuery({
    queryKey: ['brand-options', platformId, operatorId],
    queryFn: () =>
      brandApi.list({
        platforms: platformId && platformId !== 'ALL' ? platformId : DEFAULT_PLATFORM_ID,
        operators: operatorId && operatorId !== 'ALL' ? operatorId : undefined,
        pageSize: 1000,
      }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!platformId,
    select: data =>
      [
        { value: 'ALL', label: 'All Brands' },
        ...data.brands.map((brand: any) => ({
          value: brand._id,
          label: brand.brandName,
        })),
      ] as SelectOption[],
  })
}
