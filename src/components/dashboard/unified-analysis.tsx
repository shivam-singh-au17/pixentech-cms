/**
 * Unified Analysis Component
 * Combines Game Analysis and Player Analysis in a single interface with toggle
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Gamepad2, Users } from 'lucide-react'
import { GameAnalysis } from './game-analysis'
import { PlayerAnalysis } from './player-analysis'
import { cn } from '@/lib/utils'

interface GameData {
  brandName: string
  betCounts: number
  betAmount: number
  winAmount: number
  margin: number
  gameAlias: string
}

interface PlayerData {
  brandName: string
  betCounts: number
  betAmount: number
  winAmount: number
  margin: number
  externalPlayerId: string
  brandId: string
}

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

interface UnifiedAnalysisProps {
  gameData: GameData[]
  playerData: PlayerData[]
  winnersData: WinnersContributorsData
  contributorsData: WinnersContributorsData
  currency: string
  selectedGame?: string | null
  onGameSelect?: (gameAlias: string | null) => void
  searchTerm?: string
}

type AnalysisView = 'games' | 'players'

export function UnifiedAnalysis({
  gameData,
  playerData,
  winnersData,
  contributorsData,
  currency,
  selectedGame,
  onGameSelect,
  searchTerm = '',
}: UnifiedAnalysisProps) {
  const [activeView, setActiveView] = useState<AnalysisView>('games')

  return (
    <div className='flex flex-col'>
      {/* Toggle Header */}
      <div className='bg-background border border-border rounded-t-lg p-4 border-b-0'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            {activeView === 'games' ? (
              <>
                <Gamepad2 className='h-5 w-5 text-primary' />
                <span className='text-lg font-semibold'>Game Analysis</span>
              </>
            ) : (
              <>
                <Users className='h-5 w-5 text-primary' />
                <span className='text-lg font-semibold'>Player Analysis</span>
              </>
            )}
          </div>

          {/* View Toggle Buttons */}
          <div className='flex items-center gap-1 bg-muted p-1 rounded-lg'>
            <Button
              variant={activeView === 'games' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => setActiveView('games')}
              className={cn(
                'flex items-center gap-2 text-xs font-medium transition-all duration-200',
                activeView === 'games'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              )}
            >
              <Gamepad2 className='h-4 w-4' />
              <span className='hidden sm:inline'>Games</span>
              <Badge
                variant={activeView === 'games' ? 'default' : 'secondary'}
                className='text-xs h-5 px-1.5'
              >
                {gameData.length}
              </Badge>
            </Button>

            <Button
              variant={activeView === 'players' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => setActiveView('players')}
              className={cn(
                'flex items-center gap-2 text-xs font-medium transition-all duration-200',
                activeView === 'players'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              )}
            >
              <Users className='h-4 w-4' />
              <span className='hidden sm:inline'>Players</span>
              <Badge
                variant={activeView === 'players' ? 'default' : 'secondary'}
                className='text-xs h-5 px-1.5'
              >
                {playerData.length}
              </Badge>
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className='overflow-hidden'>
        {activeView === 'games' ? (
          <GameAnalysis
            gameData={gameData}
            currency={currency}
            selectedGame={selectedGame}
            onGameSelect={onGameSelect}
          />
        ) : (
          <PlayerAnalysis
            playerData={playerData}
            winnersData={winnersData}
            contributorsData={contributorsData}
            currency={currency}
            searchTerm={searchTerm}
          />
        )}
      </div>
    </div>
  )
}
