/**
 * Platform Management Types
 */

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
  total?: number
  page?: number
  totalPages?: number
}

export interface PlatformListParams {
  pageNo?: number
  pageSize?: number
  sortDirection?: 1 | -1
  search?: string
}

export interface Operator {
  _id: string
  platform: string
  operatorName: string
  createdAt: string
  updatedAt: string
}

export interface CreateOperatorRequest {
  operatorName: string
  platform: string
}

export interface UpdateOperatorRequest {
  operatorName: string
}

export interface OperatorListResponse {
  operators: Operator[]
  total?: number
  page?: number
  totalPages?: number
}

export interface OperatorListParams {
  platforms?: string
  pageNo?: number
  pageSize?: number
  sortDirection?: 1 | -1
  search?: string
}

export interface Brand {
  _id: string
  platform: string
  operator: string
  brandName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateBrandRequest {
  brandName: string
  platform: string
  operator: string
}

export interface UpdateBrandRequest {
  brandName?: string
  isActive?: boolean
}

export interface BrandListResponse {
  brands: Brand[]
  total?: number
  page?: number
  totalPages?: number
}

export interface BrandListParams {
  platforms?: string
  operators?: string
  pageNo?: number
  pageSize?: number
  sortDirection?: 1 | -1
  search?: string
}
