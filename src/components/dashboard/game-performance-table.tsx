/**
 * Game Performance Table
 * Enhanced interactive table with better mobile support and visual design
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
import { formatCurrency, commaSeparated, setNumberFormat } from '@/lib/utils/dashboard'

interface GamePerformanceData {
  turnOverByGameAlias: Array<{
    brandName: string
    betCounts: number
    betAmount: number
    winAmount: number
    margin: number
    gameAlias: string
  }>
  turnOverByPlayer: Array<{
    brandName: string
    betCounts: number
    betAmount: number
    winAmount: number
    margin: number
    externalPlayerId: string
    brandId: string
  }>
}

interface GamePerformanceTableProps {
  data: GamePerformanceData
  currency: string
  activeTab?: 'games' | 'players'
  onTabChange?: (tab: 'games' | 'players') => void
}

export function GamePerformanceTable({
  data,
  currency,
  activeTab = 'games',
  onTabChange,
}: GamePerformanceTableProps) {
  console.log('GamePerformanceTable received data:', data)

  const getMarginBadge = (margin: number) => {
    const variant = margin >= 0 ? 'default' : 'destructive'
    return (
      <Badge variant={variant} className='text-xs'>
        {setNumberFormat(margin, 2)}%
      </Badge>
    )
  }

  return (
    <Card className='h-full'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-base font-semibold'>Performance Analysis</CardTitle>
          <div className='flex space-x-1'>
            <button
              onClick={() => onTabChange?.('games')}
              className={`px-3 py-1 text-xs rounded ${
                activeTab === 'games'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              By Games
            </button>
            <button
              onClick={() => onTabChange?.('players')}
              className={`px-3 py-1 text-xs rounded ${
                activeTab === 'players'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              By Players
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        <div className='h-64 overflow-y-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-xs'>
                  {activeTab === 'games' ? 'Game' : 'Player'}
                </TableHead>
                <TableHead className='text-xs text-right'>Bets</TableHead>
                <TableHead className='text-xs text-right'>Turnover</TableHead>
                <TableHead className='text-xs text-right'>Won</TableHead>
                <TableHead className='text-xs text-right'>Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeTab === 'games'
                ? data.turnOverByGameAlias
                    ?.filter(
                      (game, index, self) =>
                        index === self.findIndex(g => g.gameAlias === game.gameAlias)
                    )
                    .slice(0, 20)
                    .map((game, index) => (
                      <TableRow key={`game-${game.gameAlias}-${index}`}>
                        <TableCell className='font-medium text-xs'>{game.gameAlias}</TableCell>
                        <TableCell className='text-right text-xs'>
                          {commaSeparated(game.betCounts)}
                        </TableCell>
                        <TableCell className='text-right text-xs'>
                          {formatCurrency(game.betAmount, currency)}
                        </TableCell>
                        <TableCell className='text-right text-xs'>
                          {formatCurrency(game.winAmount, currency)}
                        </TableCell>
                        <TableCell className='text-right'>{getMarginBadge(game.margin)}</TableCell>
                      </TableRow>
                    ))
                : data.turnOverByPlayer
                    ?.filter(
                      (player, index, self) =>
                        index ===
                        self.findIndex(p => p.externalPlayerId === player.externalPlayerId)
                    )
                    .slice(0, 20)
                    .map((player, index) => (
                      <TableRow key={`player-${player.externalPlayerId}-${index}`}>
                        <TableCell className='font-medium text-xs'>
                          {player.externalPlayerId}
                        </TableCell>
                        <TableCell className='text-right text-xs'>
                          {commaSeparated(player.betCounts)}
                        </TableCell>
                        <TableCell className='text-right text-xs'>
                          {formatCurrency(player.betAmount, currency)}
                        </TableCell>
                        <TableCell className='text-right text-xs'>
                          {formatCurrency(player.winAmount, currency)}
                        </TableCell>
                        <TableCell className='text-right'>
                          {getMarginBadge(player.margin)}
                        </TableCell>
                      </TableRow>
                    ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
