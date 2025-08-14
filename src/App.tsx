import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { store, persistor } from '@/store'
import { router } from '@/routes'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthInitializer } from '@/components/auth/auth-initializer'
import '@/styles/globals.css'

// Create a client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors (401/403)
        if (error?.status === 401 || error?.status === 403) {
          return false
        }
        // Retry up to 2 times for other errors
        return failureCount < 2
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <AuthInitializer>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme='system' storageKey='theme'>
              <RouterProvider router={router} />
              <ReactQueryDevtools initialIsOpen={false} />
            </ThemeProvider>
          </QueryClientProvider>
        </AuthInitializer>
      </PersistGate>
    </Provider>
  )
}

export default App
