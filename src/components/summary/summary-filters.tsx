/**
 * Summary Filters Component
 * Reusable filter component for all summary reports
 */

import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
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
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { FilterOption } from '@/lib/types/summary'
import { usePlatformData } from '@/hooks/data'

interface SummaryFiltersProps {
  startDate: Date
  endDate: Date
  platform?: string
  operator?: string
  brand?: string
  gameAlias?: string
  currency?: string
  externalPlayerId?: string
  onFiltersChange: (filters: any) => void
  onSubmit: () => void
  loading?: boolean
  gameOptions?: FilterOption[]
  showGameFilter?: boolean
  showPlayerFilter?: boolean
}

export function SummaryFilters({
  startDate,
  endDate,
  platform = 'ALL',
  operator = 'ALL',
  brand = 'ALL',
  gameAlias = 'ALL',
  currency = 'INR',
  externalPlayerId = '',
  onFiltersChange,
  onSubmit,
  loading = false,
  gameOptions = [],
  showGameFilter = false,
  showPlayerFilter = false,
}: SummaryFiltersProps) {
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

  // Add "All" option to the beginning if not already present
  const finalPlatformOptions: FilterOption[] = [
    { id: 'ALL', label: 'All Platforms' },
    ...platformOptions.filter((opt: any) => opt.id !== 'ALL'),
  ]

  const finalOperatorOptions: FilterOption[] = [
    { id: 'ALL', label: 'All Operators' },
    ...operatorOptions.filter((opt: any) => opt.id !== 'ALL'),
  ]

  const finalBrandOptions: FilterOption[] = [
    { id: 'ALL', label: 'All Brands' },
    ...brandOptions.filter((opt: any) => opt.id !== 'ALL'),
  ]

  const currencyOptions: FilterOption[] = [
    { id: 'INR', label: 'INR' },
    { id: 'USD', label: 'USD' },
    { id: 'EUR', label: 'EUR' },
  ]
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  const gameOptionsWithAll = [{ id: 'ALL', label: 'All Games' }, ...gameOptions]

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ [key]: value })
  }

  return (
    <Card className='mb-6'>
      <CardContent className='pt-6'>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
          {/* Start Date */}
          <div className='space-y-2'>
            <Label htmlFor='startDate' className='text-sm font-medium'>
              From Date
            </Label>
            <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  id='startDate'
                  variant='outline'
                  className={cn(
                    'w-full justify-start text-left font-normal h-10',
                    !startDate && 'text-muted-foreground'
                  )}
                  disabled={loading}
                >
                  <CalendarIcon className='mr-2 h-4 w-4 shrink-0' />
                  <span className='truncate'>
                    {startDate ? format(startDate, 'dd MMM yyyy') : 'Pick a date'}
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
                  selected={startDate}
                  onSelect={(date: Date | undefined) => {
                    if (date) {
                      handleFilterChange('startDate', date)
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
            <Label htmlFor='endDate' className='text-sm font-medium'>
              To Date
            </Label>
            <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  id='endDate'
                  variant='outline'
                  className={cn(
                    'w-full justify-start text-left font-normal h-10',
                    !endDate && 'text-muted-foreground'
                  )}
                  disabled={loading}
                >
                  <CalendarIcon className='mr-2 h-4 w-4 shrink-0' />
                  <span className='truncate'>
                    {endDate ? format(endDate, 'dd MMM yyyy') : 'Pick a date'}
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
                  selected={endDate}
                  onSelect={(date: Date | undefined) => {
                    if (date) {
                      handleFilterChange('endDate', date)
                      setEndDateOpen(false)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Platform */}
          <div className='space-y-2'>
            <Label htmlFor='platform'>Platform</Label>
            <Select
              value={platform}
              onValueChange={value => handleFilterChange('platform', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select platform' />
              </SelectTrigger>
              <SelectContent>
                {finalPlatformOptions.map((option: any) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Operator */}
          {platform && platform !== 'ALL' && (
            <div className='space-y-2'>
              <Label htmlFor='operator'>Operator</Label>
              <Select
                value={operator}
                onValueChange={value => handleFilterChange('operator', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select operator' />
                </SelectTrigger>
                <SelectContent>
                  {finalOperatorOptions.map((option: any) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Brand */}
          {operator && operator !== 'ALL' && (
            <div className='space-y-2'>
              <Label htmlFor='brand'>Brand</Label>
              <Select
                value={brand}
                onValueChange={value => handleFilterChange('brand', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select brand' />
                </SelectTrigger>
                <SelectContent>
                  {finalBrandOptions.map((option: any) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Game Filter */}
          {showGameFilter && (
            <div className='space-y-2'>
              <Label htmlFor='gameAlias'>Game</Label>
              <Select
                value={gameAlias}
                onValueChange={value => handleFilterChange('gameAlias', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select game' />
                </SelectTrigger>
                <SelectContent>
                  {gameOptionsWithAll.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Currency */}
          <div className='space-y-2'>
            <Label htmlFor='currency'>Currency</Label>
            <Select
              value={currency}
              onValueChange={value => handleFilterChange('currency', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select currency' />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Player Filter */}
          {showPlayerFilter && (
            <div className='space-y-2'>
              <Label htmlFor='externalPlayerId'>Player ID</Label>
              <Input
                id='externalPlayerId'
                placeholder='Enter player ID'
                value={externalPlayerId}
                onChange={e => handleFilterChange('externalPlayerId', e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          {/* Submit Button */}
          <div className='space-y-2'>
            <Label>&nbsp;</Label>
            <Button
              onClick={onSubmit}
              disabled={loading || platformDataLoading}
              className='w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
            >
              {loading || platformDataLoading ? 'Loading...' : 'Apply Filters'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
