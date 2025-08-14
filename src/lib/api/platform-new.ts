/**
 * Platform Management API
 * Real API endpoints for Platform, Operator, and Brand management
 */

import { apiClient } from './client'
import { DEFAULT_PLATFORM_ID } from '@/lib/constants/platform'
import type {
  Platform,
  CreatePlatformRequest,
  UpdatePlatformRequest,
  PlatformListResponse,
  PlatformListParams,
  Operator,
  CreateOperatorRequest,
  UpdateOperatorRequest,
  OperatorListResponse,
  OperatorListParams,
  Brand,
  CreateBrandRequest,
  UpdateBrandRequest,
  BrandListResponse,
  BrandListParams,
} from '@/lib/types/platform-updated'

// Platform APIs
export const platformApi = {
  list: async (params: PlatformListParams = {}): Promise<PlatformListResponse> => {
    const searchParams = new URLSearchParams()

    // Set required parameters with defaults
    const pageNo = params.pageNo || 1
    const pageSize = params.pageSize || 10
    const sortDirection = params.sortDirection || -1

    searchParams.append('pageNo', pageNo.toString())
    searchParams.append('pageSize', pageSize.toString())
    searchParams.append('sortDirection', sortDirection.toString())

    const url = `/platform/list?${searchParams.toString()}`
    const response = await apiClient.get(url)
    return response
  },

  create: async (data: CreatePlatformRequest): Promise<Platform> => {
    const response = await apiClient.post('/platform/create', data)
    return response
  },

  update: async (id: string, data: UpdatePlatformRequest): Promise<Platform> => {
    const response = await apiClient.put(`/platform/update/${id}`, data)
    return response
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/platform/delete/${id}`)
  },

  getById: async (id: string): Promise<Platform> => {
    const response = await apiClient.get(`/platform/${id}`)
    return response
  },
}

// Operator APIs
export const operatorApi = {
  list: async (params: OperatorListParams = {}): Promise<OperatorListResponse> => {
    const searchParams = new URLSearchParams()

    // Set required parameters with defaults
    const platforms = params.platforms || DEFAULT_PLATFORM_ID // Required parameter, default to specific platform ID
    const pageNo = params.pageNo || 1
    const pageSize = params.pageSize || 10
    const sortDirection = params.sortDirection || -1

    searchParams.append('platforms', platforms)
    searchParams.append('pageNo', pageNo.toString())
    searchParams.append('pageSize', pageSize.toString())
    searchParams.append('sortDirection', sortDirection.toString())

    const url = `/operator/list?${searchParams.toString()}`
    const response = await apiClient.get(url)
    return response
  },

  create: async (data: CreateOperatorRequest): Promise<Operator> => {
    const response = await apiClient.post('/operator/create', data)
    return response
  },

  update: async (id: string, data: UpdateOperatorRequest): Promise<Operator> => {
    const response = await apiClient.put(`/operator/update/${id}`, data)
    return response
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/operator/delete/${id}`)
  },

  getById: async (id: string): Promise<Operator> => {
    const response = await apiClient.get(`/operator/${id}`)
    return response
  },
}

// Brand APIs
export const brandApi = {
  list: async (params: BrandListParams = {}): Promise<BrandListResponse> => {
    const searchParams = new URLSearchParams()

    // Set required parameters with defaults
    const platforms = params.platforms || DEFAULT_PLATFORM_ID // Required parameter, default to specific platform ID
    const pageNo = params.pageNo || 1
    const pageSize = params.pageSize || 10
    const sortDirection = params.sortDirection || -1

    searchParams.append('platforms', platforms)
    searchParams.append('pageNo', pageNo.toString())
    searchParams.append('pageSize', pageSize.toString())
    searchParams.append('sortDirection', sortDirection.toString())

    const url = `/brand/list?${searchParams.toString()}`
    const response = await apiClient.get(url)
    return response
  },

  create: async (data: CreateBrandRequest): Promise<Brand> => {
    const response = await apiClient.post('/brand/create', data)
    return response
  },

  update: async (id: string, data: UpdateBrandRequest): Promise<Brand> => {
    const response = await apiClient.put(`/brand/update/${id}`, data)
    return response
  },

  updateStatus: async (id: string, isActive: boolean): Promise<Brand> => {
    const response = await apiClient.put(`/brand/update/${id}`, { isActive })
    return response
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/brand/delete/${id}`)
  },

  getById: async (id: string): Promise<Brand> => {
    const response = await apiClient.get(`/brand/${id}`)
    return response
  },
}
