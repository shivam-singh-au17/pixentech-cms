/**
 * Operator Management Page
 * Comprehensive operator CRUD operations with modern UI
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Building2,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Users,
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
import { OperatorForm } from '@/components/operator/operator-form'
import { OperatorDetails } from '@/components/operator/operator-details'
import { usePlatformData } from '@/hooks/usePlatformData'
import { useDeleteOperator } from '@/hooks/queries/useOperatorQueries'
import { formatDateSafe } from '@/lib/utils/summary'
import { cn } from '@/lib/utils'
import type { Operator } from '@/lib/types/platform-updated'

export function OperatorManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  // Fetch operators and platforms with centralized Redux store
  const {
    operators,
    platformOptions,
    operatorsLoading: isLoading,
    refetchOperators: refetch,
  } = usePlatformData({
    autoFetch: true,
    fetchPlatforms: true,
    fetchOperators: true,
    fetchBrands: false,
  })

  const deleteOperatorMutation = useDeleteOperator()

  const totalCount = operators.length
  const isFetching = isLoading // For compatibility
  // const totalPages = Math.ceil(totalCount / pageSize)

  // Filter operators by search query on frontend (since API doesn't support search)
  const filteredOperators = operators.filter((operator: Operator) =>
    operator.operatorName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  const handlePlatformFilter = (value: string) => {
    setSelectedPlatform(value === 'all' ? '' : value)
  }

  const handleEdit = (operator: Operator) => {
    setSelectedOperator(operator)
    setShowEditDialog(true)
  }

  const handleView = (operator: Operator) => {
    setSelectedOperator(operator)
    setShowDetailsDialog(true)
  }

  const handleDelete = async (operator: Operator) => {
    if (window.confirm(`Are you sure you want to delete operator "${operator.operatorName}"?`)) {
      await deleteOperatorMutation.mutateAsync(operator._id)
    }
  }

  const handleExport = () => {
    // Export functionality - can be implemented based on requirements
    const csvContent = [
      ['Operator Name', 'Platform', 'Created', 'Updated'],
      ...filteredOperators.map((op: Operator) => [
        op.operatorName,
        platformOptions.find((p: any) => p.value === op.platform)?.label || op.platform,
        formatDateSafe(op.createdAt),
        formatDateSafe(op.updatedAt),
      ]),
    ]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'operators.csv'
    a.click()
    URL.revokeObjectURL(url)
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
              Operator Management
            </h1>
            <p className='text-sm text-slate-600 dark:text-slate-400 mt-1'>
              Manage operators across different platforms
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
                  <span className='hidden sm:inline'>Add Operator</span>
                  <span className='sm:hidden'>Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-2xl'>
                <DialogHeader>
                  <DialogTitle>Create New Operator</DialogTitle>
                  <DialogDescription>
                    Add a new operator to manage platform operations
                  </DialogDescription>
                </DialogHeader>
                <OperatorForm
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
          <Card className='bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-green-500 text-white'>
                  <Building2 className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-sm font-medium text-green-600 dark:text-green-400'>
                    Total Operators
                  </p>
                  <p className='text-2xl font-bold text-green-900 dark:text-green-100'>
                    {totalCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-blue-500 text-white'>
                  <Users className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                    Active Platforms
                  </p>
                  <p className='text-2xl font-bold text-blue-900 dark:text-blue-100'>
                    {platformOptions.length - 1}
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
                    {filteredOperators.length}
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
                    placeholder='Search operators...'
                    value={searchQuery}
                    onChange={e => handleSearch(e.target.value)}
                    className='pl-10'
                  />
                </div>
                <Select value={selectedPlatform || 'all'} onValueChange={handlePlatformFilter}>
                  <SelectTrigger className='w-full sm:w-[200px]'>
                    <SelectValue placeholder='Filter by Platform' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Platforms</SelectItem>
                    {platformOptions.map((platform: any) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Operators Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Building2 className='h-5 w-5' />
                Operators ({filteredOperators.length})
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
                        <TableHead>Operator Name</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {filteredOperators.map((operator: Operator) => (
                          <motion.tr
                            key={operator._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='group'
                          >
                            <TableCell className='font-medium'>
                              <div className='flex items-center gap-3'>
                                <div className='p-2 rounded-lg bg-slate-100 dark:bg-slate-800'>
                                  <Building2 className='h-4 w-4 text-slate-600 dark:text-slate-400' />
                                </div>
                                <div>
                                  <p className='font-semibold'>{operator.operatorName}</p>
                                  <p className='text-sm text-slate-500'>ID: {operator._id}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant='outline' className='font-mono text-xs'>
                                {platformOptions.find((p: any) => p.value === operator.platform)
                                  ?.label || operator.platform}
                              </Badge>
                            </TableCell>
                            <TableCell className='text-slate-600 dark:text-slate-400'>
                              {formatDateSafe(operator.createdAt)}
                            </TableCell>
                            <TableCell className='text-slate-600 dark:text-slate-400'>
                              {formatDateSafe(operator.updatedAt)}
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
                                  <DropdownMenuItem onClick={() => handleView(operator)}>
                                    <Eye className='h-4 w-4 mr-2' />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEdit(operator)}>
                                    <Edit className='h-4 w-4 mr-2' />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(operator)}
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
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Edit Operator</DialogTitle>
            <DialogDescription>Update operator information</DialogDescription>
          </DialogHeader>
          {selectedOperator && (
            <OperatorForm
              operator={selectedOperator}
              onSuccess={() => setShowEditDialog(false)}
              onCancel={() => setShowEditDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Operator Details</DialogTitle>
            <DialogDescription>View detailed operator information</DialogDescription>
          </DialogHeader>
          {selectedOperator && <OperatorDetails operator={selectedOperator} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
