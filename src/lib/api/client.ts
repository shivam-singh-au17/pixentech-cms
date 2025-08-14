/**
 * API Client
 * Core HTTP client with interceptors, error handling, and retry logic
 */

import { API_CONFIG, HTTP_STATUS } from './config'
import { ApiException, RequestConfig, RequestOptions } from './types'

class ApiClient {
  private baseURL: string
  private defaultTimeout: number
  private token: string | null = null
  private refreshToken: string | null = null

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
    this.defaultTimeout = API_CONFIG.TIMEOUT
  }

  /**
   * Set authentication tokens
   */
  setTokens(token: string, refreshToken?: string) {
    this.token = token
    if (refreshToken) {
      this.refreshToken = refreshToken
    }
  }

  /**
   * Clear authentication tokens
   */
  clearTokens() {
    this.token = null
    this.refreshToken = null
  }

  /**
   * Get stored tokens
   */
  getTokens() {
    return {
      token: this.token,
      refreshToken: this.refreshToken,
    }
  }

  /**
   * Build full URL
   */
  private buildUrl(endpoint: string): string {
    return `${this.baseURL}${endpoint}`
  }

  /**
   * Build request headers
   */
  private buildHeaders(
    customHeaders: Record<string, string> = {},
    skipAuth = false
  ): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    }

    if (!skipAuth && this.token) {
      headers.authorization = `Bearer ${this.token}`
    }

    return headers
  }

  /**
   * Handle API errors
   */
  private handleError(response: Response, data: any): never {
    const { status } = response

    let message = 'An unexpected error occurred'
    let code: string | undefined
    let details: any

    if (data) {
      if (typeof data === 'string') {
        message = data
      } else if (data.message) {
        message = data.message
      } else if (data.error) {
        message = data.error
      }

      code = data.code || data.error_code
      details = data.errors || data.details
    }

    // Default messages for common status codes
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        message = message || 'Authentication required'
        break
      case HTTP_STATUS.FORBIDDEN:
        message = message || 'Access denied'
        break
      case HTTP_STATUS.NOT_FOUND:
        message = message || 'Resource not found'
        break
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        message = message || 'Internal server error'
        break
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        message = message || 'Service temporarily unavailable'
        break
    }

    throw new ApiException(status, message, code, details)
  }

  /**
   * Sleep utility for retry delay
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest(config: RequestConfig): Promise<any> {
    const { method, url, data, params, headers = {}, options = {} } = config
    const {
      timeout = this.defaultTimeout,
      retries = API_CONFIG.RETRY_ATTEMPTS,
      retryDelay = API_CONFIG.RETRY_DELAY,
      skipAuth = false,
      skipErrorHandling = false,
    } = options

    const fullUrl = this.buildUrl(url)
    const requestHeaders = this.buildHeaders(headers, skipAuth)

    // Build URL with query parameters
    const urlWithParams = new URL(fullUrl)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          urlWithParams.searchParams.append(key, String(value))
        }
      })
    }

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(timeout),
    }

    if (data && method !== 'GET') {
      requestConfig.body = JSON.stringify(data)
    }

    let lastError: Error | ApiException | null = null

    // Retry logic
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(urlWithParams.toString(), requestConfig)

        // Handle different content types
        let responseData: any
        const contentType = response.headers.get('content-type')

        if (contentType?.includes('application/json')) {
          responseData = await response.json()
        } else {
          responseData = await response.text()
        }

        // Handle non-success status codes
        if (!response.ok) {
          if (!skipErrorHandling) {
            this.handleError(response, responseData)
          }
          return { response, data: responseData }
        }

        return responseData
      } catch (error) {
        lastError = error as Error

        // Don't retry on authentication errors or client errors (4xx)
        if (error instanceof ApiException) {
          if (error.status >= 400 && error.status < 500) {
            throw error
          }
        }

        // Don't retry on the last attempt
        if (attempt === retries) {
          break
        }

        // Wait before retrying
        await this.sleep(retryDelay * Math.pow(2, attempt)) // Exponential backoff
      }
    }

    // If we get here, all retries failed
    throw lastError || new ApiException(0, 'Request failed after retries')
  }

  /**
   * GET request
   */
  async get<T = any>(
    url: string,
    params?: Record<string, any>,
    options?: RequestOptions
  ): Promise<T> {
    return this.makeRequest({
      method: 'GET',
      url,
      params,
      options,
    })
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.makeRequest({
      method: 'POST',
      url,
      data,
      options,
    })
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.makeRequest({
      method: 'PUT',
      url,
      data,
      options,
    })
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.makeRequest({
      method: 'PATCH',
      url,
      data,
      options,
    })
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, options?: RequestOptions): Promise<T> {
    return this.makeRequest({
      method: 'DELETE',
      url,
      options,
    })
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient()
