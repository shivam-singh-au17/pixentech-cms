/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
  BASE_URL: 'http://localhost:4002/cms',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/user/login',
    LOGOUT: '/user/logout',
    REFRESH: '/user/refresh',
    PROFILE: '/user/profile',
  },
  REPORTS: {
    DAILY_SUMMARY: '/reports/dailySummary',
    GAME_SUMMARY: '/reports/gameSummary',
    PLAYER_SUMMARY: '/reports/playerSummary',
    PLAYER_GAME_SUMMARY: '/reports/playerGameSummary',
    DASHBOARD_CHART_SUMMARY: '/reports/dashboardChartSummary',
    WINNERS_CONTRIBUTORS: '/reports/winnersAndContributors',
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    GET: (id: string) => `/users/${id}`,
  },
  OPERATOR_GAME: {
    LIST: '/operatorGame/list',
  },
  TRANSACTION_REPORTS: {
    LIST: '/transactionReports/detailedReports',
    DETAILS: '/transactionReports/roundDetails',
  },
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const
