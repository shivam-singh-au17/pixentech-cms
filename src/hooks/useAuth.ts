/**
 * Auth Hook
 * Custom hook for authentication management
 */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { restoreAuth } from '@/store/slices/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth)

  // Initialize auth from storage on app start
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check if we have stored auth data
        const persistedState = localStorage.getItem('persist:auth')
        if (persistedState) {
          const authData = JSON.parse(persistedState)

          if (authData.token && authData.user && authData.isAuthenticated) {
            const user =
              typeof authData.user === 'string' ? JSON.parse(authData.user) : authData.user
            const token =
              typeof authData.token === 'string' ? JSON.parse(authData.token) : authData.token
            const refreshToken =
              typeof authData.refreshToken === 'string'
                ? JSON.parse(authData.refreshToken)
                : authData.refreshToken

            if (token && user) {
              dispatch(restoreAuth({ user, token, refreshToken }))

              // Optionally refresh the token if it's close to expiry
              // This could be enhanced with JWT token expiry checking
              // dispatch(refreshAuthToken() as any)
            }
          }
        }
      } catch (error) {
        console.warn('Failed to restore auth from storage:', error)
        // Clear any corrupted storage
        localStorage.removeItem('persist:auth')
      }
    }

    initializeAuth()
  }, [dispatch])

  return {
    ...auth,
  }
}

export default useAuth
