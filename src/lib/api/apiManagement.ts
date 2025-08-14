/**
 * API Management Service
 * Handles all API management-related operations
 */

import { apiClient } from './client'

export interface ApiManagement {
  _id: string
  name: string
  endPoint: string
  description: string
  status: boolean
  role: string[]
  platforms: string[]
  operators: string[]
  brands: string[]
  createdAt?: string
  updatedAt?: string
}

export interface ApiManagementListParams {
  pageNo?: number
  pageSize?: number
  sortDirection?: 1 | -1
  searchQuery?: string
  status?: boolean
  role?: string
  platformId?: string
  operatorId?: string
  brandId?: string
}

export interface CreateApiManagementData {
  name: string
  endPoint: string
  description: string
  status: boolean
  role: string[]
  platforms: string[]
  operators: string[]
  brands: string[]
}

export interface UpdateApiManagementData extends CreateApiManagementData {
  _id: string
}

export interface ApiManagementListResponse {
  data: ApiManagement[]
  totalItems: number
  limit: number
  page: number
  totalPages: number
  morePages: boolean
}

export interface ApiResponse<T = any> {
  data: T
  [key: string]: any
}

class ApiManagementApi {
  private baseUrl = '/apiManagement'

  /**
   * Get list of API endpoints with pagination and filters
   */
  async list(params: ApiManagementListParams = {}): Promise<ApiManagementListResponse> {
    const searchParams = new URLSearchParams()

    // Add default pagination parameters
    searchParams.append('pageNo', (params.pageNo || 1).toString())
    searchParams.append('pageSize', (params.pageSize || 50).toString())

    // Add filter parameters
    if (params.searchQuery) searchParams.append('searchQuery', params.searchQuery)
    if (params.status !== undefined) searchParams.append('status', params.status.toString())
    if (params.role) searchParams.append('role', params.role)
    if (params.platformId) searchParams.append('platformId', params.platformId)
    if (params.operatorId) searchParams.append('operatorId', params.operatorId)
    if (params.brandId) searchParams.append('brandId', params.brandId)
    if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection.toString())

    const response = await apiClient.get(`${this.baseUrl}/get?${searchParams.toString()}`)

    // Handle different API response structures
    const responseData = response.data

    // If API returns direct array, wrap it in the expected structure
    if (Array.isArray(responseData)) {
      return {
        data: responseData,
        totalItems: responseData.length,
        limit: params.pageSize || 50,
        page: params.pageNo || 1,
        totalPages: Math.ceil(responseData.length / (params.pageSize || 50)),
        morePages: false,
      }
    }

    // If API returns the expected structure, return it directly
    return responseData
  }

  /**
   * Get API endpoint by ID
   */
  async getById(id: string): Promise<ApiManagement> {
    const response = await apiClient.get(`${this.baseUrl}/get/${id}`)
    return response.data
  }

  /**
   * Create new API endpoint
   */
  async create(data: CreateApiManagementData): Promise<ApiManagement> {
    const response = await apiClient.post(`${this.baseUrl}/create`, data)
    return response.data
  }

  /**
   * Update existing API endpoint
   */
  async update(id: string, data: UpdateApiManagementData): Promise<ApiManagement> {
    const response = await apiClient.put(`${this.baseUrl}/update`, { ...data, _id: id })
    return response.data
  }

  /**
   * Delete API endpoint
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/delete/${id}`)
  }

  /**
   * Toggle API endpoint status
   */
  async toggleStatus(id: string): Promise<ApiManagement> {
    const response = await apiClient.patch(`${this.baseUrl}/toggle-status/${id}`)
    return response.data
  }

  /**
   * Bulk update API endpoints
   */
  async bulkUpdate(ids: string[], updates: Partial<CreateApiManagementData>): Promise<void> {
    await apiClient.patch(`${this.baseUrl}/bulk-update`, {
      ids,
      updates,
    })
  }

  /**
   * Export API endpoints data
   */
  async export(params: ApiManagementListParams = {}): Promise<Blob> {
    const searchParams = new URLSearchParams()

    if (params.searchQuery) searchParams.append('searchQuery', params.searchQuery)
    if (params.status !== undefined) searchParams.append('status', params.status.toString())
    if (params.role) searchParams.append('role', params.role)
    if (params.platformId) searchParams.append('platformId', params.platformId)
    if (params.operatorId) searchParams.append('operatorId', params.operatorId)
    if (params.brandId) searchParams.append('brandId', params.brandId)

    const response = await apiClient.get(`${this.baseUrl}/export?${searchParams.toString()}`, {
      responseType: 'blob',
    })
    return response.data
  }
}

export const apiManagementApi = new ApiManagementApi()
