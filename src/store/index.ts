import { configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { authSlice, AuthState } from './slices/authSlice'
import { itemsSlice } from './slices/itemsSlice'
import { uiSlice, UiState } from './slices/uiSlice'
import { gamesSlice, GamesState } from './slices/gamesSlice'
import { platformDataSlice, PlatformDataState } from './slices/platformDataSlice'

// Persist config for auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'refreshToken', 'isAuthenticated'],
}

// Persist config for UI slice
const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['theme', 'sidebarCollapsed'],
}

// Persist config for games slice
const gamesPersistConfig = {
  key: 'games',
  storage,
  whitelist: [
    'games',
    'gameOptions',
    'platformOptions',
    'operatorOptions',
    'brandOptions',
    'lastFetched',
  ],
}

// Persist config for platform data slice
const platformDataPersistConfig = {
  key: 'platformData',
  storage,
  whitelist: [
    'platforms',
    'operators',
    'brands',
    'platformOptions',
    'operatorOptions',
    'brandOptions',
    'lastFetched',
  ],
}

// Create store
export const store = configureStore({
  reducer: {
    auth: persistReducer<AuthState>(authPersistConfig, authSlice.reducer),
    items: itemsSlice.reducer,
    ui: persistReducer<UiState>(uiPersistConfig, uiSlice.reducer),
    games: persistReducer<GamesState>(gamesPersistConfig, gamesSlice.reducer),
    platformData: persistReducer<PlatformDataState>(
      platformDataPersistConfig,
      platformDataSlice.reducer
    ),
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

// Create persistor
export const persistor = persistStore(store)

// Export types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
