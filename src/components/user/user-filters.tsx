/**
 * User Filters Component
 * Advanced filtering for users with platform, operator, brand, role, status, and search filters
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
import { usePlatformData } from '@/hooks/usePlatformData'
import type { UserListParams } from '@/lib/api/user'

const USER_ROLES = [
  { value: 'ALL', label: 'All Roles' },
  { value: 'ROOT', label: 'Root' },
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'SUB_ADMIN', label: 'Sub Admin' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'USER', label: 'User' },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
]

interface UserFiltersProps {
  filters: UserListParams
  onFiltersChange: (filters: Partial<UserListParams>) => void
  onApplyFilters: () => void
  onResetFilters: () => void
  loading?: boolean
}

export function UserFilters({
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters,
  loading = false,
}: UserFiltersProps) {
  // Get centralized platform data
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

  return (
    <Card className='bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-xl border-0 shadow-lg'>
      <CardHeader className='pb-3 sm:pb-4'>
        <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
          <Filter className='h-4 w-4 sm:h-5 sm:w-5' />
          Filter Users
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-0'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4'>
          {/* Search Input */}
          <div className='space-y-2'>
            <Label htmlFor='search'>Search</Label>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                id='search'
                placeholder='Search users...'
                value={filters.searchQuery || ''}
                onChange={e => onFiltersChange({ searchQuery: e.target.value })}
                className='pl-10'
                disabled={loading}
              />
            </div>
          </div>

          {/* Platform Filter */}
          <div className='space-y-2'>
            <Label>Platform</Label>
            <Select
              value={filters.platform || 'ALL'}
              onValueChange={value =>
                onFiltersChange({ platform: value === 'ALL' ? undefined : value })
              }
              disabled={loading || platformDataLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select platform' />
              </SelectTrigger>
              <SelectContent>
                {finalPlatformOptions.map(platform => (
                  <SelectItem key={platform.id} value={platform.id}>
                    {platform.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Operator Filter */}
          <div className='space-y-2'>
            <Label>Operator</Label>
            <Select
              value={filters.operator || 'ALL'}
              onValueChange={value =>
                onFiltersChange({ operator: value === 'ALL' ? undefined : value })
              }
              disabled={loading || platformDataLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select operator' />
              </SelectTrigger>
              <SelectContent>
                {finalOperatorOptions.map(operator => (
                  <SelectItem key={operator.id} value={operator.id}>
                    {operator.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brand Filter */}
          <div className='space-y-2'>
            <Label>Brand</Label>
            <Select
              value={filters.brand || 'ALL'}
              onValueChange={value =>
                onFiltersChange({ brand: value === 'ALL' ? undefined : value })
              }
              disabled={loading || platformDataLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select brand' />
              </SelectTrigger>
              <SelectContent>
                {finalBrandOptions.map(brand => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Role Filter */}
          <div className='space-y-2'>
            <Label>Role</Label>
            <Select
              value={filters.role || 'ALL'}
              onValueChange={value =>
                onFiltersChange({ role: value === 'ALL' ? undefined : value })
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select role' />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLES.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className='space-y-2'>
            <Label>Status</Label>
            <Select
              value={filters.isActive === undefined ? 'all' : filters.isActive ? 'true' : 'false'}
              onValueChange={value =>
                onFiltersChange({
                  isActive: value === 'all' ? undefined : value === 'true',
                })
              }
              disabled={loading}
            >
              <SelectTrigger>
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

          {/* Action Buttons */}
          <div className='space-y-2 sm:col-span-2 lg:col-span-1 xl:col-span-2 2xl:col-span-1'>
            <Label>&nbsp;</Label>
            <div className='flex gap-2'>
              <Button
                onClick={onResetFilters}
                variant='outline'
                size='sm'
                disabled={loading}
                className='flex-1'
              >
                Reset Filters
              </Button>
              <Button
                onClick={onApplyFilters}
                size='sm'
                disabled={loading || platformDataLoading}
                className='flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
              >
                {loading || platformDataLoading ? 'Loading...' : 'Apply Filters'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
