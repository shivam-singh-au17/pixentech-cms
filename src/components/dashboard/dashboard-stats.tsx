/**
 * Dashboard Stats Cards
 * Display key metrics in card format
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Percent } from 'lucide-react'
import { commaSeparated, formatCurrency } from '@/lib/utils/dashboard'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  format?: 'currency' | 'percentage' | 'number'
  currency?: string
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  format = 'number',
  currency = 'INR',
}: StatsCardProps) {
  const formatValue = (val: string | number) => {
    if (format === 'currency') {
      return formatCurrency(val, currency)
    } else if (format === 'percentage') {
      const numValue = Number(val)
      if (isNaN(numValue)) {
        return '0.00%'
      }
      return `${numValue.toFixed(2)}%`
    } else {
      return commaSeparated(val)
    }
  }

  const getValueColor = () => {
    if (format === 'percentage' || title.toLowerCase().includes('ggr')) {
      const numValue = Number(value)
      return numValue >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    }
    return 'text-foreground'
  }

  const getIconBackground = () => {
    if (format === 'percentage' || title.toLowerCase().includes('ggr')) {
      const numValue = Number(value)
      return numValue >= 0
        ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
        : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
    }
    return 'bg-primary/10 text-primary dark:bg-primary/20'
  }

  return (
    <Card className='relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 group border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900'>
      <div className='absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 relative z-10'>
        <CardTitle className='text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors'>
          {title}
        </CardTitle>
        <div
          className={cn(
            'h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300',
            getIconBackground()
          )}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent className='relative z-10'>
        <div className={cn('text-2xl font-bold transition-colors duration-300', getValueColor())}>
          {formatValue(value)}
        </div>
        {trend && (
          <div className='flex items-center pt-2'>
            {trend.isPositive ? (
              <TrendingUp className='h-4 w-4 text-green-600 dark:text-green-400' />
            ) : (
              <TrendingDown className='h-4 w-4 text-red-600 dark:text-red-400' />
            )}
            <span
              className={cn(
                'text-xs ml-1 font-medium',
                trend.isPositive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              )}
            >
              {Math.abs(trend.value).toFixed(1)}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface DashboardStatsProps {
  data: {
    uniqueUsers: number
    betCount: number
    turnOver: number
    wonAmount: number
    ggr: number
    ggrInPercentage: number
  }
  currency: string
}

export function DashboardStats({ data, currency }: DashboardStatsProps) {
  console.log('DashboardStats received data:', data)

  const stats = [
    {
      title: 'Unique Users',
      value: data.uniqueUsers,
      icon: <Users className='h-4 w-4' />,
      format: 'number' as const,
    },
    {
      title: 'Bet Count',
      value: data.betCount,
      icon: <Target className='h-4 w-4' />,
      format: 'number' as const,
    },
    {
      title: 'Turnover',
      value: data.turnOver,
      icon: <DollarSign className='h-4 w-4' />,
      format: 'currency' as const,
    },
    {
      title: 'Won Amount',
      value: data.wonAmount,
      icon: <DollarSign className='h-4 w-4' />,
      format: 'currency' as const,
    },
    {
      title: 'GGR',
      value: data.ggr,
      icon: <TrendingUp className='h-4 w-4' />,
      format: 'currency' as const,
    },
    {
      title: 'GGR (%)',
      value: data.ggrInPercentage,
      icon: <Percent className='h-4 w-4' />,
      format: 'percentage' as const,
    },
  ]

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          format={stat.format}
          currency={currency}
        />
      ))}
    </div>
  )
}
