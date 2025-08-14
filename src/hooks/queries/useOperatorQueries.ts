/**
 * Operator Management Query Hooks
 * TanStack Query hooks for operator management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { operatorApi } from '@/lib/api/platform-new'
import type {
  OperatorListParams,
  CreateOperatorRequest,
  UpdateOperatorRequest,
} from '@/lib/types/platform-updated'

// Query Keys
export const operatorQueryKeys = {
  all: ['operators'] as const,
  lists: () => [...operatorQueryKeys.all, 'list'] as const,
  list: (filters: OperatorListParams) => [...operatorQueryKeys.lists(), filters] as const,
  details: () => [...operatorQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...operatorQueryKeys.details(), id] as const,
}

// Operator Hooks
export function useOperators(params: OperatorListParams) {
  return useQuery({
    queryKey: operatorQueryKeys.list(params),
    queryFn: () => operatorApi.list(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
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
      console.log('Operator created successfully!')
    },
    onError: error => {
      console.error('Failed to create operator:', error)
    },
  })
}

export function useUpdateOperator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOperatorRequest }) =>
      operatorApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: operatorQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: operatorQueryKeys.detail(id) })
      console.log('Operator updated successfully!')
    },
    onError: error => {
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
      console.log('Operator deleted successfully!')
    },
    onError: error => {
      console.error('Failed to delete operator:', error)
    },
  })
}
