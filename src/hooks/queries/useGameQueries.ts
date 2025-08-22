/**
 * Game Management React Query Hooks
 * Provides data fetching and mutation hooks for game operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  gameApi,
  type GameListParams,
  type CreateGameData,
  type UpdateGameData,
} from '@/lib/api/game'
import { apiClient } from '@/lib/api'

// Query Keys
export const gameKeys = {
  all: ['games'] as const,
  lists: () => [...gameKeys.all, 'list'] as const,
  list: (params: GameListParams) => [...gameKeys.lists(), params] as const,
  details: () => [...gameKeys.all, 'detail'] as const,
  detail: (id: string) => [...gameKeys.details(), id] as const,
}

/**
 * Hook to fetch games list
 */
export function useGames(params: GameListParams = {}, enabled: boolean = true) {
  return useQuery({
    queryKey: gameKeys.list(params),
    queryFn: async () => {
      // Ensure API client has token before making request
      const { token } = apiClient.getTokens()
      if (!token) {
        throw new Error('Authentication required')
      }
      return gameApi.list(params)
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Hook to fetch single game
 */
export function useGame(id: string) {
  return useQuery({
    queryKey: gameKeys.detail(id),
    queryFn: () => gameApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Hook to create new game
 */
export function useCreateGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateGameData) => gameApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch games list
      queryClient.invalidateQueries({ queryKey: gameKeys.lists() })
    },
  })
}

/**
 * Hook to update game
 */
export function useUpdateGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGameData }) => gameApi.update(id, data),
    onSuccess: updatedGame => {
      // Invalidate specific game and lists
      queryClient.invalidateQueries({ queryKey: gameKeys.detail(updatedGame._id) })
      queryClient.invalidateQueries({ queryKey: gameKeys.lists() })
    },
  })
}

/**
 * Hook to delete game
 */
export function useDeleteGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => gameApi.deleteGame(id),
    onSuccess: () => {
      // Invalidate games list
      queryClient.invalidateQueries({ queryKey: gameKeys.lists() })
    },
  })
}

/**
 * Hook to toggle game status (enable/disable)
 */
export function useToggleGameStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      gameApi.toggleStatus(id, isActive),
    onSuccess: updatedGame => {
      // Invalidate specific game and lists
      queryClient.invalidateQueries({ queryKey: gameKeys.detail(updatedGame._id) })
      queryClient.invalidateQueries({ queryKey: gameKeys.lists() })
    },
  })
}

/**
 * Hook to export games
 */
export function useExportGames() {
  return useMutation({
    mutationFn: (params: GameListParams) => gameApi.exportGames(params),
  })
}

/**
 * Hook to bulk update games
 */
export function useBulkUpdateGames() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ids, data }: { ids: string[]; data: Partial<UpdateGameData> }) =>
      gameApi.bulkUpdate(ids, data),
    onSuccess: () => {
      // Invalidate games list
      queryClient.invalidateQueries({ queryKey: gameKeys.lists() })
    },
  })
}

/**
 * Utility hook to get game type options for filters
 */
export function useGameTypeOptions() {
  const { data: gamesData } = useGames({ pageSize: 1000 })

  const gameTypes = Array.from(new Set(gamesData?.data?.map(game => game.gameType) || [])).filter(
    Boolean
  )

  return gameTypes.map(type => ({
    value: type as string,
    label: (type as string)?.toUpperCase() || '',
  }))
}

/**
 * Utility hook to get game mode options for filters
 */
export function useGameModeOptions() {
  const { data: gamesData } = useGames({ pageSize: 1000 })

  const gameModes = Array.from(
    new Set(gamesData?.data?.map((game: any) => game.gameMode) || [])
  ).filter(Boolean)

  return gameModes.map(mode => ({
    value: mode as string,
    label: `Mode ${mode}`,
  }))
}
