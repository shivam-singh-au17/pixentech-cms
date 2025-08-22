/**
 * Unified Games Data Management
 * Centralized React Query hooks for game operations with cache invalidation
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  gameApi,
  type GameListParams,
  type CreateGameData,
  type UpdateGameData,
} from '@/lib/api/game'
import { apiClient } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

// Query Keys Factory
export const gameQueryKeys = {
  all: ['games'] as const,
  lists: () => [...gameQueryKeys.all, 'list'] as const,
  list: (params: GameListParams = {}) => [...gameQueryKeys.lists(), params] as const,
  details: () => [...gameQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...gameQueryKeys.details(), id] as const,
  // Filtered data
  active: () => [...gameQueryKeys.all, 'active'] as const,
  options: (params: { isActive?: boolean } = {}) =>
    [...gameQueryKeys.all, 'options', params] as const,
}

/**
 * Authentication-aware query enabler
 */
const useAuthReady = () => {
  const { token } = apiClient.getTokens()
  return !!token
}

/**
 * Hook to fetch games list with authentication checking
 */
export function useGames(params: GameListParams = {}, enabled: boolean = true) {
  const isAuthReady = useAuthReady()

  return useQuery({
    queryKey: gameQueryKeys.list(params),
    queryFn: async () => {
      const { token } = apiClient.getTokens()
      if (!token) {
        throw new Error('Authentication required')
      }
      return gameApi.list(params)
    },
    enabled: enabled && isAuthReady,
    staleTime: 2 * 60 * 1000, // 2 minutes - shorter for better responsiveness
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Refetch on window focus for real-time updates
    refetchOnMount: true, // Always refetch on component mount
  })
}

/**
 * Hook to fetch only active games as options for dropdowns
 */
export function useGameOptions(enabled: boolean = true) {
  const isAuthReady = useAuthReady()

  return useQuery({
    queryKey: gameQueryKeys.options({ isActive: true }),
    queryFn: async () => {
      const { token } = apiClient.getTokens()
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await gameApi.list({ isActive: true })

      // Transform to options format
      return {
        games: response.data || [],
        options: (response.data || []).map(game => ({
          id: game._id,
          value: game._id,
          label: game.gameName,
          gameAlias: game.gameAlias,
          isActive: game.isActive,
        })),
      }
    },
    enabled: enabled && isAuthReady,
    staleTime: 1 * 60 * 1000, // 1 minute for options
    gcTime: 3 * 60 * 1000, // 3 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })
}

/**
 * Hook to fetch single game
 */
export function useGame(id: string, enabled: boolean = true) {
  const isAuthReady = useAuthReady()

  return useQuery({
    queryKey: gameQueryKeys.detail(id),
    queryFn: () => gameApi.getById(id),
    enabled: enabled && isAuthReady && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes for individual games
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Hook to create a new game
 */
export function useCreateGame() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  return useMutation({
    mutationFn: (data: CreateGameData) => gameApi.create(data),
    onSuccess: newGame => {
      // Invalidate and refetch all game-related queries
      queryClient.invalidateQueries({ queryKey: gameQueryKeys.all })

      // Optimistically add the new game to existing lists
      queryClient.setQueryData(gameQueryKeys.list(), (oldData: any) => {
        if (oldData?.games) {
          return {
            ...oldData,
            games: [newGame, ...oldData.games],
            total: (oldData.total || 0) + 1,
          }
        }
        return oldData
      })

      success('Game created successfully!')
    },
    onError: (err: any) => {
      error(err?.message || 'Failed to create game')
    },
  })
}

/**
 * Hook to update a game
 */
export function useUpdateGame() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGameData }) => gameApi.update(id, data),
    onSuccess: (updatedGame, { id }) => {
      // Update specific game detail
      queryClient.setQueryData(gameQueryKeys.detail(id), updatedGame)

      // Invalidate all lists to ensure they show updated data
      queryClient.invalidateQueries({ queryKey: gameQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: gameQueryKeys.options() })

      success('Game updated successfully!')
    },
    onError: (err: any) => {
      error(err?.message || 'Failed to update game')
    },
  })
}

/**
 * Hook to delete a game
 */
export function useDeleteGame() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  return useMutation({
    mutationFn: (id: string) => gameApi.deleteGame(id),
    onSuccess: (_, deletedId) => {
      // Remove from all cached queries
      queryClient.setQueryData(gameQueryKeys.list(), (oldData: any) => {
        if (oldData?.games) {
          return {
            ...oldData,
            games: oldData.games.filter((game: any) => game._id !== deletedId),
            total: Math.max((oldData.total || 0) - 1, 0),
          }
        }
        return oldData
      })

      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: gameQueryKeys.all })

      success('Game deleted successfully!')
    },
    onError: (err: any) => {
      error(err?.message || 'Failed to delete game')
    },
  })
}

/**
 * Hook to toggle game active status
 */
export function useToggleGameStatus() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      gameApi.update(id, { isActive }),
    onSuccess: (updatedGame, { id, isActive }) => {
      // Update specific game detail
      queryClient.setQueryData(gameQueryKeys.detail(id), updatedGame)

      // Update in all list queries
      queryClient.setQueryData(gameQueryKeys.list(), (oldData: any) => {
        if (oldData?.games) {
          return {
            ...oldData,
            games: oldData.games.map((game: any) =>
              game._id === id ? { ...game, isActive } : game
            ),
          }
        }
        return oldData
      })

      // Invalidate options queries since active status affects dropdown options
      queryClient.invalidateQueries({ queryKey: gameQueryKeys.options() })

      success(`Game ${isActive ? 'activated' : 'deactivated'} successfully!`)
    },
    onError: (err: any) => {
      error(err?.message || 'Failed to update game status')
    },
  })
}

/**
 * Utility hook to refresh all game data
 */
export function useRefreshGames() {
  const queryClient = useQueryClient()

  return () => {
    // Invalidate all game queries to force refresh
    queryClient.invalidateQueries({ queryKey: gameQueryKeys.all })
  }
}
