/**
 * Dashboard Filters Component
 * Date range, game, currency, and player filters
 */

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { EnhancedCalendar } from '@/components/ui/enhanced-calendar'
import { CalendarIcon, RotateCcw } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface FilterOptions {
  startDate: Date
  endDate: Date
  currency: string
  gameAlias?: string
  externalPlayerId: string
}

interface DashboardFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: Partial<FilterOptions>) => void
  gameOptions: Array<{ id: string; label: string }>
  isLoading?: boolean
  onResetFilters?: () => void
}

const currencyOptions = [
  { id: 'INR', label: 'INR' },
  { id: 'USD', label: 'USD' },
  { id: 'EUR', label: 'EUR' },
]

export function DashboardFilters({
  filters,
  onFiltersChange,
  gameOptions,
  isLoading = false,
  onResetFilters,
}: DashboardFiltersProps) {
  const gameOptionsWithAll = [{ id: 'ALL', label: 'All Games' }, ...gameOptions]

  // State for controlling calendar popover visibility
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  return (
    <Card className='w-full max-w-full overflow-x-hidden'>
      <CardContent className='py-4 sm:py-6 px-3 sm:px-4'>
        {/* Header with Reset Button */}
        {onResetFilters && (
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>Filters</h3>
            <Button
              onClick={onResetFilters}
              size='sm'
              disabled={isLoading}
              className='flex items-center gap-1 sm:gap-2 text-xs h-8 px-2 sm:px-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
            >
              <RotateCcw className='h-3 w-3 sm:h-4 sm:w-4 shrink-0' />
              <span className='hidden sm:inline'>Reset Filters</span>
              <span className='sm:hidden'>Reset</span>
            </Button>
          </div>
        )}

        {/* Filter Grid - Responsive Layout matching other pages */}
        <div className='grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
          {/* Start Date */}
          <div className='space-y-2'>
            <Label htmlFor='startDate' className='text-xs sm:text-sm font-medium'>
              From Date
            </Label>
            <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  id='startDate'
                  variant='outline'
                  className={cn(
                    'w-full justify-start text-left font-normal h-9 sm:h-10',
                    'text-xs sm:text-sm',
                    !filters.startDate && 'text-muted-foreground'
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className='mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 shrink-0' />
                  <span className='truncate'>
                    {filters.startDate ? format(filters.startDate, 'dd MMM yyyy') : 'Pick a date'}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='w-auto p-0 max-w-[90vw] sm:max-w-sm'
                align='start'
                side='bottom'
                sideOffset={4}
              >
                <EnhancedCalendar
                  mode='single'
                  selected={filters.startDate}
                  onSelect={(date: Date | undefined) => {
                    if (date) {
                      onFiltersChange({ startDate: date })
                      setStartDateOpen(false)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div className='space-y-2'>
            <Label htmlFor='endDate' className='text-xs sm:text-sm font-medium'>
              To Date
            </Label>
            <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  id='endDate'
                  variant='outline'
                  className={cn(
                    'w-full justify-start text-left font-normal h-9 sm:h-10',
                    'text-xs sm:text-sm',
                    !filters.endDate && 'text-muted-foreground'
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className='mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 shrink-0' />
                  <span className='truncate'>
                    {filters.endDate ? format(filters.endDate, 'dd MMM yyyy') : 'Pick a date'}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='w-auto p-0 max-w-[90vw] sm:max-w-sm'
                align='start'
                side='bottom'
                sideOffset={4}
              >
                <EnhancedCalendar
                  mode='single'
                  selected={filters.endDate}
                  onSelect={(date: Date | undefined) => {
                    if (date) {
                      onFiltersChange({ endDate: date })
                      setEndDateOpen(false)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Game Select */}
          <div className='space-y-2'>
            <Label htmlFor='game' className='text-xs sm:text-sm font-medium'>
              Game
            </Label>
            <Select
              value={filters.gameAlias || 'ALL'}
              onValueChange={value => onFiltersChange({ gameAlias: value })}
              disabled={isLoading}
            >
              <SelectTrigger id='game' className='h-9 sm:h-10 text-xs sm:text-sm'>
                <SelectValue placeholder='Select game' />
              </SelectTrigger>
              <SelectContent>
                {gameOptionsWithAll.map(game => (
                  <SelectItem key={game.id} value={game.id} className='text-xs sm:text-sm'>
                    {game.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Currency Select */}
          <div className='space-y-2'>
            <Label htmlFor='currency' className='text-xs sm:text-sm font-medium'>
              Currency
            </Label>
            <Select
              value={filters.currency}
              onValueChange={value => onFiltersChange({ currency: value })}
              disabled={isLoading}
            >
              <SelectTrigger id='currency' className='h-9 sm:h-10 text-xs sm:text-sm'>
                <SelectValue placeholder='Select currency' />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map(currency => (
                  <SelectItem key={currency.id} value={currency.id} className='text-xs sm:text-sm'>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Player ID Input */}
          <div className='space-y-2'>
            <Label htmlFor='playerId' className='text-xs sm:text-sm font-medium'>
              Player ID
            </Label>
            <Input
              id='playerId'
              placeholder='Enter player ID'
              value={filters.externalPlayerId}
              onChange={e => onFiltersChange({ externalPlayerId: e.target.value })}
              disabled={isLoading}
              className='h-9 sm:h-10 text-xs sm:text-sm'
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
