/**
 * Game Performance Analytics Page
 * Detailed analytics for individual games
 */

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Gamepad2,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Search,
  Download,
  RefreshCw,
} from 'lucide-react'

const sampleGames = [
  {
    id: 1,
    name: 'AVIATORX',
    type: 'Crash Game',
    totalBets: 15420,
    totalRevenue: 89750.5,
    totalPlayers: 1250,
    avgBetSize: 5.82,
    winRate: 48.5,
    margin: 15.8,
    status: 'active',
    growth: 12.5,
  },
  {
    id: 2,
    name: 'PLINKO',
    type: 'Arcade',
    totalBets: 28930,
    totalRevenue: 156800.25,
    totalPlayers: 2100,
    avgBetSize: 5.42,
    winRate: 52.1,
    margin: 8.9,
    status: 'active',
    growth: -3.2,
  },
  {
    id: 3,
    name: 'CRASH',
    type: 'Crash Game',
    totalBets: 12560,
    totalRevenue: 67400.75,
    totalPlayers: 890,
    avgBetSize: 5.37,
    winRate: 49.8,
    margin: 12.4,
    status: 'active',
    growth: 8.7,
  },
  {
    id: 4,
    name: 'MINES',
    type: 'Strategy',
    totalBets: 8750,
    totalRevenue: 45600.3,
    totalPlayers: 650,
    avgBetSize: 5.21,
    winRate: 47.2,
    margin: 18.6,
    status: 'maintenance',
    growth: 0,
  },
  {
    id: 5,
    name: 'DICE',
    type: 'Classic',
    totalBets: 22100,
    totalRevenue: 125400.8,
    totalPlayers: 1800,
    avgBetSize: 5.67,
    winRate: 51.3,
    margin: 9.8,
    status: 'active',
    growth: 15.3,
  },
]

export function GamePerformanceAnalytics() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('revenue')

  const filteredGames = sampleGames
    .filter(game => game.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b.totalRevenue - a.totalRevenue
        case 'players':
          return b.totalPlayers - a.totalPlayers
        case 'margin':
          return b.margin - a.margin
        default:
          return 0
      }
    })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant='default' className='bg-green-100 text-green-800'>
            Active
          </Badge>
        )
      case 'maintenance':
        return (
          <Badge variant='secondary' className='bg-yellow-100 text-yellow-800'>
            Maintenance
          </Badge>
        )
      default:
        return <Badge variant='outline'>Unknown</Badge>
    }
  }

  const getGrowthIndicator = (growth: number) => {
    if (growth > 0) {
      return (
        <div className='flex items-center gap-1 text-green-600'>
          <TrendingUp className='h-4 w-4' />
          <span>+{growth}%</span>
        </div>
      )
    } else if (growth < 0) {
      return (
        <div className='flex items-center gap-1 text-red-600'>
          <TrendingDown className='h-4 w-4' />
          <span>{growth}%</span>
        </div>
      )
    } else {
      return (
        <div className='flex items-center gap-1 text-gray-500'>
          <span>0%</span>
        </div>
      )
    }
  }

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Game Performance Analytics</h1>
          <p className='text-muted-foreground mt-1'>Detailed performance metrics for all games</p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            size='sm'
            className='bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
          >
            <RefreshCw className='h-4 w-4 mr-2' />
            Refresh Data
          </Button>
          <Button
            size='sm'
            className='bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
          >
            <Download className='h-4 w-4 mr-2' />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                placeholder='Search games...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
            <div className='flex gap-2'>
              <Button
                variant={sortBy === 'revenue' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setSortBy('revenue')}
              >
                Sort by Revenue
              </Button>
              <Button
                variant={sortBy === 'players' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setSortBy('players')}
              >
                Sort by Players
              </Button>
              <Button
                variant={sortBy === 'margin' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setSortBy('margin')}
              >
                Sort by Margin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Cards */}
      <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        {filteredGames.map(game => (
          <Card key={game.id} className='hover:shadow-lg transition-shadow'>
            <CardHeader className='pb-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                    <Gamepad2 className='h-6 w-6 text-primary' />
                  </div>
                  <div>
                    <CardTitle className='text-lg'>{game.name}</CardTitle>
                    <p className='text-sm text-muted-foreground'>{game.type}</p>
                  </div>
                </div>
                {getStatusBadge(game.status)}
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Key Metrics */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='text-center p-3 bg-muted/50 rounded-lg'>
                  <DollarSign className='h-5 w-5 mx-auto mb-1 text-green-600' />
                  <p className='text-sm font-medium'>₹{game.totalRevenue.toLocaleString()}</p>
                  <p className='text-xs text-muted-foreground'>Total Revenue</p>
                </div>
                <div className='text-center p-3 bg-muted/50 rounded-lg'>
                  <Users className='h-5 w-5 mx-auto mb-1 text-blue-600' />
                  <p className='text-sm font-medium'>{game.totalPlayers.toLocaleString()}</p>
                  <p className='text-xs text-muted-foreground'>Total Players</p>
                </div>
              </div>

              {/* Additional Stats */}
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>Total Bets</span>
                  <span className='font-medium'>{game.totalBets.toLocaleString()}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>Avg Bet Size</span>
                  <span className='font-medium'>₹{game.avgBetSize}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>Win Rate</span>
                  <span className='font-medium'>{game.winRate}%</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>House Margin</span>
                  <span className='font-medium text-green-600'>{game.margin}%</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>Growth</span>
                  {getGrowthIndicator(game.growth)}
                </div>
              </div>

              {/* Action Button */}
              <Button className='w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'>
                View Detailed Analytics
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <Card>
          <CardContent className='p-12 text-center'>
            <Gamepad2 className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
            <h3 className='text-lg font-medium mb-2'>No games found</h3>
            <p className='text-muted-foreground'>Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
