/**
 * Operator Game Details Component
 * Displays comprehensive operator game information
 */

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Gamepad2, Building2, Tag, DollarSign, ExternalLink, Activity } from 'lucide-react'
import type { OperatorGame } from '@/lib/api/operatorGame'

interface OperatorGameDetailsProps {
  operatorGame: OperatorGame
  isLoading?: boolean
}

export function OperatorGameDetails({ operatorGame, isLoading = false }: OperatorGameDetailsProps) {
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

  return (
    <div className='space-y-6 max-h-[70vh] overflow-y-auto'>
      {/* Header Section */}
      <div className='space-y-4'>
        <div className='flex items-center gap-3'>
          <div className='flex-shrink-0'>
            {operatorGame.icon ? (
              <img
                src={operatorGame.icon}
                alt={operatorGame.gameName}
                className='w-12 h-12 rounded-lg object-cover border'
                onError={e => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className='w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center'>
                <Gamepad2 className='w-6 h-6 text-white' />
              </div>
            )}
          </div>
          <div className='flex-1 min-w-0'>
            <h3 className='text-2xl font-bold truncate'>{operatorGame.gameName}</h3>
            <p className='text-sm text-muted-foreground'>{operatorGame.gameAlias}</p>
          </div>
        </div>

        <div className='flex flex-wrap gap-2'>
          <Badge variant={operatorGame.isActive ? 'default' : 'secondary'}>
            <Activity className='w-3 h-3 mr-1' />
            {operatorGame.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <Badge variant='outline'>
            <Tag className='w-3 h-3 mr-1' />
            {operatorGame.gameType?.toUpperCase() || 'Unknown'}
          </Badge>
          <Badge variant='outline'>Mode {operatorGame.gameMode}</Badge>
        </div>
      </div>

      <Separator />

      {/* Details Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Gamepad2 className='w-5 h-5' />
              Game Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-muted-foreground'>Game ID:</span>
              <span className='text-sm font-mono text-right break-all max-w-[200px]'>
                {operatorGame._id}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-muted-foreground'>Game Code:</span>
              <span className='text-sm font-medium'>{operatorGame.gameAlias}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-muted-foreground'>Game Name:</span>
              <span className='text-sm'>{operatorGame.gameName}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-muted-foreground'>Game Type:</span>
              <span className='text-sm uppercase'>{operatorGame.gameType || 'N/A'}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-muted-foreground'>Game Mode:</span>
              <span className='text-sm'>{operatorGame.gameMode}</span>
            </div>
          </CardContent>
        </Card>

        {/* Platform Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Building2 className='w-5 h-5' />
              Platform Details
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-muted-foreground'>Platform:</span>
              <span className='text-sm font-mono text-right break-all max-w-[200px]'>
                {operatorGame.platform}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-muted-foreground'>Operator:</span>
              <span className='text-sm font-mono text-right break-all max-w-[200px]'>
                {operatorGame.operator}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-muted-foreground'>Brand:</span>
              <span className='text-sm font-mono text-right break-all max-w-[200px]'>
                {operatorGame.brand}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Betting Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <DollarSign className='w-5 h-5' />
              Betting Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-muted-foreground'>Min Bet:</span>
              <span className='text-sm font-medium'>
                {operatorGame.minBet !== undefined
                  ? `${operatorGame.minBet.toFixed(2)}`
                  : 'Not set'}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-muted-foreground'>Max Bet:</span>
              <span className='text-sm font-medium'>
                {operatorGame.maxBet !== undefined
                  ? `${operatorGame.maxBet.toFixed(2)}`
                  : 'Not set'}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-muted-foreground'>Default Bet:</span>
              <span className='text-sm font-medium'>
                {operatorGame.defaultBet !== undefined
                  ? `${operatorGame.defaultBet.toFixed(2)}`
                  : 'Not set'}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-muted-foreground'>Max Win:</span>
              <span className='text-sm font-medium'>
                {operatorGame.maxWin !== undefined
                  ? `${operatorGame.maxWin.toFixed(2)}`
                  : 'Not set'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Launch & Resources */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <ExternalLink className='w-5 h-5' />
              Launch & Resources
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between items-start'>
              <span className='text-sm font-medium text-muted-foreground'>Launch Path:</span>
              <span className='text-sm font-mono text-right break-all max-w-[200px]'>
                {operatorGame.launchPath}
              </span>
            </div>
            <div className='flex justify-between items-start'>
              <span className='text-sm font-medium text-muted-foreground'>Icon Path:</span>
              <span className='text-sm font-mono text-right break-all max-w-[200px]'>
                {operatorGame.icon || 'N/A'}
              </span>
            </div>
            {operatorGame.homeURL && (
              <div className='flex justify-between items-start'>
                <span className='text-sm font-medium text-muted-foreground'>Home URL:</span>
                <span className='text-sm font-mono text-right break-all max-w-[200px]'>
                  {operatorGame.homeURL}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
