/**
 * Game Analysis Component
 * Game selection and performance analytics
 */

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Gamepad2, Search, TrendingUp, TrendingDown, ArrowUpDown, Eye, EyeOff } from 'lucide-react'
import { formatCurrency, commaSeparated, setNumberFormat } from '@/lib/utils/dashboard'
import { cn } from '@/lib/utils'

interface GameData {
  brandName: string
  betCounts: number
  betAmount: number
  winAmount: number
  margin: number
  gameAlias: string
}

interface GameAnalysisProps {
  gameData: GameData[]
  currency: string
  selectedGame?: string | null
  onGameSelect?: (gameAlias: string | null) => void
}

export function GameAnalysis({
  gameData,
  currency,
  selectedGame,
  onGameSelect,
}: GameAnalysisProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isCompactView, setIsCompactView] = useState(false)

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

  const filteredAndSortedData = (data: GameData[]) => {
    let filtered = data.filter(item =>
      item.gameAlias.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = a[sortField as keyof GameData]
        const bValue = b[sortField as keyof GameData]

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
        }

        return 0
      })
    }

    return filtered
  }

  const displayData = filteredAndSortedData(gameData)

  return (
    <Card className='h-full flex flex-col'>
      <CardHeader className='pb-3 space-y-4'>
        {/* Title and Action Section */}
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg font-semibold flex items-center gap-2'>
            <Gamepad2 className='h-5 w-5 text-primary' />
            Game Analysis
          </CardTitle>
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className='text-xs'>
              {displayData.length} games
            </Badge>
            {onGameSelect && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsCompactView(!isCompactView)}
                className='h-8 px-3'
              >
                {isCompactView ? <Eye className='h-4 w-4' /> : <EyeOff className='h-4 w-4' />}
                <span className='hidden sm:inline ml-2'>
                  {isCompactView ? 'Detailed' : 'Compact'}
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Search games...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='pl-9 h-9'
          />
        </div>

        {/* Helpful Information */}
        {onGameSelect && !selectedGame && (
          <div className='inline-flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800'>
            <Eye className='h-4 w-4 text-blue-600 dark:text-blue-400' />
            <span className='text-xs font-medium text-blue-700 dark:text-blue-300'>
              Click any game row to view detailed analytics and game insights
            </span>
          </div>
        )}

        {/* Selected Game Display */}
        {onGameSelect && selectedGame && (
          <div className='flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20'>
            <Gamepad2 className='h-4 w-4 text-primary' />
            <span className='text-sm font-medium text-primary'>Selected: {selectedGame}</span>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onGameSelect(null)}
              className='ml-auto h-6 w-6 p-0 hover:bg-primary/10'
            >
              <span className='text-primary'>×</span>
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className='flex-1 p-0 overflow-hidden'>
        {/* Desktop Table */}
        <div className='hidden lg:block h-full border-t overflow-auto'>
          <Table className='min-w-full'>
            <TableHeader className='sticky top-0 bg-background/95 backdrop-blur-sm z-10'>
              <TableRow className='hover:bg-transparent border-b'>
                <TableHead
                  className='font-semibold cursor-pointer hover:bg-muted/50 transition-colors py-3'
                  onClick={() => handleSort('gameAlias')}
                >
                  <div className='flex items-center gap-2'>
                    Game
                    {getSortIcon('gameAlias')}
                  </div>
                </TableHead>
                <TableHead
                  className='font-semibold text-right cursor-pointer hover:bg-muted/50 transition-colors py-3'
                  onClick={() => handleSort('betCounts')}
                >
                  <div className='flex items-center justify-end gap-2'>
                    Bets
                    {getSortIcon('betCounts')}
                  </div>
                </TableHead>
                <TableHead
                  className='font-semibold text-right cursor-pointer hover:bg-muted/50 transition-colors py-3'
                  onClick={() => handleSort('betAmount')}
                >
                  <div className='flex items-center justify-end gap-2'>
                    Turnover
                    {getSortIcon('betAmount')}
                  </div>
                </TableHead>
                {!isCompactView && (
                  <TableHead
                    className='font-semibold text-right cursor-pointer hover:bg-muted/50 transition-colors py-3'
                    onClick={() => handleSort('winAmount')}
                  >
                    <div className='flex items-center justify-end gap-2'>
                      Won
                      {getSortIcon('winAmount')}
                    </div>
                  </TableHead>
                )}
                <TableHead
                  className='font-semibold text-right cursor-pointer hover:bg-muted/50 transition-colors py-3'
                  onClick={() => handleSort('margin')}
                >
                  <div className='flex items-center justify-end gap-2'>
                    Margin
                    {getSortIcon('margin')}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((item, index) => {
                const isSelected = selectedGame === item.gameAlias
                const isClickable = !!onGameSelect

                return (
                  <TableRow
                    key={`${item.gameAlias}-${index}`}
                    className={cn(
                      'transition-colors border-b hover:bg-muted/30',
                      isClickable && 'cursor-pointer',
                      isSelected && 'bg-primary/10 border-primary/30'
                    )}
                    onClick={() => {
                      if (isClickable) {
                        onGameSelect(isSelected ? null : item.gameAlias)
                      }
                    }}
                  >
                    <TableCell className='font-medium py-3'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={cn(
                            'h-8 w-8 rounded-full flex items-center justify-center',
                            isSelected ? 'bg-primary/20' : 'bg-primary/10'
                          )}
                        >
                          <Gamepad2 className='h-4 w-4 text-primary' />
                        </div>
                        <span className='font-medium'>{item.gameAlias}</span>
                        {isSelected && (
                          <Badge variant='default' className='text-xs'>
                            Selected
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className='text-right font-medium'>
                      {commaSeparated(item.betCounts)}
                    </TableCell>
                    <TableCell className='text-right font-medium'>
                      {formatCurrency(item.betAmount, currency)}
                    </TableCell>
                    {!isCompactView && (
                      <TableCell className='text-right font-medium'>
                        {formatCurrency(item.winAmount, currency)}
                      </TableCell>
                    )}
                    <TableCell className='text-right'>{getMarginBadge(item.margin)}</TableCell>
                  </TableRow>
                )
              })}
              {displayData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={isCompactView ? 4 : 5}
                    className='text-center py-12 text-muted-foreground'
                  >
                    <Gamepad2 className='h-12 w-12 mx-auto mb-4 opacity-20' />
                    <p>No games found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className='lg:hidden'>
          <div className='p-4 space-y-3 max-h-[500px] overflow-y-auto'>
            {displayData.map((item, index) => {
              const isSelected = selectedGame === item.gameAlias
              const isClickable = !!onGameSelect

              return (
                <Card
                  key={`mobile-${item.gameAlias}-${index}`}
                  className={cn(
                    'border-l-4 border-l-primary/30 transition-colors',
                    isClickable && 'cursor-pointer hover:bg-muted/50',
                    isSelected && 'ring-2 ring-primary bg-primary/5 border-l-primary'
                  )}
                  onClick={() => {
                    if (isClickable) {
                      onGameSelect(isSelected ? null : item.gameAlias)
                    }
                  }}
                >
                  <div className='p-4'>
                    <div className='flex items-center justify-between mb-3'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={cn(
                            'h-8 w-8 rounded-full flex items-center justify-center',
                            isSelected ? 'bg-primary/20' : 'bg-primary/10'
                          )}
                        >
                          <Gamepad2 className='h-4 w-4 text-primary' />
                        </div>
                        <div>
                          <div className='font-medium text-base'>{item.gameAlias}</div>
                          {isSelected && (
                            <Badge variant='default' className='text-xs mt-1'>
                              Selected
                            </Badge>
                          )}
                        </div>
                      </div>
                      {getMarginBadge(item.margin)}
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                      <div className='flex justify-between items-center p-2 bg-muted/30 rounded'>
                        <span className='text-xs text-muted-foreground font-medium'>Bets</span>
                        <span className='text-sm font-semibold'>
                          {commaSeparated(item.betCounts)}
                        </span>
                      </div>
                      <div className='flex justify-between items-center p-2 bg-muted/30 rounded'>
                        <span className='text-xs text-muted-foreground font-medium'>Turnover</span>
                        <span className='text-sm font-semibold'>
                          {formatCurrency(item.betAmount, currency)}
                        </span>
                      </div>
                      <div className='flex justify-between items-center p-2 bg-muted/30 rounded sm:col-span-2'>
                        <span className='text-xs text-muted-foreground font-medium'>Won</span>
                        <span className='text-sm font-semibold'>
                          {formatCurrency(item.winAmount, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
            {displayData.length === 0 && (
              <div className='text-center py-12 text-muted-foreground'>
                <Gamepad2 className='h-12 w-12 mx-auto mb-4 opacity-20' />
                <p>No games found</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
