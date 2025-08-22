/**
 * Game API Service
 * Handles all game-related API operations
 */

import { apiClient } from './client'

export interface Game {
  _id: string
  gameName: string
  gameAlias: string
  launchPath: string
  icon?: string
  isActive: boolean
  gameType?: 'pg' | 'sg' | 'cg' | string // pg = Provably Fair, sg = Slot Game, cg = Crash Game
  defaultBet?: number
  maxBet?: number
  minBet?: number
  gameMode?: string
  homeURL?: string
  extraData?: string
  maxWin?: number
  availableGameModes?: string[]
  createdAt?: string
  updatedAt?: string
  __v?: number

  // Slot game specific fields (sg type)
  gameId?: string
  buyFeature?: boolean
  possibleBets?: number[]
  baseGame?: number
  freeGame?: number
  freeSpin?: boolean
  bbRtp?: string
  bbRtps?: string[]
  bbBetMultiplier?: number[]
  bbMaxPayoutMultiplier?: number
  maxPayoutMultiplier?: number
  isAutomationRtp?: boolean
  automationBBRtps?: string[]
  automationRtps?: string[]
  bbBetMultiplierSettings?: Record<string, number>
  basicLaunchPath?: string
  createdBy?: string
  updatedBy?: string
}

export interface GameListParams {
  gameType?: string
  isActive?: boolean
  pageSize?: number
  pageNo?: number
  sortBy?: string
  sortDirection?: number
  search?: string
}

export interface GameListResponse {
  data: Game[]
  totalItems: number
  limit: number
  page: number
  totalPages: number
  morePages: boolean
}

export interface CreateGameData {
  gameName: string
  gameAlias: string
  launchPath: string
  icon?: string
  gameType: 'pg' | 'sg' | 'cg'
  defaultBet: number
  maxBet: number
  minBet: number
  gameMode?: string
  homeURL?: string
  extraData?: string
  maxWin?: number
  availableGameModes?: string[]
  isActive?: boolean

  // Optional slot game fields
  gameId?: string
  buyFeature?: boolean
  possibleBets?: number[]
  baseGame?: number
  freeGame?: number
  freeSpin?: boolean
  bbRtp?: string
  bbRtps?: string[]
  bbBetMultiplier?: number[]
  bbMaxPayoutMultiplier?: number
  maxPayoutMultiplier?: number
  isAutomationRtp?: boolean
  automationBBRtps?: string[]
  automationRtps?: string[]
  bbBetMultiplierSettings?: Record<string, number>
  basicLaunchPath?: string
}

export interface UpdateGameData extends Partial<CreateGameData> {
  _id?: string
}

export const gameApi = {
  /**
   * Get list of games
   */
  list: async (params: GameListParams = {}): Promise<GameListResponse> => {
    try {
      const searchParams = new URLSearchParams()

      if (params.pageNo) searchParams.append('pageNo', params.pageNo.toString())
      if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString())
      if (params.sortBy) searchParams.append('sortBy', params.sortBy)
      if (params.sortDirection)
        searchParams.append('sortDirection', params.sortDirection.toString())
      if (params.gameType) searchParams.append('gameType', params.gameType)
      if (params.isActive !== undefined) searchParams.append('isActive', params.isActive.toString())
      if (params.search) searchParams.append('search', params.search)

      const url = `/game/list?${searchParams.toString()}`
      const response = await apiClient.get(url)
      return response
    } catch (error) {
      console.error('Error fetching games:', error)
      return { data: [], totalItems: 0, limit: 0, page: 1, totalPages: 0, morePages: false }
    }
  },

  /**
   * Get single game by ID
   */
  getById: async (id: string): Promise<Game> => {
    const response = await apiClient.get(`/game/${id}`)
    return response.data
  },

  /**
   * Create new game
   */
  create: async (data: CreateGameData): Promise<Game> => {
    const response = await apiClient.post('/game/create', data)
    return response.data
  },

  /**
   * Update game
   */
  update: async (id: string, data: UpdateGameData): Promise<Game> => {
    const response = await apiClient.put(`/game/update/${id}`, data)
    return response.data
  },

  /**
   * Delete game
   */
  deleteGame: async (id: string): Promise<void> => {
    await apiClient.delete(`/game/delete/${id}`)
  },

  /**
   * Toggle game active status
   */
  toggleStatus: async (id: string, isActive: boolean): Promise<Game> => {
    const response = await apiClient.put(`/game/update/${id}`, { isActive })
    return response.data
  },

  /**
   * Bulk operations
   */
  bulkUpdate: async (ids: string[], data: Partial<UpdateGameData>): Promise<void> => {
    await apiClient.put('/game/bulk-update', { ids, data })
  },

  /**
   * Export games data
   */
  exportGames: async (params: GameListParams = {}): Promise<Blob> => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })

    const response = await apiClient.get(`/game/export?${searchParams.toString()}`, {
      responseType: 'blob',
    })
    return response.data
  },
}
