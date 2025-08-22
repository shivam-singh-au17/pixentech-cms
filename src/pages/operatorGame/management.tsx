/**
 * Operator Game Management Page
 * Comprehensive operator game CRUD operations with modern UI
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Gamepad2,
  RefreshCw,
  Download,
  ToggleRight,
  DollarSign,
  Eye,
  EyeOff,
  Tag,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { useToast } from '@/hooks/use-toast'
import { OperatorGameForm } from '@/components/operatorGame/operator-game-form'
import { OperatorGameDetails } from '@/components/operatorGame/operator-game-details'
import { OperatorGameFilters } from '@/components/operatorGame/operator-game-filters'
import {
  useOperatorGames,
  useDeleteOperatorGame,
  useToggleOperatorGameStatus,
  useCreateOperatorGame,
  useUpdateOperatorGame,
} from '@/hooks/queries/useOperatorGameQueries'
import { useAppSelector } from '@/store/hooks'
import type { OperatorGame, OperatorGameListParams } from '@/lib/api/operatorGame'

// Helper function for CSV export
const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return

  const headers = Object.keys(data[0]).join(',')
  const csvContent = [
    headers,
    ...data.map(row =>
      Object.values(row)
        .map(value => (typeof value === 'string' && value.includes(',') ? `"${value}"` : value))
        .join(',')
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Prepare operator game data for export
const prepareOperatorGameExportData = (operatorGames: OperatorGame[]) => {
  return operatorGames.map(game => ({
    'Game ID': game._id,
    'Game Name': game.gameName,
    'Game Alias': game.gameAlias,
    Platform: game.platform || 'N/A',
    Operator: game.operator || 'N/A',
    Brand: game.brand || 'N/A',
    'Game Type': game.gameType || 'N/A',
    'Launch Path': game.launchPath || 'N/A',
    Status: game.isActive ? 'Active' : 'Inactive',
    'Min Bet': game.minBet !== undefined ? `${game.minBet.toFixed(2)}` : 'N/A',
    'Max Bet': game.maxBet !== undefined ? `${game.maxBet.toFixed(2)}` : 'N/A',
    'Default Bet': game.defaultBet !== undefined ? `${game.defaultBet.toFixed(2)}` : 'N/A',
    'Max Win': game.maxWin !== undefined ? `${game.maxWin.toFixed(2)}` : 'N/A',
  }))
}

export default function OperatorGameManagementPage() {
  // Auth state to check if user is authenticated
  const { isAuthenticated, token } = useAppSelector(state => state.auth)

  // Toast hook
  const { success, error } = useToast()

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

  // Filter state
  const [filters, setFilters] = useState<OperatorGameListParams>({
    pageNo: 1,
    pageSize: 20,
    sortDirection: 1,
    sortBy: 'updatedAt',
  })

  // UI state
  const [selectedOperatorGame, setSelectedOperatorGame] = useState<OperatorGame | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact')

  // Fetch operator games with parameters - only when ready for API calls
  const {
    data: operatorGamesData,
    isLoading: operatorGamesLoading,
    refetch,
    isFetching,
  } = useOperatorGames(filters, isReadyForApiCalls)

  // Mutations
  const createOperatorGameMutation = useCreateOperatorGame()
  const updateOperatorGameMutation = useUpdateOperatorGame()
  const deleteOperatorGameMutation = useDeleteOperatorGame()
  const toggleOperatorGameStatusMutation = useToggleOperatorGameStatus()

  const operatorGames = operatorGamesData?.data || []
  const totalCount = operatorGamesData?.totalItems || operatorGames.length

  // Handle filter changes
  const handleFiltersChange = (newFilters: Partial<OperatorGameListParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters, pageNo: 1 }))
  }

  // Handle reset filters
  const handleResetFilters = () => {
    const resetFilters: OperatorGameListParams = {
      pageNo: 1,
      pageSize: 20,
      sortDirection: 1,
      sortBy: 'updatedAt',
    }
    setFilters(resetFilters)
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, pageNo: page }))
  }

  const handlePageSizeChange = (pageSize: number) => {
    setFilters(prev => ({ ...prev, pageSize, pageNo: 1 }))
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

  // Handle refresh
  const handleRefresh = () => {
    refetch()
    success('Operator games refreshed successfully')
  }

  // Handle export
  const handleExport = () => {
    if (!operatorGames || operatorGames.length === 0) {
      error('No operator games data available to export')
      return
    }

    try {
      const exportData = prepareOperatorGameExportData(operatorGames)
      const timestamp = new Date().toISOString().split('T')[0]
      exportToCSV(exportData, `operator-game-management-${timestamp}`)
      success('Operator games data exported successfully')
    } catch (err) {
      error('Failed to export operator games data')
    }
  }

  // Handle create operator game
  const handleCreateOperatorGame = async (data: any) => {
    try {
      await createOperatorGameMutation.mutateAsync(data)
      setShowCreateDialog(false)
      success('Operator game created successfully')
    } catch (err) {
      error('Failed to create operator game')
    }
  }

  // Handle edit operator game
  const handleEditOperatorGame = async (data: any) => {
    if (!selectedOperatorGame) return

    try {
      await updateOperatorGameMutation.mutateAsync({
        id: selectedOperatorGame._id,
        data,
      })
      setShowEditDialog(false)
      setSelectedOperatorGame(null)
      success('Operator game updated successfully')
    } catch (err) {
      error('Failed to update operator game')
    }
  }

  // Handle delete operator game
  const handleDeleteOperatorGame = async (operatorGame: OperatorGame) => {
    if (!confirm(`Are you sure you want to delete "${operatorGame.gameName}"?`)) {
      return
    }

    try {
      await deleteOperatorGameMutation.mutateAsync(operatorGame._id)
      success('Operator game deleted successfully')
    } catch (err) {
      error('Failed to delete operator game')
    }
  }

  // Handle toggle status
  const handleToggleStatus = async (operatorGame: OperatorGame) => {
    try {
      await toggleOperatorGameStatusMutation.mutateAsync(operatorGame._id)
      success(`Operator game ${operatorGame.isActive ? 'deactivated' : 'activated'} successfully`)
    } catch (err) {
      error('Failed to update operator game status')
    }
  }

  // Handle view details
  const handleViewDetails = (operatorGame: OperatorGame) => {
    setSelectedOperatorGame(operatorGame)
    setShowDetailsDialog(true)
  }

  // Sortable Table Header Component
  const SortableHeader = ({
    column,
    children,
    className = '',
  }: {
    column: string
    children: React.ReactNode
    className?: string
  }) => (
    <TableHead className={className}>
      <Button
        variant='ghost'
        size='sm'
        className='h-auto p-0 font-semibold hover:bg-transparent'
        onClick={() => handleSort(column)}
        disabled={isFetching}
      >
        <div className='flex items-center gap-2'>
          {children}
          {isFetching && filters.sortBy === column ? (
            <RefreshCw className='h-4 w-4 animate-spin' />
          ) : (
            getSortIcon(column)
          )}
        </div>
      </Button>
    </TableHead>
  )

  // Loading skeleton
  const renderSkeleton = () => (
    <div className='space-y-4'>
      {[...Array(5)].map((_, i) => (
        <div key={i} className='flex items-center space-x-4 p-4'>
          <Skeleton className='h-12 w-12 rounded' />
          <div className='space-y-2 flex-1'>
            <Skeleton className='h-4 w-[200px]' />
            <Skeleton className='h-4 w-[150px]' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-[100px]' />
            <Skeleton className='h-4 w-[80px]' />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className='container mx-auto px-4 py-6 space-y-6'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6'
      >
        {/* Title Section */}
        <div className='flex-1 space-y-1'>
          <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900'>
            Operator Game Management
          </h1>
          <p className='text-sm sm:text-base text-gray-600 max-w-2xl'>
            Manage and configure operator games with comprehensive controls and analytics.
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col xs:flex-row sm:flex-row gap-2 sm:gap-3 lg:flex-shrink-0'>
          {/* Refresh Button */}
          <Button
            onClick={handleRefresh}
            size='sm'
            disabled={operatorGamesLoading || isFetching}
            className='flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 transition-all duration-200 h-8 sm:h-9'
          >
            <RefreshCw
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${operatorGamesLoading || isFetching ? 'animate-spin' : ''}`}
            />
            <span className='hidden xs:inline whitespace-nowrap'>
              {operatorGamesLoading || isFetching ? 'Refreshing...' : 'Refresh Data'}
            </span>
            <span className='xs:hidden'>
              {operatorGamesLoading || isFetching ? '...' : 'Refresh'}
            </span>
          </Button>

          {/* Export Button */}
          <Button
            onClick={handleExport}
            size='sm'
            className='flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 transition-all duration-200 h-8 sm:h-9'
          >
            <Download className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
            <span className='hidden xs:inline whitespace-nowrap'>Export CSV</span>
            <span className='xs:hidden'>Export</span>
          </Button>

          {/* Create Button */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button
                size='sm'
                className='flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 transition-all duration-200 h-8 sm:h-9'
              >
                <Plus className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                <span className='hidden xs:inline whitespace-nowrap'>Add Operator Game</span>
                <span className='xs:hidden'>Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>Create Operator Game</DialogTitle>
                <DialogDescription>
                  Configure a new operator game with betting parameters and launch settings.
                </DialogDescription>
              </DialogHeader>
              <OperatorGameForm
                mode='create'
                onSubmit={handleCreateOperatorGame}
                onCancel={() => setShowCreateDialog(false)}
                isLoading={createOperatorGameMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <OperatorGameFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onResetFilters={handleResetFilters}
          loading={operatorGamesLoading}
        />
      </motion.div>

      {/* Stats Cards */}
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
                <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>Total Games</p>
                <p className='text-2xl font-bold text-blue-700 dark:text-blue-300'>
                  {operatorGamesLoading ? '...' : totalCount}
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
                  {operatorGamesLoading ? '...' : operatorGames.filter(g => g.isActive).length}
                </p>
              </div>
              <ToggleRight className='h-8 w-8 text-green-500' />
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
                  {operatorGamesLoading
                    ? '...'
                    : [...new Set(operatorGames.map(g => g.gameType))].length}
                </p>
              </div>
              <Tag className='h-8 w-8 text-purple-500' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200 dark:border-orange-800'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-orange-600 dark:text-orange-400'>
                  Configured Bets
                </p>
                <p className='text-2xl font-bold text-orange-700 dark:text-orange-300'>
                  {operatorGamesLoading
                    ? '...'
                    : operatorGames.filter(g => g.minBet !== undefined).length}
                </p>
              </div>
              <DollarSign className='h-8 w-8 text-orange-500' />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Operator Games Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className='bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-xl border-0 shadow-lg'>
          <CardHeader className='border-b border-gray-200 dark:border-gray-700'>
            <CardTitle className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Gamepad2 className='h-5 w-5' />
                Operator Games ({totalCount})
              </div>
              <Button
                onClick={() => setViewMode(viewMode === 'compact' ? 'detailed' : 'compact')}
                variant='outline'
                size='sm'
                className='h-8 px-3'
              >
                {viewMode === 'compact' ? (
                  <Eye className='h-4 w-4' />
                ) : (
                  <EyeOff className='h-4 w-4' />
                )}
                <span className='hidden sm:inline ml-2'>
                  {viewMode === 'compact' ? 'Detailed' : 'Compact'}
                </span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            {operatorGamesLoading ? (
              renderSkeleton()
            ) : operatorGames.length === 0 ? (
              <div className='text-center py-12'>
                <Gamepad2 className='mx-auto h-12 w-12 text-gray-400' />
                <h3 className='mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100'>
                  No operator games found
                </h3>
                <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                  Get started by creating a new operator game.
                </p>
              </div>
            ) : (
              <div className='relative overflow-x-auto'>
                {isFetching && (
                  <div className='absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center'>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                      <RefreshCw className='h-4 w-4 animate-spin' />
                      Sorting data...
                    </div>
                  </div>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableHeader column='gameName'>Game Name</SortableHeader>
                      <SortableHeader column='gameAlias'>Game Code</SortableHeader>
                      <TableHead className='hidden md:table-cell'>Platform</TableHead>
                      <TableHead className='hidden lg:table-cell'>Operator</TableHead>
                      <TableHead className='hidden xl:table-cell'>Brand</TableHead>
                      {viewMode === 'detailed' && (
                        <>
                          <TableHead className='hidden lg:table-cell'>Min Bet</TableHead>
                          <TableHead className='hidden lg:table-cell'>Max Bet</TableHead>
                          <TableHead className='hidden xl:table-cell'>Default Bet</TableHead>
                          <TableHead className='hidden xl:table-cell'>Max Win</TableHead>
                        </>
                      )}
                      <SortableHeader column='isActive'>Status</SortableHeader>
                      <TableHead className='w-[70px]'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {operatorGames.map(operatorGame => (
                      <TableRow key={operatorGame._id} className='hover:bg-muted/50'>
                        <TableCell>
                          <div className='space-y-1'>
                            <div className='font-medium'>{operatorGame.gameName}</div>
                            <div className='text-xs text-muted-foreground'>
                              {operatorGame.gameType?.toUpperCase() || 'Unknown'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='text-sm font-mono'>{operatorGame.gameAlias}</div>
                        </TableCell>
                        <TableCell className='hidden md:table-cell'>
                          <div className='text-sm'>
                            {operatorGame.platform || (
                              <span className='text-muted-foreground'>-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className='hidden lg:table-cell'>
                          <div className='text-sm'>
                            {operatorGame.operator || (
                              <span className='text-muted-foreground'>-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className='hidden xl:table-cell'>
                          <div className='text-sm'>
                            {operatorGame.brand || <span className='text-muted-foreground'>-</span>}
                          </div>
                        </TableCell>
                        {viewMode === 'detailed' && (
                          <>
                            <TableCell className='hidden lg:table-cell'>
                              <div className='text-sm'>
                                {operatorGame.minBet !== undefined
                                  ? `${operatorGame.minBet.toFixed(2)}`
                                  : '-'}
                              </div>
                            </TableCell>
                            <TableCell className='hidden lg:table-cell'>
                              <div className='text-sm'>
                                {operatorGame.maxBet !== undefined
                                  ? `${operatorGame.maxBet.toFixed(2)}`
                                  : '-'}
                              </div>
                            </TableCell>
                            <TableCell className='hidden xl:table-cell'>
                              <div className='text-sm'>
                                {operatorGame.defaultBet !== undefined
                                  ? `${operatorGame.defaultBet.toFixed(2)}`
                                  : '-'}
                              </div>
                            </TableCell>
                            <TableCell className='hidden xl:table-cell'>
                              <div className='text-sm'>
                                {operatorGame.maxWin !== undefined
                                  ? `${operatorGame.maxWin.toFixed(2)}`
                                  : '-'}
                              </div>
                            </TableCell>
                          </>
                        )}
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            {/* DISABLED: Status toggle functionality temporarily disabled - API not available */}
                            <Switch
                              checked={operatorGame.isActive}
                              onCheckedChange={() => handleToggleStatus(operatorGame)}
                              disabled={true}
                              className='opacity-60'
                            />
                            <Badge variant={operatorGame.isActive ? 'default' : 'secondary'}>
                              {operatorGame.isActive ? 'Active' : 'Inactive'}
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
                              <DropdownMenuItem onClick={() => handleViewDetails(operatorGame)}>
                                <Eye className='mr-2 h-4 w-4' />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedOperatorGame(operatorGame)
                                  setShowEditDialog(true)
                                }}
                              >
                                <Edit className='mr-2 h-4 w-4' />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {/* DISABLED: Delete operator game functionality temporarily disabled - API not available */}
                              <DropdownMenuItem
                                onClick={() => handleDeleteOperatorGame(operatorGame)}
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

            {/* Pagination */}
            {!operatorGamesLoading && operatorGames.length > 0 && (
              <div className='flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t'>
                <div className='text-sm text-muted-foreground'>
                  Showing {((filters.pageNo || 1) - 1) * (filters.pageSize || 20) + 1} to{' '}
                  {Math.min(
                    (filters.pageNo || 1) * (filters.pageSize || 20),
                    operatorGamesData?.totalItems || operatorGames.length
                  )}{' '}
                  of {operatorGamesData?.totalItems || operatorGames.length} games
                </div>

                <div className='flex items-center gap-2'>
                  <div className='flex items-center gap-2 text-sm'>
                    <span>Rows per page:</span>
                    <Select
                      value={(filters.pageSize || 20).toString()}
                      onValueChange={value => handlePageSizeChange(Number(value))}
                    >
                      <SelectTrigger className='h-8 w-16'>
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

                  <div className='flex items-center gap-1'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handlePageChange((filters.pageNo || 1) - 1)}
                      disabled={(filters.pageNo || 1) <= 1}
                      className='h-8 w-8 p-0'
                    >
                      <ChevronLeft className='h-4 w-4' />
                    </Button>

                    <div className='flex items-center gap-1'>
                      {(() => {
                        const currentPage = filters.pageNo || 1
                        const totalPages =
                          operatorGamesData?.totalPages ||
                          Math.ceil(
                            (operatorGamesData?.totalItems || operatorGames.length) /
                              (filters.pageSize || 20)
                          )

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
                        (operatorGamesData?.totalPages ||
                          Math.ceil(
                            (operatorGamesData?.totalItems || operatorGames.length) /
                              (filters.pageSize || 20)
                          ))
                      }
                      className='h-8 w-8 p-0'
                    >
                      <ChevronRight className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Edit Operator Game</DialogTitle>
            <DialogDescription>
              Update operator game betting parameters and configuration.
            </DialogDescription>
          </DialogHeader>
          {selectedOperatorGame && (
            <OperatorGameForm
              mode='edit'
              operatorGame={selectedOperatorGame}
              onSubmit={handleEditOperatorGame}
              onCancel={() => {
                setShowEditDialog(false)
                setSelectedOperatorGame(null)
              }}
              isLoading={updateOperatorGameMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Operator Game Details</DialogTitle>
            <DialogDescription>
              Comprehensive information about the operator game configuration.
            </DialogDescription>
          </DialogHeader>
          {selectedOperatorGame && (
            <OperatorGameDetails operatorGame={selectedOperatorGame} isLoading={false} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
