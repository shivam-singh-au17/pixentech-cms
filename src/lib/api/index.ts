/**
 * API Index
 * Central export point for all API services
 */

export * from './config'
export * from './types'
export * from './client'
export * from './auth'
export * from './dashboard'
export * from './summary'

// Import and re-export services
import { authService } from './auth'

export const api = {
  auth: authService,
}

export { authService }
