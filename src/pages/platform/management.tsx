/**
 * Platform Management Page
 * Comprehensive platform CRUD operations with modern UI
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Server,
  Globe,
  RefreshCw,
  Download,
  Filter,
  Eye,
  ExternalLink,
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
import { Skeleton } from '@/components/ui/skeleton'
import { PlatformForm } from '@/components/platform/platform-form-simplified'
import { PlatformDetails } from '@/components/platform/platform-details-simplified'
import { usePlatformData } from '@/hooks/usePlatformData'
import { useDeletePlatform } from '@/hooks/queries/usePlatformQueries'
import { formatDateSafe } from '@/lib/utils/summary'
import { cn } from '@/lib/utils'
import type { Platform } from '@/lib/types/platform'

export function PlatformManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  // Fetch platforms with centralized Redux store
  const {
    platforms,
    platformsLoading: isLoading,
    refetchPlatforms: refetch,
  } = usePlatformData({
    autoFetch: true,
    fetchPlatforms: true,
    fetchOperators: false,
    fetchBrands: false,
  })

  const deleteplatformMutation = useDeletePlatform()

  const totalCount = platforms.length
  const totalPages = Math.ceil(totalCount / pageSize)
  const isFetching = isLoading // For compatibility

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleEdit = (platform: Platform) => {
    setSelectedPlatform(platform)
    setShowEditDialog(true)
  }

  const handleView = (platform: Platform) => {
    setSelectedPlatform(platform)
    setShowDetailsDialog(true)
  }

  const handleDelete = async (platform: Platform) => {
    if (window.confirm(`Are you sure you want to delete platform "${platform.platformName}"?`)) {
      await deleteplatformMutation.mutateAsync(platform._id)
    }
  }

  const handleExport = () => {
    // Export functionality - can be implemented based on requirements
    console.log('Export platforms to CSV')
  }

  const handleRefresh = () => {
    refetch()
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
              Platform Management
            </h1>
            <p className='text-sm text-slate-600 dark:text-slate-400 mt-1'>
              Manage platforms, API endpoints and configurations
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-2'>
            <Button
              onClick={handleRefresh}
              size='sm'
              disabled={isFetching}
              className='flex items-center gap-1 sm:gap-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
            >
              <RefreshCw className={cn('h-3 w-3 sm:h-4 sm:w-4', isFetching && 'animate-spin')} />
              <span className='hidden sm:inline'>
                {isFetching ? 'Refreshing...' : 'Refresh Data'}
              </span>
              <span className='sm:hidden'>{isFetching ? '...' : 'Refresh Data'}</span>
            </Button>

            <Button
              onClick={handleExport}
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
                  <span className='hidden sm:inline'>Add Platform</span>
                  <span className='sm:hidden'>Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                  <DialogTitle>Create New Platform</DialogTitle>
                  <DialogDescription>
                    Add a new platform with API endpoint configurations
                  </DialogDescription>
                </DialogHeader>
                <PlatformForm
                  onSuccess={() => setShowCreateDialog(false)}
                  onCancel={() => setShowCreateDialog(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='grid grid-cols-1 md:grid-cols-3 gap-4'
        >
          <Card className='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-blue-500 text-white'>
                  <Server className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                    Total Platforms
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
                  <Globe className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-sm font-medium text-green-600 dark:text-green-400'>
                    Active Platforms
                  </p>
                  <p className='text-2xl font-bold text-green-900 dark:text-green-100'>
                    {platforms.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-purple-500 text-white'>
                  <ExternalLink className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-sm font-medium text-purple-600 dark:text-purple-400'>
                    API Configurations
                  </p>
                  <p className='text-2xl font-bold text-purple-900 dark:text-purple-100'>
                    {platforms.length}
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
                    placeholder='Search platforms...'
                    value={searchQuery}
                    onChange={e => handleSearch(e.target.value)}
                    className='pl-10'
                  />
                </div>
                <Button variant='outline' className='gap-2'>
                  <Filter className='h-4 w-4' />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Platforms Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Server className='h-5 w-5' />
                Platforms ({totalCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className='space-y-3'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className='h-12 w-full' />
                  ))}
                </div>
              ) : (
                <div className='rounded-md border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Platform Name</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {platforms.map((platform: Platform) => (
                          <motion.tr
                            key={platform._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='group'
                          >
                            <TableCell>
                              <div className='flex items-center gap-3'>
                                <div className='p-2 rounded-lg bg-slate-100 dark:bg-slate-800'>
                                  <Server className='h-4 w-4 text-slate-600 dark:text-slate-400' />
                                </div>
                                <div>
                                  <p className='font-semibold'>{platform.platformName}</p>
                                  <p className='text-sm text-slate-500'>ID: {platform._id}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className='text-slate-600 dark:text-slate-400'>
                              {formatDateSafe(platform.createdAt)}
                            </TableCell>
                            <TableCell className='text-slate-600 dark:text-slate-400'>
                              {formatDateSafe(platform.updatedAt)}
                            </TableCell>
                            <TableCell className='text-right'>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant='ghost' size='sm'>
                                    <MoreHorizontal className='h-4 w-4' />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleView(platform)}>
                                    <Eye className='h-4 w-4 mr-2' />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEdit(platform)}>
                                    <Edit className='h-4 w-4 mr-2' />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(platform)}
                                    className='text-red-600'
                                  >
                                    <Trash2 className='h-4 w-4 mr-2' />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='flex items-center justify-between mt-6'>
                  <p className='text-sm text-slate-600 dark:text-slate-400'>
                    Showing {(currentPage - 1) * pageSize + 1} to{' '}
                    {Math.min(currentPage * pageSize, totalCount)} of {totalCount} platforms
                  </p>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className='text-sm font-medium'>
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Edit Platform</DialogTitle>
            <DialogDescription>Update platform configuration and API endpoints</DialogDescription>
          </DialogHeader>
          {selectedPlatform && (
            <PlatformForm
              platform={selectedPlatform}
              onSuccess={() => setShowEditDialog(false)}
              onCancel={() => setShowEditDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Platform Details</DialogTitle>
            <DialogDescription>
              View platform configuration and API endpoint details
            </DialogDescription>
          </DialogHeader>
          {selectedPlatform && <PlatformDetails platform={selectedPlatform} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
