/**
 * Operator Game API Interface
 * Handles all operator game related API operations
 */

import { apiClient } from './index'

export interface OperatorGame {
  _id: string
  platform: string
  operator: string
  brand: string
  game?: string // For creation, this is the game ID reference
  isActive: boolean
  gameMode: string
  gameName: string
  gameAlias: string
  launchPath: string
  icon: string
  gameType: string
  minBet?: number
  maxBet?: number
  defaultBet?: number
  maxWin?: number
  homeURL?: string
}

export interface OperatorGameListParams {
  pageNo?: number
  pageSize?: number
  sortDirection?: 1 | -1
  sortBy?: string
  platform?: string
  operator?: string
  brand?: string
  game?: string
  gameType?: string
  isActive?: boolean
  searchQuery?: string
}

export interface OperatorGameListResponse {
  data: OperatorGame[]
  totalItems: number
  limit: number
  page: number
  totalPages: number
  morePages: boolean
}

export interface CreateOperatorGameData {
  game: string
  platform: string
  operator: string
  brand: string
  minBet?: number
  maxBet?: number
  defaultBet?: number
  maxWin?: number
}

export interface UpdateOperatorGameData {
  minBet?: number
  maxBet?: number
  defaultBet?: number
  maxWin?: number
  isActive?: boolean
}

export const operatorGameApi = {
  /**
   * Get operator games list
   */
  list: async (params: OperatorGameListParams = {}): Promise<OperatorGameListResponse> => {
    try {
      const searchParams = new URLSearchParams()

      if (params.pageNo) searchParams.append('pageNo', params.pageNo.toString())
      if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString())
      if (params.sortDirection)
        searchParams.append('sortDirection', params.sortDirection.toString())
      if (params.sortBy) searchParams.append('sortBy', params.sortBy)
      if (params.platform && params.platform !== 'ALL')
        searchParams.append('platform', params.platform)
      if (params.operator && params.operator !== 'ALL')
        searchParams.append('operator', params.operator)
      if (params.brand && params.brand !== 'ALL') searchParams.append('brand', params.brand)
      if (params.game && params.game !== 'ALL') searchParams.append('game', params.game)
      if (params.gameType) searchParams.append('gameType', params.gameType)
      if (params.isActive !== undefined) searchParams.append('isActive', params.isActive.toString())
      if (params.searchQuery) searchParams.append('search', params.searchQuery)

      const queryString = searchParams.toString()
      const url = `/operatorGame/list${queryString ? `?${queryString}` : ''}`

      const response = await apiClient.get(url)

      // Handle the actual API response structure based on your provided data
      if (response.data && Array.isArray(response.data)) {
        return {
          data: response.data,
          totalItems: response.totalItems || response.data.length,
          limit: response.limit || 50,
          page: response.page || 1,
          totalPages:
            response.totalPages ||
            Math.ceil((response.totalItems || response.data.length) / (response.limit || 50)),
          morePages: response.morePages || false,
        }
      }

      // Fallback structure
      return {
        data: response.data?.data || [],
        totalItems: response.data?.totalItems || response.data?.data?.length || 0,
        limit: response.data?.limit || 50,
        page: response.data?.page || 1,
        totalPages:
          response.data?.totalPages ||
          Math.ceil(
            (response.data?.totalItems || response.data?.data?.length || 0) /
              (response.data?.limit || 50)
          ),
        morePages: response.data?.morePages || false,
      }
    } catch (error) {
      console.error('Error fetching operator games:', error)
      return {
        data: [],
        totalItems: 0,
        limit: 50,
        page: 1,
        totalPages: 0,
        morePages: false,
      }
    }
  },

  /**
   * Get operator game by ID
   */
  getById: async (id: string): Promise<OperatorGame> => {
    const response = await apiClient.get<{ data: OperatorGame }>(`/operatorGame/${id}`)
    return response.data
  },

  /**
   * Create new operator game
   */
  create: async (data: CreateOperatorGameData): Promise<OperatorGame> => {
    const response = await apiClient.post<{ data: OperatorGame }>('/operatorGame/create', data)
    return response.data
  },

  /**
   * Update operator game
   */
  update: async (id: string, data: UpdateOperatorGameData): Promise<OperatorGame> => {
    const response = await apiClient.put<{ data: OperatorGame }>(`/operatorGame/update/${id}`, data)
    return response.data
  },

  /**
   * Delete operator game
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/operatorGame/delete/${id}`)
  },

  /**
   * Toggle operator game status
   */
  toggleStatus: async (id: string): Promise<OperatorGame> => {
    const response = await apiClient.patch<{ data: OperatorGame }>(
      `/operatorGame/toggle-status/${id}`
    )
    return response.data
  },
}
