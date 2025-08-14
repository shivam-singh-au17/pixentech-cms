/**
 * Player Analysis Component
 * Comprehensive player analytics with Performance, Winners, and Contributors
 */

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, Trophy, Target, TrendingUp, TrendingDown, Crown, Award } from 'lucide-react'
import { formatCurrency, commaSeparated, setNumberFormat } from '@/lib/utils/dashboard'
import { cn } from '@/lib/utils'

interface PlayerData {
  brandName: string
  betCounts: number
  betAmount: number
  winAmount: number
  margin: number
  externalPlayerId: string
  brandId: string
}

interface WinnersContributorsData {
  data: Array<{
    _id: {
      externalPlayerId: string | null
    }
    betCounts: number
    betAmount: number
    winAmount: number
    externalPlayerId: string | null
    marginInAmount: number
    marginInPercentage: number
  }>
}

interface PlayerAnalysisProps {
  playerData: PlayerData[]
  winnersData: WinnersContributorsData
  contributorsData: WinnersContributorsData
  currency: string
  searchTerm?: string
}

type PlayerAnalysisTab = 'performance' | 'winners' | 'contributors'

export function PlayerAnalysis({
  playerData,
  winnersData,
  contributorsData,
  currency,
  searchTerm = '',
}: PlayerAnalysisProps) {
  const [activeTab, setActiveTab] = useState<PlayerAnalysisTab>('performance')

  const getMarginBadge = (margin: number, isContributor: boolean = false) => {
    const variant = isContributor
      ? margin >= 0
        ? 'default'
        : 'destructive'
      : margin < 0
        ? 'default'
        : 'destructive'
    const Icon = margin >= 0 ? TrendingUp : TrendingDown
    return (
      <Badge variant={variant} className='text-xs font-medium flex items-center gap-1'>
        <Icon className='h-3 w-3' />
        {setNumberFormat(Math.abs(margin), 2)}%
      </Badge>
    )
  }

  const getPlayerDisplay = (playerId: string | null) => {
    return playerId || 'Anonymous'
  }

  const filteredPlayerData = playerData.filter(player =>
    player.externalPlayerId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Desktop Table Components
  const PerformanceTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead className='text-right'>Bets</TableHead>
          <TableHead className='text-right'>Bet Amount</TableHead>
          <TableHead className='text-right'>Win Amount</TableHead>
          <TableHead className='text-right'>Margin</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredPlayerData.map((player, index) => (
          <TableRow key={player.externalPlayerId || index} className='hover:bg-muted/50'>
            <TableCell>
              <div className='flex items-center gap-2'>
                <Users className='h-4 w-4 text-blue-500' />
                <span className='font-medium'>{getPlayerDisplay(player.externalPlayerId)}</span>
              </div>
            </TableCell>
            <TableCell className='text-right font-medium'>
              {commaSeparated(player.betCounts)}
            </TableCell>
            <TableCell className='text-right'>
              {formatCurrency(player.betAmount, currency)}
            </TableCell>
            <TableCell className='text-right'>
              {formatCurrency(player.winAmount, currency)}
            </TableCell>
            <TableCell className='text-right'>{getMarginBadge(player.margin)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const WinnersTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-12'>#</TableHead>
          <TableHead>Player</TableHead>
          <TableHead className='text-right'>Bets</TableHead>
          <TableHead className='text-right'>Bet Amount</TableHead>
          <TableHead className='text-right'>Win Amount</TableHead>
          <TableHead className='text-right'>Net Win</TableHead>
          <TableHead className='text-right'>Win %</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {winnersData.data.map((winner, index) => (
          <TableRow key={winner.externalPlayerId || index} className='hover:bg-muted/50'>
            <TableCell className='font-medium'>
              <div className='flex items-center gap-2'>
                {index < 3 && (
                  <Crown
                    className={cn('h-4 w-4', {
                      'text-yellow-500': index === 0,
                      'text-gray-400': index === 1,
                      'text-amber-600': index === 2,
                    })}
                  />
                )}
                {index + 1}
              </div>
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-2'>
                <Trophy className='h-4 w-4 text-orange-500' />
                <span className='font-medium'>{getPlayerDisplay(winner.externalPlayerId)}</span>
              </div>
            </TableCell>
            <TableCell className='text-right font-medium'>
              {commaSeparated(winner.betCounts)}
            </TableCell>
            <TableCell className='text-right'>
              {formatCurrency(winner.betAmount, currency)}
            </TableCell>
            <TableCell className='text-right font-medium text-green-600'>
              {formatCurrency(winner.winAmount, currency)}
            </TableCell>
            <TableCell className='text-right'>
              <span
                className={cn('font-medium', {
                  'text-green-600': winner.marginInAmount < 0,
                  'text-red-600': winner.marginInAmount >= 0,
                })}
              >
                {formatCurrency(Math.abs(winner.marginInAmount), currency)}
              </span>
            </TableCell>
            <TableCell className='text-right'>
              {getMarginBadge(winner.marginInPercentage, false)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const ContributorsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-12'>#</TableHead>
          <TableHead>Player</TableHead>
          <TableHead className='text-right'>Bets</TableHead>
          <TableHead className='text-right'>Bet Amount</TableHead>
          <TableHead className='text-right'>Win Amount</TableHead>
          <TableHead className='text-right'>Contribution</TableHead>
          <TableHead className='text-right'>Margin %</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contributorsData.data.map((contributor, index) => (
          <TableRow key={contributor.externalPlayerId || index} className='hover:bg-muted/50'>
            <TableCell className='font-medium'>
              <div className='flex items-center gap-2'>
                {index < 3 && (
                  <Award
                    className={cn('h-4 w-4', {
                      'text-green-500': index === 0,
                      'text-blue-500': index === 1,
                      'text-purple-500': index === 2,
                    })}
                  />
                )}
                {index + 1}
              </div>
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-2'>
                <Target className='h-4 w-4 text-blue-500' />
                <span className='font-medium'>
                  {getPlayerDisplay(contributor.externalPlayerId)}
                </span>
              </div>
            </TableCell>
            <TableCell className='text-right font-medium'>
              {commaSeparated(contributor.betCounts)}
            </TableCell>
            <TableCell className='text-right'>
              {formatCurrency(contributor.betAmount, currency)}
            </TableCell>
            <TableCell className='text-right'>
              {formatCurrency(contributor.winAmount, currency)}
            </TableCell>
            <TableCell className='text-right font-medium text-green-600'>
              {formatCurrency(contributor.marginInAmount, currency)}
            </TableCell>
            <TableCell className='text-right'>
              {getMarginBadge(contributor.marginInPercentage, true)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  // Mobile Card Components
  const MobileCards = () => {
    const getCurrentData = () => {
      switch (activeTab) {
        case 'performance':
          return filteredPlayerData.map(player => ({
            id: player.externalPlayerId,
            title: getPlayerDisplay(player.externalPlayerId),
            icon: <Users className='h-4 w-4 text-blue-500' />,
            badge: getMarginBadge(player.margin),
            rank: undefined,
            metrics: [
              { label: 'Bets', value: commaSeparated(player.betCounts) },
              { label: 'Bet Amount', value: formatCurrency(player.betAmount, currency) },
              { label: 'Win Amount', value: formatCurrency(player.winAmount, currency) },
            ],
          }))
        case 'winners':
          return winnersData.data.map((winner, index) => ({
            id: winner.externalPlayerId || `winner-${index}`,
            title: getPlayerDisplay(winner.externalPlayerId),
            icon: <Trophy className='h-4 w-4 text-orange-500' />,
            badge: getMarginBadge(winner.marginInPercentage, false),
            rank: index + 1,
            metrics: [
              { label: 'Bets', value: commaSeparated(winner.betCounts) },
              { label: 'Bet Amount', value: formatCurrency(winner.betAmount, currency) },
              {
                label: 'Net Win',
                value: formatCurrency(Math.abs(winner.marginInAmount), currency),
              },
            ],
          }))
        case 'contributors':
          return contributorsData.data.map((contributor, index) => ({
            id: contributor.externalPlayerId || `contributor-${index}`,
            title: getPlayerDisplay(contributor.externalPlayerId),
            icon: <Target className='h-4 w-4 text-blue-500' />,
            badge: getMarginBadge(contributor.marginInPercentage, true),
            rank: index + 1,
            metrics: [
              { label: 'Bets', value: commaSeparated(contributor.betCounts) },
              { label: 'Bet Amount', value: formatCurrency(contributor.betAmount, currency) },
              {
                label: 'Contribution',
                value: formatCurrency(contributor.marginInAmount, currency),
              },
            ],
          }))
        default:
          return []
      }
    }

    const data = getCurrentData()

    return (
      <div className='lg:hidden'>
        <div className='p-4 space-y-3 max-h-[500px] overflow-y-auto'>
          {data.map(item => (
            <Card key={item.id} className='border-l-4 border-l-primary/30'>
              <div className='p-4'>
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center gap-2'>
                    {item.rank && item.rank <= 3 && activeTab !== 'performance' && (
                      <div className='flex items-center gap-1'>
                        <Crown
                          className={cn('h-4 w-4', {
                            'text-yellow-500': item.rank === 1,
                            'text-gray-400': item.rank === 2,
                            'text-amber-600': item.rank === 3,
                          })}
                        />
                        <span className='font-bold text-sm'>#{item.rank}</span>
                      </div>
                    )}
                    {item.rank && item.rank > 3 && (
                      <span className='font-bold text-sm text-muted-foreground'>#{item.rank}</span>
                    )}
                    <div className='flex items-center gap-2'>
                      {item.icon}
                      <span className='font-medium text-sm'>{item.title}</span>
                    </div>
                  </div>
                  {item.badge}
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  {item.metrics.map((metric, index) => (
                    <div
                      key={index}
                      className='flex justify-between items-center p-2 bg-muted/30 rounded'
                    >
                      <span className='text-xs text-muted-foreground font-medium'>
                        {metric.label}
                      </span>
                      <span className='text-sm font-semibold'>{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
          {data.length === 0 && (
            <div className='text-center py-12 text-muted-foreground'>
              <Users className='h-12 w-12 mx-auto mb-4 opacity-20' />
              <p>No data found</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  const getCurrentTable = () => {
    switch (activeTab) {
      case 'performance':
        return <PerformanceTable />
      case 'winners':
        return <WinnersTable />
      case 'contributors':
        return <ContributorsTable />
      default:
        return <PerformanceTable />
    }
  }

  const getTabInfo = (tab: PlayerAnalysisTab) => {
    switch (tab) {
      case 'performance':
        return {
          icon: <Users className='h-4 w-4' />,
          label: 'Performance',
          count: filteredPlayerData.length,
        }
      case 'winners':
        return {
          icon: <Trophy className='h-4 w-4' />,
          label: 'Winners',
          count: winnersData.data.length,
        }
      case 'contributors':
        return {
          icon: <Target className='h-4 w-4' />,
          label: 'Contributors',
          count: contributorsData.data.length,
        }
    }
  }

  return (
    <Card className='h-full flex flex-col'>
      <CardHeader className='pb-3 space-y-0'>
        {/* Title Section */}
        <div className='flex items-center justify-between mb-4'>
          <CardTitle className='text-lg font-semibold flex items-center gap-2'>
            <Users className='h-5 w-5 text-primary' />
            Player Analysis
          </CardTitle>
          <Badge variant='outline' className='text-xs'>
            {getTabInfo(activeTab).count} records
          </Badge>
        </div>

        {/* Tab Navigation - Redesigned */}
        <div className='flex space-x-0 bg-muted p-1 rounded-lg'>
          {(['performance', 'winners', 'contributors'] as PlayerAnalysisTab[]).map(tab => {
            const info = getTabInfo(tab)
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                )}
              >
                <div className='flex items-center gap-1 sm:gap-2'>
                  {info.icon}
                  <span className='hidden md:inline'>{info.label}</span>
                  <span className='md:hidden text-xs'>
                    {tab === 'performance' ? 'Perf' : tab === 'winners' ? 'Win' : 'Cont'}
                  </span>
                </div>
                <Badge
                  variant={isActive ? 'default' : 'secondary'}
                  className='text-xs h-4 sm:h-5 px-1 sm:px-1.5 min-w-0'
                >
                  {info.count}
                </Badge>
              </button>
            )
          })}
        </div>
      </CardHeader>

      <CardContent className='flex-1 p-0 overflow-hidden'>
        {/* Desktop Tables */}
        <div className='hidden lg:block h-full border-t overflow-auto'>{getCurrentTable()}</div>

        {/* Mobile Cards */}
        <MobileCards />
      </CardContent>
    </Card>
  )
}
