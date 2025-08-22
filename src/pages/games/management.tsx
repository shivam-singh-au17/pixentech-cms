/**
 * Game Management Page
 * Modern, comprehensive game CRUD operations with responsive UI matching Operator Game Management
 */

import { useState, useEffect } from 'react'
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  Eye,
  Gamepad2,
  DollarSign,
  Zap,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'

import { GameForm } from '@/components/game/game-form'
import { GameDetails } from '@/components/game/game-details'
import { GameFilters } from '@/components/game/game-filters'
import { useGames, useDeleteGame, useToggleGameStatus } from '@/hooks/queries/useGameQueries'

import type { Game, GameListParams } from '@/lib/api/game'
import { useAppSelector } from '@/store/hooks'
import { toast } from 'sonner'
import { downloadAsExcel } from '@/lib/utils/export'
import { cn } from '@/lib/utils'

// Helper functions for toasts
const success = (message: string) => toast.success(message)
const error = (message: string) => toast.error(message)

// Helper function to determine game type badge
const getGameTypeBadge = (gameType: string) => {
  switch (gameType?.toLowerCase()) {
    case 'pg':
      return (
        <Badge variant='default' className='bg-blue-500'>
          Provably Fair
        </Badge>
      )
    case 'sg':
      return (
        <Badge variant='default' className='bg-green-500'>
          Slot Game
        </Badge>
      )
    case 'cg':
      return (
        <Badge variant='default' className='bg-purple-500'>
          Crash Game
        </Badge>
      )
    default:
      return <Badge variant='secondary'>Unknown</Badge>
  }
}

// Helper function to prepare export data
const prepareGameExportData = (games: Game[]) => {
  return games.map(game => ({
    ID: game._id,
    'Game Name': game.gameName,
    'Game Alias': game.gameAlias,
    'Game Type': game.gameType?.toUpperCase() || 'Unknown',
    'Launch Path': game.launchPath || '-',
    'Home URL': game.homeURL || '-',
    'Min Bet': game.minBet !== undefined ? game.minBet.toFixed(2) : '-',
    'Max Bet': game.maxBet !== undefined ? game.maxBet.toFixed(2) : '-',
    'Default Bet': game.defaultBet !== undefined ? game.defaultBet.toFixed(2) : '-',
    'Game Mode': game.gameMode || '-',
    'Available Game Modes': game.availableGameModes?.join(', ') || '-',
    Status: game.isActive ? 'Active' : 'Inactive',
    'Created At': game.createdAt ? new Date(game.createdAt).toLocaleDateString() : '-',
    'Updated At': game.updatedAt ? new Date(game.updatedAt).toLocaleDateString() : '-',
  }))
}

export default function GameManagementPage() {
  // Auth state to check if user is authenticated
  const { isAuthenticated, token } = useAppSelector(state => state.auth)

  // Local state to track when we're ready to make API calls
  const [isReadyForApiCalls, setIsReadyForApiCalls] = useState(false)

  // Wait for auth state to be properly loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated && token) {
        setIsReadyForApiCalls(true)
      } else {
        setIsReadyForApiCalls(false)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isAuthenticated, token])

  // State management
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [filters, setFilters] = useState<GameListParams>({
    pageNo: 1,
    pageSize: 20,
    sortBy: 'gameName',
    sortDirection: 1,
  })

  const [selectedGame, setSelectedGame] = useState<Game | null>(null)

  // API hooks
  const {
    data: gamesData,
    isLoading: gamesLoading,
    isFetching,
    refetch,
    error: gamesError,
  } = useGames(filters, isReadyForApiCalls)

  const deleteGameMutation = useDeleteGame()
  const toggleGameStatusMutation = useToggleGameStatus()

  const games = gamesData?.data || []
  const totalCount = gamesData?.totalItems || games.length

  // Filter and pagination handlers
  const handleFiltersChange = (newFilters: Partial<GameListParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters, pageNo: 1 }))
  }

  const handleResetFilters = () => {
    const resetFilters: GameListParams = {
      pageNo: 1,
      pageSize: 20,
      sortBy: 'gameName',
      sortDirection: 1,
    }
    setFilters(resetFilters)
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, pageNo: page }))
  }

  const handlePageSizeChange = (size: number) => {
    setFilters(prev => ({ ...prev, pageSize: size, pageNo: 1 }))
  }

  // Handle sorting
  const handleSort = (sortBy: string) => {
    setFilters(prev => {
      // If clicking the same column, toggle direction
      if (prev.sortBy === sortBy) {
        return {
          ...prev,
          sortDirection: prev.sortDirection === 1 ? -1 : 1,
          pageNo: 1, // Reset to first page when sorting
        }
      }
      // If clicking a different column, default to ascending (1)
      return {
        ...prev,
        sortBy,
        sortDirection: 1,
        pageNo: 1,
      }
    })
  }

  // Get sort icon for column headers
  const getSortIcon = (column: string) => {
    if (filters.sortBy !== column) {
      return <ArrowUpDown className='h-4 w-4' />
    }
    return filters.sortDirection === 1 ? (
      <ArrowUp className='h-4 w-4' />
    ) : (
      <ArrowDown className='h-4 w-4' />
    )
  }

  // Sortable header component
  interface SortableHeaderProps {
    column: string
    children: React.ReactNode
    className?: string
  }

  function SortableHeader({ column, children, className }: SortableHeaderProps) {
    return (
      <TableHead
        className={cn('cursor-pointer hover:bg-muted/50 select-none', className)}
        onClick={() => handleSort(column)}
      >
        <div className='flex items-center gap-1'>
          {children}
          {getSortIcon(column)}
        </div>
      </TableHead>
    )
  }

  // API handlers
  const handleRefresh = () => {
    refetch()
  }

  // Export functionality
  const handleExportGames = () => {
    if (!games || games.length === 0) {
      error('No games data to export')
      return
    }

    try {
      const exportData = prepareGameExportData(games)
      const timestamp = new Date().toISOString().split('T')[0]
      downloadAsExcel(exportData, `game-management-${timestamp}`)
      success('Games data exported successfully')
    } catch (err) {
      console.error('Export error:', err)
      error('Failed to export games data')
    }
  }

  // Handle delete game
  const handleDeleteGame = async (game: Game) => {
    if (!confirm(`Are you sure you want to delete "${game.gameName}"?`)) {
      return
    }

    try {
      await deleteGameMutation.mutateAsync(game._id)
      success('Game deleted successfully')
    } catch (err) {
      error('Failed to delete game')
    }
  }

  // Handle toggle status
  const handleToggleStatus = async (game: Game) => {
    try {
      await toggleGameStatusMutation.mutateAsync({
        id: game._id,
        isActive: !game.isActive,
      })
      success(`Game ${game.isActive ? 'deactivated' : 'activated'} successfully`)
    } catch (err) {
      error('Failed to toggle game status')
    }
  }

  // Handle view details
  const handleViewDetails = (game: Game) => {
    setSelectedGame(game)
    setShowDetailsDialog(true)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'>
      <div className='container mx-auto px-4 py-6 space-y-6'>
        {/* Header with Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'
        >
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Game Management</h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Manage game catalog, settings, and configurations
            </p>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center gap-2'>
            {/* Refresh Button */}
            <Button
              variant='outline'
              size='sm'
              onClick={handleRefresh}
              disabled={gamesLoading || isFetching}
              className='flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 transition-all duration-200 h-8 sm:h-9'
            >
              <RefreshCw
                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${gamesLoading || isFetching ? 'animate-spin' : ''}`}
              />
              <span className='hidden xs:inline whitespace-nowrap'>
                {gamesLoading || isFetching ? 'Refreshing...' : 'Refresh'}
              </span>
              <span className='xs:hidden'>{gamesLoading || isFetching ? '...' : 'Refresh'}</span>
            </Button>

            {/* Export Button */}
            <Button
              onClick={handleExportGames}
              size='sm'
              disabled={gamesLoading || games.length === 0}
              className='flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 transition-all duration-200 h-8 sm:h-9'
            >
              <Download className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
              <span className='hidden xs:inline whitespace-nowrap'>Export</span>
              <span className='xs:hidden'>Export</span>
            </Button>

            {/* Create Button */}
            <Button
              onClick={() => setShowCreateDialog(true)}
              size='sm'
              disabled={!isReadyForApiCalls}
              className='flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 transition-all duration-200 h-8 sm:h-9'
            >
              <Plus className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
              <span className='hidden xs:inline whitespace-nowrap'>Add</span>
              <span className='xs:hidden'>Add</span>
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className='space-y-6'>
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GameFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleResetFilters}
              loading={gamesLoading}
            />
          </motion.div>

          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
          >
            <Card className='bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800'>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                      Total Games
                    </p>
                    <p className='text-2xl font-bold text-blue-700 dark:text-blue-300'>
                      {gamesLoading ? '...' : totalCount}
                    </p>
                  </div>
                  <Gamepad2 className='h-8 w-8 text-blue-500' />
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800'>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-green-600 dark:text-green-400'>
                      Active Games
                    </p>
                    <p className='text-2xl font-bold text-green-700 dark:text-green-300'>
                      {gamesLoading ? '...' : games.filter(g => g.isActive).length}
                    </p>
                  </div>
                  <Zap className='h-8 w-8 text-green-500' />
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800'>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-purple-600 dark:text-purple-400'>
                      Game Types
                    </p>
                    <p className='text-2xl font-bold text-purple-700 dark:text-purple-300'>
                      {gamesLoading ? '...' : [...new Set(games.map(g => g.gameType))].length}
                    </p>
                  </div>
                  <Filter className='h-8 w-8 text-purple-500' />
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200 dark:border-orange-800'>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-orange-600 dark:text-orange-400'>
                      With Betting
                    </p>
                    <p className='text-2xl font-bold text-orange-700 dark:text-orange-300'>
                      {gamesLoading ? '...' : games.filter(g => g.minBet !== undefined).length}
                    </p>
                  </div>
                  <DollarSign className='h-8 w-8 text-orange-500' />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Games Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className='bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-xl border-0 shadow-lg'>
              {/* Table Header */}
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b'>
                <div className='flex items-center gap-3'>
                  <Gamepad2 className='h-5 w-5 text-muted-foreground' />
                  <h2 className='text-lg font-semibold'>Games ({totalCount})</h2>
                </div>

                <div className='flex items-center gap-2'>
                  {/* Actions will be here if needed */}
                </div>
              </div>

              {/* Table Content */}
              <CardContent className='p-0'>
                {gamesLoading ? (
                  <div className='p-8 space-y-4'>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className='flex items-center space-x-4'>
                        <Skeleton className='h-12 w-12 rounded' />
                        <div className='space-y-2 flex-1'>
                          <Skeleton className='h-4 w-[250px]' />
                          <Skeleton className='h-4 w-[200px]' />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : games.length === 0 ? (
                  <div className='text-center py-12'>
                    <Gamepad2 className='mx-auto h-12 w-12 text-muted-foreground' />
                    <h3 className='mt-4 text-lg font-semibold'>No games found</h3>
                    <p className='text-muted-foreground'>
                      {gamesError
                        ? 'Error loading games. Please try again.'
                        : 'No games match your current filters.'}
                    </p>
                    <div className='mt-6 flex flex-col sm:flex-row gap-2 justify-center'>
                      <Button variant='outline' onClick={handleResetFilters}>
                        Clear Filters
                      </Button>
                      <Button onClick={() => setShowCreateDialog(true)}>
                        <Plus className='mr-2 h-4 w-4' />
                        Add First Game
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className='overflow-hidden'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <SortableHeader column='gameName'>Game Name</SortableHeader>
                          <SortableHeader column='gameAlias'>Game Alias</SortableHeader>
                          <TableHead className='hidden md:table-cell'>Game Type</TableHead>
                          <TableHead className='hidden lg:table-cell'>Launch Path</TableHead>
                          <TableHead className='hidden xl:table-cell'>Home URL</TableHead>
                          <TableHead className='hidden lg:table-cell'>Min Bet</TableHead>
                          <TableHead className='hidden lg:table-cell'>Max Bet</TableHead>
                          <TableHead className='hidden xl:table-cell'>Default Bet</TableHead>
                          <TableHead className='hidden xl:table-cell'>Game Mode</TableHead>
                          <SortableHeader column='isActive'>Status</SortableHeader>
                          <TableHead className='w-[70px]'>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {games.map(game => (
                          <TableRow key={game._id} className='hover:bg-muted/50'>
                            <TableCell>
                              <div className='space-y-1'>
                                <div className='font-medium'>{game.gameName}</div>
                                <div className='text-xs text-muted-foreground'>
                                  {game.gameType?.toUpperCase() || 'Unknown'}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className='text-sm font-mono'>{game.gameAlias}</div>
                            </TableCell>
                            <TableCell className='hidden md:table-cell'>
                              {getGameTypeBadge(game.gameType || '')}
                            </TableCell>
                            <TableCell className='hidden lg:table-cell'>
                              <div className='text-sm max-w-[200px] truncate'>
                                {game.launchPath || (
                                  <span className='text-muted-foreground'>-</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className='hidden xl:table-cell'>
                              <div className='text-sm max-w-[200px] truncate'>
                                {game.homeURL || <span className='text-muted-foreground'>-</span>}
                              </div>
                            </TableCell>
                            <TableCell className='hidden lg:table-cell'>
                              <div className='text-sm'>
                                {game.minBet !== undefined ? `${game.minBet.toFixed(2)}` : '-'}
                              </div>
                            </TableCell>
                            <TableCell className='hidden lg:table-cell'>
                              <div className='text-sm'>
                                {game.maxBet !== undefined ? `${game.maxBet.toFixed(2)}` : '-'}
                              </div>
                            </TableCell>
                            <TableCell className='hidden xl:table-cell'>
                              <div className='text-sm'>
                                {game.defaultBet !== undefined
                                  ? `${game.defaultBet.toFixed(2)}`
                                  : '-'}
                              </div>
                            </TableCell>
                            <TableCell className='hidden xl:table-cell'>
                              <div className='text-sm'>
                                {game.gameMode || <span className='text-muted-foreground'>-</span>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center gap-2'>
                                {/* Status toggle functionality - matching Operator Game Management */}
                                <Switch
                                  checked={game.isActive}
                                  onCheckedChange={() => handleToggleStatus(game)}
                                  disabled={true}
                                  className='opacity-60'
                                />
                                <Badge variant={game.isActive ? 'default' : 'secondary'}>
                                  {game.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant='ghost' className='h-8 w-8 p-0'>
                                    <MoreHorizontal className='h-4 w-4' />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleViewDetails(game)}>
                                    <Eye className='mr-2 h-4 w-4' />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedGame(game)
                                      setShowEditDialog(true)
                                    }}
                                  >
                                    <Edit className='mr-2 h-4 w-4' />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {/* DISABLED: Delete game functionality temporarily disabled - API not available */}
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteGame(game)}
                                    disabled={true}
                                    className='text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-60'
                                  >
                                    <Trash2 className='mr-2 h-4 w-4' />
                                    Delete (Disabled)
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Enhanced Pagination */}
                {!gamesLoading && games.length > 0 && (
                  <div className='mt-6 bg-white dark:bg-gray-800 rounded-lg border p-4'>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                      {/* Results Info */}
                      <div className='text-sm text-muted-foreground'>
                        Showing{' '}
                        {Math.min(
                          ((filters.pageNo || 1) - 1) * (filters.pageSize || 20) + 1,
                          totalCount
                        )}{' '}
                        to {Math.min((filters.pageNo || 1) * (filters.pageSize || 20), totalCount)}{' '}
                        of {totalCount} games
                      </div>

                      {/* Pagination Controls */}
                      <div className='flex flex-col xs:flex-row items-start xs:items-center gap-3'>
                        {/* Page Size Selector */}
                        <div className='flex items-center gap-2'>
                          <span className='text-sm text-muted-foreground whitespace-nowrap'>
                            Rows per page:
                          </span>
                          <Select
                            value={(filters.pageSize || 20).toString()}
                            onValueChange={value => handlePageSizeChange(Number(value))}
                          >
                            <SelectTrigger className='h-8 w-16 text-sm'>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='10'>10</SelectItem>
                              <SelectItem value='20'>20</SelectItem>
                              <SelectItem value='50'>50</SelectItem>
                              <SelectItem value='100'>100</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Page Navigation */}
                        <div className='flex items-center gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handlePageChange((filters.pageNo || 1) - 1)}
                            disabled={(filters.pageNo || 1) <= 1}
                            className='h-8 w-8 p-0'
                          >
                            <ChevronLeft className='h-4 w-4' />
                          </Button>

                          {/* Page Numbers */}
                          <div className='flex items-center gap-1'>
                            {(() => {
                              const currentPage = filters.pageNo || 1
                              const totalPages =
                                gamesData?.totalPages ||
                                Math.ceil(totalCount / (filters.pageSize || 20))

                              // Show only 3 pages at a time
                              return Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                                let pageNum
                                if (totalPages <= 3) {
                                  // If total pages is 3 or less, show all pages
                                  pageNum = i + 1
                                } else if (currentPage <= 2) {
                                  // If on page 1 or 2, show 1, 2, 3
                                  pageNum = i + 1
                                } else if (currentPage >= totalPages - 1) {
                                  // If on last 2 pages, show last 3 pages
                                  pageNum = totalPages - 2 + i
                                } else {
                                  // For middle pages (including page 3), show current-1, current, current+1
                                  pageNum = currentPage - 1 + i
                                }

                                // Ensure pageNum is within valid range
                                if (pageNum > totalPages || pageNum < 1) return null

                                return (
                                  <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? 'default' : 'outline'}
                                    size='sm'
                                    onClick={() => handlePageChange(pageNum)}
                                    className='h-8 w-8 p-0'
                                  >
                                    {pageNum}
                                  </Button>
                                )
                              }).filter(Boolean)
                            })()}
                          </div>

                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handlePageChange((filters.pageNo || 1) + 1)}
                            disabled={
                              (filters.pageNo || 1) >=
                              (gamesData?.totalPages ||
                                Math.ceil(totalCount / (filters.pageSize || 20)))
                            }
                            className='h-8 w-8 p-0'
                          >
                            <ChevronRight className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Create Game Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Create New Game</DialogTitle>
              <DialogDescription>Add a new game to the management system</DialogDescription>
            </DialogHeader>
            <GameForm
              onSuccess={() => {
                setShowCreateDialog(false)
                refetch()
              }}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Game Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Edit Game</DialogTitle>
              <DialogDescription>Update game information</DialogDescription>
            </DialogHeader>
            {selectedGame && (
              <GameForm
                game={selectedGame}
                onSuccess={() => {
                  setShowEditDialog(false)
                  setSelectedGame(null)
                  refetch()
                }}
                onCancel={() => {
                  setShowEditDialog(false)
                  setSelectedGame(null)
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Game Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Game Details</DialogTitle>
              <DialogDescription>Comprehensive game information</DialogDescription>
            </DialogHeader>
            {selectedGame && <GameDetails game={selectedGame} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
