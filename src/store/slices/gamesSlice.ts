import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { getOperatorGameList } from '@/lib/api/dashboard'

// Game interface
export interface Game {
  _id: string
  platform: string
  operator: string
  brand: string
  isActive: boolean
  gameMode?: string
  gameName: string
  gameAlias: string
  launchPath: string
  icon: string
  gameType: string
  minBet?: number
  maxBet?: number
  defaultBet?: number
  homeURL?: string
}

// Filter option interface for dropdowns
export interface GameFilterOption {
  id: string
  label: string
}

// Games state interface
export interface GamesState {
  // Raw game data
  games: Game[]

  // Processed filter options
  gameOptions: GameFilterOption[]
  platformOptions: GameFilterOption[]
  operatorOptions: GameFilterOption[]
  brandOptions: GameFilterOption[]

  // Loading and error states
  loading: boolean
  error: string | null
  lastFetched: number | null

  // Cache validity (12 hours in milliseconds)
  cacheTimeout: number
}

const initialState: GamesState = {
  games: [],
  gameOptions: [],
  platformOptions: [],
  operatorOptions: [],
  brandOptions: [],
  loading: false,
  error: null,
  lastFetched: null,
  cacheTimeout: 12 * 60 * 60 * 1000, // 12 hours
}

// Async thunk to fetch games list
export const fetchGamesList = createAsyncThunk(
  'games/fetchGamesList',
  async (
    params: {
      limit?: number
      page?: number
      platform?: string
      operator?: string
      brand?: string
      isActive?: boolean
      forceRefresh?: boolean
    } = {}
  ) => {
    const response = await getOperatorGameList({
      limit: params.limit || 500,
      page: params.page || 1,
      platform: params.platform,
      operator: params.operator,
      brand: params.brand,
      isActive: params.isActive,
    })
    return response
  }
)

// Helper function to extract unique options
const extractUniqueOptions = (games: Game[], field: keyof Game): GameFilterOption[] => {
  const uniqueValues = Array.from(new Set(games.map(game => game[field] as string)))
    .filter(Boolean)
    .sort()

  return uniqueValues.map(value => ({
    id: value,
    label: value,
  }))
}

export const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    // Clear games data
    clearGames: state => {
      state.games = []
      state.gameOptions = []
      state.platformOptions = []
      state.operatorOptions = []
      state.brandOptions = []
      state.lastFetched = null
      state.error = null
    },

    // Clear error
    clearError: state => {
      state.error = null
    },

    // Set cache timeout
    setCacheTimeout: (state, action: PayloadAction<number>) => {
      state.cacheTimeout = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchGamesList.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGamesList.fulfilled, (state, action) => {
        state.loading = false
        state.games = action.payload.data
        state.lastFetched = Date.now()
        state.error = null

        // Process and create filter options
        const games = action.payload.data

        // Game options (id: gameAlias, label: gameName)
        state.gameOptions = games
          .map(game => ({
            id: game.gameAlias,
            label: game.gameName,
          }))
          .filter((game, index, self) => index === self.findIndex(g => g.id === game.id))
          .sort((a, b) => a.label.localeCompare(b.label))

        // Platform options
        state.platformOptions = extractUniqueOptions(games, 'platform')

        // Operator options
        state.operatorOptions = extractUniqueOptions(games, 'operator')

        // Brand options
        state.brandOptions = extractUniqueOptions(games, 'brand')
      })
      .addCase(fetchGamesList.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch games list'
      })
  },
})

export const { clearGames, clearError, setCacheTimeout } = gamesSlice.actions

// Selectors
export const selectGamesState = (state: { games: GamesState }) => state.games
export const selectGames = (state: { games: GamesState }) => state.games.games
export const selectGameOptions = (state: { games: GamesState }) => state.games.gameOptions
export const selectPlatformOptions = (state: { games: GamesState }) => state.games.platformOptions
export const selectOperatorOptions = (state: { games: GamesState }) => state.games.operatorOptions
export const selectBrandOptions = (state: { games: GamesState }) => state.games.brandOptions
export const selectGamesLoading = (state: { games: GamesState }) => state.games.loading
export const selectGamesError = (state: { games: GamesState }) => state.games.error

// Selector to check if data is stale
export const selectIsDataStale = (state: { games: GamesState }) => {
  const { lastFetched, cacheTimeout } = state.games
  if (!lastFetched) return true
  return Date.now() - lastFetched > cacheTimeout
}

// Selector to check if data should be fetched
export const selectShouldFetchGames = (state: { games: GamesState }) => {
  const gamesState = state.games
  return gamesState.games.length === 0 || selectIsDataStale(state) || gamesState.error !== null
}

export default gamesSlice.reducer
