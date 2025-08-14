/**
 * Winners and Contributors Component
 * Displays top winners and contributors in responsive tables
 */

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
import { Trophy, TrendingUp, TrendingDown, Target, Award, Crown } from 'lucide-react'
import { formatCurrency, commaSeparated, setNumberFormat } from '@/lib/utils/dashboard'
import { cn } from '@/lib/utils'

interface WinnersContributorsData {
  data: Array<{
    _id: {
      externalPlayerId: string | null
    }
    betCounts: number
    betAmount: number
    winAmount: number
    externalPlayerId: string | null
    marginInAmount: number
    marginInPercentage: number
  }>
}

interface WinnersContributorsProps {
  winnersData: WinnersContributorsData
  contributorsData: WinnersContributorsData
  currency: string
}

export function WinnersContributors({
  winnersData,
  contributorsData,
  currency,
}: WinnersContributorsProps) {
  const getMarginBadge = (margin: number, isContributor: boolean = false) => {
    const variant = isContributor
      ? margin >= 0
        ? 'default'
        : 'destructive'
      : margin < 0
        ? 'default'
        : 'destructive' // For winners, negative margin is good
    const Icon = margin >= 0 ? TrendingUp : TrendingDown
    return (
      <Badge variant={variant} className='text-xs font-medium flex items-center gap-1'>
        <Icon className='h-3 w-3' />
        {setNumberFormat(Math.abs(margin), 2)}%
      </Badge>
    )
  }

  const getPlayerDisplay = (playerId: string | null) => {
    return playerId || 'Anonymous'
  }

  const WinnersTable = () => (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-12'>#</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className='text-right'>Bets</TableHead>
            <TableHead className='text-right'>Bet Amount</TableHead>
            <TableHead className='text-right'>Win Amount</TableHead>
            <TableHead className='text-right'>Net Win</TableHead>
            <TableHead className='text-right'>Win %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {winnersData.data.map((winner, index) => (
            <TableRow key={winner.externalPlayerId || index} className='hover:bg-muted/50'>
              <TableCell className='font-medium'>
                <div className='flex items-center gap-2'>
                  {index < 3 && (
                    <Crown
                      className={cn('h-4 w-4', {
                        'text-yellow-500': index === 0,
                        'text-gray-400': index === 1,
                        'text-amber-600': index === 2,
                      })}
                    />
                  )}
                  {index + 1}
                </div>
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <Trophy className='h-4 w-4 text-orange-500' />
                  <span className='font-medium'>{getPlayerDisplay(winner.externalPlayerId)}</span>
                </div>
              </TableCell>
              <TableCell className='text-right font-medium'>
                {commaSeparated(winner.betCounts)}
              </TableCell>
              <TableCell className='text-right'>
                {formatCurrency(winner.betAmount, currency)}
              </TableCell>
              <TableCell className='text-right font-medium text-green-600'>
                {formatCurrency(winner.winAmount, currency)}
              </TableCell>
              <TableCell className='text-right'>
                <span
                  className={cn('font-medium', {
                    'text-green-600': winner.marginInAmount < 0,
                    'text-red-600': winner.marginInAmount >= 0,
                  })}
                >
                  {formatCurrency(Math.abs(winner.marginInAmount), currency)}
                </span>
              </TableCell>
              <TableCell className='text-right'>
                {getMarginBadge(winner.marginInPercentage, false)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  const ContributorsTable = () => (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-12'>#</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className='text-right'>Bets</TableHead>
            <TableHead className='text-right'>Bet Amount</TableHead>
            <TableHead className='text-right'>Win Amount</TableHead>
            <TableHead className='text-right'>Contribution</TableHead>
            <TableHead className='text-right'>Margin %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contributorsData.data.map((contributor, index) => (
            <TableRow key={contributor.externalPlayerId || index} className='hover:bg-muted/50'>
              <TableCell className='font-medium'>
                <div className='flex items-center gap-2'>
                  {index < 3 && (
                    <Award
                      className={cn('h-4 w-4', {
                        'text-green-500': index === 0,
                        'text-blue-500': index === 1,
                        'text-purple-500': index === 2,
                      })}
                    />
                  )}
                  {index + 1}
                </div>
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <Target className='h-4 w-4 text-blue-500' />
                  <span className='font-medium'>
                    {getPlayerDisplay(contributor.externalPlayerId)}
                  </span>
                </div>
              </TableCell>
              <TableCell className='text-right font-medium'>
                {commaSeparated(contributor.betCounts)}
              </TableCell>
              <TableCell className='text-right'>
                {formatCurrency(contributor.betAmount, currency)}
              </TableCell>
              <TableCell className='text-right'>
                {formatCurrency(contributor.winAmount, currency)}
              </TableCell>
              <TableCell className='text-right font-medium text-green-600'>
                {formatCurrency(contributor.marginInAmount, currency)}
              </TableCell>
              <TableCell className='text-right'>
                {getMarginBadge(contributor.marginInPercentage, true)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  // Mobile Card View
  const MobileWinnersCards = () => (
    <div className='space-y-4'>
      {winnersData.data.map((winner, index) => (
        <Card key={winner.externalPlayerId || index} className='p-4'>
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-2'>
              {index < 3 && (
                <Crown
                  className={cn('h-4 w-4', {
                    'text-yellow-500': index === 0,
                    'text-gray-400': index === 1,
                    'text-amber-600': index === 2,
                  })}
                />
              )}
              <span className='font-bold text-lg'>#{index + 1}</span>
              <Trophy className='h-4 w-4 text-orange-500' />
            </div>
            {getMarginBadge(winner.marginInPercentage, false)}
          </div>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span className='text-sm text-muted-foreground'>Player:</span>
              <span className='font-medium'>{getPlayerDisplay(winner.externalPlayerId)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-muted-foreground'>Bets:</span>
              <span className='font-medium'>{commaSeparated(winner.betCounts)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-muted-foreground'>Bet Amount:</span>
              <span>{formatCurrency(winner.betAmount, currency)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-muted-foreground'>Win Amount:</span>
              <span className='font-medium text-green-600'>
                {formatCurrency(winner.winAmount, currency)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-muted-foreground'>Net Win:</span>
              <span
                className={cn('font-medium', {
                  'text-green-600': winner.marginInAmount < 0,
                  'text-red-600': winner.marginInAmount >= 0,
                })}
              >
                {formatCurrency(Math.abs(winner.marginInAmount), currency)}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  const MobileContributorsCards = () => (
    <div className='space-y-4'>
      {contributorsData.data.map((contributor, index) => (
        <Card key={contributor.externalPlayerId || index} className='p-4'>
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-2'>
              {index < 3 && (
                <Award
                  className={cn('h-4 w-4', {
                    'text-green-500': index === 0,
                    'text-blue-500': index === 1,
                    'text-purple-500': index === 2,
                  })}
                />
              )}
              <span className='font-bold text-lg'>#{index + 1}</span>
              <Target className='h-4 w-4 text-blue-500' />
            </div>
            {getMarginBadge(contributor.marginInPercentage, true)}
          </div>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span className='text-sm text-muted-foreground'>Player:</span>
              <span className='font-medium'>{getPlayerDisplay(contributor.externalPlayerId)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-muted-foreground'>Bets:</span>
              <span className='font-medium'>{commaSeparated(contributor.betCounts)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-muted-foreground'>Bet Amount:</span>
              <span>{formatCurrency(contributor.betAmount, currency)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-muted-foreground'>Win Amount:</span>
              <span>{formatCurrency(contributor.winAmount, currency)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-muted-foreground'>Contribution:</span>
              <span className='font-medium text-green-600'>
                {formatCurrency(contributor.marginInAmount, currency)}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      {/* Winners Section */}
      <Card>
        <CardHeader className='pb-4'>
          <CardTitle className='flex items-center gap-2'>
            <Trophy className='h-5 w-5 text-orange-500' />
            Top Winners
            <Badge variant='secondary' className='ml-auto'>
              {winnersData.data.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className='hidden lg:block'>
            <WinnersTable />
          </div>
          {/* Mobile Cards */}
          <div className='lg:hidden'>
            <MobileWinnersCards />
          </div>
        </CardContent>
      </Card>

      {/* Contributors Section */}
      <Card>
        <CardHeader className='pb-4'>
          <CardTitle className='flex items-center gap-2'>
            <Target className='h-5 w-5 text-blue-500' />
            Top Contributors
            <Badge variant='secondary' className='ml-auto'>
              {contributorsData.data.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className='hidden lg:block'>
            <ContributorsTable />
          </div>
          {/* Mobile Cards */}
          <div className='lg:hidden'>
            <MobileContributorsCards />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
