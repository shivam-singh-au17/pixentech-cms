/**
 * Enhanced Dashboard Page
 * Comprehensive dashboard with game-specific analytics and interactive features
 * Now using TanStack Query for optimized data fetching
 */

import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'
import { useGames } from '@/hooks/useGames'
import {
  useDashboardChartData,
  useDashboardData,
  useWinnersReport,
  useContributorsReport,
} from '@/hooks/queries/useSummaryQueries'
import { DashboardFilters } from '@/components/dashboard/dashboard-filters'
import { EnhancedDashboardStats } from '@/components/dashboard/enhanced-dashboard-stats'
import { UnifiedAnalysis } from '@/components/dashboard/unified-analysis'
import { GameSpecificAnalytics } from '@/components/dashboard/game-specific-analytics'
import { BarChart } from '@/components/charts/bar-chart'
import { AreaChart } from '@/components/charts/area-chart'
import { HorizontalBarChart } from '@/components/charts/horizontal-bar-chart'
import { TurnoverByOperatorChart } from '@/components/charts/turnover-by-operator'
import { Button } from '@/components/ui/button'
import { type DashboardFilter } from '@/lib/api/dashboard'
import {
  formatCurrency,
  processHourlyData,
  groupUniquePlayersByBrand,
  processTurnoverByOperator,
} from '@/lib/utils/dashboard'

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function Dashboard() {
  const { user, token, isAuthenticated } = useAppSelector(state => state.auth)
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  // Use games hook for game options
  const { gameOptions } = useGames()

  // Helper function to get current day start and end times
  const getCurrentDayRange = () => {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    return { startOfDay, endOfDay }
  }

  const { startOfDay, endOfDay } = getCurrentDayRange()

  const [filters, setFilters] = useState<DashboardFilter & { externalPlayerId: string }>({
    startDate: startOfDay, // Current day start time (00:00:00)
    endDate: endOfDay, // Current day end time (23:59:59)
    currency: 'INR',
    gameAlias: 'ALL',
    externalPlayerId: '',
  })

  // Debounce the player ID filter with longer delay to reduce API calls
  const debouncedPlayerId = useDebounce(filters.externalPlayerId, 1000)

  // Create filter params for the query
  const queryFilters: DashboardFilter = {
    startDate: filters.startDate,
    endDate: filters.endDate,
    currency: filters.currency,
    gameAlias: filters.gameAlias !== 'ALL' ? filters.gameAlias : undefined,
    externalPlayerId: debouncedPlayerId || undefined,
  }

  // TanStack Query for dashboard data
  const dashboardQuery = useDashboardChartData(queryFilters)
  const {
    data: dashboardData,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useDashboardData(dashboardQuery)

  // TanStack Query for Winners and Contributors data
  const winnersQuery = useWinnersReport(queryFilters)
  const contributorsQuery = useContributorsReport(queryFilters)

  // Refresh handler for manual data refresh
  const handleRefresh = async () => {
    await refetch()
    await winnersQuery.refetch()
    await contributorsQuery.refetch()
  }

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  // Reset filters to default values
  const handleResetFilters = () => {
    const { startOfDay, endOfDay } = getCurrentDayRange()
    setFilters({
      startDate: startOfDay,
      endDate: endOfDay,
      currency: 'INR',
      gameAlias: 'ALL',
      externalPlayerId: '',
    })
  }

  // Simple authentication check - TanStack Query handles the rest
  useEffect(() => {
    if (!isAuthenticated || !token) {
      console.log('Dashboard: Not authenticated or no token')
      return
    }

    // TanStack Query will automatically handle the API calls
    console.log('Dashboard: Authenticated with token, queries will run automatically')
  }, [isAuthenticated, token])

  if (!isAuthenticated) {
    return (
      <div className='flex flex-col items-center justify-center h-96 space-y-4'>
        <p className='text-muted-foreground'>Please log in to view the dashboard</p>
        <p className='text-sm text-muted-foreground'>
          Authentication status: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
        </p>
        <p className='text-sm text-muted-foreground'>User: {user ? user.email : 'No user'}</p>
        <p className='text-sm text-muted-foreground'>Token: {token ? 'Present' : 'Missing'}</p>
      </div>
    )
  }

  if (loading && !dashboardData) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></div>
      </div>
    )
  }

  if (isError && error) {
    return (
      <div className='flex flex-col items-center justify-center h-96 space-y-4'>
        <p className='text-red-600'>Error: {error.message || 'Failed to load dashboard data'}</p>
        <Button onClick={handleRefresh} className='flex items-center gap-2'>
          <RefreshCw className='h-4 w-4' />
          Retry
        </Button>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className='flex items-center justify-center h-96'>
        <p className='text-muted-foreground'>No data available</p>
      </div>
    )
  }

  // Process data for charts
  console.log('Processing data for charts. Dashboard data:', dashboardData)

  const betsData = processHourlyData(dashboardData.betsGGRTurnOver, 'betCounts')
  const ggrData = processHourlyData(dashboardData.betsGGRTurnOver, 'ggr')
  const turnoverData = processHourlyData(dashboardData.betsGGRTurnOver, 'betAmount')

  console.log('Processed chart data:', { betsData, ggrData, turnoverData })

  const uniqueUsersByBrand = groupUniquePlayersByBrand(dashboardData.uniquePlayers.data)
  const turnoverByOperator = processTurnoverByOperator(dashboardData.turnOverByOperator)

  console.log('Processed brand data:', { uniqueUsersByBrand, turnoverByOperator })

  // Prepare stats data
  console.log('Raw dashboard data for stats:', {
    betCounts: dashboardData.generic.betCounts,
    betAmount: dashboardData.generic.betAmount,
    winAmount: dashboardData.generic.winAmount,
    ggr: dashboardData.generic.ggr,
    ggrInPercentage: dashboardData.generic.ggrInPercentage,
  })

  const statsData = {
    uniqueUsers: dashboardData.uniquePlayers.uap || 0,
    betCount: dashboardData.generic.betCounts || 0,
    turnOver: dashboardData.generic.betAmount || 0,
    wonAmount: dashboardData.generic.winAmount || 0,
    ggr: dashboardData.generic.ggr || 0,
    ggrInPercentage: dashboardData.generic.ggrInPercentage || 0,
  }

  console.log('Stats data:', statsData)

  // Get selected game data
  const selectedGameData = selectedGame
    ? dashboardData.turnOverByGameAlias.find(game => game.gameAlias === selectedGame)
    : null

  // Get players for selected game - filter by game instead of using externalPlayerId
  const selectedGamePlayerData = selectedGame
    ? dashboardData.turnOverByPlayer.filter(
        player =>
          // Since the API seems to mix player and game data, we'll need to check both fields
          player.externalPlayerId === selectedGame ||
          dashboardData.turnOverByGameAlias.some(
            game => game.gameAlias === selectedGame && player.externalPlayerId
          )
      )
    : []

  // Create game-specific stats when a game is selected
  const gameSpecificStats = selectedGameData
    ? {
        uniqueUsers: selectedGamePlayerData.length,
        betCount: selectedGameData.betCounts,
        turnOver: selectedGameData.betAmount,
        wonAmount: selectedGameData.winAmount,
        ggr: selectedGameData.betAmount - selectedGameData.winAmount,
        ggrInPercentage: selectedGameData.margin,
      }
    : null

  return (
    <div className='bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'>
      <div className='w-full'>
        <div className='space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 lg:p-8'>
          {/* Header Section */}
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4'>
            <div>
              <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent'>
                Gaming Analytics Dashboard
              </h1>
              <p className='text-sm sm:text-base text-muted-foreground mt-1'>
                Real-time insights and performance metrics
              </p>
            </div>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4'>
              {/* Refresh Button */}
              <Button
                onClick={handleRefresh}
                size='sm'
                disabled={loading}
                className='flex items-center gap-1 sm:gap-2 text-xs sm:text-sm w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
              >
                <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className='hidden sm:inline'>
                  {loading ? 'Refreshing...' : 'Refresh Data'}
                </span>
                <span className='sm:hidden'>{loading ? '...' : 'Refresh'}</span>
              </Button>

              {/* Live Data Indicator */}
              <div className='flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground'>
                <div className='h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500 rounded-full animate-pulse'></div>
                <span className='hidden sm:inline'>Live Data</span>
                <span className='sm:hidden'>Live</span>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className='relative'>
            <DashboardFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              gameOptions={gameOptions}
              isLoading={loading}
              onResetFilters={handleResetFilters}
            />
            {loading && (
              <div className='absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10'>
                <div className='flex items-center gap-2 text-xs sm:text-sm text-muted-foreground'>
                  <div className='animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-primary'></div>
                  Updating data...
                </div>
              </div>
            )}
          </div>

          {/* Context Header - Show what data is being displayed */}
          {selectedGame && (
            <div className='bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
                  <span className='text-blue-700 dark:text-blue-300 font-medium'>
                    Viewing Game-Specific Analytics
                  </span>
                </div>
                <div className='text-blue-600 dark:text-blue-400 font-semibold'>{selectedGame}</div>
                <Button
                  onClick={() => setSelectedGame(null)}
                  variant='ghost'
                  size='sm'
                  className='ml-auto text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
                >
                  View Overall Dashboard
                </Button>
              </div>
            </div>
          )}

          {!selectedGame && (
            <div className='bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4'>
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                  <span className='text-green-700 dark:text-green-300 font-medium'>
                    Overall Dashboard View
                  </span>
                </div>
                <span className='text-green-600 dark:text-green-400'>
                  All games and players data
                </span>
              </div>
            </div>
          )}

          {/* Stats Section - Context-aware */}
          <EnhancedDashboardStats
            data={selectedGame && gameSpecificStats ? gameSpecificStats : statsData}
            currency={filters.currency}
            selectedGameData={selectedGameData}
          />

          {/* Main Layout - Single Column with Unified Analysis */}
          <div className='space-y-4 sm:space-y-6'>
            {/* Unified Analysis Component */}
            <UnifiedAnalysis
              gameData={dashboardData.turnOverByGameAlias || []}
              playerData={
                selectedGame ? selectedGamePlayerData : dashboardData.turnOverByPlayer || []
              }
              winnersData={winnersQuery.data || { data: [] }}
              contributorsData={contributorsQuery.data || { data: [] }}
              currency={filters.currency}
              selectedGame={selectedGame}
              onGameSelect={setSelectedGame}
              searchTerm={selectedGame || ''}
            />

            {/* Contextual Content Below */}
            {!selectedGame ? (
              // Overall Dashboard Content
              <div className='space-y-4 sm:space-y-6'>
                {/* Charts Section */}
                <div className='space-y-4 sm:space-y-6 lg:grid lg:gap-4 lg:space-y-0 xl:gap-6 lg:grid-cols-2 xl:grid-cols-3'>
                  <div className='space-y-4 sm:space-y-6 lg:col-span-1 xl:col-span-2 md:grid md:gap-4 md:space-y-0 sm:md:gap-6 md:grid-cols-2'>
                    <div className='w-full'>
                      <AreaChart
                        data={betsData}
                        title='Overall Bets Over Time'
                        color='rgba(59, 130, 246, 0.8)'
                        formatTooltip={value => `${value.toLocaleString()} bets`}
                      />
                    </div>
                    <div className='w-full'>
                      <BarChart
                        data={turnoverData}
                        title='Overall Turnover Over Time'
                        formatTooltip={value => formatCurrency(value, filters.currency)}
                      />
                    </div>
                  </div>
                  <div className='w-full xl:col-span-1'>
                    <AreaChart
                      data={ggrData}
                      title='Overall GGR Over Time'
                      color='rgba(16, 185, 129, 0.8)'
                      formatTooltip={value => formatCurrency(value, filters.currency)}
                    />
                  </div>
                </div>

                {/* Brand Analytics Charts */}
                <div className='space-y-4 sm:space-y-6 md:grid md:gap-4 md:space-y-0 sm:md:gap-6 md:grid-cols-2'>
                  <div className='w-full'>
                    <HorizontalBarChart
                      data={uniqueUsersByBrand}
                      title='Unique Users By Brand'
                      formatTooltip={value => `${value} users`}
                    />
                  </div>
                  <div className='w-full'>
                    <TurnoverByOperatorChart
                      data={turnoverByOperator}
                      title='Turnover by Brand'
                      formatTooltip={value => formatCurrency(value, filters.currency)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              // Game-Specific Content
              <GameSpecificAnalytics
                gameAlias={selectedGame}
                data={{
                  gameData: selectedGameData || {
                    brandName: '',
                    betCounts: 0,
                    betAmount: 0,
                    winAmount: 0,
                    margin: 0,
                    gameAlias: selectedGame,
                  },
                  playerData: selectedGamePlayerData,
                  hourlyData: dashboardData.betsGGRTurnOver,
                }}
                currency={filters.currency}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
