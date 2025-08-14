/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import { apiClient } from './client'
import { API_ENDPOINTS } from './config'
import { LoginRequest, LoginResponse, RefreshTokenResponse, ApiResponse } from './types'

export class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('Attempting login with:', { email: credentials.email })

      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials, {
        skipAuth: true,
      })

      console.log('Login API response:', response)

      // Handle the actual API response format
      if (response.user && response.token) {
        // Transform the API response to match our expected format
        const loginData: LoginResponse = {
          user: {
            id: response.user.id || response.user._id,
            email: response.user.email,
            name: response.user.name || response.user.email.split('@')[0], // Use email prefix if no name
            role: response.user.role,
            avatar: response.user.avatar,
            isActive: response.user.isActive,
          },
          token: response.token,
          refreshToken: response.refreshToken || '', // Set empty if not provided
          expiresIn: response.expiresIn || 3600, // Default to 1 hour
        }

        console.log('Processed login data:', loginData)

        // Store tokens in the API client
        apiClient.setTokens(loginData.token, loginData.refreshToken)
        return loginData
      } else {
        console.error('Unexpected response format:', response)
        throw new Error('Login failed - unexpected response format')
      }
    } catch (error) {
      console.error('Login error details:', error)
      throw error
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const { refreshToken } = apiClient.getTokens()

      if (refreshToken) {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken })
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Don't throw error on logout failure
    } finally {
      // Always clear tokens locally
      apiClient.clearTokens()
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const { refreshToken } = apiClient.getTokens()

      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refreshToken },
        { skipAuth: true }
      )

      if (response.success && response.data) {
        // Update tokens in the API client
        apiClient.setTokens(response.data.token, response.data.refreshToken)
        return response.data
      }

      throw new Error(response.message || 'Token refresh failed')
    } catch (error) {
      console.error('Token refresh error:', error)
      // Clear tokens on refresh failure
      apiClient.clearTokens()
      throw error
    }
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<LoginResponse['user']> {
    try {
      const response = await apiClient.get<ApiResponse<LoginResponse['user']>>(
        API_ENDPOINTS.AUTH.PROFILE
      )

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to fetch profile')
    } catch (error) {
      console.error('Profile fetch error:', error)
      throw error
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const { token } = apiClient.getTokens()
    return !!token
  }

  /**
   * Get current tokens
   */
  getTokens() {
    return apiClient.getTokens()
  }

  /**
   * Set tokens (useful for restoring from storage)
   */
  setTokens(token: string, refreshToken?: string) {
    apiClient.setTokens(token, refreshToken)
  }

  /**
   * Clear tokens
   */
  clearTokens() {
    apiClient.clearTokens()
  }
}

// Create and export singleton instance
export const authService = new AuthService()
