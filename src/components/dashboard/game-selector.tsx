/**
 * Game Selector Component
 * Interactive game selection for detailed analysis
 */

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Gamepad2, Search, TrendingUp, TrendingDown, X } from 'lucide-react'
import { formatCurrency, commaSeparated, setNumberFormat } from '@/lib/utils/dashboard'

interface GameData {
  brandName: string
  betCounts: number
  betAmount: number
  winAmount: number
  margin: number
  gameAlias: string
}

interface GameSelectorProps {
  games: GameData[]
  selectedGame: string | null
  onGameSelect: (gameAlias: string | null) => void
  currency: string
}

export function GameSelector({ games, selectedGame, onGameSelect, currency }: GameSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredGames = games.filter(game =>
    game.gameAlias.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getMarginColor = (margin: number) => {
    if (margin >= 50) return 'bg-green-100 text-green-800 border-green-200'
    if (margin >= 20) return 'bg-blue-100 text-blue-800 border-blue-200'
    if (margin >= 0) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const getMarginIcon = (margin: number) => {
    return margin >= 0 ? TrendingUp : TrendingDown
  }

  return (
    <Card className='bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg'>
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg font-semibold flex items-center gap-2'>
            <Gamepad2 className='h-5 w-5 text-primary' />
            Game Selection
            {selectedGame && (
              <Badge variant='default' className='ml-2'>
                {selectedGame}
              </Badge>
            )}
          </CardTitle>
          {selectedGame && (
            <Button
              variant='outline'
              size='sm'
              onClick={() => onGameSelect(null)}
              className='h-8 w-8 p-0'
            >
              <X className='h-4 w-4' />
            </Button>
          )}
        </div>

        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Search games...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='pl-10 bg-background'
          />
        </div>
      </CardHeader>

      <CardContent className='p-0'>
        <div className='max-h-64 sm:max-h-80 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
          <div className='grid gap-2 p-3 sm:p-4'>
            {filteredGames.slice(0, 20).map((game, index) => {
              const MarginIcon = getMarginIcon(game.margin)
              const isSelected = selectedGame === game.gameAlias

              return (
                <div
                  key={`${game.gameAlias}-${index}`}
                  onClick={() => onGameSelect(isSelected ? null : game.gameAlias)}
                  className={`p-2 sm:p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-sm'
                      : 'bg-background hover:bg-muted/50 border-border'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2 mb-1'>
                        <h4 className='font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none'>
                          {game.gameAlias}
                        </h4>
                        <Badge
                          variant='outline'
                          className={`text-xs border ${getMarginColor(game.margin)} flex-shrink-0`}
                        >
                          <MarginIcon className='h-3 w-3 mr-1' />
                          {setNumberFormat(game.margin, 2)}%
                        </Badge>
                      </div>

                      <div className='grid grid-cols-3 gap-1 sm:gap-2 text-xs text-muted-foreground'>
                        <div className='min-w-0'>
                          <span className='block font-medium text-foreground text-xs truncate'>
                            {commaSeparated(game.betCounts)}
                          </span>
                          <span className='text-xs'>Bets</span>
                        </div>
                        <div className='min-w-0'>
                          <span className='block font-medium text-foreground text-xs truncate'>
                            {formatCurrency(game.betAmount, currency)}
                          </span>
                          <span className='text-xs'>Turnover</span>
                        </div>
                        <div className='min-w-0'>
                          <span className='block font-medium text-foreground text-xs truncate'>
                            {formatCurrency(game.winAmount, currency)}
                          </span>
                          <span className='text-xs'>Won</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {filteredGames.length === 0 && (
              <div className='text-center py-6 sm:py-8 text-muted-foreground text-sm'>
                No games found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
