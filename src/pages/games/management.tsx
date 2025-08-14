/**
 * Game Management Page
 * Comprehensive game CRUD operations with modern UI
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Gamepad2,
  RefreshCw,
  Download,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  ExternalLink,
  Zap,
  Clock,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { GameForm } from '@/components/game/game-form'
import { GameDetails } from '@/components/game/game-details'
import { useGames, useDeleteGame, useToggleGameStatus } from '@/hooks/queries/useGameQueries'
import { useAppSelector } from '@/store/hooks'
import { cn } from '@/lib/utils'
import type { Game } from '@/lib/api/game'

const GAME_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'pg', label: 'Provably Fair' },
  { value: 'sg', label: 'Slot Games' },
  { value: 'cg', label: 'Crash Games' },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
]

export default function GameManagementPage() {
  // Auth state to check if user is authenticated
  const { isAuthenticated, token } = useAppSelector(state => state.auth)

  // Local state to track when we're ready to make API calls
  const [isReadyForApiCalls, setIsReadyForApiCalls] = useState(false)

  // Wait for auth state to be properly loaded
  useEffect(() => {
    // Give Redux Persist time to rehydrate, then check auth state
    const timer = setTimeout(() => {
      if (isAuthenticated && token) {
        setIsReadyForApiCalls(true)
      } else {
        setIsReadyForApiCalls(false)
      }
    }, 100) // Small delay to ensure rehydration

    return () => clearTimeout(timer)
  }, [isAuthenticated, token])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGameType, setSelectedGameType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)

  // Fetch games with parameters - only when ready for API calls
  const {
    data: gamesData,
    isLoading: gamesLoading,
    refetch,
  } = useGames(
    {
      pageNo: currentPage,
      pageSize: pageSize,
      sortDirection: 1,
      gameType: selectedGameType === 'all' ? undefined : selectedGameType,
      isActive: selectedStatus === 'all' ? undefined : selectedStatus === 'true',
      searchQuery: searchQuery || undefined,
    },
    isReadyForApiCalls
  )

  const deleteGameMutation = useDeleteGame()
  const toggleGameStatusMutation = useToggleGameStatus()

  const games = gamesData?.games || []
  const totalCount = gamesData?.games.length || 0

  // No need for client-side filtering since we're filtering on the server
  const displayGames = games

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleGameTypeFilter = (value: string) => {
    setSelectedGameType(value)
    setCurrentPage(1)
  }

  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value)
    setCurrentPage(1)
  }

  const handleEdit = (game: Game) => {
    setSelectedGame(game)
    setShowEditDialog(true)
  }

  const handleView = (game: Game) => {
    setSelectedGame(game)
    setShowDetailsDialog(true)
  }

  const handleRefresh = () => {
    refetch()
  }

  const handleDelete = async (game: Game) => {
    if (window.confirm(`Are you sure you want to delete game "${game.gameName}"?`)) {
      try {
        await deleteGameMutation.mutateAsync(game._id)
        alert(`Game "${game.gameName}" deleted successfully`)
      } catch (error) {
        alert('Failed to delete game')
        console.error('Delete game error:', error)
      }
    }
  }

  const handleStatusToggle = async (game: Game) => {
    try {
      await toggleGameStatusMutation.mutateAsync({
        id: game._id,
        isActive: !game.isActive,
      })
      alert(`Game "${game.gameName}" ${!game.isActive ? 'enabled' : 'disabled'} successfully`)
    } catch (error) {
      alert('Failed to update game status')
      console.error('Toggle status error:', error)
    }
  }

  const getGameTypeIcon = (gameType?: string) => {
    switch (gameType) {
      case 'pg':
        return <Zap className='h-4 w-4' />
      case 'sg':
        return <Gamepad2 className='h-4 w-4' />
      case 'cg':
        return <Clock className='h-4 w-4' />
      default:
        return <Gamepad2 className='h-4 w-4' />
    }
  }

  const getGameTypeBadge = (gameType?: string) => {
    const variants = {
      pg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      sg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      cg: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    }

    const labels = {
      pg: 'Provably Fair',
      sg: 'Slot Game',
      cg: 'Crash Game',
    }

    return (
      <Badge
        className={cn('font-medium', variants[gameType as keyof typeof variants] || variants.pg)}
      >
        <span className='flex items-center gap-1'>
          {getGameTypeIcon(gameType)}
          {labels[gameType as keyof typeof labels] || gameType?.toUpperCase() || 'UNKNOWN'}
        </span>
      </Badge>
    )
  }

  const activegames = displayGames.filter((game: Game) => game.isActive).length
  const inactiveGames = displayGames.filter((game: Game) => !game.isActive).length

  // Show loading spinner while auth is being restored
  if (!isReadyForApiCalls) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800'>
        <div className='container mx-auto p-6'>
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-center'>
              <RefreshCw className='h-8 w-8 animate-spin mx-auto mb-4 text-slate-400' />
              <p className='text-slate-600 dark:text-slate-400'>
                {!isAuthenticated
                  ? 'Checking authentication...'
                  : !token
                    ? 'Loading user session...'
                    : 'Initializing...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800'>
      <div className='container mx-auto p-6 space-y-6'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4'
        >
          <div>
            <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent'>
              Game Management
            </h1>
            <p className='text-sm text-slate-600 dark:text-slate-400 mt-1'>
              Manage your game catalog with comprehensive CRUD operations
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-2'>
            <Button
              onClick={handleRefresh}
              size='sm'
              disabled={gamesLoading}
              className='flex items-center gap-1 sm:gap-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
            >
              <RefreshCw className={cn('h-3 w-3 sm:h-4 sm:w-4', gamesLoading && 'animate-spin')} />
              <span className='hidden sm:inline'>
                {gamesLoading ? 'Refreshing...' : 'Refresh Data'}
              </span>
              <span className='sm:hidden'>{gamesLoading ? '...' : 'Refresh Data'}</span>
            </Button>

            <Button
              variant='outline'
              size='sm'
              className='flex items-center gap-1 sm:gap-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
            >
              <Download className='h-3 w-3 sm:h-4 sm:w-4' />
              <span className='hidden sm:inline'>Export CSV</span>
              <span className='sm:hidden'>Export</span>
            </Button>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button
                  size='sm'
                  className='flex items-center gap-1 sm:gap-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
                >
                  <Plus className='h-3 w-3 sm:h-4 sm:w-4' />
                  <span className='hidden sm:inline'>Add Game</span>
                  <span className='sm:hidden'>Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                  <DialogTitle>Create New Game</DialogTitle>
                  <DialogDescription>
                    Add a new game to your catalog with all necessary configurations.
                  </DialogDescription>
                </DialogHeader>
                <GameForm
                  onSuccess={() => {
                    setShowCreateDialog(false)
                    refetch()
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='grid grid-cols-1 md:grid-cols-4 gap-6'
        >
          <Card className='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-blue-500 text-white'>
                  <Gamepad2 className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                    Total Games
                  </p>
                  <p className='text-2xl font-bold text-blue-900 dark:text-blue-100'>
                    {totalCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-green-500 text-white'>
                  <ToggleRight className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-sm font-medium text-green-600 dark:text-green-400'>
                    Active Games
                  </p>
                  <p className='text-2xl font-bold text-green-900 dark:text-green-100'>
                    {activegames}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-red-500 text-white'>
                  <ToggleLeft className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-sm font-medium text-red-600 dark:text-red-400'>
                    Inactive Games
                  </p>
                  <p className='text-2xl font-bold text-red-900 dark:text-red-100'>
                    {inactiveGames}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-purple-500 text-white'>
                  <Filter className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-sm font-medium text-purple-600 dark:text-purple-400'>
                    Filtered Results
                  </p>
                  <p className='text-2xl font-bold text-purple-900 dark:text-purple-100'>
                    {displayGames.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className='p-6'>
              <div className='flex flex-col sm:flex-row gap-4'>
                <div className='relative flex-1'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400' />
                  <Input
                    placeholder='Search games...'
                    value={searchQuery}
                    onChange={e => handleSearch(e.target.value)}
                    className='pl-10'
                  />
                </div>
                <Select value={selectedGameType} onValueChange={handleGameTypeFilter}>
                  <SelectTrigger className='w-full sm:w-[200px]'>
                    <SelectValue placeholder='Filter by Game Type' />
                  </SelectTrigger>
                  <SelectContent>
                    {GAME_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={handleStatusFilter}>
                  <SelectTrigger className='w-full sm:w-[200px]'>
                    <SelectValue placeholder='Filter by Status' />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Games Table */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Gamepad2 className='h-5 w-5' />
              Games ({displayGames.length})
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[200px]'>Game ID</TableHead>
                    <TableHead>Game Alias</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className='w-[300px]'>Launch Path</TableHead>
                    <TableHead>Min Bet</TableHead>
                    <TableHead>Max Bet</TableHead>
                    <TableHead>Default Bet</TableHead>
                    <TableHead>Max Win</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='w-[100px]'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gamesLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className='h-4 w-48' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-24' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-32' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-40' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-16' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-16' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-16' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-20' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-6 w-16' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-8 w-8' />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : displayGames.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className='text-center py-8'>
                        <div className='flex flex-col items-center gap-3 text-gray-500'>
                          <Gamepad2 className='h-12 w-12' />
                          <p>No games found</p>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => setShowCreateDialog(true)}
                          >
                            <Plus className='h-4 w-4 mr-2' />
                            Add Your First Game
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayGames.map((game: Game) => (
                      <TableRow
                        key={game._id}
                        className='hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      >
                        <TableCell>
                          <code className='bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono'>
                            {game._id || 'N/A'}
                          </code>
                        </TableCell>

                        <TableCell>
                          <code className='bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-sm text-blue-800 dark:text-blue-300'>
                            {game.gameAlias}
                          </code>
                        </TableCell>

                        <TableCell>
                          <div className='flex flex-col'>
                            <span className='font-medium text-gray-900 dark:text-gray-100'>
                              {game.gameName}
                            </span>
                            <div className='flex items-center gap-1 mt-1'>
                              {getGameTypeBadge(game.gameType)}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className='flex flex-col max-w-xs'>
                            {game.launchPath ? (
                              <span className='text-sm text-gray-600 dark:text-gray-400 flex items-start gap-1 break-all'>
                                <ExternalLink className='h-3 w-3 mt-0.5 flex-shrink-0' />
                                <span className='break-all'>{game.launchPath}</span>
                              </span>
                            ) : (
                              <span className='text-sm text-gray-400'>No launch path</span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className='flex items-center gap-1 text-sm font-medium'>
                            <DollarSign className='h-3 w-3 text-green-600' />
                            <span>{game.minBet || 'N/A'}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className='flex items-center gap-1 text-sm font-medium'>
                            <DollarSign className='h-3 w-3 text-red-600' />
                            <span>{game.maxBet || 'N/A'}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className='flex items-center gap-1 text-sm font-medium'>
                            <DollarSign className='h-3 w-3 text-blue-600' />
                            <span>{game.defaultBet || 'N/A'}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className='flex items-center gap-1 text-sm font-medium'>
                            <DollarSign className='h-3 w-3 text-yellow-600' />
                            <span>{game.maxWin || game.maxPayoutMultiplier || 'N/A'}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <Switch
                              checked={game.isActive}
                              onCheckedChange={() => handleStatusToggle(game)}
                              disabled={toggleGameStatusMutation.isPending}
                            />
                            <Badge
                              variant={game.isActive ? 'default' : 'secondary'}
                              className={cn(
                                'font-medium',
                                game.isActive
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                              )}
                            >
                              {game.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </TableCell>

                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='sm'>
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />

                              <DropdownMenuItem onClick={() => handleView(game)}>
                                <Gamepad2 className='h-4 w-4 mr-2' />
                                View Details
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => handleEdit(game)}>
                                <Edit className='h-4 w-4 mr-2' />
                                Edit Game
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleStatusToggle(game)}
                                disabled={toggleGameStatusMutation.isPending}
                              >
                                {game.isActive ? (
                                  <>
                                    <ToggleLeft className='h-4 w-4 mr-2' />
                                    Disable
                                  </>
                                ) : (
                                  <>
                                    <ToggleRight className='h-4 w-4 mr-2' />
                                    Enable
                                  </>
                                )}
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                onClick={() => handleDelete(game)}
                                className='text-red-600 dark:text-red-400'
                                disabled={deleteGameMutation.isPending}
                              >
                                <Trash2 className='h-4 w-4 mr-2' />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Edit Game</DialogTitle>
              <DialogDescription>Update game information and configurations.</DialogDescription>
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
          <DialogContent className='max-w-[95vw] sm:max-w-4xl w-full max-h-[95vh] p-0'>
            <div className='p-4 sm:p-6 max-h-[95vh] overflow-y-auto'>
              <DialogHeader className='mb-4'>
                <DialogTitle className='text-lg sm:text-xl'>Game Details</DialogTitle>
                <DialogDescription className='text-sm text-gray-600'>
                  Comprehensive information about the selected game.
                </DialogDescription>
              </DialogHeader>
              {selectedGame && <GameDetails game={selectedGame} />}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
