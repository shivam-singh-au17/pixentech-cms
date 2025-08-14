/**
 * Enhanced Dashboard Stats Component
 * Comprehensive stats display with all available metrics
 */

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Target,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Percent,
  Award,
  Activity,
} from 'lucide-react'
import { formatCurrency, commaSeparated, setNumberFormat } from '@/lib/utils/dashboard'

interface EnhancedStatsData {
  uniqueUsers: number
  betCount: number
  turnOver: number
  wonAmount: number
  ggr: number
  ggrInPercentage: number
  // Additional metrics from the full data response
  totalBrands?: number
  totalGames?: number
  avgBetSize?: number
  winRate?: number
  marginTotal?: number
}

interface EnhancedDashboardStatsProps {
  data: EnhancedStatsData
  currency: string
  selectedGameData?: {
    gameAlias: string
    betCounts: number
    betAmount: number
    winAmount: number
    margin: number
  } | null
}

export function EnhancedDashboardStats({
  data,
  currency,
  selectedGameData,
}: EnhancedDashboardStatsProps) {
  // Calculate derived metrics
  const avgBetSize = data.betCount > 0 ? data.turnOver / data.betCount : 0
  const winRate = data.turnOver > 0 ? (data.wonAmount / data.turnOver) * 100 : 0
  const marginPercentage = data.ggrInPercentage

  const mainStats = [
    {
      title: 'Unique Players',
      value: commaSeparated(data.uniqueUsers),
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      description: 'Active users',
      trend: null,
    },
    {
      title: 'Total Bets',
      value: commaSeparated(data.betCount),
      icon: Target,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      description: 'Bet count',
      trend: null,
    },
    {
      title: 'Turnover',
      value: formatCurrency(data.turnOver, currency),
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      description: 'Total volume',
      trend: null,
    },
    {
      title: 'Won Amount',
      value: formatCurrency(data.wonAmount, currency),
      icon: Award,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      description: 'Player winnings',
      trend: null,
    },
    {
      title: 'GGR',
      value: formatCurrency(data.ggr, currency),
      icon: data.ggr >= 0 ? TrendingUp : TrendingDown,
      color:
        data.ggr >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      bgColor:
        data.ggr >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30',
      description: 'Gross gaming revenue',
      trend: `${setNumberFormat(marginPercentage, 2)}%`,
    },
    {
      title: 'Avg Bet Size',
      value: formatCurrency(avgBetSize, currency),
      icon: BarChart3,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      description: 'Per bet average',
      trend: null,
    },
  ]

  const performanceStats = [
    {
      title: 'Win Rate',
      value: `${setNumberFormat(winRate, 2)}%`,
      icon: Percent,
      color:
        winRate >= 50 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400',
      bgColor:
        winRate >= 50 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30',
      description: 'Player win percentage',
    },
    {
      title: 'Margin',
      value: `${setNumberFormat(marginPercentage, 2)}%`,
      icon: marginPercentage >= 0 ? TrendingUp : TrendingDown,
      color:
        marginPercentage >= 0
          ? 'text-green-600 dark:text-green-400'
          : 'text-red-600 dark:text-red-400',
      bgColor:
        marginPercentage >= 0
          ? 'bg-green-100 dark:bg-green-900/30'
          : 'bg-red-100 dark:bg-red-900/30',
      description: 'House edge',
    },
    {
      title: 'Activity Score',
      value: data.betCount > 1000 ? 'High' : data.betCount > 500 ? 'Medium' : 'Low',
      icon: Activity,
      color:
        data.betCount > 1000
          ? 'text-green-600 dark:text-green-400'
          : data.betCount > 500
            ? 'text-yellow-600 dark:text-yellow-400'
            : 'text-red-600 dark:text-red-400',
      bgColor:
        data.betCount > 1000
          ? 'bg-green-100 dark:bg-green-900/30'
          : data.betCount > 500
            ? 'bg-yellow-100 dark:bg-yellow-900/30'
            : 'bg-red-100 dark:bg-red-900/30',
      description: 'Platform activity level',
    },
  ]

  return (
    <div className='space-y-6'>
      {/* Selected Game Stats (if any) */}
      {selectedGameData && (
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <h3 className='text-lg font-semibold'>Game Analytics</h3>
            <Badge variant='default' className='bg-primary/10 text-primary border-primary/20'>
              {selectedGameData.gameAlias}
            </Badge>
          </div>

          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
            <Card className='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700'>
              <CardContent className='p-3 sm:p-4'>
                <div className='flex items-center gap-2 sm:gap-3'>
                  <div className='h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-blue-200 dark:bg-blue-800 flex items-center justify-center'>
                    <Target className='h-4 w-4 sm:h-5 sm:w-5 text-blue-700 dark:text-blue-300' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-xs sm:text-sm font-medium text-muted-foreground'>
                      Game Bets
                    </p>
                    <p className='text-lg sm:text-xl font-bold truncate text-foreground'>
                      {commaSeparated(selectedGameData.betCounts)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700'>
              <CardContent className='p-3 sm:p-4'>
                <div className='flex items-center gap-2 sm:gap-3'>
                  <div className='h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-purple-200 dark:bg-purple-800 flex items-center justify-center'>
                    <DollarSign className='h-4 w-4 sm:h-5 sm:w-5 text-purple-700 dark:text-purple-300' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-xs sm:text-sm font-medium text-muted-foreground'>
                      Game Turnover
                    </p>
                    <p className='text-lg sm:text-xl font-bold truncate text-foreground'>
                      {formatCurrency(selectedGameData.betAmount, currency)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700'>
              <CardContent className='p-3 sm:p-4'>
                <div className='flex items-center gap-2 sm:gap-3'>
                  <div className='h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-orange-200 dark:bg-orange-800 flex items-center justify-center'>
                    <Award className='h-4 w-4 sm:h-5 sm:w-5 text-orange-700 dark:text-orange-300' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-xs sm:text-sm font-medium text-muted-foreground'>
                      Game Winnings
                    </p>
                    <p className='text-lg sm:text-xl font-bold truncate text-foreground'>
                      {formatCurrency(selectedGameData.winAmount, currency)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-gradient-to-br ${selectedGameData.margin >= 0 ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700' : 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700'}`}
            >
              <CardContent className='p-3 sm:p-4'>
                <div className='flex items-center gap-2 sm:gap-3'>
                  <div
                    className={`h-8 w-8 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center ${selectedGameData.margin >= 0 ? 'bg-green-200 dark:bg-green-800' : 'bg-red-200 dark:bg-red-800'}`}
                  >
                    {selectedGameData.margin >= 0 ? (
                      <TrendingUp
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${selectedGameData.margin >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}
                      />
                    ) : (
                      <TrendingDown className='h-4 w-4 sm:h-5 sm:w-5 text-red-700 dark:text-red-300' />
                    )}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-xs sm:text-sm font-medium text-muted-foreground'>
                      Game Margin
                    </p>
                    <p className='text-lg sm:text-xl font-bold truncate text-foreground'>
                      {setNumberFormat(selectedGameData.margin, 2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Main Platform Stats */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Platform Overview</h3>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
          {mainStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className='bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-md hover:shadow-lg transition-all duration-200'
              >
                <CardContent className='p-4'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={`h-10 w-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-xs font-medium text-muted-foreground truncate'>
                        {stat.title}
                      </p>
                      <p className='text-lg font-bold truncate text-foreground'>{stat.value}</p>
                      {stat.trend && (
                        <Badge variant='outline' className='text-xs mt-1'>
                          {stat.trend}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Performance Metrics</h3>
        <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          {performanceStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className='bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-md hover:shadow-lg transition-all duration-200'
              >
                <CardContent className='p-4 sm:p-6'>
                  <div className='flex items-center gap-3 sm:gap-4'>
                    <div
                      className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-xs sm:text-sm font-medium text-muted-foreground'>
                        {stat.title}
                      </p>
                      <p className='text-xl sm:text-2xl font-bold truncate text-foreground'>
                        {stat.value}
                      </p>
                      <p className='text-xs text-muted-foreground mt-1'>{stat.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
