/**
 * Transaction Fiimport { usePlatformData } from '@/hooks/data';mport { usePlatformData } from '@/hooks/data';mport { usePlatformData } from "@/hooks/data";ters Component
 * Advanced filtering for transaction reports with date range, platform, operator, brand, game, status, and search filters
 */

import { useState } from 'react'
import { CalendarIcon, Search, Filter } from 'lucide-react'
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
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { useGameOptions } from '@/hooks/data'
import { usePlatformData } from '@/hooks/data'
import { TRANSACTION_STATUS_OPTIONS } from '@/lib/types/transaction'
import type { TransactionFilter } from '@/lib/types/transaction'

interface TransactionFiltersProps {
  filters: TransactionFilter
  onFiltersChange: (filters: Partial<TransactionFilter>) => void
  onApplyFilters: () => void
  onResetFilters: () => void
  loading?: boolean
}

export function TransactionFilters({
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters,
  loading = false,
}: TransactionFiltersProps) {
  // Get centralized platform data with explicit fetch options
  const {
    platformOptions,
    operatorOptions,
    brandOptions,
    isLoading: platformDataLoading,
  } = usePlatformData({
    autoFetch: true,
    fetchPlatforms: true,
    fetchOperators: true,
    fetchBrands: true,
  })

  // Get game options from the games hook (keeping this as games are specific to the games module)
  const { data: gameData } = useGameOptions()
  const gameOptions = gameData?.options || []

  // Add "All" option to the beginning if not already present
  const finalPlatformOptions = [
    { id: 'ALL', label: 'All Platforms' },
    ...platformOptions.filter((opt: any) => opt.id !== 'ALL'),
  ]

  const finalOperatorOptions = [
    { id: 'ALL', label: 'All Operators' },
    ...operatorOptions.filter((opt: any) => opt.id !== 'ALL'),
  ]

  const finalBrandOptions = [
    { id: 'ALL', label: 'All Brands' },
    ...brandOptions.filter((opt: any) => opt.id !== 'ALL'),
  ]

  const [calendarType, setCalendarType] = useState<'start' | 'end' | null>(null)

  const handleDateSelect = (date: Date | undefined, type: 'start' | 'end') => {
    if (date) {
      if (type === 'start') {
        // Set to start of day
        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)
        onFiltersChange({ startDate: startOfDay })
      } else {
        // Set to end of day
        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)
        onFiltersChange({ endDate: endOfDay })
      }
    }
    setCalendarType(null)
  }

  const filteredOperatorOptions = finalOperatorOptions
  const filteredBrandOptions = finalBrandOptions

  return (
    <div className='w-full max-w-full overflow-x-hidden'>
      <div className='py-4 sm:py-6 space-y-4 sm:space-y-6 px-3 sm:px-4'>
        {/* Filter Header */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4'>
          <div className='flex items-center gap-2'>
            <Filter className='h-4 w-4 text-muted-foreground' />
            <h3 className='text-sm sm:text-base font-medium'>Transaction Filters</h3>
          </div>
          <div className='flex flex-col sm:flex-row gap-2'>
            <Button
              size='sm'
              onClick={onResetFilters}
              disabled={loading || platformDataLoading}
              className='text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
            >
              Reset Filters
            </Button>
            <Button
              onClick={onApplyFilters}
              size='sm'
              disabled={loading || platformDataLoading}
              className='text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
            >
              {loading || platformDataLoading ? 'Loading...' : 'Apply Filters'}
            </Button>
          </div>
        </div>

        {/* Date Range Filters */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='startDate' className='text-xs sm:text-sm'>
              Start Date
            </Label>
            <Popover
              open={calendarType === 'start'}
              onOpenChange={open => setCalendarType(open ? 'start' : null)}
            >
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'w-full justify-start text-left font-normal text-xs sm:text-sm',
                    !filters.startDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4' />
                  {filters.startDate
                    ? format(filters.startDate, 'MMM dd, yyyy')
                    : 'Pick start date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={filters.startDate}
                  onSelect={date => handleDateSelect(date, 'start')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='endDate' className='text-xs sm:text-sm'>
              End Date
            </Label>
            <Popover
              open={calendarType === 'end'}
              onOpenChange={open => setCalendarType(open ? 'end' : null)}
            >
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'w-full justify-start text-left font-normal text-xs sm:text-sm',
                    !filters.endDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4' />
                  {filters.endDate ? format(filters.endDate, 'MMM dd, yyyy') : 'Pick end date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={filters.endDate}
                  onSelect={date => handleDateSelect(date, 'end')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className='space-y-2'>
            <Label className='text-xs sm:text-sm'>Platform</Label>
            <Select
              value={filters.platform || 'ALL'}
              onValueChange={value => onFiltersChange({ platform: value })}
            >
              <SelectTrigger className='text-xs sm:text-sm'>
                <SelectValue placeholder='Select platform' />
              </SelectTrigger>
              <SelectContent>
                {finalPlatformOptions.map((option: any) => (
                  <SelectItem key={option.id} value={option.id} className='text-xs sm:text-sm'>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label className='text-xs sm:text-sm'>Operator</Label>
            <Select
              value={filters.operator || 'ALL'}
              onValueChange={value => onFiltersChange({ operator: value })}
            >
              <SelectTrigger className='text-xs sm:text-sm'>
                <SelectValue placeholder='Select operator' />
              </SelectTrigger>
              <SelectContent>
                {filteredOperatorOptions.map((option: any) => (
                  <SelectItem key={option.id} value={option.id} className='text-xs sm:text-sm'>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Additional Filters Row */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
          <div className='space-y-2'>
            <Label className='text-xs sm:text-sm'>Brand</Label>
            <Select
              value={filters.brand || 'ALL'}
              onValueChange={value => onFiltersChange({ brand: value })}
            >
              <SelectTrigger className='text-xs sm:text-sm'>
                <SelectValue placeholder='Select brand' />
              </SelectTrigger>
              <SelectContent>
                {filteredBrandOptions.map((option: any) => (
                  <SelectItem key={option.id} value={option.id} className='text-xs sm:text-sm'>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label className='text-xs sm:text-sm'>Game</Label>
            <Select
              value={filters.gameAlias || 'ALL'}
              onValueChange={value => onFiltersChange({ gameAlias: value })}
            >
              <SelectTrigger className='text-xs sm:text-sm'>
                <SelectValue placeholder='Select game' />
              </SelectTrigger>
              <SelectContent>
                {gameOptions.map(option => (
                  <SelectItem key={option.id} value={option.id} className='text-xs sm:text-sm'>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label className='text-xs sm:text-sm'>Status</Label>
            <Select
              value={filters.status || 'ALL'}
              onValueChange={value => onFiltersChange({ status: value })}
            >
              <SelectTrigger className='text-xs sm:text-sm'>
                <SelectValue placeholder='Select status' />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_STATUS_OPTIONS.map(option => (
                  <SelectItem key={option.id} value={option.id} className='text-xs sm:text-sm'>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='pageSize' className='text-xs sm:text-sm'>
              Items per page
            </Label>
            <Select
              value={filters.pageSize?.toString() || '10'}
              onValueChange={value => onFiltersChange({ pageSize: parseInt(value), pageNo: 1 })}
            >
              <SelectTrigger className='text-xs sm:text-sm'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='10' className='text-xs sm:text-sm'>
                  10
                </SelectItem>
                <SelectItem value='25' className='text-xs sm:text-sm'>
                  25
                </SelectItem>
                <SelectItem value='50' className='text-xs sm:text-sm'>
                  50
                </SelectItem>
                <SelectItem value='100' className='text-xs sm:text-sm'>
                  100
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Fields */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='externalPlayerId' className='text-xs sm:text-sm'>
              Player ID
            </Label>
            <div className='relative'>
              <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground' />
              <Input
                id='externalPlayerId'
                placeholder='Search by player ID'
                value={filters.externalPlayerId || ''}
                onChange={e => onFiltersChange({ externalPlayerId: e.target.value })}
                className='pl-7 sm:pl-8 text-xs sm:text-sm'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='roundId' className='text-xs sm:text-sm'>
              Round ID
            </Label>
            <div className='relative'>
              <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground' />
              <Input
                id='roundId'
                placeholder='Search by round ID'
                value={filters.roundId || ''}
                onChange={e => onFiltersChange({ roundId: e.target.value })}
                className='pl-7 sm:pl-8 text-xs sm:text-sm'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='betTxnId' className='text-xs sm:text-sm'>
              Bet Transaction ID
            </Label>
            <div className='relative'>
              <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground' />
              <Input
                id='betTxnId'
                placeholder='Search by bet transaction ID'
                value={filters.betTxnId || ''}
                onChange={e => onFiltersChange({ betTxnId: e.target.value })}
                className='pl-7 sm:pl-8 text-xs sm:text-sm'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
