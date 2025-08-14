/**
 * User Management Page
 * Comprehensive user CRUD operations with modern UI
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
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
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { UserForm } from '@/components/user/user-form'
import { UserDetails } from '@/components/user/user-details'
import { UserFilters } from '@/components/user/user-filters'
import {
  useUsers,
  useDeleteUser,
  useToggleUserStatus,
  useCreateUser,
  useUpdateUser,
} from '@/hooks/queries/useUserQueries'
import { useToast } from '@/hooks/use-toast'
import { useAppSelector } from '@/store/hooks'
import type { User, UserListParams } from '@/lib/api/user'

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
  })

  // UI state
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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
  const deleteUserMutation = useDeleteUser()
  const toggleUserStatusMutation = useToggleUserStatus()

  const users = usersData?.data || []
  const totalCount = users.length

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setFilters(prev => ({ ...prev, searchQuery: value, pageNo: 1 }))
  }

  // Handle filter changes
  const handleFiltersChange = (newFilters: Partial<UserListParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters, pageNo: 1 }))
  }

  // Handle apply filters
  const handleApplyFilters = () => {
    refetch()
  }

  // Handle reset filters
  const handleResetFilters = () => {
    const resetFilters: UserListParams = {
      pageNo: 1,
      pageSize: 25,
      sortDirection: 1,
    }
    setFilters(resetFilters)
    setSearchQuery('')
  }

  // Handle refresh
  const handleRefresh = () => {
    refetch()
    success('Users refreshed successfully')
  }

  // Handle export
  const handleExport = () => {
    // Export logic here
    success('Export functionality will be implemented')
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
  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Are you sure you want to delete "${user.email}"?`)) {
      return
    }

    try {
      await deleteUserMutation.mutateAsync(user._id)
      success('User deleted successfully')
    } catch (err) {
      error('Failed to delete user')
    }
  }

  // Handle toggle status
  const handleToggleStatus = async (user: User) => {
    try {
      await toggleUserStatusMutation.mutateAsync(user._id)
      success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`)
    } catch (err) {
      error('Failed to update user status')
    }
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
      SUB_ADMIN: { variant: 'secondary' as const, icon: Shield, label: 'Sub Admin' },
      ADMIN: { variant: 'outline' as const, icon: Shield, label: 'Admin' },
      USER: { variant: 'outline' as const, icon: UserCheck, label: 'User' },
    }

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.USER
    const IconComponent = config.icon

    return (
      <Badge variant={config.variant}>
        <IconComponent className='w-3 h-3 mr-1' />
        {config.label}
      </Badge>
    )
  }

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
        className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'
      >
        <div className='space-y-1'>
          <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>User Management</h1>
          <p className='text-gray-600 mt-2'>
            Manage system users with comprehensive access controls and permissions.
          </p>
        </div>
        <div className='flex flex-col sm:flex-row gap-2'>
          {/* Refresh Button */}
          <Button
            onClick={handleRefresh}
            size='sm'
            disabled={usersLoading || isFetching}
            className='flex items-center gap-1 sm:gap-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
          >
            <RefreshCw
              className={`h-3 w-3 sm:h-4 sm:w-4 ${usersLoading || isFetching ? 'animate-spin' : ''}`}
            />
            <span className='hidden sm:inline'>
              {usersLoading || isFetching ? 'Refreshing...' : 'Refresh Data'}
            </span>
            <span className='sm:hidden'>{usersLoading || isFetching ? '...' : 'Refresh'}</span>
          </Button>

          {/* Export Button */}
          <Button
            onClick={handleExport}
            size='sm'
            className='flex items-center gap-1 sm:gap-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
          >
            <Download className='h-3 w-3 sm:h-4 sm:w-4' />
            <span className='hidden sm:inline'>Export CSV</span>
            <span className='sm:hidden'>Export</span>
          </Button>

          {/* Create Button */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button
                size='sm'
                className='flex items-center gap-1 sm:gap-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
              >
                <Plus className='h-3 w-3 sm:h-4 sm:w-4' />
                <span className='hidden sm:inline'>Add User</span>
                <span className='sm:hidden'>Add</span>
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
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          loading={usersLoading}
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
                <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>Total Users</p>
                <p className='text-2xl font-bold text-blue-700 dark:text-blue-300'>
                  {usersLoading ? '...' : totalCount}
                </p>
              </div>
              <UsersIcon className='h-8 w-8 text-blue-500' />
            </div>
          </CardContent>
        </Card>

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

        <Card className='bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-purple-600 dark:text-purple-400'>Admins</p>
                <p className='text-2xl font-bold text-purple-700 dark:text-purple-300'>
                  {usersLoading ? '...' : users.filter(u => u.role.includes('ADMIN')).length}
                </p>
              </div>
              <Shield className='h-8 w-8 text-purple-500' />
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
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className='bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-xl border-0 shadow-lg'>
          <CardHeader className='border-b border-gray-200 dark:border-gray-700'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
              <CardTitle className='flex items-center gap-2'>
                <UsersIcon className='h-5 w-5' />
                Users ({totalCount})
              </CardTitle>

              {/* Quick Search */}
              <div className='relative max-w-sm'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Quick search...'
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  className='pl-10 h-9'
                />
              </div>
            </div>
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
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className='hidden md:table-cell'>Platforms</TableHead>
                      <TableHead className='hidden lg:table-cell'>Operators</TableHead>
                      <TableHead className='hidden xl:table-cell'>Brands</TableHead>
                      <TableHead>Status</TableHead>
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
                            <Switch
                              checked={user.isActive}
                              onCheckedChange={() => handleToggleStatus(user)}
                              disabled={toggleUserStatusMutation.isPending}
                            />
                            <Badge variant={user.isActive ? 'default' : 'secondary'}>
                              {user.isActive ? 'Active' : 'Inactive'}
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
                              <DropdownMenuItem
                                onClick={() => handleDeleteUser(user)}
                                className='text-red-600 dark:text-red-400'
                              >
                                <Trash2 className='mr-2 h-4 w-4' />
                                Delete
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
