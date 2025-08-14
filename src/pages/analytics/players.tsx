/**
 * Player Analytics Page
 * Detailed analytics for player behavior and demographics
 */

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Users,
  TrendingUp,
  TrendingDown,
  UserCheck,
  UserX,
  Clock,
  DollarSign,
  Search,
  Download,
  RefreshCw,
  Activity,
  Star,
} from 'lucide-react'

const samplePlayers = [
  {
    id: 1,
    username: 'player_123',
    email: 'player123@example.com',
    joinDate: '2024-01-15',
    status: 'active',
    totalBets: 1580,
    totalWagered: 8750.5,
    totalWinnings: 6250.3,
    favoriteGame: 'AVIATORX',
    sessionTime: 245,
    vipLevel: 'Gold',
    growth: 15.2,
  },
  {
    id: 2,
    username: 'lucky_winner',
    email: 'winner@example.com',
    joinDate: '2024-02-03',
    status: 'active',
    totalBets: 2150,
    totalWagered: 12400.8,
    totalWinnings: 9800.45,
    favoriteGame: 'PLINKO',
    sessionTime: 320,
    vipLevel: 'Platinum',
    growth: 8.7,
  },
  {
    id: 3,
    username: 'casino_pro',
    email: 'pro@example.com',
    joinDate: '2023-11-20',
    status: 'active',
    totalBets: 4200,
    totalWagered: 28750.9,
    totalWinnings: 18200.6,
    favoriteGame: 'DICE',
    sessionTime: 890,
    vipLevel: 'Diamond',
    growth: 22.1,
  },
  {
    id: 4,
    username: 'new_player',
    email: 'newbie@example.com',
    joinDate: '2024-03-10',
    status: 'inactive',
    totalBets: 45,
    totalWagered: 275.2,
    totalWinnings: 150.8,
    favoriteGame: 'CRASH',
    sessionTime: 15,
    vipLevel: 'Bronze',
    growth: -5.3,
  },
  {
    id: 5,
    username: 'high_roller',
    email: 'roller@example.com',
    joinDate: '2023-08-12',
    status: 'active',
    totalBets: 8950,
    totalWagered: 145600.75,
    totalWinnings: 98750.2,
    favoriteGame: 'MINES',
    sessionTime: 1250,
    vipLevel: 'Diamond',
    growth: 12.8,
  },
]

const playerStats = {
  totalPlayers: 15420,
  activeToday: 3250,
  newThisMonth: 890,
  avgSessionTime: 185,
  retentionRate: 68.5,
  conversionRate: 12.3,
}

export function PlayerAnalytics() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPlayers = samplePlayers.filter(
    player =>
      player.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant='default' className='bg-green-100 text-green-800'>
            Active
          </Badge>
        )
      case 'inactive':
        return (
          <Badge variant='secondary' className='bg-gray-100 text-gray-800'>
            Inactive
          </Badge>
        )
      default:
        return <Badge variant='outline'>Unknown</Badge>
    }
  }

  const getVipLevelBadge = (level: string) => {
    const colors = {
      Bronze: 'bg-orange-100 text-orange-800',
      Gold: 'bg-yellow-100 text-yellow-800',
      Platinum: 'bg-purple-100 text-purple-800',
      Diamond: 'bg-blue-100 text-blue-800',
    }

    return (
      <Badge
        variant='outline'
        className={colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800'}
      >
        <Star className='h-3 w-3 mr-1' />
        {level}
      </Badge>
    )
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
          <h1 className='text-3xl font-bold tracking-tight'>Player Analytics</h1>
          <p className='text-muted-foreground mt-1'>
            Comprehensive player behavior and performance insights
          </p>
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

      {/* Overview Stats */}
      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center'>
                <Users className='h-6 w-6 text-blue-600' />
              </div>
              <div>
                <p className='text-2xl font-bold'>{playerStats.totalPlayers.toLocaleString()}</p>
                <p className='text-muted-foreground'>Total Players</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center'>
                <UserCheck className='h-6 w-6 text-green-600' />
              </div>
              <div>
                <p className='text-2xl font-bold'>{playerStats.activeToday.toLocaleString()}</p>
                <p className='text-muted-foreground'>Active Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center'>
                <TrendingUp className='h-6 w-6 text-purple-600' />
              </div>
              <div>
                <p className='text-2xl font-bold'>{playerStats.newThisMonth}</p>
                <p className='text-muted-foreground'>New This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center'>
                <Clock className='h-6 w-6 text-orange-600' />
              </div>
              <div>
                <p className='text-2xl font-bold'>{playerStats.avgSessionTime}</p>
                <p className='text-muted-foreground'>Avg Session (min)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center'>
                <Activity className='h-6 w-6 text-indigo-600' />
              </div>
              <div>
                <p className='text-2xl font-bold'>{playerStats.retentionRate}%</p>
                <p className='text-muted-foreground'>Retention Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-lg bg-pink-100 flex items-center justify-center'>
                <TrendingUp className='h-6 w-6 text-pink-600' />
              </div>
              <div>
                <p className='text-2xl font-bold'>{playerStats.conversionRate}%</p>
                <p className='text-muted-foreground'>Conversion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Player Search */}
      <Card>
        <CardContent className='p-6'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            <Input
              placeholder='Search players by username or email...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
        </CardContent>
      </Card>

      {/* Player Cards */}
      <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        {filteredPlayers.map(player => (
          <Card key={player.id} className='hover:shadow-lg transition-shadow'>
            <CardHeader className='pb-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg'>{player.username}</CardTitle>
                  <p className='text-sm text-muted-foreground'>{player.email}</p>
                </div>
                {getStatusBadge(player.status)}
              </div>
              <div className='flex justify-between items-center'>
                {getVipLevelBadge(player.vipLevel)}
                {getGrowthIndicator(player.growth)}
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Key Metrics */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='text-center p-3 bg-muted/50 rounded-lg'>
                  <DollarSign className='h-5 w-5 mx-auto mb-1 text-green-600' />
                  <p className='text-sm font-medium'>₹{player.totalWagered.toLocaleString()}</p>
                  <p className='text-xs text-muted-foreground'>Total Wagered</p>
                </div>
                <div className='text-center p-3 bg-muted/50 rounded-lg'>
                  <TrendingUp className='h-5 w-5 mx-auto mb-1 text-blue-600' />
                  <p className='text-sm font-medium'>₹{player.totalWinnings.toLocaleString()}</p>
                  <p className='text-xs text-muted-foreground'>Total Winnings</p>
                </div>
              </div>

              {/* Additional Stats */}
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>Total Bets</span>
                  <span className='font-medium'>{player.totalBets.toLocaleString()}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>Favorite Game</span>
                  <span className='font-medium'>{player.favoriteGame}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>Session Time</span>
                  <span className='font-medium'>{player.sessionTime}min</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>Join Date</span>
                  <span className='font-medium'>
                    {new Date(player.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <Button className='w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'>
                View Player Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <Card>
          <CardContent className='p-12 text-center'>
            <UserX className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
            <h3 className='text-lg font-medium mb-2'>No players found</h3>
            <p className='text-muted-foreground'>Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
