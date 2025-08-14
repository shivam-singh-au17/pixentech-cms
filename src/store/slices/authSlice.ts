import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authService, apiClient, LoginRequest, ApiException } from '@/lib/api'

export interface User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
  isActive?: boolean
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      return response
    } catch (error) {
      if (error instanceof ApiException) {
        return rejectWithValue({
          message: error.message,
          status: error.status,
          code: error.code,
        })
      }
      return rejectWithValue({
        message: error instanceof Error ? error.message : 'Login failed',
        status: 0,
      })
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await authService.logout()
  } catch (error) {
    console.warn('Logout API call failed:', error)
    // Don't reject on logout failure
  }
})

export const refreshAuthToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken()
      return response
    } catch (error) {
      if (error instanceof ApiException) {
        return rejectWithValue({
          message: error.message,
          status: error.status,
          code: error.code,
        })
      }
      return rejectWithValue({
        message: error instanceof Error ? error.message : 'Token refresh failed',
        status: 0,
      })
    }
  }
)

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getProfile()
      return user
    } catch (error) {
      if (error instanceof ApiException) {
        return rejectWithValue({
          message: error.message,
          status: error.status,
          code: error.code,
        })
      }
      return rejectWithValue({
        message: error instanceof Error ? error.message : 'Failed to fetch profile',
        status: 0,
      })
    }
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous actions
    logout: state => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
      // Clear tokens from API client
      apiClient.clearTokens()
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    clearError: state => {
      state.error = null
    },
    // Action to restore auth state from storage
    restoreAuth: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken: string }>
    ) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
      // Set tokens in API client
      apiClient.setTokens(action.payload.token, action.payload.refreshToken)
    },
  },
  extraReducers: builder => {
    // Login
    builder
      .addCase(loginUser.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.isAuthenticated = true
        state.error = null
        // Set tokens in API client
        apiClient.setTokens(action.payload.token, action.payload.refreshToken)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.error = (action.payload as any)?.message || 'Login failed'
        // Clear tokens from API client
        apiClient.clearTokens()
      })

    // Logout
    builder.addCase(logoutUser.fulfilled, state => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
      // Clear tokens from API client
      apiClient.clearTokens()
    })

    // Refresh Token
    builder
      .addCase(refreshAuthToken.pending, state => {
        state.isLoading = true
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.isLoading = false
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.error = null
        // Set tokens in API client
        apiClient.setTokens(action.payload.token, action.payload.refreshToken || '')
      })
      .addCase(refreshAuthToken.rejected, (state, action) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.error = (action.payload as any)?.message || 'Session expired'
        // Clear tokens from API client
        apiClient.clearTokens()
      })

    // Fetch Profile
    builder
      .addCase(fetchUserProfile.pending, state => {
        state.isLoading = true
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || 'Failed to fetch profile'
      })
  },
})

export const { logout, updateUser, clearError, restoreAuth } = authSlice.actions

export default authSlice.reducer
