/**
 * User Management API Interface
 * Handles all user management related API operations
 */

import { apiClient } from './index'

export interface User {
  _id: string
  email: string
  role: 'ROOT' | 'SUPER_ADMIN' | 'SUB_ADMIN' | 'ADMIN' | 'USER'
  isActive: boolean
  allowedBrands: string[]
  allowedOperators: string[]
  allowedPlatforms: string[]
  userName?: string
  createdAt?: string
  updatedAt?: string
}

export interface UserListParams {
  pageNo?: number
  pageSize?: number
  sortDirection?: 1 | -1
  platform?: string
  operator?: string
  brand?: string
  role?: string
  isActive?: boolean
  searchQuery?: string
}

export interface UserListResponse {
  data: User[]
  limit: number
  page: number
  totalCount?: number
}

export interface CreateUserData {
  userName: string
  email: string
  password: string
  role: 'SUPER_ADMIN' | 'SUB_ADMIN' | 'ADMIN' | 'USER'
  allowedPlatforms: string[]
  allowedOperators: string[]
  allowedBrands: string[]
}

export interface UpdateUserData {
  userName?: string
  email?: string
  password?: string
  role?: 'SUPER_ADMIN' | 'SUB_ADMIN' | 'ADMIN' | 'USER'
  allowedPlatforms?: string[]
  allowedOperators?: string[]
  allowedBrands?: string[]
  isActive?: boolean
}

export const userApi = {
  /**
   * Get users list
   */
  list: async (params: UserListParams = {}): Promise<UserListResponse> => {
    try {
      const searchParams = new URLSearchParams()

      if (params.pageNo) searchParams.append('pageNo', params.pageNo.toString())
      if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString())
      if (params.sortDirection)
        searchParams.append('sortDirection', params.sortDirection.toString())
      if (params.platform && params.platform !== 'ALL')
        searchParams.append('platform', params.platform)
      if (params.operator && params.operator !== 'ALL')
        searchParams.append('operator', params.operator)
      if (params.brand && params.brand !== 'ALL') searchParams.append('brand', params.brand)
      if (params.role && params.role !== 'ALL') searchParams.append('role', params.role)
      if (params.isActive !== undefined) searchParams.append('isActive', params.isActive.toString())
      if (params.searchQuery) searchParams.append('search', params.searchQuery)

      const queryString = searchParams.toString()
      const url = `/user/list${queryString ? `?${queryString}` : ''}`

      const response = await apiClient.get(url)

      // Handle the API response structure based on your provided data
      if (response.data && Array.isArray(response.data)) {
        return {
          data: response.data,
          limit: response.limit || 25,
          page: response.page || 1,
        }
      }

      // Fallback structure
      return {
        data: response.data?.data || [],
        limit: response.data?.limit || 25,
        page: response.data?.page || 1,
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      return { data: [], limit: 25, page: 1 }
    }
  },

  /**
   * Get user by ID
   */
  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<{ data: User }>(`/user/${id}`)
    return response.data
  },

  /**
   * Create new user
   */
  create: async (data: CreateUserData): Promise<User> => {
    const response = await apiClient.post<{ data: User }>('/user/create', data)
    return response.data
  },

  /**
   * Update user
   */
  update: async (id: string, data: UpdateUserData): Promise<User> => {
    const response = await apiClient.put<{ data: User }>(`/user/update/${id}`, data)
    return response.data
  },

  /**
   * Delete user
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/user/delete/${id}`)
  },

  /**
   * Toggle user status
   */
  toggleStatus: async (id: string): Promise<User> => {
    const response = await apiClient.patch<{ data: User }>(`/user/toggle-status/${id}`)
    return response.data
  },
}
