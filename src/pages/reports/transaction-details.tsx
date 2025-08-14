/**
 * Transaction Details Page - Enhanced Creative UI
 * Beautiful, comprehensive view of a single transaction with stunning visual design
 * Features glass morphism, gradient backgrounds, and modern animations
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  RefreshCw,
  Copy,
  CheckCircle2,
  Info,
  Gamepad2,
  User,
  CreditCard,
  Calendar,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Award,
  Zap,
  Building,
  Globe,
  Hash,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTransactionDetails } from '@/hooks/queries/useTransactionQueries'
import {
  formatCurrency,
  formatDateSafe,
  getStatusColorClass,
  getStatusDisplayText,
  calculateProfitLoss,
  formatProfitLoss,
  calculateMultiplier,
  formatMultiplier,
} from '@/lib/utils/transaction'
import { cn } from '@/lib/utils'

// Enhanced copy button with beautiful animations
function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant='ghost'
        size='sm'
        onClick={handleCopy}
        className={cn(
          'h-8 px-3 rounded-lg transition-all duration-300',
          'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50',
          'dark:hover:from-blue-950/50 dark:hover:to-purple-950/50',
          'border border-transparent hover:border-blue-200 dark:hover:border-blue-800',
          copied && 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800'
        )}
      >
        <AnimatePresence mode='wait'>
          {copied ? (
            <motion.div
              key='check'
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className='flex items-center gap-1.5 text-green-600'
            >
              <CheckCircle2 className='h-3.5 w-3.5' />
              <span className='text-xs font-medium'>Copied!</span>
            </motion.div>
          ) : (
            <motion.div
              key='copy'
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className='flex items-center gap-1.5 text-gray-600 dark:text-gray-400'
            >
              <Copy className='h-3.5 w-3.5' />
              <span className='text-xs font-medium'>{label || 'Copy'}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  )
}

// Enhanced stats card with gradient and glow effects
function StatsCard({
  icon: Icon,
  title,
  value,
  subtitle,
  colorClass = 'blue',
  trend,
}: {
  icon: any
  title: string
  value: string
  subtitle?: string
  colorClass?: string
  trend?: 'up' | 'down' | 'neutral'
}) {
  const gradients = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    red: 'from-red-500 to-pink-500',
    purple: 'from-purple-500 to-violet-500',
    orange: 'from-orange-500 to-yellow-500',
  }

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className='group'
    >
      <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500'>
        {/* Glow effect */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500',
            gradients[colorClass as keyof typeof gradients]
          )}
        />

        {/* Sparkle decoration */}
        <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
          <Sparkles className='h-4 w-4 text-yellow-400' />
        </div>

        <CardContent className='p-4 sm:p-6'>
          <div className='flex items-center justify-between mb-3 sm:mb-4'>
            <div
              className={cn(
                'p-2 sm:p-3 rounded-xl bg-gradient-to-br shadow-lg',
                gradients[colorClass as keyof typeof gradients]
              )}
            >
              <Icon className='h-5 w-5 sm:h-6 sm:w-6 text-white' />
            </div>
            {TrendIcon && (
              <div
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                  trend === 'up' &&
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                  trend === 'down' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                )}
              >
                <TrendIcon className='h-3 w-3' />
              </div>
            )}
          </div>

          <div className='space-y-1'>
            <p className='text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400'>
              {title}
            </p>
            <p className='text-lg sm:text-2xl font-bold text-gray-900 dark:text-white break-words'>
              {value}
            </p>
            {subtitle && <p className='text-xs text-gray-500 dark:text-gray-500'>{subtitle}</p>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Enhanced detail card with beautiful layouts
function DetailCard({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string
  icon: any
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='group'>
      <Card
        className={cn(
          'border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80',
          'backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-500',
          'group-hover:shadow-2xl',
          className
        )}
      >
        <CardHeader className='pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6'>
          <CardTitle className='flex items-center gap-2 sm:gap-3 text-base sm:text-lg'>
            <div className='p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg'>
              <Icon className='h-4 w-4 sm:h-5 sm:w-5 text-white' />
            </div>
            <span className='bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent'>
              {title}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-0 px-4 sm:px-6 pb-4 sm:pb-6'>{children}</CardContent>
      </Card>
    </motion.div>
  )
}

// Enhanced detail row component
function DetailRow({
  label,
  value,
  copyable = false,
  icon: Icon,
}: {
  label: string
  value: string | React.ReactNode
  copyable?: boolean
  icon?: any
}) {
  return (
    <div className='py-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3'>
        <div className='flex items-center gap-2 sm:gap-3 min-w-0'>
          {Icon && (
            <div className='p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0'>
              <Icon className='h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400' />
            </div>
          )}
          <span className='text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate'>
            {label}
          </span>
        </div>
        <div className='flex items-center gap-2 ml-6 sm:ml-0 flex-shrink-0'>
          <div className='text-xs sm:text-sm font-semibold text-gray-900 dark:text-white break-all sm:break-normal min-w-0'>
            {value}
          </div>
          {copyable && typeof value === 'string' && <CopyButton text={value} />}
        </div>
      </div>
    </div>
  )
}

export function TransactionDetailsPage() {
  const { betTxnId } = useParams<{ betTxnId: string }>()
  const navigate = useNavigate()

  // Fetch transaction details
  const {
    data: transaction,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useTransactionDetails(betTxnId || '')

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [betTxnId])

  // Manual refresh
  const handleRefresh = async () => {
    await refetch()
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800'>
        <div className='flex items-center justify-center min-h-[60vh]'>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className='text-center space-y-4'
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className='mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'
            >
              <Sparkles className='h-8 w-8 text-white' />
            </motion.div>
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Loading Transaction Details
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Fetching comprehensive transaction data...
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800'>
        <div className='flex items-center justify-center min-h-[60vh]'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-center space-y-4 max-w-md mx-auto px-4'
          >
            <div className='w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto'>
              <Info className='h-8 w-8 text-white' />
            </div>
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Error Loading Transaction
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                {error instanceof Error ? error.message : 'Unable to fetch transaction details'}
              </p>
            </div>
            <div className='flex gap-3 justify-center'>
              <Button
                onClick={() => navigate('/reports/transactions')}
                variant='outline'
                className='border-gray-300'
              >
                <ArrowLeft className='h-4 w-4 mr-2' />
                Back to Transactions
              </Button>
              <Button
                onClick={handleRefresh}
                className='bg-gradient-to-r from-blue-500 to-purple-500'
              >
                <RefreshCw className='h-4 w-4 mr-2' />
                Try Again
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!transaction?.rounds) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800'>
        <div className='flex items-center justify-center min-h-[60vh]'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='text-center space-y-4'
          >
            <div className='w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto'>
              <Gamepad2 className='h-8 w-8 text-white' />
            </div>
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Transaction Not Found
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                No transaction found with ID: {betTxnId}
              </p>
            </div>
            <Button
              onClick={() => navigate('/reports/transactions')}
              className='bg-gradient-to-r from-blue-500 to-purple-500'
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Transactions
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  const round = transaction.rounds
  const profitLoss = calculateProfitLoss(round.betAmount || 0, round.winAmount || 0)
  const multiplier = calculateMultiplier(round.betAmount || 0, round.winAmount || 0)

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800'>
      {/* Header with floating navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50'
      >
        <div className='max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0 flex-1'>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate('/reports/transactions')}
                  variant='ghost'
                  size='sm'
                  className='rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 backdrop-blur-sm w-fit'
                >
                  <ArrowLeft className='h-4 w-4 mr-2' />
                  <span className='hidden xs:inline'>Back to Transactions</span>
                  <span className='xs:hidden'>Back</span>
                </Button>
              </motion.div>

              <div className='min-w-0 flex-1'>
                <h1 className='text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent'>
                  Transaction Details
                </h1>
              </div>
            </div>

            <div className='flex items-center gap-2 sm:gap-3 flex-shrink-0'>
              <Badge
                className={cn(
                  'px-2 sm:px-3 py-1 rounded-full text-xs font-medium border',
                  getStatusColorClass(round.status)
                )}
              >
                {getStatusDisplayText(round.status)}
              </Badge>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleRefresh}
                  disabled={isFetching}
                  size='sm'
                  className='rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg'
                >
                  <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} />
                  <span className='ml-2 hidden sm:inline'>Refresh Data</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className='max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8'>
        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'
        >
          <StatsCard
            icon={CreditCard}
            title='Bet Amount'
            value={formatCurrency(round.betAmount || 0, round.playerCurrencyCode)}
            subtitle='Player stake'
            colorClass='blue'
          />

          <StatsCard
            icon={Award}
            title='Win Amount'
            value={formatCurrency(round.winAmount || 0, round.playerCurrencyCode)}
            subtitle='Payout received'
            colorClass='green'
            trend={round.winAmount && round.winAmount > 0 ? 'up' : 'neutral'}
          />

          <StatsCard
            icon={TrendingUp}
            title='Profit/Loss'
            value={formatProfitLoss(profitLoss, round.playerCurrencyCode)}
            subtitle='Net result'
            colorClass={profitLoss > 0 ? 'green' : profitLoss < 0 ? 'red' : 'blue'}
            trend={profitLoss > 0 ? 'up' : profitLoss < 0 ? 'down' : 'neutral'}
          />

          <StatsCard
            icon={Zap}
            title='Multiplier'
            value={formatMultiplier(multiplier)}
            subtitle='Win ratio'
            colorClass='purple'
          />
        </motion.div>

        {/* Detail cards grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6'>
          {/* Transaction Information */}
          <DetailCard title='Transaction Information' icon={Hash}>
            <div className='space-y-0'>
              <DetailRow label='Transaction ID' value={round.betTxnId} copyable icon={Hash} />
              <DetailRow label='Round ID' value={round.roundId} copyable icon={Hash} />
              <DetailRow
                label='Session ID'
                value={round.playerSessionId || 'N/A'}
                copyable={!!round.playerSessionId}
                icon={Hash}
              />
              <DetailRow
                label='Platform Transaction ID'
                value={round.platformTransactionId || 'N/A'}
                copyable={!!round.platformTransactionId}
                icon={Hash}
              />
              <DetailRow
                label='User ID'
                value={round.user || 'N/A'}
                copyable={!!round.user}
                icon={User}
              />
              <DetailRow
                label='Transaction Date'
                value={formatDateSafe(round.createdAt)}
                icon={Calendar}
              />
              <DetailRow
                label='Last Updated'
                value={formatDateSafe(round.updatedAt)}
                icon={Calendar}
              />
              <DetailRow
                label='Status'
                value={
                  <Badge className={cn('px-2 py-1 text-xs', getStatusColorClass(round.status))}>
                    {getStatusDisplayText(round.status)}
                  </Badge>
                }
                icon={Info}
              />
              <DetailRow label='Is New BE' value={round.isNewBe ? 'Yes' : 'No'} icon={Info} />
            </div>
          </DetailCard>

          {/* Player Information */}
          <DetailCard title='Player Information' icon={User}>
            <div className='space-y-0'>
              <DetailRow label='Player ID' value={round.externalPlayerId} copyable icon={User} />
              <DetailRow
                label='Balance'
                value={formatCurrency(round.balance || 0, round.playerCurrencyCode)}
                icon={CreditCard}
              />
              <DetailRow label='Currency' value={round.playerCurrencyCode} icon={Globe} />
              <DetailRow label='Free Bet' value={round.isFreeBet ? 'Yes' : 'No'} icon={Award} />
            </div>
          </DetailCard>

          {/* Platform Information */}
          <DetailCard title='Platform Information' icon={Building}>
            <div className='space-y-0'>
              <DetailRow
                label='Platform'
                value={round.platform?.platformName || 'N/A'}
                icon={Building}
              />
              <DetailRow
                label='Platform ID'
                value={round.platform?.id || 'N/A'}
                copyable={!!round.platform?.id}
                icon={Hash}
              />
              <DetailRow
                label='Operator'
                value={round.operator?.operatorName || 'N/A'}
                icon={Building}
              />
              <DetailRow
                label='Operator ID'
                value={round.operator?.id || 'N/A'}
                copyable={!!round.operator?.id}
                icon={Hash}
              />
              <DetailRow label='Brand' value={round.brand?.brandName || 'N/A'} icon={Building} />
              <DetailRow
                label='Brand ID'
                value={round.brand?.id || 'N/A'}
                copyable={!!round.brand?.id}
                icon={Hash}
              />
            </div>
          </DetailCard>

          {/* Game Information */}
          <DetailCard title='Game Information' icon={Gamepad2}>
            <div className='space-y-0'>
              <DetailRow label='Game Name' value={round.gameAlias || 'N/A'} icon={Gamepad2} />
              <DetailRow
                label='Operator Game'
                value={round.operatorGame || 'N/A'}
                icon={Gamepad2}
              />
              <DetailRow label='Buy Bonus' value={round.buyBonus ? 'Yes' : 'No'} icon={Award} />
              <DetailRow
                label='Completed'
                value={round.isCompleted ? 'Yes' : 'No'}
                icon={CheckCircle2}
              />
            </div>
          </DetailCard>

          {/* Bet Amounts */}
          <DetailCard title='Bet Amount Details' icon={CreditCard}>
            <div className='space-y-0'>
              <DetailRow
                label='Bet Amount'
                value={formatCurrency(round.betAmount || 0, round.playerCurrencyCode)}
                icon={CreditCard}
              />
              {round.betAmtConverted && (
                <>
                  <DetailRow
                    label='INR Equivalent'
                    value={formatCurrency(round.betAmtConverted.INR || 0, 'INR')}
                    icon={Globe}
                  />
                  <DetailRow
                    label='USD Equivalent'
                    value={formatCurrency(round.betAmtConverted.USD || 0, 'USD')}
                    icon={Globe}
                  />
                  <DetailRow
                    label='EUR Equivalent'
                    value={formatCurrency(round.betAmtConverted.EUR || 0, 'EUR')}
                    icon={Globe}
                  />
                </>
              )}
            </div>
          </DetailCard>

          {/* Win Amounts */}
          {round.winAmount !== undefined && (
            <DetailCard title='Win Amount Details' icon={Award}>
              <div className='space-y-0'>
                <DetailRow
                  label='Win Amount'
                  value={formatCurrency(round.winAmount || 0, round.playerCurrencyCode)}
                  icon={Award}
                />
                {round.winAmtConverted && (
                  <>
                    <DetailRow
                      label='INR Equivalent'
                      value={formatCurrency(round.winAmtConverted.INR || 0, 'INR')}
                      icon={Globe}
                    />
                    <DetailRow
                      label='USD Equivalent'
                      value={formatCurrency(round.winAmtConverted.USD || 0, 'USD')}
                      icon={Globe}
                    />
                    <DetailRow
                      label='EUR Equivalent'
                      value={formatCurrency(round.winAmtConverted.EUR || 0, 'EUR')}
                      icon={Globe}
                    />
                  </>
                )}
              </div>
            </DetailCard>
          )}

          {/* Bet Information - if available */}
          {round.betInfo && (
            <>
              <DetailCard title='Bet Details' icon={Info} className='lg:col-span-2 xl:col-span-1'>
                <div className='space-y-0'>
                  <DetailRow
                    label='Bet ID'
                    value={round.betInfo.betId || 'N/A'}
                    copyable={!!round.betInfo.betId}
                    icon={Hash}
                  />
                  <DetailRow
                    label='Game Code'
                    value={round.betInfo.gameCode || 'N/A'}
                    icon={Gamepad2}
                  />
                  <DetailRow
                    label='Game Mode'
                    value={round.betInfo.gameMode || 'N/A'}
                    icon={Gamepad2}
                  />
                  <DetailRow
                    label='Created At'
                    value={formatDateSafe(round.betInfo.createdAt)}
                    icon={Calendar}
                  />
                  <DetailRow
                    label='Active'
                    value={round.betInfo.active ? 'Yes' : 'No'}
                    icon={Info}
                  />
                  <DetailRow
                    label='Nonce'
                    value={round.betInfo.nonce?.toString() || 'N/A'}
                    icon={Hash}
                  />
                </div>
              </DetailCard>

              <DetailCard title='Payout Information' icon={TrendingUp}>
                <div className='space-y-0'>
                  <DetailRow
                    label='Payout'
                    value={formatCurrency(
                      round.betInfo.payout || 0,
                      round.betInfo.currency || round.playerCurrencyCode
                    )}
                    icon={Award}
                  />
                  <DetailRow
                    label='Payout Multiplier'
                    value={`${round.betInfo.payoutMultiplier || 0}x`}
                    icon={TrendingUp}
                  />
                  {round.betInfo.winChance && (
                    <DetailRow
                      label='Win Chance'
                      value={`${round.betInfo.winChance}%`}
                      icon={TrendingUp}
                    />
                  )}
                  {round.betInfo.cashOutAt && (
                    <DetailRow
                      label='Cash Out At'
                      value={round.betInfo.cashOutAt?.toString() || 'N/A'}
                      icon={Clock}
                    />
                  )}
                  {round.betInfo.targetMultiplier && (
                    <DetailRow
                      label='Target Multiplier'
                      value={`${round.betInfo.targetMultiplier}x`}
                      icon={Zap}
                    />
                  )}
                  {round.betInfo.crashMultiplier && (
                    <DetailRow
                      label='Crash Multiplier'
                      value={`${round.betInfo.crashMultiplier}x`}
                      icon={TrendingDown}
                    />
                  )}
                  {round.betInfo.btnIndex !== undefined && round.betInfo.btnIndex !== null && (
                    <DetailRow
                      label='Button Index'
                      value={round.betInfo.btnIndex?.toString() || 'N/A'}
                      icon={Info}
                    />
                  )}
                </div>
              </DetailCard>

              {/* Game State - if available */}
              {round.betInfo.state && (
                <DetailCard title='Game State' icon={Info} className='lg:col-span-2 xl:col-span-3'>
                  <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 sm:p-4'>
                    <pre className='text-xs sm:text-sm text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap break-words'>
                      {JSON.stringify(round.betInfo.state, null, 2)}
                    </pre>
                  </div>
                </DetailCard>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
