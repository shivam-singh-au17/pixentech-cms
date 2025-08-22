/**
 * User Management Page
 * Comprehensive user CRUD operations with modern UI
 *
 * IMPORTANT NOTES:
 * - Delete user functionality is DISABLED (API endpoint not implemented)
 * - Toggle user status functionality is DISABLED (API endpoint not implemented)
 * - These features will be enabled once backend APIs are ready
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Users as UsersIcon,
  RefreshCw,
  Download,
  Shield,
  Eye,
  UserCheck,
  UserX,
  Crown,
  Briefcase,
  Headphones,
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
import { UserForm } from '@/components/user/user-form'
import { UserDetails } from '@/components/user/user-details'
import { UserFilters } from '@/components/user/user-filters'
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  // DISABLED: These imports are commented out since APIs are not available
  // useDeleteUser,
  // useToggleUserStatus,
} from '@/hooks/queries/useUserQueries'
import { useToast } from '@/hooks/use-toast'
import { useAppSelector } from '@/store/hooks'
import type { User, UserListParams } from '@/lib/api/user'

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

// Prepare user data for export
const prepareUserExportData = (users: User[]) => {
  return users.map(user => ({
    'User ID': user._id,
    Email: user.email,
    'User Name': user.userName || 'N/A',
    Role: user.role,
    Status: user.isActive ? 'Active' : 'Inactive',
    Platforms: user.allowedPlatforms.join('; ') || 'None',
    Operators: user.allowedOperators.join('; ') || 'None',
    Brands: user.allowedBrands.join('; ') || 'None',
    'Created At': user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A',
    'Updated At': user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'N/A',
  }))
}

export default function UserManagement() {
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
  const [filters, setFilters] = useState<UserListParams>({
    pageNo: 1,
    pageSize: 25,
    sortDirection: 1,
    sortBy: 'updatedAt',
  })

  // UI state
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  // Fetch users with parameters - only when ready for API calls
  const {
    data: usersData,
    isLoading: usersLoading,
    refetch,
    isFetching,
  } = useUsers(filters, isReadyForApiCalls)

  // Mutations
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  // DISABLED: These mutations are commented out since APIs are not available
  // const deleteUserMutation = useDeleteUser()
  // const toggleUserStatusMutation = useToggleUserStatus()

  const users = usersData?.data || []
  const totalCount = usersData?.totalItems || 0

  // Handle filter changes
  const handleFiltersChange = (newFilters: Partial<UserListParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters, pageNo: 1 }))
  }

  // Handle reset filters
  const handleResetFilters = () => {
    const resetFilters: UserListParams = {
      pageNo: 1,
      pageSize: 25,
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
    success('Users refreshed successfully')
  }

  // Handle export
  const handleExport = () => {
    if (!users || users.length === 0) {
      error('No users data available to export')
      return
    }

    try {
      const exportData = prepareUserExportData(users)
      const timestamp = new Date().toISOString().split('T')[0]
      exportToCSV(exportData, `user-management-${timestamp}`)
      success('Users data exported successfully')
    } catch (err) {
      error('Failed to export users data')
    }
  }

  // Handle create user
  const handleCreateUser = async (data: any) => {
    try {
      await createUserMutation.mutateAsync(data)
      setShowCreateDialog(false)
      success('User created successfully')
    } catch (err) {
      error('Failed to create user')
    }
  }

  // Handle edit user
  const handleEditUser = async (data: any) => {
    if (!selectedUser) return

    try {
      await updateUserMutation.mutateAsync({
        id: selectedUser._id,
        data,
      })
      setShowEditDialog(false)
      setSelectedUser(null)
      success('User updated successfully')
    } catch (err) {
      error('Failed to update user')
    }
  }

  // Handle delete user
  // DISABLED: Delete user API endpoint is not implemented yet
  // TODO: Enable this function once the backend delete user API is ready
  const handleDeleteUser = async (_user: User) => {
    // Temporarily disabled - API not available
    error('Delete user functionality is temporarily disabled. API endpoint not available.')
    return

    /* Original implementation - uncomment when API is ready
    if (!confirm(`Are you sure you want to delete "${_user.email}"?`)) {
      return
    }

    try {
      await deleteUserMutation.mutateAsync(_user._id)
      success('User deleted successfully')
    } catch (err) {
      error('Failed to delete user')
    }
    */
  }

  // Handle toggle status
  // DISABLED: Toggle user status API endpoint is not implemented yet
  // TODO: Enable this function once the backend toggle user status API is ready
  const handleToggleStatus = async (_user: User) => {
    // Temporarily disabled - API not available
    error('Toggle user status functionality is temporarily disabled. API endpoint not available.')
    return

    /* Original implementation - uncomment when API is ready
    try {
      await toggleUserStatusMutation.mutateAsync(_user._id)
      success(`User ${_user.isActive ? 'deactivated' : 'activated'} successfully`)
    } catch (err) {
      error('Failed to update user status')
    }
    */
  }

  // Handle view details
  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
    setShowDetailsDialog(true)
  }

  // Get role badge
  const getRoleBadge = (role: string) => {
    const roleConfig = {
      ROOT: { variant: 'destructive' as const, icon: Crown, label: 'Root' },
      SUPER_ADMIN: { variant: 'default' as const, icon: Shield, label: 'Super Admin' },
      SUB_ADMIN: { variant: 'secondary' as const, icon: UserCheck, label: 'Sub Admin' },
      MANAGER: { variant: 'outline' as const, icon: Briefcase, label: 'Manager' },
      SUPPORT: { variant: 'outline' as const, icon: Headphones, label: 'Support' },
    }

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.SUPPORT
    const IconComponent = config.icon

    return (
      <Badge variant={config.variant}>
        <IconComponent className='w-3 h-3 mr-1' />
        {config.label}
      </Badge>
    )
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
            User Management
          </h1>
          <p className='text-sm sm:text-base text-gray-600 max-w-2xl'>
            Manage system users with comprehensive access controls and permissions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col xs:flex-row sm:flex-row gap-2 sm:gap-3 lg:flex-shrink-0'>
          {/* Refresh Button */}
          <Button
            onClick={handleRefresh}
            size='sm'
            disabled={usersLoading || isFetching}
            className='flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 transition-all duration-200 h-8 sm:h-9'
          >
            <RefreshCw
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${usersLoading || isFetching ? 'animate-spin' : ''}`}
            />
            <span className='hidden xs:inline whitespace-nowrap'>
              {usersLoading || isFetching ? 'Refreshing...' : 'Refresh Data'}
            </span>
            <span className='xs:hidden'>{usersLoading || isFetching ? '...' : 'Refresh'}</span>
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
                <span className='hidden xs:inline whitespace-nowrap'>Add User</span>
                <span className='xs:hidden'>Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>Create User</DialogTitle>
                <DialogDescription>
                  Create a new user with specific roles and permissions.
                </DialogDescription>
              </DialogHeader>
              <UserForm
                mode='create'
                onSubmit={handleCreateUser}
                onCancel={() => setShowCreateDialog(false)}
                isLoading={createUserMutation.isPending}
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
        <UserFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onResetFilters={handleResetFilters}
          loading={usersLoading}
        />
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'
      >
        <Card className='bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-green-600 dark:text-green-400'>
                  Active Users
                </p>
                <p className='text-2xl font-bold text-green-700 dark:text-green-300'>
                  {usersLoading ? '...' : users.filter(u => u.isActive).length}
                </p>
              </div>
              <UserCheck className='h-8 w-8 text-green-500' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-200 dark:border-red-800'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-red-600 dark:text-red-400'>Inactive Users</p>
                <p className='text-2xl font-bold text-red-700 dark:text-red-300'>
                  {usersLoading ? '...' : users.filter(u => !u.isActive).length}
                </p>
              </div>
              <UserX className='h-8 w-8 text-red-500' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>Super Admins</p>
                <p className='text-2xl font-bold text-blue-700 dark:text-blue-300'>
                  {usersLoading ? '...' : users.filter(u => u.role === 'SUPER_ADMIN').length}
                </p>
              </div>
              <Shield className='h-8 w-8 text-blue-500' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-purple-600 dark:text-purple-400'>
                  Sub Admins
                </p>
                <p className='text-2xl font-bold text-purple-700 dark:text-purple-300'>
                  {usersLoading ? '...' : users.filter(u => u.role === 'SUB_ADMIN').length}
                </p>
              </div>
              <UserCheck className='h-8 w-8 text-purple-500' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200 dark:border-orange-800'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-orange-600 dark:text-orange-400'>Manager</p>
                <p className='text-2xl font-bold text-orange-700 dark:text-orange-300'>
                  {usersLoading ? '...' : users.filter(u => u.role === 'MANAGER').length}
                </p>
              </div>
              <Briefcase className='h-8 w-8 text-orange-500' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-teal-500/10 to-teal-600/5 border-teal-200 dark:border-teal-800'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-teal-600 dark:text-teal-400'>Support</p>
                <p className='text-2xl font-bold text-teal-700 dark:text-teal-300'>
                  {usersLoading ? '...' : users.filter(u => u.role === 'SUPPORT').length}
                </p>
              </div>
              <Headphones className='h-8 w-8 text-teal-500' />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className='bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-xl border-0 shadow-lg'>
          <CardHeader className='border-b border-gray-200 dark:border-gray-700'>
            <CardTitle className='flex items-center gap-2'>
              <UsersIcon className='h-5 w-5' />
              Users ({totalCount})
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            {usersLoading ? (
              renderSkeleton()
            ) : users.length === 0 ? (
              <div className='text-center py-12'>
                <UsersIcon className='mx-auto h-12 w-12 text-gray-400' />
                <h3 className='mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100'>
                  No users found
                </h3>
                <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                  Get started by creating a new user.
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
                      <SortableHeader column='email'>Email</SortableHeader>
                      <SortableHeader column='role'>Role</SortableHeader>
                      <TableHead className='hidden md:table-cell'>Platforms</TableHead>
                      <TableHead className='hidden lg:table-cell'>Operators</TableHead>
                      <TableHead className='hidden xl:table-cell'>Brands</TableHead>
                      <SortableHeader column='isActive'>Status</SortableHeader>
                      <SortableHeader column='createdAt' className='hidden lg:table-cell'>
                        Created
                      </SortableHeader>
                      <SortableHeader column='updatedAt' className='hidden xl:table-cell'>
                        Updated
                      </SortableHeader>
                      <TableHead className='w-[70px]'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user._id} className='hover:bg-muted/50'>
                        <TableCell>
                          <div className='space-y-1'>
                            <div className='font-medium'>{user.email}</div>
                            {user.userName && (
                              <div className='text-xs text-muted-foreground'>{user.userName}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell className='hidden md:table-cell'>
                          <div className='text-sm'>
                            {user.allowedPlatforms.length > 0 ? (
                              <Badge variant='outline' className='text-xs'>
                                {user.allowedPlatforms.length} Platform
                                {user.allowedPlatforms.length !== 1 ? 's' : ''}
                              </Badge>
                            ) : (
                              <span className='text-muted-foreground'>None</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className='hidden lg:table-cell'>
                          <div className='text-sm'>
                            {user.allowedOperators.length > 0 ? (
                              <Badge variant='outline' className='text-xs'>
                                {user.allowedOperators.length} Operator
                                {user.allowedOperators.length !== 1 ? 's' : ''}
                              </Badge>
                            ) : (
                              <span className='text-muted-foreground'>None</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className='hidden xl:table-cell'>
                          <div className='text-sm'>
                            {user.allowedBrands.length > 0 ? (
                              <Badge variant='outline' className='text-xs'>
                                {user.allowedBrands.length} Brand
                                {user.allowedBrands.length !== 1 ? 's' : ''}
                              </Badge>
                            ) : (
                              <span className='text-muted-foreground'>None</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            {/* DISABLED: Status toggle functionality temporarily disabled - API not available */}
                            <Switch
                              checked={user.isActive}
                              onCheckedChange={() => handleToggleStatus(user)}
                              disabled={true}
                              className='opacity-60'
                            />
                            <Badge variant={user.isActive ? 'default' : 'secondary'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className='hidden lg:table-cell'>
                          <div className='text-sm'>
                            {user.createdAt ? (
                              <div>
                                <div className='font-medium'>
                                  {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                                <div className='text-xs text-muted-foreground'>
                                  {new Date(user.createdAt).toLocaleTimeString()}
                                </div>
                              </div>
                            ) : (
                              <span className='text-muted-foreground'>-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className='hidden xl:table-cell'>
                          <div className='text-sm'>
                            {user.updatedAt ? (
                              <div>
                                <div className='font-medium'>
                                  {new Date(user.updatedAt).toLocaleDateString()}
                                </div>
                                <div className='text-xs text-muted-foreground'>
                                  {new Date(user.updatedAt).toLocaleTimeString()}
                                </div>
                              </div>
                            ) : (
                              <span className='text-muted-foreground'>-</span>
                            )}
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
                              <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                                <Eye className='mr-2 h-4 w-4' />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user)
                                  setShowEditDialog(true)
                                }}
                              >
                                <Edit className='mr-2 h-4 w-4' />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {/* DISABLED: Delete user functionality temporarily disabled - API not available */}
                              <DropdownMenuItem
                                onClick={() => handleDeleteUser(user)}
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
            {!usersLoading && users.length > 0 && (
              <div className='flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t'>
                <div className='text-sm text-muted-foreground'>
                  Showing {((filters.pageNo || 1) - 1) * (filters.pageSize || 25) + 1} to{' '}
                  {Math.min(
                    (filters.pageNo || 1) * (filters.pageSize || 25),
                    usersData?.totalItems || users.length
                  )}{' '}
                  of {usersData?.totalItems || users.length} users
                </div>

                <div className='flex items-center gap-2'>
                  <div className='flex items-center gap-2 text-sm'>
                    <span>Rows per page:</span>
                    <Select
                      value={(filters.pageSize || 25).toString()}
                      onValueChange={value => handlePageSizeChange(Number(value))}
                    >
                      <SelectTrigger className='h-8 w-16'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='10'>10</SelectItem>
                        <SelectItem value='25'>25</SelectItem>
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
                          usersData?.totalPages ||
                          Math.ceil(
                            (usersData?.totalItems || users.length) / (filters.pageSize || 25)
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
                        (usersData?.totalPages ||
                          Math.ceil(
                            (usersData?.totalItems || users.length) / (filters.pageSize || 25)
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
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information, permissions, and access controls.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              mode='edit'
              user={selectedUser}
              onSubmit={handleEditUser}
              onCancel={() => {
                setShowEditDialog(false)
                setSelectedUser(null)
              }}
              isLoading={updateUserMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Comprehensive information about the user and their permissions.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && <UserDetails user={selectedUser} isLoading={false} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
