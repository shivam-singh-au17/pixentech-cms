import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { config, STORAGE_KEYS } from '@/lib/config'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
        if (refreshToken) {
          const response = await axios.post(`${config.api.baseUrl}/auth/refresh`, {
            refresh_token: refreshToken,
          })

          const { access_token } = response.data
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, access_token)

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// Generic API response type
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

// Generic API error type
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
}

// API service class
export class ApiService {
  static async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.get<ApiResponse<T>>(url, config)
    return response.data
  }

  static async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config)
    return response.data
  }

  static async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config)
    return response.data
  }

  static async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config)
    return response.data
  }

  static async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.delete<ApiResponse<T>>(url, config)
    return response.data
  }
}

export default apiClient
