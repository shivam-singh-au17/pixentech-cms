/**
 * User Details Component
 * Displays comprehensive user information
 */

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  User as UserIcon,
  Shield,
  Crown,
  UserCheck,
  Briefcase,
  Headphones,
  Activity,
  Building2,
  Users,
  Tag,
  Calendar,
} from 'lucide-react'
import type { User } from '@/lib/api/user'

interface UserDetailsProps {
  user: User
  isLoading?: boolean
}

export function UserDetails({ user, isLoading = false }: UserDetailsProps) {
  if (isLoading) {
    return (
      <div className='space-y-6'>
        {/* Header Skeleton */}
        <div className='space-y-4'>
          <Skeleton className='h-8 w-3/4' />
          <div className='flex gap-2'>
            <Skeleton className='h-6 w-16' />
            <Skeleton className='h-6 w-20' />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-6 w-32' />
              </CardHeader>
              <CardContent className='space-y-3'>
                {[...Array(3)].map((_, j) => (
                  <div key={j} className='flex justify-between'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-4 w-32' />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      ROOT: { variant: 'destructive' as const, icon: Crown, label: 'Root' },
      SUPER_ADMIN: { variant: 'default' as const, icon: Shield, label: 'Super Admin' },
      SUB_ADMIN: { variant: 'secondary' as const, icon: UserCheck, label: 'Sub Admin' },
      MANAGER: { variant: 'outline' as const, icon: Briefcase, label: 'Manager' },
      SUPPORT: { variant: 'outline' as const, icon: Headphones, label: 'Support' },
    }

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.SUPPORT
    const IconComponent = config.icon

    return (
      <Badge variant={config.variant}>
        <IconComponent className='w-3 h-3 mr-1' />
        {config.label}
      </Badge>
    )
  }

  return (
    <div className='space-y-6 max-h-[70vh] overflow-y-auto'>
      {/* Header Section */}
      <div className='space-y-4'>
        <div className='flex items-center gap-3'>
          <div className='flex-shrink-0'>
            <div className='w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center'>
              <UserIcon className='w-6 h-6 text-white' />
            </div>
          </div>
          <div className='flex-1 min-w-0'>
            <h3 className='text-2xl font-bold truncate'>{user.userName || user.email}</h3>
            <p className='text-sm text-muted-foreground'>{user.email}</p>
          </div>
        </div>

        <div className='flex flex-wrap gap-2'>
          <Badge variant={user.isActive ? 'default' : 'secondary'}>
            <Activity className='w-3 h-3 mr-1' />
            {user.isActive ? 'Active' : 'Inactive'}
          </Badge>
          {getRoleBadge(user.role)}
        </div>
      </div>

      <Separator />

      {/* Details Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <UserIcon className='w-5 h-5' />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-muted-foreground'>User ID:</span>
              <span className='text-sm font-mono text-right break-all max-w-[200px]'>
                {user._id}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-muted-foreground'>User Name:</span>
              <span className='text-sm'>{user.userName || 'Not set'}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-muted-foreground'>Email:</span>
              <span className='text-sm break-all'>{user.email}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-muted-foreground'>Role:</span>
              <span className='text-sm'>{user.role.replace('_', ' ')}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-muted-foreground'>Status:</span>
              <span className='text-sm'>{user.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Platforms */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Building2 className='w-5 h-5' />
              Allowed Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.allowedPlatforms.length > 0 ? (
              <div className='space-y-2'>
                {user.allowedPlatforms.map((platformId, index) => (
                  <div key={platformId} className='text-sm'>
                    <span className='font-mono text-muted-foreground'>#{index + 1}:</span>{' '}
                    <span className='break-all'>{platformId}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-muted-foreground'>No platforms assigned</p>
            )}
          </CardContent>
        </Card>

        {/* Operators */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Users className='w-5 h-5' />
              Allowed Operators
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.allowedOperators.length > 0 ? (
              <div className='space-y-2'>
                {user.allowedOperators.map((operatorId, index) => (
                  <div key={operatorId} className='text-sm'>
                    <span className='font-mono text-muted-foreground'>#{index + 1}:</span>{' '}
                    <span className='break-all'>{operatorId}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-muted-foreground'>No operators assigned</p>
            )}
          </CardContent>
        </Card>

        {/* Brands */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Tag className='w-5 h-5' />
              Allowed Brands
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.allowedBrands.length > 0 ? (
              <div className='space-y-2'>
                {user.allowedBrands.map((brandId, index) => (
                  <div key={brandId} className='text-sm'>
                    <span className='font-mono text-muted-foreground'>#{index + 1}:</span>{' '}
                    <span className='break-all'>{brandId}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-muted-foreground'>No brands assigned</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timestamps */}
      {(user.createdAt || user.updatedAt) && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Calendar className='w-5 h-5' />
                Timestamps
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              {user.createdAt && (
                <div className='flex justify-between items-center'>
                  <span className='text-sm font-medium text-muted-foreground'>Created:</span>
                  <span className='text-sm'>{new Date(user.createdAt).toLocaleString()}</span>
                </div>
              )}
              {user.updatedAt && (
                <div className='flex justify-between items-center'>
                  <span className='text-sm font-medium text-muted-foreground'>Updated:</span>
                  <span className='text-sm'>{new Date(user.updatedAt).toLocaleString()}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
