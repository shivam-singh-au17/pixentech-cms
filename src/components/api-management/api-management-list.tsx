import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit2, Power, PowerOff, Trash2, Plus, Search, Filter } from 'lucide-react'
import {
  useApiManagement,
  useDeleteApiManagement,
  useToggleApiManagementStatus,
} from '../../hooks/queries/useApiManagementQueries'
import { ApiManagementForm } from './api-management-form'
import { ApiManagement } from '../../lib/api/apiManagement'

interface ApiManagementListProps {}

export const ApiManagementList: React.FC<ApiManagementListProps> = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingEndpoint, setEditingEndpoint] = useState<ApiManagement | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [selectedRole, setSelectedRole] = useState<string>('all')

  // Use the individual hooks
  const { data: endpointsData, isLoading, refetch } = useApiManagement({})
  const deleteEndpoint = useDeleteApiManagement()
  const toggleEndpointStatus = useToggleApiManagementStatus()

  const endpoints = endpointsData?.data || []

  // Filter endpoints based on search and filters
  const filteredEndpoints =
    endpoints?.filter(endpoint => {
      const matchesSearch =
        endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        endpoint.endPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        endpoint.description?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' && endpoint.status) ||
        (selectedStatus === 'inactive' && !endpoint.status)

      const matchesRole = selectedRole === 'all' || endpoint.role?.includes(selectedRole)

      return matchesSearch && matchesStatus && matchesRole
    }) || []

  const handleEdit = (endpoint: ApiManagement) => {
    setEditingEndpoint(endpoint)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this API endpoint?')) {
      await deleteEndpoint.mutateAsync(id)
    }
  }

  const handleToggleStatus = async (id: string) => {
    await toggleEndpointStatus.mutateAsync(id)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingEndpoint(null)
    refetch()
  }

  const handleFormSubmit = async (_data: any) => {
    // Handle form submission logic here
    // This would typically call the create or update mutation
    handleFormSuccess()
  }

  const getRolesBadges = (roles: string[]) => {
    return roles?.map(role => (
      <span
        key={role}
        className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mr-1 mb-1'
      >
        {role}
      </span>
    ))
  }

  if (showForm) {
    return (
      <ApiManagementForm
        mode={editingEndpoint ? 'edit' : 'create'}
        apiEndpoint={editingEndpoint || undefined}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setShowForm(false)
          setEditingEndpoint(null)
        }}
      />
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            API Management
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Manage API endpoints and their permissions
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200'
        >
          <Plus className='w-4 h-4 mr-2' />
          Add API Endpoint
        </button>
      </div>

      {/* Search and Filters */}
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* Search */}
          <div className='flex-1'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <input
                type='text'
                placeholder='Search by name, endpoint, or description...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            <Filter className='w-4 h-4 mr-2' />
            Filters
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value as any)}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                >
                  <option value='all'>All Status</option>
                  <option value='active'>Active</option>
                  <option value='inactive'>Inactive</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Role
                </label>
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                >
                  <option value='all'>All Roles</option>
                  <option value='ROOT'>ROOT</option>
                  <option value='SUPER_ADMIN'>SUPER ADMIN</option>
                  <option value='SUB_ADMIN'>SUB ADMIN</option>
                  <option value='ADMIN'>ADMIN</option>
                  <option value='USER'>USER</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Results Count */}
      <div className='text-sm text-gray-600 dark:text-gray-400'>
        Showing {filteredEndpoints.length} of {endpoints?.length || 0} API endpoints
      </div>

      {/* API Endpoints Table */}
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
        {isLoading ? (
          <div className='p-8 text-center'>
            <div className='inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500 hover:bg-blue-400 transition ease-in-out duration-150 cursor-not-allowed'>
              <svg
                className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Loading...
            </div>
          </div>
        ) : filteredEndpoints.length === 0 ? (
          <div className='p-8 text-center text-gray-500 dark:text-gray-400'>
            {searchTerm || selectedStatus !== 'all' || selectedRole !== 'all'
              ? 'No API endpoints match your search criteria.'
              : 'No API endpoints found. Create your first endpoint to get started.'}
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
              <thead className='bg-gray-50 dark:bg-gray-900'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Sl No.
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Endpoint
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Roles
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Description
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                {filteredEndpoints.map((endpoint, index) => (
                  <motion.tr
                    key={endpoint._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className='hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                  >
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                      {index + 1}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900 dark:text-white'>
                        {endpoint.name}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded'>
                        {endpoint.endPoint}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-wrap'>{getRolesBadges(endpoint.role || [])}</div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm text-gray-900 dark:text-white max-w-xs truncate'>
                        {endpoint.description || '-'}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          endpoint.status
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {endpoint.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <div className='flex items-center space-x-2'>
                        <button
                          onClick={() => handleEdit(endpoint)}
                          className='text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors'
                          title='Edit'
                        >
                          <Edit2 className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(endpoint._id)}
                          className={`transition-colors ${
                            endpoint.status
                              ? 'text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300'
                              : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                          }`}
                          title={endpoint.status ? 'Deactivate' : 'Activate'}
                        >
                          {endpoint.status ? (
                            <PowerOff className='w-4 h-4' />
                          ) : (
                            <Power className='w-4 h-4' />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(endpoint._id)}
                          className='text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors'
                          title='Delete'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApiManagementList
