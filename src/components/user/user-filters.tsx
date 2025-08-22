/**
 * User Filters Component
 * Updated to use hierarchical Platform → Operator → Brand selection
 * Advanced filtering for users with platform hierarchy, role, status, and search filters
 */

import {
  Search,
  Filter,
  Crown,
  Shield,
  UserCheck,
  Briefcase,
  Headphones,
  Users,
} from 'lucide-react'
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
import { PlatformFilter, OperatorFilter, BrandFilter } from '@/components/common/PlatformFilters'
import type { UserListParams } from '@/lib/api/user'

const USER_ROLES = [
  { value: 'ALL', label: 'All Roles', icon: Users },
  { value: 'ROOT', label: 'Root', icon: Crown },
  { value: 'SUPER_ADMIN', label: 'Super Admin', icon: Shield },
  { value: 'SUB_ADMIN', label: 'Sub Admin', icon: UserCheck },
  { value: 'MANAGER', label: 'Manager', icon: Briefcase },
  { value: 'SUPPORT', label: 'Support', icon: Headphones },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
]

interface UserFiltersProps {
  filters: UserListParams
  onFiltersChange: (filters: Partial<UserListParams>) => void
  onResetFilters: () => void
  loading?: boolean
}

export function UserFilters({
  filters,
  onFiltersChange,
  onResetFilters,
  loading = false,
}: UserFiltersProps) {
  return (
    <Card className='bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-xl border-0 shadow-lg'>
      <CardHeader className='pb-3 sm:pb-4'>
        <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
          <Filter className='h-4 w-4 sm:h-5 sm:w-5' />
          Filter Users
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-0'>
        <div className='space-y-4'>
          {/* All Filters in One Unified Grid Layout */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'>
            {/* Search Input */}
            <div className='space-y-2'>
              <Label htmlFor='search' className='text-sm font-medium'>
                Search
              </Label>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  id='search'
                  placeholder='Search by email...'
                  value={filters.email || ''}
                  onChange={e => onFiltersChange({ email: e.target.value })}
                  className='pl-10 h-9 text-sm'
                  disabled={loading}
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Role</Label>
              <Select
                value={filters.role || 'ALL'}
                onValueChange={value =>
                  onFiltersChange({ role: value === 'ALL' ? undefined : value })
                }
                disabled={loading}
              >
                <SelectTrigger className='h-9 text-sm'>
                  <SelectValue placeholder='Select role' />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.map(role => {
                    const IconComponent = role.icon
                    return (
                      <SelectItem key={role.value} value={role.value}>
                        <div className='flex items-center gap-2'>
                          <IconComponent className='h-4 w-4' />
                          {role.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Status</Label>
              <Select
                value={filters.isActive?.toString() || 'all'}
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

            {/* Platform Filter - Individual Component */}
            <PlatformFilter
              value={filters.platform}
              onChange={(platformId: string) =>
                onFiltersChange({
                  platform: platformId === 'all' ? '' : platformId,
                  operator: '', // Reset operator when platform changes
                  brand: '', // Reset brand when platform changes
                })
              }
              disabled={loading}
            />

            {/* Operator Filter - Individual Component */}
            <OperatorFilter
              selectedPlatform={filters.platform}
              value={filters.operator}
              onChange={(operatorId: string) =>
                onFiltersChange({
                  operator: operatorId === 'all' ? '' : operatorId,
                  brand: '', // Reset brand when operator changes
                })
              }
              disabled={loading}
            />

            {/* Brand Filter - Individual Component */}
            <BrandFilter
              selectedPlatform={filters.platform}
              selectedOperator={filters.operator}
              value={filters.brand}
              onChange={(brandId: string) =>
                onFiltersChange({
                  brand: brandId === 'all' ? '' : brandId,
                })
              }
              disabled={loading}
            />
          </div>
        </div>

        {/* Reset Button Row */}
        <div className='mt-4 flex justify-end'>
          <Button onClick={onResetFilters} variant='outline' size='sm' disabled={loading}>
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
