/**
 * API Management Page
 * Comprehensive API endpoint CRUD operations with modern UI
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Globe,
  RefreshCw,
  Download,
  Filter,
  Eye,
  ToggleLeft,
  ToggleRight,
  Power,
  PowerOff,
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
import {
  useApiManagement,
  useDeleteApiManagement,
  useToggleApiManagementStatus,
  useCreateApiManagement,
  useUpdateApiManagement,
} from '@/hooks/queries/useApiManagementQueries'
import { ApiManagementForm } from '@/components/api-management/api-management-form'
import { ApiManagement, CreateApiManagementData } from '@/lib/api/apiManagement'
import { useAppSelector } from '@/store/hooks'
import { cn } from '@/lib/utils'

const roleOptions = [
  { value: 'ROOT', label: 'ROOT' },
  { value: 'SUPER_ADMIN', label: 'SUPER ADMIN' },
  { value: 'SUB_ADMIN', label: 'SUB ADMIN' },
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'USER', label: 'USER' },
]

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
]

const formatDateSafe = (dateString?: string) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return 'Invalid Date'
  }
}

const ApiManagementPage: React.FC = () => {
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
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedApiEndpoint, setSelectedApiEndpoint] = useState<ApiManagement | null>(null)

  // React Query hooks
  const {
    data: apiEndpointsData,
    isLoading: apiEndpointsLoading,
    refetch: refetchApiEndpoints,
  } = useApiManagement({}, isReadyForApiCalls)

  const deleteApiEndpointMutation = useDeleteApiManagement()
  const updateApiEndpointStatusMutation = useToggleApiManagementStatus()
  const createApiEndpointMutation = useCreateApiManagement()
  const updateApiEndpointMutation = useUpdateApiManagement()

  const apiEndpoints = apiEndpointsData?.data || []
  const totalCount = apiEndpointsData?.totalItems || apiEndpoints.length

  // Filter API endpoints by search query on frontend
  const filteredApiEndpoints = apiEndpoints.filter(
    (endpoint: ApiManagement) =>
      (endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.endPoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.description?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedRole === '' || endpoint.role?.includes(selectedRole)) &&
      (selectedStatus === '' ||
        selectedStatus === 'all' ||
        (selectedStatus === 'true' && endpoint.status) ||
        (selectedStatus === 'false' && !endpoint.status))
  )

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  const handleRoleFilter = (value: string) => {
    setSelectedRole(value === 'all' ? '' : value)
  }

  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value === 'all' ? '' : value)
  }

  const handleEdit = (endpoint: ApiManagement) => {
    setSelectedApiEndpoint(endpoint)
    setShowEditDialog(true)
  }

  const handleView = (endpoint: ApiManagement) => {
    setSelectedApiEndpoint(endpoint)
    setShowDetailsDialog(true)
  }

  const handleDelete = async (endpoint: ApiManagement) => {
    if (window.confirm(`Are you sure you want to delete API endpoint "${endpoint.name}"?`)) {
      await deleteApiEndpointMutation.mutateAsync(endpoint._id)
    }
  }

  const handleStatusToggle = async (endpoint: ApiManagement) => {
    await updateApiEndpointStatusMutation.mutateAsync(endpoint._id)
  }

  const handleRefresh = () => {
    refetchApiEndpoints()
  }

  const handleCreateSubmit = async (data: CreateApiManagementData) => {
    try {
      await createApiEndpointMutation.mutateAsync(data)
      setShowCreateDialog(false)
      refetchApiEndpoints()
    } catch (error) {
      console.error('Failed to create API endpoint:', error)
    }
  }

  const handleEditSubmit = async (data: CreateApiManagementData) => {
    if (!selectedApiEndpoint) return
    try {
      await updateApiEndpointMutation.mutateAsync({
        id: selectedApiEndpoint._id,
        data: { ...data, _id: selectedApiEndpoint._id },
      })
      setShowEditDialog(false)
      setSelectedApiEndpoint(null)
      refetchApiEndpoints()
    } catch (error) {
      console.error('Failed to update API endpoint:', error)
    }
  }

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Endpoint', 'Roles', 'Description', 'Status', 'Created', 'Updated'],
      ...filteredApiEndpoints.map((endpoint: ApiManagement) => [
        endpoint.name,
        endpoint.endPoint,
        endpoint.role?.join(', ') || '',
        endpoint.description || '',
        endpoint.status ? 'Active' : 'Inactive',
        formatDateSafe(endpoint.createdAt),
        formatDateSafe(endpoint.updatedAt),
      ]),
    ]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'api-management.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const activeCount = apiEndpoints.filter((e: ApiManagement) => e.status).length
  const inactiveCount = totalCount - activeCount

  // Temporarily allow rendering even if not ready for debugging
  const shouldShowLoadingScreen = false // !isReadyForApiCalls

  if (shouldShowLoadingScreen) {
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
    <div className='space-y-6 p-6 max-w-7xl mx-auto'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4'
      >
        <div>
          <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent'>
            API Management
          </h1>
          <p className='text-sm text-slate-600 dark:text-slate-400 mt-1'>
            Manage API endpoints and their permissions
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-2'>
          <Button
            onClick={handleRefresh}
            size='sm'
            disabled={apiEndpointsLoading}
            className='flex items-center gap-1 sm:gap-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
          >
            <RefreshCw
              className={cn('h-3 w-3 sm:h-4 sm:w-4', apiEndpointsLoading && 'animate-spin')}
            />
            <span className='hidden sm:inline'>
              {apiEndpointsLoading ? 'Refreshing...' : 'Refresh Data'}
            </span>
            <span className='sm:hidden'>{apiEndpointsLoading ? '...' : 'Refresh'}</span>
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
                <span className='hidden sm:inline'>Add API Endpoint</span>
                <span className='sm:hidden'>Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>Create New API Endpoint</DialogTitle>
                <DialogDescription>
                  Add a new API endpoint with role-based permissions
                </DialogDescription>
              </DialogHeader>
              <ApiManagementForm
                mode='create'
                onSubmit={handleCreateSubmit}
                onCancel={() => setShowCreateDialog(false)}
                isLoading={createApiEndpointMutation.isPending}
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
        className='grid grid-cols-1 md:grid-cols-4 gap-4'
      >
        <Card className='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800'>
          <CardContent className='p-6'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-blue-500 text-white'>
                <Globe className='h-5 w-5' />
              </div>
              <div>
                <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                  Total Endpoints
                </p>
                <p className='text-2xl font-bold text-blue-900 dark:text-blue-100'>{totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800'>
          <CardContent className='p-6'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-green-500 text-white'>
                <Power className='h-5 w-5' />
              </div>
              <div>
                <p className='text-sm font-medium text-green-600 dark:text-green-400'>Active</p>
                <p className='text-2xl font-bold text-green-900 dark:text-green-100'>
                  {activeCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800'>
          <CardContent className='p-6'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-orange-500 text-white'>
                <PowerOff className='h-5 w-5' />
              </div>
              <div>
                <p className='text-sm font-medium text-orange-600 dark:text-orange-400'>Inactive</p>
                <p className='text-2xl font-bold text-orange-900 dark:text-orange-100'>
                  {inactiveCount}
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
                <p className='text-sm font-medium text-purple-600 dark:text-purple-400'>Filtered</p>
                <p className='text-2xl font-bold text-purple-900 dark:text-purple-100'>
                  {filteredApiEndpoints.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Search className='h-5 w-5' />
              Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col lg:flex-row gap-4'>
              <div className='flex-1'>
                <Input
                  placeholder='Search by name, endpoint, or description...'
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  className='w-full'
                />
              </div>

              <div className='flex flex-col sm:flex-row gap-2'>
                <Select value={selectedRole} onValueChange={handleRoleFilter}>
                  <SelectTrigger className='w-full sm:w-48'>
                    <SelectValue placeholder='Filter by Role' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Roles</SelectItem>
                    {roleOptions.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={handleStatusFilter}>
                  <SelectTrigger className='w-full sm:w-48'>
                    <SelectValue placeholder='Filter by Status' />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* API Endpoints Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Globe className='h-5 w-5' />
              API Endpoints ({filteredApiEndpoints.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {apiEndpointsLoading ? (
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
                      <TableHead>Name</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredApiEndpoints.map((endpoint: ApiManagement) => (
                        <motion.tr
                          key={endpoint._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className='group hover:bg-muted/50'
                        >
                          <TableCell className='font-medium'>{endpoint.name}</TableCell>
                          <TableCell>
                            <code className='px-2 py-1 bg-muted rounded text-sm'>
                              {endpoint.endPoint}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div className='flex flex-wrap gap-1'>
                              {endpoint.role?.map((role, index) => (
                                <Badge key={index} variant='secondary' className='text-xs'>
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className='max-w-xs truncate'>
                            {endpoint.description || '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={endpoint.status ? 'default' : 'secondary'}>
                              {endpoint.status ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className='text-muted-foreground'>
                            {formatDateSafe(endpoint.createdAt)}
                          </TableCell>
                          <TableCell className='text-muted-foreground'>
                            {formatDateSafe(endpoint.updatedAt)}
                          </TableCell>
                          <TableCell className='text-right'>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant='ghost' className='h-8 w-8 p-0'>
                                  <MoreHorizontal className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleView(endpoint)}>
                                  <Eye className='mr-2 h-4 w-4' />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(endpoint)}>
                                  <Edit className='mr-2 h-4 w-4' />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusToggle(endpoint)}>
                                  {endpoint.status ? (
                                    <>
                                      <ToggleLeft className='mr-2 h-4 w-4' />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <ToggleRight className='mr-2 h-4 w-4' />
                                      Activate
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(endpoint)}
                                  className='text-destructive'
                                >
                                  <Trash2 className='mr-2 h-4 w-4' />
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

                {filteredApiEndpoints.length === 0 && !apiEndpointsLoading && (
                  <div className='text-center py-8 text-muted-foreground'>
                    {searchQuery || selectedRole || selectedStatus
                      ? 'No API endpoints match your search criteria.'
                      : 'No API endpoints found. Create your first endpoint to get started.'}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Edit API Endpoint</DialogTitle>
            <DialogDescription>Update the API endpoint configuration</DialogDescription>
          </DialogHeader>
          {selectedApiEndpoint && (
            <ApiManagementForm
              mode='edit'
              apiEndpoint={selectedApiEndpoint}
              onSubmit={handleEditSubmit}
              onCancel={() => setShowEditDialog(false)}
              isLoading={updateApiEndpointMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>API Endpoint Details</DialogTitle>
          </DialogHeader>
          {selectedApiEndpoint && (
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>Name</label>
                  <p className='font-medium'>{selectedApiEndpoint.name}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>Status</label>
                  <p>
                    <Badge variant={selectedApiEndpoint.status ? 'default' : 'secondary'}>
                      {selectedApiEndpoint.status ? 'Active' : 'Inactive'}
                    </Badge>
                  </p>
                </div>
              </div>

              <div>
                <label className='text-sm font-medium text-muted-foreground'>Endpoint</label>
                <p className='font-mono bg-muted p-2 rounded'>{selectedApiEndpoint.endPoint}</p>
              </div>

              <div>
                <label className='text-sm font-medium text-muted-foreground'>Description</label>
                <p>{selectedApiEndpoint.description || 'No description provided'}</p>
              </div>

              <div>
                <label className='text-sm font-medium text-muted-foreground'>Roles</label>
                <div className='flex flex-wrap gap-1 mt-1'>
                  {selectedApiEndpoint.role?.map((role, index) => (
                    <Badge key={index} variant='secondary'>
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>Created</label>
                  <p>{formatDateSafe(selectedApiEndpoint.createdAt)}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>Updated</label>
                  <p>{formatDateSafe(selectedApiEndpoint.updatedAt)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ApiManagementPage
