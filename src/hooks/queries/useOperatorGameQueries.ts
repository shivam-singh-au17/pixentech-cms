/**
 * Operator Game Management React Query Hooks
 * Provides data fetching and mutation hooks for operator game operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  operatorGameApi,
  type OperatorGameListParams,
  type CreateOperatorGameData,
  type UpdateOperatorGameData,
} from '@/lib/api/operatorGame'
import { apiClient } from '@/lib/api'

// Query Keys
export const operatorGameKeys = {
  all: ['operatorGames'] as const,
  lists: () => [...operatorGameKeys.all, 'list'] as const,
  list: (params: OperatorGameListParams) => [...operatorGameKeys.lists(), params] as const,
  details: () => [...operatorGameKeys.all, 'detail'] as const,
  detail: (id: string) => [...operatorGameKeys.details(), id] as const,
}

/**
 * Hook to fetch operator games list
 */
export function useOperatorGames(params: OperatorGameListParams = {}, enabled: boolean = true) {
  return useQuery({
    queryKey: operatorGameKeys.list(params),
    queryFn: async () => {
      // Ensure API client has token before making request
      const { token } = apiClient.getTokens()
      if (!token) {
        throw new Error('Authentication required')
      }
      return operatorGameApi.list(params)
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Hook to fetch single operator game
 */
export function useOperatorGame(id: string) {
  return useQuery({
    queryKey: operatorGameKeys.detail(id),
    queryFn: () => operatorGameApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Hook to create operator game
 */
export function useCreateOperatorGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOperatorGameData) => operatorGameApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch operator games list
      queryClient.invalidateQueries({ queryKey: operatorGameKeys.lists() })
    },
  })
}

/**
 * Hook to update operator game
 */
export function useUpdateOperatorGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOperatorGameData }) =>
      operatorGameApi.update(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific operator game and lists
      queryClient.invalidateQueries({ queryKey: operatorGameKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: operatorGameKeys.lists() })
    },
  })
}

/**
 * Hook to delete operator game
 */
export function useDeleteOperatorGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => operatorGameApi.delete(id),
    onSuccess: () => {
      // Invalidate operator games list
      queryClient.invalidateQueries({ queryKey: operatorGameKeys.lists() })
    },
  })
}

/**
 * Hook to toggle operator game status
 */
export function useToggleOperatorGameStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => operatorGameApi.toggleStatus(id),
    onSuccess: (_, id) => {
      // Invalidate specific operator game and lists
      queryClient.invalidateQueries({ queryKey: operatorGameKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: operatorGameKeys.lists() })
    },
  })
}
