/**
 * Game Filters Component
 * Advanced filtering for games with enhanced UI
 */

import { Search, Filter } from 'lucide-react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { GameListParams } from '@/lib/api/game'

const GAME_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'pg', label: 'Provably Fair' },
  { value: 'sg', label: 'Slot Games' },
  { value: 'cg', label: 'Crash Games' },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
]

interface GameFiltersProps {
  filters: GameListParams
  onFiltersChange: (filters: Partial<GameListParams>) => void
  onReset: () => void
  loading?: boolean
}

export function GameFilters({ filters, onFiltersChange, onReset, loading }: GameFiltersProps) {
  return (
    <Card className='bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-xl border-0 shadow-lg'>
      <CardHeader className='pb-3 sm:pb-4'>
        <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
          <Filter className='h-4 w-4 sm:h-5 sm:w-5' />
          Filter Games
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-0'>
        <div className='space-y-4'>
          {/* All Filters in One Unified Grid Layout */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {/* Search Input */}
            <div className='space-y-2'>
              <Label htmlFor='search' className='text-sm font-medium'>
                Search
              </Label>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  id='search'
                  placeholder='Search games...'
                  value={filters.search || ''}
                  onChange={e => onFiltersChange({ search: e.target.value })}
                  className='pl-10 h-9 text-sm'
                  disabled={loading}
                />
              </div>
            </div>

            {/* Game Type Filter */}
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Game Type</Label>
              <Select
                value={filters.gameType || 'all'}
                onValueChange={value =>
                  onFiltersChange({
                    gameType: value === 'all' ? undefined : value,
                  })
                }
                disabled={loading}
              >
                <SelectTrigger className='h-9 text-sm'>
                  <SelectValue placeholder='Select type' />
                </SelectTrigger>
                <SelectContent>
                  {GAME_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Status</Label>
              <Select
                value={filters.isActive === undefined ? 'all' : filters.isActive ? 'true' : 'false'}
                onValueChange={value =>
                  onFiltersChange({
                    isActive: value === 'all' ? undefined : value === 'true',
                  })
                }
                disabled={loading}
              >
                <SelectTrigger className='h-9 text-sm'>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Reset Button Row */}
        <div className='mt-4 flex justify-end'>
          <Button onClick={onReset} variant='outline' size='sm' disabled={loading}>
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
