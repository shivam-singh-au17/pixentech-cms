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

// Create store
export const store = configureStore({
  reducer: {
    auth: persistReducer<AuthState>(authPersistConfig, authSlice.reducer),
    items: itemsSlice.reducer,
    ui: persistReducer<UiState>(uiPersistConfig, uiSlice.reducer),
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
