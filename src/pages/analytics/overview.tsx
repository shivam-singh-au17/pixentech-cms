/**
 * Analytics Overview Page
 * Main analytics dashboard redirects to the main dashboard for now
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function AnalyticsOverview() {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to main dashboard for now
    navigate('/', { replace: true })
  }, [navigate])

  return null
}
