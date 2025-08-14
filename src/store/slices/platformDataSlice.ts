import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { platformApi, operatorApi, brandApi } from '@/lib/api/platform-new'
import { DEFAULT_PLATFORM_ID } from '@/lib/constants/platform'
import type { Platform, Operator, Brand } from '@/lib/types/platform-updated'
import type { RootState } from '@/store'

// Filter option interface for dropdowns
export interface FilterOption {
  id: string
  label: string
  value: string
}

// Combined state interface
export interface PlatformDataState {
  // Raw data
  platforms: Platform[]
  operators: Operator[]
  brands: Brand[]

  // Processed filter options
  platformOptions: FilterOption[]
  operatorOptions: FilterOption[]
  brandOptions: FilterOption[]

  // Loading states
  platformsLoading: boolean
  operatorsLoading: boolean
  brandsLoading: boolean

  // Error states
  platformsError: string | null
  operatorsError: string | null
  brandsError: string | null

  // Cache management
  lastFetched: {
    platforms: number | null
    operators: number | null
    brands: number | null
  }

  // Cache validity (30 minutes in milliseconds)
  cacheTimeout: number
}

const initialState: PlatformDataState = {
  platforms: [],
  operators: [],
  brands: [],
  platformOptions: [],
  operatorOptions: [],
  brandOptions: [],
  platformsLoading: false,
  operatorsLoading: false,
  brandsLoading: false,
  platformsError: null,
  operatorsError: null,
  brandsError: null,
  lastFetched: {
    platforms: null,
    operators: null,
    brands: null,
  },
  cacheTimeout: 30 * 60 * 1000, // 30 minutes
}

// Async thunks for data fetching
export const fetchPlatformsList = createAsyncThunk(
  'platformData/fetchPlatforms',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Check authentication before making API call
      const state = getState() as RootState
      const { isAuthenticated, token } = state.auth

      if (!isAuthenticated || !token) {
        console.warn('Cannot fetch platforms: user not authenticated')
        return rejectWithValue('User not authenticated')
      }

      const response = await platformApi.list({
        pageNo: 1,
        pageSize: 100, // Get all platforms for options
        sortDirection: -1,
      })
      return response.platforms || []
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch platforms')
    }
  }
)

export const fetchOperatorsList = createAsyncThunk(
  'platformData/fetchOperators',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Check authentication before making API call
      const state = getState() as RootState
      const { isAuthenticated, token } = state.auth

      if (!isAuthenticated || !token) {
        console.warn('Cannot fetch operators: user not authenticated')
        return rejectWithValue('User not authenticated')
      }

      const response = await operatorApi.list({
        platforms: DEFAULT_PLATFORM_ID, // Default platform ID
        pageNo: 1,
        pageSize: 100,
        sortDirection: -1,
      })
      return response.operators || []
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch operators')
    }
  }
)

export const fetchBrandsList = createAsyncThunk(
  'platformData/fetchBrands',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Check authentication before making API call
      const state = getState() as RootState
      const { isAuthenticated, token } = state.auth

      if (!isAuthenticated || !token) {
        console.warn('Cannot fetch brands: user not authenticated')
        return rejectWithValue('User not authenticated')
      }

      const response = await brandApi.list({
        platforms: DEFAULT_PLATFORM_ID, // Default platform ID
        pageNo: 1,
        pageSize: 100,
        sortDirection: -1,
      })
      return response.brands || []
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch brands')
    }
  }
)

// Helper functions to process data into filter options
const processPlatformsToOptions = (platforms: Platform[]): FilterOption[] => {
  return platforms.map(platform => ({
    id: platform._id,
    label: platform.platformName,
    value: platform._id,
  }))
}

const processOperatorsToOptions = (operators: Operator[]): FilterOption[] => {
  return operators.map(operator => ({
    id: operator._id,
    label: operator.operatorName,
    value: operator._id,
  }))
}

const processBrandsToOptions = (brands: Brand[]): FilterOption[] => {
  return brands.map(brand => ({
    id: brand._id,
    label: brand.brandName,
    value: brand._id,
  }))
}

export const platformDataSlice = createSlice({
  name: 'platformData',
  initialState,
  reducers: {
    clearPlatformsError: state => {
      state.platformsError = null
    },
    clearOperatorsError: state => {
      state.operatorsError = null
    },
    clearBrandsError: state => {
      state.brandsError = null
    },
    clearAllErrors: state => {
      state.platformsError = null
      state.operatorsError = null
      state.brandsError = null
    },
    setCacheTimeout: (state, action: PayloadAction<number>) => {
      state.cacheTimeout = action.payload
    },
    clearAllData: state => {
      state.platforms = []
      state.operators = []
      state.brands = []
      state.platformOptions = []
      state.operatorOptions = []
      state.brandOptions = []
      state.lastFetched = {
        platforms: null,
        operators: null,
        brands: null,
      }
    },
  },
  extraReducers: builder => {
    // Platforms
    builder
      .addCase(fetchPlatformsList.pending, state => {
        state.platformsLoading = true
        state.platformsError = null
      })
      .addCase(fetchPlatformsList.fulfilled, (state, action) => {
        state.platformsLoading = false
        state.platforms = action.payload
        state.platformOptions = processPlatformsToOptions(action.payload)
        state.lastFetched.platforms = Date.now()
      })
      .addCase(fetchPlatformsList.rejected, (state, action) => {
        state.platformsLoading = false
        state.platformsError = action.payload as string
      })

    // Operators
    builder
      .addCase(fetchOperatorsList.pending, state => {
        state.operatorsLoading = true
        state.operatorsError = null
      })
      .addCase(fetchOperatorsList.fulfilled, (state, action) => {
        state.operatorsLoading = false
        state.operators = action.payload
        state.operatorOptions = processOperatorsToOptions(action.payload)
        state.lastFetched.operators = Date.now()
      })
      .addCase(fetchOperatorsList.rejected, (state, action) => {
        state.operatorsLoading = false
        state.operatorsError = action.payload as string
      })

    // Brands
    builder
      .addCase(fetchBrandsList.pending, state => {
        state.brandsLoading = true
        state.brandsError = null
      })
      .addCase(fetchBrandsList.fulfilled, (state, action) => {
        state.brandsLoading = false
        state.brands = action.payload
        state.brandOptions = processBrandsToOptions(action.payload)
        state.lastFetched.brands = Date.now()
      })
      .addCase(fetchBrandsList.rejected, (state, action) => {
        state.brandsLoading = false
        state.brandsError = action.payload as string
      })
  },
})

export const {
  clearPlatformsError,
  clearOperatorsError,
  clearBrandsError,
  clearAllErrors,
  setCacheTimeout,
  clearAllData,
} = platformDataSlice.actions

// Selectors
export const selectPlatforms = (state: any) => state.platformData.platforms

export const selectOperators = (state: any) => state.platformData.operators

export const selectBrands = (state: any) => state.platformData.brands

export const selectPlatformOptions = (state: any) => state.platformData.platformOptions

export const selectOperatorOptions = (state: any) => state.platformData.operatorOptions

export const selectBrandOptions = (state: any) => state.platformData.brandOptions

export const selectPlatformsLoading = (state: any) => state.platformData.platformsLoading

export const selectOperatorsLoading = (state: any) => state.platformData.operatorsLoading

export const selectBrandsLoading = (state: any) => state.platformData.brandsLoading

export const selectPlatformsError = (state: any) => state.platformData.platformsError

export const selectOperatorsError = (state: any) => state.platformData.operatorsError

export const selectBrandsError = (state: any) => state.platformData.brandsError

// Cache validity selectors
export const selectShouldFetchPlatforms = (state: any) => {
  const { platforms, lastFetched, cacheTimeout } = state.platformData
  if (platforms.length === 0) return true
  if (!lastFetched.platforms) return true
  return Date.now() - lastFetched.platforms > cacheTimeout
}

export const selectShouldFetchOperators = (state: any) => {
  const { operators, lastFetched, cacheTimeout } = state.platformData
  if (operators.length === 0) return true
  if (!lastFetched.operators) return true
  return Date.now() - lastFetched.operators > cacheTimeout
}

export const selectShouldFetchBrands = (state: any) => {
  const { brands, lastFetched, cacheTimeout } = state.platformData
  if (brands.length === 0) return true
  if (!lastFetched.brands) return true
  return Date.now() - lastFetched.brands > cacheTimeout
}

export default platformDataSlice.reducer
