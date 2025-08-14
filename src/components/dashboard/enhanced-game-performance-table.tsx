/**
 * Enhanced Game Performance Table
 * Interactive table with search, sort, and mobile-friendly design
 */

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Search,
  TrendingUp,
  TrendingDown,
  Gamepad2,
  Users,
  ArrowUpDown,
  Eye,
  EyeOff,
} from 'lucide-react'
import { formatCurrency, commaSeparated, setNumberFormat } from '@/lib/utils/dashboard'
import { cn } from '@/lib/utils'

interface GamePerformanceData {
  turnOverByGameAlias: Array<{
    brandName: string
    betCounts: number
    betAmount: number
    winAmount: number
    margin: number
    gameAlias: string
  }>
  turnOverByPlayer: Array<{
    brandName: string
    betCounts: number
    betAmount: number
    winAmount: number
    margin: number
    externalPlayerId: string
    brandId: string
  }>
}

interface GamePerformanceTableProps {
  data: GamePerformanceData
  currency: string
  activeTab?: 'games' | 'players'
  onTabChange?: (tab: 'games' | 'players') => void
  selectedGame?: string | null
  onGameSelect?: (gameAlias: string | null) => void
}

export function EnhancedGamePerformanceTable({
  data,
  currency,
  activeTab = 'games',
  onTabChange,
  selectedGame,
  onGameSelect,
}: GamePerformanceTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isCompactView, setIsCompactView] = useState(false)

  console.log('EnhancedGamePerformanceTable received data:', data)

  const getMarginBadge = (margin: number) => {
    const variant = margin >= 0 ? 'default' : 'destructive'
    const Icon = margin >= 0 ? TrendingUp : TrendingDown
    return (
      <Badge variant={variant} className='text-xs font-medium flex items-center gap-1'>
        <Icon className='h-3 w-3' />
        {setNumberFormat(margin, 2)}%
      </Badge>
    )
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className='h-3 w-3 opacity-50' />
    return sortDirection === 'asc' ? (
      <TrendingUp className='h-3 w-3' />
    ) : (
      <TrendingDown className='h-3 w-3' />
    )
  }

  const filteredAndSortedData = (dataArray: any[]) => {
    let filtered = dataArray.filter(item => {
      const searchValue = activeTab === 'games' ? item.gameAlias : item.externalPlayerId
      return searchValue?.toLowerCase().includes(searchTerm.toLowerCase())
    })

    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]
        const comparison = aValue > bValue ? 1 : -1
        return sortDirection === 'asc' ? comparison : -comparison
      })
    }

    return filtered
  }

  const currentData =
    activeTab === 'games'
      ? filteredAndSortedData(data.turnOverByGameAlias || [])
      : filteredAndSortedData(data.turnOverByPlayer || [])

  const displayData = currentData
    .filter(
      (item, index, self) =>
        index ===
        self.findIndex(i =>
          activeTab === 'games'
            ? i.gameAlias === item.gameAlias
            : i.externalPlayerId === item.externalPlayerId
        )
    )
    .slice(0, 20)

  return (
    <Card className='w-full min-w-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg flex flex-col'>
      <CardHeader className='pb-4 flex-shrink-0'>
        <div className='flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center justify-between gap-4'>
          <div className='flex items-center gap-2 min-w-0'>
            <CardTitle className='text-base sm:text-lg font-semibold flex items-center gap-2 truncate'>
              {activeTab === 'games' ? (
                <>
                  <Gamepad2 className='h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0' />
                  <span className='truncate'>Performance Analysis</span>
                </>
              ) : (
                <>
                  <Users className='h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0' />
                  <span className='truncate'>Player Analysis</span>
                </>
              )}
            </CardTitle>
            <Badge variant='outline' className='text-xs flex-shrink-0'>
              {displayData.length} {activeTab === 'games' ? 'games' : 'players'}
            </Badge>
          </div>

          <div className='flex items-center gap-2 flex-shrink-0'>
            <div className='flex bg-muted rounded-lg p-1'>
              <Button
                onClick={() => onTabChange?.('games')}
                variant={activeTab === 'games' ? 'default' : 'ghost'}
                size='sm'
                className={cn(
                  'text-xs transition-all duration-200',
                  activeTab === 'games'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-background'
                )}
              >
                <Gamepad2 className='h-3 w-3 mr-1' />
                <span className='hidden sm:inline'>Games</span>
              </Button>
              <Button
                onClick={() => onTabChange?.('players')}
                variant={activeTab === 'players' ? 'default' : 'ghost'}
                size='sm'
                className={cn(
                  'text-xs transition-all duration-200',
                  activeTab === 'players'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-background'
                )}
              >
                <Users className='h-3 w-3 mr-1' />
                <span className='hidden sm:inline'>Players</span>
              </Button>
            </div>

            <Button
              onClick={() => setIsCompactView(!isCompactView)}
              variant='outline'
              size='sm'
              className='hidden md:flex'
            >
              {isCompactView ? <Eye className='h-3 w-3' /> : <EyeOff className='h-3 w-3' />}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder={`Search ${activeTab === 'games' ? 'games' : 'players'}...`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='pl-10 bg-background'
          />
        </div>

        {/* Game Selection Hint */}
        {activeTab === 'games' && onGameSelect && (
          <div className='text-xs text-muted-foreground bg-muted/30 p-2 rounded'>
            💡 Click on any game to view detailed analytics
          </div>
        )}
      </CardHeader>

      <CardContent className='p-0 flex-1 overflow-hidden min-h-0'>
        {/* Desktop Table View */}
        <div className='hidden lg:flex h-full flex-col min-h-[400px] sm:min-h-[500px]'>
          <div className='flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
            <div className='min-w-full overflow-x-auto'>
              <Table className='min-w-[600px]'>
                <TableHeader className='sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10'>
                  <TableRow className='hover:bg-transparent'>
                    <TableHead
                      className='text-xs sm:text-sm font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors py-3 sm:py-4 min-w-[120px]'
                      onClick={() =>
                        handleSort(activeTab === 'games' ? 'gameAlias' : 'externalPlayerId')
                      }
                    >
                      <div className='flex items-center gap-1'>
                        {activeTab === 'games' ? 'Game' : 'Player'}
                        {getSortIcon(activeTab === 'games' ? 'gameAlias' : 'externalPlayerId')}
                      </div>
                    </TableHead>
                    <TableHead
                      className='text-xs sm:text-sm font-semibold text-foreground text-right cursor-pointer hover:bg-muted/50 transition-colors py-3 sm:py-4 min-w-[80px]'
                      onClick={() => handleSort('betCounts')}
                    >
                      <div className='flex items-center justify-end gap-1'>
                        Bets
                        {getSortIcon('betCounts')}
                      </div>
                    </TableHead>
                    <TableHead
                      className='text-xs sm:text-sm font-semibold text-foreground text-right cursor-pointer hover:bg-muted/50 transition-colors py-3 sm:py-4 min-w-[100px]'
                      onClick={() => handleSort('betAmount')}
                    >
                      <div className='flex items-center justify-end gap-1'>
                        Turnover
                        {getSortIcon('betAmount')}
                      </div>
                    </TableHead>
                    {!isCompactView && (
                      <TableHead
                        className='text-xs sm:text-sm font-semibold text-foreground text-right cursor-pointer hover:bg-muted/50 transition-colors py-3 sm:py-4 min-w-[100px]'
                        onClick={() => handleSort('winAmount')}
                      >
                        <div className='flex items-center justify-end gap-1'>
                          Won
                          {getSortIcon('winAmount')}
                        </div>
                      </TableHead>
                    )}
                    <TableHead
                      className='text-xs sm:text-sm font-semibold text-foreground text-right cursor-pointer hover:bg-muted/50 transition-colors py-3 sm:py-4 min-w-[100px]'
                      onClick={() => handleSort('margin')}
                    >
                      <div className='flex items-center justify-end gap-1'>
                        Margin
                        {getSortIcon('margin')}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayData.map((item, index) => {
                    const isSelected = activeTab === 'games' && selectedGame === item.gameAlias
                    const isClickable = activeTab === 'games' && onGameSelect

                    return (
                      <TableRow
                        key={`${activeTab}-${activeTab === 'games' ? item.gameAlias : item.externalPlayerId}-${index}`}
                        className={`transition-colors border-b border-border/50 ${
                          isClickable ? 'cursor-pointer hover:bg-muted/30' : 'hover:bg-muted/30'
                        } ${isSelected ? 'bg-primary/10 border-primary/30' : ''}`}
                        onClick={() => {
                          if (isClickable && activeTab === 'games') {
                            onGameSelect(isSelected ? null : item.gameAlias)
                          }
                        }}
                      >
                        <TableCell className='font-medium text-xs sm:text-sm py-3 sm:py-4 text-foreground'>
                          <div className='flex items-center gap-2 sm:gap-3 min-w-0'>
                            <div
                              className={`h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isSelected ? 'bg-primary/20' : 'bg-primary/10'
                              }`}
                            >
                              {activeTab === 'games' ? (
                                <Gamepad2
                                  className={`h-3 w-3 sm:h-4 sm:w-4 ${isSelected ? 'text-primary' : 'text-primary'}`}
                                />
                              ) : (
                                <Users className='h-3 w-3 sm:h-4 sm:w-4 text-primary' />
                              )}
                            </div>
                            <span className='truncate max-w-[80px] sm:max-w-[120px] md:max-w-none font-medium'>
                              {activeTab === 'games' ? item.gameAlias : item.externalPlayerId}
                            </span>
                            {isSelected && (
                              <Badge variant='default' className='text-xs flex-shrink-0'>
                                Selected
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className='text-right text-xs sm:text-sm py-3 sm:py-4 font-medium text-foreground'>
                          {commaSeparated(item.betCounts)}
                        </TableCell>
                        <TableCell className='text-right text-xs sm:text-sm py-3 sm:py-4 font-medium text-foreground'>
                          {formatCurrency(item.betAmount, currency)}
                        </TableCell>
                        {!isCompactView && (
                          <TableCell className='text-right text-xs sm:text-sm py-3 sm:py-4 font-medium text-foreground'>
                            {formatCurrency(item.winAmount, currency)}
                          </TableCell>
                        )}
                        <TableCell className='text-right py-3 sm:py-4'>
                          {getMarginBadge(item.margin)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {displayData.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={isCompactView ? 4 : 5}
                        className='text-center py-8 sm:py-12 text-muted-foreground text-xs sm:text-sm'
                      >
                        No {activeTab === 'games' ? 'games' : 'players'} found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className='lg:hidden p-4 space-y-4 max-h-[500px] overflow-y-auto'>
          {displayData.map((item, index) => {
            const isSelected = activeTab === 'games' && selectedGame === item.gameAlias
            const isClickable = activeTab === 'games' && onGameSelect

            return (
              <Card
                key={`mobile-${activeTab}-${activeTab === 'games' ? item.gameAlias : item.externalPlayerId}-${index}`}
                className={cn(
                  'p-4 transition-colors',
                  isClickable && 'cursor-pointer hover:bg-muted/50',
                  isSelected && 'ring-2 ring-primary bg-primary/5'
                )}
                onClick={() => {
                  if (isClickable && activeTab === 'games') {
                    onGameSelect(isSelected ? null : item.gameAlias)
                  }
                }}
              >
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-primary/20' : 'bg-primary/10'
                      }`}
                    >
                      {activeTab === 'games' ? (
                        <Gamepad2
                          className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-primary'}`}
                        />
                      ) : (
                        <Users className='h-4 w-4 text-primary' />
                      )}
                    </div>
                    <div>
                      <div className='font-medium text-base'>
                        {activeTab === 'games' ? item.gameAlias : item.externalPlayerId}
                      </div>
                      {isSelected && (
                        <Badge variant='default' className='text-xs mt-1'>
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                  {getMarginBadge(item.margin)}
                </div>
                <div className='grid grid-cols-2 gap-3 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Bets:</span>
                    <span className='font-medium'>{commaSeparated(item.betCounts)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Turnover:</span>
                    <span className='font-medium'>{formatCurrency(item.betAmount, currency)}</span>
                  </div>
                  <div className='flex justify-between col-span-2'>
                    <span className='text-muted-foreground'>Won:</span>
                    <span className='font-medium'>{formatCurrency(item.winAmount, currency)}</span>
                  </div>
                </div>
              </Card>
            )
          })}
          {displayData.length === 0 && (
            <div className='text-center py-8 text-muted-foreground'>
              No {activeTab === 'games' ? 'games' : 'players'} found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
