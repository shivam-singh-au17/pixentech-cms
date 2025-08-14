/**
 * Game Details Component
 * View detailed game information with responsive design and comprehensive data display
 */

import { motion } from 'framer-motion'
import {
  Gamepad2,
  Calendar,
  Settings,
  DollarSign,
  Zap,
  ToggleRight,
  ToggleLeft,
  ExternalLink,
  Shield,
  Target,
  TrendingUp,
  Database,
  Code,
  User,
  Users,
  Play,
  Coins,
  BarChart3,
  Layers,
  Hash,
  Globe,
  Cpu,
  Activity,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatDateSafe } from '@/lib/utils/summary'
import type { Game } from '@/lib/api/game'

interface GameDetailsProps {
  game: Game
}

export function GameDetails({ game }: GameDetailsProps) {
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const getGameTypeInfo = (type: string | undefined) => {
    switch (type?.toLowerCase()) {
      case 'pg':
        return {
          label: 'Provably Fair',
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        }
      case 'sg':
        return {
          label: 'Slot Game',
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
        }
      case 'cg':
        return {
          label: 'Crash Game',
          color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
        }
      default:
        return {
          label: type?.toUpperCase() || 'Unknown',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
        }
    }
  }

  const gameTypeInfo = getGameTypeInfo(game.gameType)

  return (
    <div className='w-full max-w-full'>
      <div className='space-y-4 sm:space-y-6'>
        {/* Game Header Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader className='pb-4'>
              <div className='flex flex-col sm:flex-row sm:items-start gap-4'>
                <div className='flex items-center gap-3 flex-1'>
                  <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'>
                    <Gamepad2 className='h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate'>
                      {game.gameName}
                    </h2>
                    <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-mono truncate'>
                      ID: {game._id}
                    </p>
                  </div>
                </div>
                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3'>
                  <Badge className={gameTypeInfo.color}>{gameTypeInfo.label}</Badge>
                  <Badge variant={game.isActive ? 'default' : 'secondary'} className='gap-2'>
                    {game.isActive ? (
                      <ToggleRight className='h-3 w-3' />
                    ) : (
                      <ToggleLeft className='h-3 w-3' />
                    )}
                    {game.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className='pt-0'>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Hash className='h-4 w-4 text-gray-500' />
                    <span className='text-sm font-medium'>Game Alias</span>
                  </div>
                  <Badge variant='outline' className='font-mono text-xs'>
                    {game.gameAlias}
                  </Badge>
                </div>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Settings className='h-4 w-4 text-gray-500' />
                    <span className='text-sm font-medium'>Game Mode</span>
                  </div>
                  <Badge variant='secondary' className='text-xs'>
                    {game.gameMode ? `Mode ${game.gameMode}` : 'N/A'}
                  </Badge>
                </div>
                {game.gameId && (
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Database className='h-4 w-4 text-gray-500' />
                      <span className='text-sm font-medium'>Game ID</span>
                    </div>
                    <Badge variant='outline' className='font-mono text-xs'>
                      {game.gameId}
                    </Badge>
                  </div>
                )}
                {game.extraData && (
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Code className='h-4 w-4 text-gray-500' />
                      <span className='text-sm font-medium'>Extra Data</span>
                    </div>
                    <Badge variant='outline' className='text-xs'>
                      {game.extraData}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Financial Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
                <DollarSign className='h-4 w-4 sm:h-5 sm:w-5' />
                Financial Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                <div className='p-3 rounded-lg border bg-green-50 dark:bg-green-900/10'>
                  <div className='flex items-center gap-2 mb-2'>
                    <DollarSign className='h-4 w-4 text-green-600' />
                    <span className='text-sm font-medium'>Min Bet</span>
                  </div>
                  <p className='text-lg font-bold text-green-700 dark:text-green-400'>
                    {formatCurrency(game.minBet)}
                  </p>
                </div>
                <div className='p-3 rounded-lg border bg-red-50 dark:bg-red-900/10'>
                  <div className='flex items-center gap-2 mb-2'>
                    <DollarSign className='h-4 w-4 text-red-600' />
                    <span className='text-sm font-medium'>Max Bet</span>
                  </div>
                  <p className='text-lg font-bold text-red-700 dark:text-red-400'>
                    {formatCurrency(game.maxBet)}
                  </p>
                </div>
                <div className='p-3 rounded-lg border bg-blue-50 dark:bg-blue-900/10'>
                  <div className='flex items-center gap-2 mb-2'>
                    <TrendingUp className='h-4 w-4 text-blue-600' />
                    <span className='text-sm font-medium'>Default Bet</span>
                  </div>
                  <p className='text-lg font-bold text-blue-700 dark:text-blue-400'>
                    {formatCurrency(game.defaultBet)}
                  </p>
                </div>
                <div className='p-3 rounded-lg border bg-purple-50 dark:bg-purple-900/10'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Shield className='h-4 w-4 text-purple-600' />
                    <span className='text-sm font-medium'>Max Win</span>
                  </div>
                  <p className='text-lg font-bold text-purple-700 dark:text-purple-400'>
                    {formatCurrency(game.maxWin || game.maxPayoutMultiplier)}
                  </p>
                </div>
              </div>

              {/* Additional Financial Data for Slot Games */}
              {game.gameType === 'sg' && (
                <>
                  <Separator className='my-4' />
                  <div className='space-y-4'>
                    <h4 className='text-sm font-semibold flex items-center gap-2'>
                      <BarChart3 className='h-4 w-4' />
                      Slot Game Configuration
                    </h4>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                      {game.baseGame && (
                        <div className='space-y-2'>
                          <span className='text-xs text-gray-600'>Base Game</span>
                          <p className='font-semibold'>{game.baseGame}</p>
                        </div>
                      )}
                      {game.freeGame && (
                        <div className='space-y-2'>
                          <span className='text-xs text-gray-600'>Free Game</span>
                          <p className='font-semibold'>{game.freeGame}</p>
                        </div>
                      )}
                      {game.bbMaxPayoutMultiplier && (
                        <div className='space-y-2'>
                          <span className='text-xs text-gray-600'>BB Max Payout Multiplier</span>
                          <p className='font-semibold'>{game.bbMaxPayoutMultiplier}x</p>
                        </div>
                      )}
                      {game.maxPayoutMultiplier && (
                        <div className='space-y-2'>
                          <span className='text-xs text-gray-600'>Max Payout Multiplier</span>
                          <p className='font-semibold'>{game.maxPayoutMultiplier}x</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Possible Bets */}
              {game.possibleBets && game.possibleBets.length > 0 && (
                <>
                  <Separator className='my-4' />
                  <div className='space-y-3'>
                    <h4 className='text-sm font-semibold flex items-center gap-2'>
                      <Coins className='h-4 w-4' />
                      Possible Bets
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {game.possibleBets.map((bet, index) => (
                        <Badge key={index} variant='outline' className='text-xs'>
                          {formatCurrency(bet)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* RTP and Game Modes */}
        {(game.bbRtp || game.bbRtps || game.availableGameModes || game.automationRtps) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
                  <Activity className='h-4 w-4 sm:h-5 sm:w-5' />
                  RTP & Game Modes Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {game.bbRtp && (
                    <div className='p-3 rounded-lg border'>
                      <div className='flex items-center gap-2 mb-2'>
                        <TrendingUp className='h-4 w-4 text-blue-600' />
                        <span className='text-sm font-medium'>BB RTP</span>
                      </div>
                      <Badge variant='secondary'>{game.bbRtp}</Badge>
                    </div>
                  )}
                  {game.isAutomationRtp !== undefined && (
                    <div className='p-3 rounded-lg border'>
                      <div className='flex items-center gap-2 mb-2'>
                        <Cpu className='h-4 w-4 text-purple-600' />
                        <span className='text-sm font-medium'>Automation RTP</span>
                      </div>
                      <Badge variant={game.isAutomationRtp ? 'default' : 'secondary'}>
                        {game.isAutomationRtp ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  )}
                  {game.buyFeature !== undefined && (
                    <div className='p-3 rounded-lg border'>
                      <div className='flex items-center gap-2 mb-2'>
                        <Shield className='h-4 w-4 text-green-600' />
                        <span className='text-sm font-medium'>Buy Feature</span>
                      </div>
                      <Badge variant={game.buyFeature ? 'default' : 'secondary'}>
                        {game.buyFeature ? 'Available' : 'Not Available'}
                      </Badge>
                    </div>
                  )}
                  {game.freeSpin !== undefined && (
                    <div className='p-3 rounded-lg border'>
                      <div className='flex items-center gap-2 mb-2'>
                        <Zap className='h-4 w-4 text-yellow-600' />
                        <span className='text-sm font-medium'>Free Spin</span>
                      </div>
                      <Badge variant={game.freeSpin ? 'default' : 'secondary'}>
                        {game.freeSpin ? 'Available' : 'Not Available'}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* RTP Arrays */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                  {game.bbRtps && game.bbRtps.length > 0 && (
                    <div className='space-y-3'>
                      <h5 className='text-sm font-semibold'>BB RTPs</h5>
                      <div className='flex flex-wrap gap-2'>
                        {game.bbRtps.map((rtp, index) => (
                          <Badge key={index} variant='outline' className='text-xs'>
                            {rtp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {game.automationBBRtps && game.automationBBRtps.length > 0 && (
                    <div className='space-y-3'>
                      <h5 className='text-sm font-semibold'>Automation BB RTPs</h5>
                      <div className='flex flex-wrap gap-2'>
                        {game.automationBBRtps.map((rtp, index) => (
                          <Badge key={index} variant='outline' className='text-xs'>
                            {rtp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {game.automationRtps && game.automationRtps.length > 0 && (
                    <div className='space-y-3'>
                      <h5 className='text-sm font-semibold'>Automation RTPs</h5>
                      <div className='flex flex-wrap gap-2'>
                        {game.automationRtps.map((rtp, index) => (
                          <Badge key={index} variant='outline' className='text-xs'>
                            {rtp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {game.availableGameModes && game.availableGameModes.length > 0 && (
                    <div className='space-y-3'>
                      <h5 className='text-sm font-semibold'>Available Game Modes</h5>
                      <div className='flex flex-wrap gap-2'>
                        {game.availableGameModes.map((mode, index) => (
                          <Badge key={index} variant='secondary' className='text-xs'>
                            {mode}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* BB Bet Multipliers */}
                {game.bbBetMultiplier && game.bbBetMultiplier.length > 0 && (
                  <div className='space-y-3'>
                    <h5 className='text-sm font-semibold'>BB Bet Multipliers</h5>
                    <div className='flex flex-wrap gap-2'>
                      {game.bbBetMultiplier.map((multiplier, index) => (
                        <Badge key={index} variant='outline' className='text-xs'>
                          {multiplier}x
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* BB Bet Multiplier Settings */}
                {game.bbBetMultiplierSettings &&
                  Object.keys(game.bbBetMultiplierSettings).length > 0 && (
                    <div className='space-y-3'>
                      <h5 className='text-sm font-semibold'>BB Bet Multiplier Settings</h5>
                      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2'>
                        {Object.entries(game.bbBetMultiplierSettings).map(([key, value]) => (
                          <div key={key} className='p-2 rounded border text-center'>
                            <div className='text-xs text-gray-600'>{key}</div>
                            <div className='font-semibold text-sm'>{value}x</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Technical Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
                <Settings className='h-4 w-4 sm:h-5 sm:w-5' />
                Technical Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-2'>
                      <Globe className='h-4 w-4 text-gray-500' />
                      <span className='text-sm font-medium'>Home URL</span>
                    </div>
                    {game.homeURL ? (
                      <div className='flex flex-col sm:flex-row gap-2'>
                        <code className='flex-1 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded break-all'>
                          {game.homeURL}
                        </code>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => window.open(game.homeURL, '_blank')}
                          className='gap-2 self-start'
                        >
                          <ExternalLink className='h-3 w-3' />
                          Open
                        </Button>
                      </div>
                    ) : (
                      <span className='text-sm text-gray-500'>No URL configured</span>
                    )}
                  </div>

                  <div className='space-y-3'>
                    <div className='flex items-center gap-2'>
                      <Play className='h-4 w-4 text-gray-500' />
                      <span className='text-sm font-medium'>Launch Path</span>
                    </div>
                    {game.launchPath ? (
                      <code className='block text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded break-all'>
                        {game.launchPath}
                      </code>
                    ) : (
                      <span className='text-sm text-gray-500'>Not specified</span>
                    )}
                  </div>

                  {game.basicLaunchPath && (
                    <div className='space-y-3'>
                      <div className='flex items-center gap-2'>
                        <Layers className='h-4 w-4 text-gray-500' />
                        <span className='text-sm font-medium'>Basic Launch Path</span>
                      </div>
                      <code className='block text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded break-all'>
                        {game.basicLaunchPath}
                      </code>
                    </div>
                  )}
                </div>

                <div className='space-y-4'>
                  {game.icon && (
                    <div className='space-y-3'>
                      <div className='flex items-center gap-2'>
                        <Target className='h-4 w-4 text-gray-500' />
                        <span className='text-sm font-medium'>Game Icon</span>
                      </div>
                      <div className='flex items-center gap-3'>
                        <img
                          src={game.icon}
                          alt={game.gameName}
                          className='w-12 h-12 rounded border object-cover'
                          onError={e => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                        <code className='text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded break-all flex-1'>
                          {game.icon}
                        </code>
                      </div>
                    </div>
                  )}

                  {(game.createdBy || game.updatedBy) && (
                    <div className='space-y-3'>
                      <div className='flex items-center gap-2'>
                        <Users className='h-4 w-4 text-gray-500' />
                        <span className='text-sm font-medium'>Management</span>
                      </div>
                      <div className='space-y-2'>
                        {game.createdBy && (
                          <div className='flex items-center gap-2 text-sm'>
                            <User className='h-3 w-3' />
                            <span className='text-gray-600'>Created by:</span>
                            <code className='text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded'>
                              {game.createdBy}
                            </code>
                          </div>
                        )}
                        {game.updatedBy && (
                          <div className='flex items-center gap-2 text-sm'>
                            <User className='h-3 w-3' />
                            <span className='text-gray-600'>Updated by:</span>
                            <code className='text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded'>
                              {game.updatedBy}
                            </code>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Timeline & Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
                <Calendar className='h-4 w-4 sm:h-5 sm:w-5' />
                Timeline & Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div className='p-4 rounded-lg border'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Calendar className='h-4 w-4 text-green-600' />
                    <span className='text-sm font-medium'>Created</span>
                  </div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {formatDateSafe(game.createdAt)}
                  </p>
                </div>
                <div className='p-4 rounded-lg border'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Calendar className='h-4 w-4 text-blue-600' />
                    <span className='text-sm font-medium'>Last Updated</span>
                  </div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {formatDateSafe(game.updatedAt)}
                  </p>
                </div>
                <div className='p-4 rounded-lg border'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Activity className='h-4 w-4 text-purple-600' />
                    <span className='text-sm font-medium'>Current Status</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    {game.isActive ? (
                      <ToggleRight className='h-4 w-4 text-green-500' />
                    ) : (
                      <ToggleLeft className='h-4 w-4 text-red-500' />
                    )}
                    <span className='text-sm font-medium'>
                      {game.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className='text-xs text-gray-500 mt-1'>
                    Game is {game.isActive ? 'available' : 'unavailable'} for play
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
