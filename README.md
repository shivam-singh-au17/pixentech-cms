# Pixen Tech CMS - Gaming Analytics Admin Panel

A modern, fully functional React-based Admin Panel for gaming analytics and content management, built with TypeScript, TanStack Query, and best practices for scalability and maintainability.

## 🚀 Features

- **Modern Tech Stack**: React 18+, TypeScript, Vite, TanStack Query
- **State Management**: Redux Toolkit with persistence
- **Data Fetching**: TanStack Query for optimized API calls with caching
- **Routing**: React Router v6+ with protected routes
- **UI Components**: ShadCN/UI with Tailwind CSS
- **Animations**: Framer Motion for smooth transitions
- **Form Handling**: React Hook Form with Zod validation
- **Dark/Light Theme**: Toggle with system preference support
- **Responsive Design**: Mobile-first approach
- **Authentication**: JWT-based with automatic token management
- **Gaming Analytics**: Real-time dashboard with comprehensive reporting
- **Manual Refresh**: One-click data refresh buttons across all dashboard and summary pages

## 📁 Project Architecture

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (ShadCN/UI)
│   ├── layout/          # Layout components (sidebar, header)
│   ├── dashboard/       # Dashboard-specific components
│   ├── summary/         # Summary report components
│   ├── charts/          # Chart components for analytics
│   └── auth/            # Authentication components
├── hooks/               # Custom hooks
│   ├── queries/         # TanStack Query hooks
│   └── useGames.ts      # Game management hooks
├── lib/                 # Utilities & API layer
│   ├── api/             # API services and configuration
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Helper functions
├── pages/               # Route pages
│   ├── summary/         # Summary report pages
│   └── dashboard.tsx    # Main dashboard page
├── store/               # Redux store configuration
│   └── slices/          # Redux slices (auth, games, UI)
├── routes/              # Route definitions and guards
└── styles/              # Tailwind config and global styles
```

## 🛠️ Core Technologies

### Frontend Framework

- **React 18+** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **ShadCN/UI** for consistent, accessible components

### State Management

- **Redux Toolkit** for global state management
- **Redux Persist** for state persistence
- **TanStack Query** for server state and caching

### Data Fetching & Caching

- **TanStack Query v5.17.1** for optimized API calls
- Smart caching with automatic background updates
- Retry logic with exponential backoff
- Loading states and error handling

## 🔐 Authentication System

### JWT-Based Authentication

- Automatic token injection in API requests
- Token refresh handling
- Protected route guards
- Persistent authentication state

### API Client Features

```typescript
// Automatic token management
apiClient.setTokens(accessToken, refreshToken)
apiClient.clearTokens()

// All API calls automatically include Authorization headers
const response = await getDashboardData(filters)
```

## 📊 Gaming Analytics Features

### Dashboard Analytics

- **Real-time Data**: Live gaming metrics and KPIs
- **Interactive Charts**: Hourly bets, GGR, turnover analytics
- **Operator Insights**: Performance by brand and operator
- **Player Analytics**: Unique player tracking and behavior
- **Game Performance**: Game-specific analytics and trends

### Summary Reports

- **Daily Summary**: Aggregated daily gaming data
- **Game Summary**: Game-level performance metrics
- **Player Summary**: Player-level analytics and insights
- **Player-Game Summary**: Combined player-game analytics

## 🔄 TanStack Query Implementation

### Query Organization

```typescript
// Query keys factory for consistent caching
export const summaryQueryKeys = {
  all: ['summary'] as const,
  dailySummary: filters => [...summaryQueryKeys.all, 'daily', filters],
  gameSummary: filters => [...summaryQueryKeys.all, 'game', filters],
  // ...
}

export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  chartData: filters => [...dashboardQueryKeys.all, 'chartData', filters],
}
```

### Custom Query Hooks

```typescript
// Summary reports with 5-minute cache
export const useDailySummary = (filters: DailySummaryFilter) => {
  return useQuery({
    queryKey: summaryQueryKeys.dailySummary(filters),
    queryFn: () => getDailySummary(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
    retry: 2,
  })
}

// Dashboard with 2-minute cache for real-time feel
export const useDashboardChartData = (filters: DashboardFilter) => {
  return useQuery({
    queryKey: dashboardQueryKeys.chartData(filters),
    queryFn: () => getDashboardChartData(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: keepPreviousData,
    retry: 2,
  })
}
```

### Utility Hooks

```typescript
// Consistent data access pattern
export const useSummaryData = (queryResult, pageSize = 50) => {
  return {
    data: queryResult.data?.data || [],
    totalPages: queryResult.data ? Math.ceil(queryResult.data.limit / pageSize) : 1,
    isLoading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    error: queryResult.error,
  }
}
```

## 🔐 Authentication & State Management

### Authentication-Aware Queries

All API queries are protected with authentication checks to prevent unauthorized calls:

```typescript
// Reactive authentication hook
const useAuthReady = () => {
  const { isAuthenticated, token } = useAppSelector(state => state.auth)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (isAuthenticated && token) {
      // Small delay ensures API client is updated by AuthInitializer
      const timer = setTimeout(() => setIsReady(true), 100)
      return () => clearTimeout(timer)
    } else {
      setIsReady(false)
    }
  }, [isAuthenticated, token])

  return isReady
}

// Protected query example
export const useDailySummary = (filters: DailySummaryFilter) => {
  const isAuthReady = useAuthReady()

  return useQuery({
    queryKey: summaryQueryKeys.dailySummary(filters),
    queryFn: () => getDailySummary(filters),
    enabled: isAuthReady, // Only runs when authenticated
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}
```

### Key Authentication Features

- **Reactive State**: Authentication checks react to Redux state changes
- **Page Refresh Support**: Queries automatically execute after page refresh
- **Token Management**: Automatic token setting in API client via AuthInitializer
- **Error Prevention**: No unauthorized API calls, eliminating 401 errors
- **Seamless UX**: No manual navigation required to trigger data loading

## 🌐 API Integration

### API Layer Structure

```
src/lib/api/
├── config.ts          # API endpoints and configuration
├── client.ts          # HTTP client with interceptors
├── auth.ts            # Authentication service
├── dashboard.ts       # Dashboard data service
├── summary.ts         # Summary reports service
└── types/             # API type definitions
```

### Base Configuration

- **Base URL**: `https://be.pixentech.com/bo/cms`
- **Authentication**: Bearer token in Authorization header
- **Error Handling**: Global error interceptors
- **Retry Logic**: Automatic retries with exponential backoff

### API Services

```typescript
// Dashboard API
export const getDashboardChartData = async (filters: DashboardFilter) => {
  // Automatic authentication headers
  const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.CHART_DATA, filters)
  return response
}

// Summary APIs
export const getDailySummary = async (filters: DailySummaryFilter) => {
  const response = await apiClient.get(API_ENDPOINTS.REPORTS.DAILY_SUMMARY, filters)
  return response
}
```

## 🎨 UI Components & Styling

### Design System

- **Tailwind CSS** for utility-first styling
- **CSS Variables** for theme management
- **Dark/Light Mode** with system preference detection
- **Responsive Design** with mobile-first approach

### Component Library

- **ShadCN/UI** for base components
- **Custom Components** for gaming-specific UI
- **Chart Components** for data visualization
- **Form Components** with validation

### Theme Configuration

```typescript
// Dark/Light theme support
const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('system')

// CSS variables for consistent theming
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  // ...
}
```

## 🧭 Routing & Navigation

### Route Structure

```typescript
// Protected routes with authentication guards
const protectedRoutes = [
  { path: '/', element: <Dashboard /> },
  { path: '/summary/daily', element: <DailySummaryPage /> },
  { path: '/summary/game', element: <GameSummaryPage /> },
  { path: '/summary/player', element: <PlayerSummaryPage /> },
  { path: '/summary/player-game', element: <PlayerGameSummaryPage /> },
]

// Public routes with redirect logic
const publicRoutes = [
  { path: '/login', element: <LoginPage /> },
]
```

### Navigation Features

- **Protected Routes**: Authentication guards
- **Sidebar Navigation**: Collapsible with dark mode support
- **Breadcrumbs**: Dynamic breadcrumb navigation
- **Mobile Navigation**: Responsive hamburger menu

## 📱 Responsive Design

### Breakpoint Strategy

- **Mobile**: 320px - 768px (single column)
- **Tablet**: 768px - 1024px (adaptive layout)
- **Desktop**: 1024px+ (full sidebar and multi-column)

### Mobile Optimizations

- Touch-friendly interactions
- Collapsible navigation
- Swipe gestures for charts
- Optimized table layouts

## 🔧 Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pixen-tech-cms-fe

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Scripts

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\""
}
```

## 🏗️ Key Features Implementation

### 1. Dashboard Page (`/`)

- **Real-time Analytics**: Live gaming metrics with auto-refresh
- **Interactive Charts**: Hourly trends for bets, GGR, and turnover
- **Performance Metrics**: KPI cards with trend indicators
- **Operator Analysis**: Brand and operator performance comparison
- **Player Insights**: Unique player tracking and behavior analytics
- **Game Selection**: Detailed analytics for specific games

### 2. Summary Reports (`/summary/*`)

- **Daily Summary**: Aggregated daily gaming data with filtering
- **Game Summary**: Game-level performance with sorting and pagination
- **Player Summary**: Player analytics with search and filters
- **Player-Game Summary**: Combined player-game performance metrics
- **Export Functionality**: CSV/Excel export for all reports
- **Advanced Filtering**: Date ranges, platforms, operators, brands

### 3. Authentication System

- **JWT Authentication**: Secure token-based authentication
- **Auto-login**: Remember user sessions
- **Token Refresh**: Automatic token renewal
- **Protected Routes**: Route guards for authenticated access

## 🎯 Performance Optimizations

### TanStack Query Benefits

- **Smart Caching**: Reduces redundant API calls
- **Background Updates**: Keeps data fresh automatically
- **Placeholder Data**: Smooth transitions between states
- **Retry Logic**: Handles network failures gracefully
- **Loading States**: Consistent loading indicators

### Code Splitting

- Route-based code splitting
- Lazy loading for heavy components
- Optimized bundle sizes

### Caching Strategy

- **Dashboard**: 2-minute cache for real-time feel
- **Summary Reports**: 5-minute cache for performance
- **Games Data**: 12-hour cache with Redis-like behavior

## 🔮 Architecture Benefits

### Scalability

- Feature-based folder structure
- Modular component architecture
- Centralized state management
- Type-safe API layer

### Maintainability

- Consistent code patterns
- Comprehensive TypeScript coverage
- Automated formatting and linting
- Component reusability

### Performance

- Optimized bundle sizes
- Smart caching strategies
- Efficient re-rendering
- Mobile-optimized interactions

## 📚 Usage Examples

### Adding New Summary Reports

```typescript
// 1. Define query key
export const summaryQueryKeys = {
  newReport: filters => [...summaryQueryKeys.all, 'newReport', filters],
}

// 2. Create query hook
export const useNewReport = (filters: NewReportFilter) => {
  return useQuery({
    queryKey: summaryQueryKeys.newReport(filters),
    queryFn: () => getNewReport(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

// 3. Use in component
const { data, isLoading } = useNewReport(filters)
```

### Adding New Dashboard Widgets

```typescript
// 1. Create component
const NewWidget = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Metric</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Widget content */}
      </CardContent>
    </Card>
  )
}

// 2. Add to dashboard
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <NewWidget data={dashboardData.newMetric} />
</div>
```

This documentation provides a comprehensive overview of the Pixen Tech CMS Gaming Analytics Admin Panel, focusing on architecture, implementation patterns, and usage guidelines for future development and maintenance.
