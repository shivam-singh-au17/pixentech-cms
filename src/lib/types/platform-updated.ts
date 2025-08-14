/**
 * Platform Management Types
 * Updated to match real API responses
 */

// Platform Types
export interface Platform {
  _id: string
  platformName: string
  createdAt: string
  updatedAt: string
  betRequest: {
    url: string
    method: 'POST' | 'GET' | 'PUT' | 'DELETE'
  }
  winRequest: {
    url: string
    method: 'POST' | 'GET' | 'PUT' | 'DELETE'
  }
  balanceRequest: {
    url: string
    method: 'POST' | 'GET' | 'PUT' | 'DELETE'
  }
  refundRequest: {
    url: string
    method: 'POST' | 'GET' | 'PUT' | 'DELETE'
  }
  __v?: number
}

export interface CreatePlatformRequest {
  platformName: string
  betRequest: {
    url: string
    method: 'POST' | 'GET' | 'PUT' | 'DELETE'
  }
  winRequest: {
    url: string
    method: 'POST' | 'GET' | 'PUT' | 'DELETE'
  }
  balanceRequest: {
    url: string
    method: 'POST' | 'GET' | 'PUT' | 'DELETE'
  }
  refundRequest: {
    url: string
    method: 'POST' | 'GET' | 'PUT' | 'DELETE'
  }
}

export interface UpdatePlatformRequest {
  betRequest: {
    url: string
    method: 'POST' | 'GET' | 'PUT' | 'DELETE'
  }
  winRequest: {
    url: string
    method: 'POST' | 'GET' | 'PUT' | 'DELETE'
  }
  balanceRequest: {
    url: string
    method: 'POST' | 'GET' | 'PUT' | 'DELETE'
  }
  refundRequest: {
    url: string
    method: 'POST' | 'GET' | 'PUT' | 'DELETE'
  }
}

export interface PlatformListResponse {
  platforms: Platform[]
}

export interface PlatformListParams {
  pageNo?: number
  pageSize?: number
  sortDirection?: number
}

// Operator Types
export interface Operator {
  _id: string
  platform: string // platform ID
  operatorName: string
  createdAt: string
  updatedAt: string
}

export interface CreateOperatorRequest {
  operatorName: string
  platform: string // platform ID
}

export interface UpdateOperatorRequest {
  operatorName: string
}

export interface OperatorListResponse {
  operators: Operator[]
}

export interface OperatorListParams {
  platforms?: string // platform ID
  pageNo?: number
  pageSize?: number
  sortDirection?: number
}

// Brand Types
export interface Brand {
  _id: string
  platform: string // platform ID
  operator: string // operator ID
  brandName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateBrandRequest {
  brandName: string
  platform: string // platform ID
  operator: string // operator ID
}

export interface UpdateBrandRequest {
  brandName?: string
  isActive?: boolean
}

export interface BrandListResponse {
  brands: Brand[]
}

export interface BrandListParams {
  platforms?: string // platform ID
  operators?: string // operator ID
  pageNo?: number
  pageSize?: number
  sortDirection?: number
}

// Option types for dropdowns
export interface SelectOption {
  value: string
  label: string
}

// Common API Response wrapper (if needed)
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}
