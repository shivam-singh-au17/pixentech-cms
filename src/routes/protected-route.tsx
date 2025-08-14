import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth)
  const location = useLocation()

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin' />
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return <>{children}</>
}

interface PublicRouteProps {
  children: React.ReactNode
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  if (isAuthenticated) {
    // Redirect to dashboard if already authenticated
    return <Navigate to='/' replace />
  }

  return <>{children}</>
}
