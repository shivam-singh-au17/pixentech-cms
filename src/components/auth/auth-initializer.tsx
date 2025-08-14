/**
 * Auth Initializer
 * Ensures API client has the current auth token when app loads
 */

import { useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'
import { apiClient } from '@/lib/api'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { token, refreshToken } = useAppSelector(state => state.auth)

  useEffect(() => {
    // Initialize API client with tokens from Redux store
    if (token) {
      apiClient.setTokens(token, refreshToken || undefined)
    } else {
      apiClient.clearTokens()
    }
  }, [token, refreshToken])

  return <>{children}</>
}
