/**
 * Game Specific Analytics Component
 * Detailed analytics for selected game
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Gamepad2,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  BarChart3,
} from 'lucide-react'
import { formatCurrency, commaSeparated, setNumberFormat } from '@/lib/utils/dashboard'

interface GameSpecificData {
  gameData: {
    brandName: string
    betCounts: number
    betAmount: number
    winAmount: number
    margin: number
    gameAlias: string
  }
  playerData: Array<{
    brandName: string
    betCounts: number
    betAmount: number
    winAmount: number
    margin: number
    externalPlayerId: string
    brandId: string
  }>
  hourlyData?: Array<{
    betCounts: number
    updatedAt: string
    betAmount: number
    winAmount: number
    hour: string
    ggr: number
    margin: number
  }>
}

interface GameSpecificAnalyticsProps {
  gameAlias: string
  data: GameSpecificData
  currency: string
}

export function GameSpecificAnalytics({ gameAlias, data, currency }: GameSpecificAnalyticsProps) {
  const { gameData, playerData } = data

  // Calculate aggregated metrics for players playing this game
  const totalPlayers = playerData.length
  const totalPlayerBets = playerData.reduce((sum, player) => sum + player.betCounts, 0)
  const totalPlayerTurnover = playerData.reduce((sum, player) => sum + player.betAmount, 0)
  const totalPlayerWinnings = playerData.reduce((sum, player) => sum + player.winAmount, 0)
  const avgPlayerMargin =
    playerData.length > 0
      ? playerData.reduce((sum, player) => sum + player.margin, 0) / playerData.length
      : 0

  // Calculate game statistics
  const winRate = gameData.betAmount > 0 ? (gameData.winAmount / gameData.betAmount) * 100 : 0
  const avgBetSize = gameData.betCounts > 0 ? gameData.betAmount / gameData.betCounts : 0

  const statCards = [
    {
      title: 'Total Bets',
      value: commaSeparated(gameData.betCounts),
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: null,
    },
    {
      title: 'Total Turnover',
      value: formatCurrency(gameData.betAmount, currency),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: null,
    },
    {
      title: 'Total Winnings',
      value: formatCurrency(gameData.winAmount, currency),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: null,
    },
    {
      title: 'Game Margin',
      value: `${setNumberFormat(gameData.margin, 2)}%`,
      icon: gameData.margin >= 0 ? TrendingUp : TrendingDown,
      color: gameData.margin >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: gameData.margin >= 0 ? 'bg-green-100' : 'bg-red-100',
      change: null,
    },
    {
      title: 'Active Players',
      value: commaSeparated(totalPlayers),
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      change: null,
    },
    {
      title: 'Avg Bet Size',
      value: formatCurrency(avgBetSize, currency),
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: null,
    },
  ]

  return (
    <div className='space-y-6'>
      {/* Game Header */}
      <Card className='bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-lg'>
        <CardHeader>
          <CardTitle className='text-xl font-bold flex items-center gap-3'>
            <div className='h-10 w-10 rounded-full bg-white/20 flex items-center justify-center'>
              <Gamepad2 className='h-6 w-6' />
            </div>
            {gameAlias} Analytics
            <Badge variant='secondary' className='bg-white/20 text-white border-white/30'>
              Detailed View
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Game Statistics Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className='bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-md hover:shadow-lg transition-shadow'
            >
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <div
                    className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                  >
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium text-muted-foreground'>{stat.title}</p>
                    <p className='text-2xl font-bold'>{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Game Performance Insights */}
      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Performance Metrics */}
        <Card className='bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg'>
          <CardHeader>
            <CardTitle className='text-lg font-semibold flex items-center gap-2'>
              <BarChart3 className='h-5 w-5 text-primary' />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4'>
              <div className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'>
                <span className='text-sm font-medium'>Win Rate</span>
                <Badge variant={winRate >= 50 ? 'default' : 'secondary'}>
                  {setNumberFormat(winRate, 2)}%
                </Badge>
              </div>

              <div className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'>
                <span className='text-sm font-medium'>Player Margin Avg</span>
                <Badge variant={avgPlayerMargin >= 0 ? 'default' : 'destructive'}>
                  {setNumberFormat(avgPlayerMargin, 2)}%
                </Badge>
              </div>

              <div className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'>
                <span className='text-sm font-medium'>GGR</span>
                <span className='font-semibold text-green-600'>
                  {formatCurrency(gameData.betAmount - gameData.winAmount, currency)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Player Summary */}
        <Card className='bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg'>
          <CardHeader>
            <CardTitle className='text-lg font-semibold flex items-center gap-2'>
              <Users className='h-5 w-5 text-primary' />
              Player Summary
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4'>
              <div className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'>
                <span className='text-sm font-medium'>Total Player Bets</span>
                <span className='font-semibold'>{commaSeparated(totalPlayerBets)}</span>
              </div>

              <div className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'>
                <span className='text-sm font-medium'>Player Turnover</span>
                <span className='font-semibold'>
                  {formatCurrency(totalPlayerTurnover, currency)}
                </span>
              </div>

              <div className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'>
                <span className='text-sm font-medium'>Player Winnings</span>
                <span className='font-semibold'>
                  {formatCurrency(totalPlayerWinnings, currency)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Players for this Game */}
      <Card className='bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg'>
        <CardHeader>
          <CardTitle className='text-lg font-semibold flex items-center gap-2'>
            <Users className='h-5 w-5 text-primary' />
            Top Players
            <Badge variant='outline'>{playerData.length} players</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {playerData
              .sort((a, b) => b.betAmount - a.betAmount)
              .slice(0, 5)
              .map((player, index) => (
                <div
                  key={`${player.externalPlayerId}-${index}`}
                  className='flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors'
                >
                  <div className='flex items-center gap-3'>
                    <div className='h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center'>
                      <span className='text-sm font-semibold text-primary'>#{index + 1}</span>
                    </div>
                    <div>
                      <p className='font-medium text-sm'>{player.externalPlayerId}</p>
                      <p className='text-xs text-muted-foreground'>
                        {commaSeparated(player.betCounts)} bets
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-semibold text-sm'>
                      {formatCurrency(player.betAmount, currency)}
                    </p>
                    <Badge
                      variant={player.margin >= 0 ? 'default' : 'destructive'}
                      className='text-xs'
                    >
                      {setNumberFormat(player.margin, 2)}%
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
