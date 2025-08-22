/**
 * Brand Management Page
 * Comprehensive brand CRUD operations with modern UI
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Tag,
  RefreshCw,
  Download,
  Filter,
  Eye,
  ToggleLeft,
  ToggleRight,
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
import { BrandForm } from '@/components/brand/brand-form'
import { BrandDetails } from '@/components/brand/brand-details'
import { useDeleteBrand, useUpdateBrandStatus } from '@/hooks/queries/useBrandQueries'
import { usePlatformData } from '@/hooks/data'
import { formatDateSafe } from '@/lib/utils/summary'
import { cn } from '@/lib/utils'
import type { Brand } from '@/lib/types/platform-updated'

export function BrandManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [selectedOperator, setSelectedOperator] = useState<string>('')
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  // Use centralized Redux-based platform data (authentication-aware)
  const { platformOptions, operatorOptions, brands, brandsLoading, refetchAll } = usePlatformData({
    fetchPlatforms: true,
    fetchOperators: true,
    fetchBrands: true,
    autoFetch: true,
  })

  const deleteBrandMutation = useDeleteBrand()
  const updateBrandStatusMutation = useUpdateBrandStatus()

  const totalCount = brands.length
  // const totalPages = Math.ceil(totalCount / pageSize)

  // Filter brands by search query on frontend
  const filteredBrands = brands.filter(
    (brand: Brand) =>
      brand.brandName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedPlatform === '' || brand.platform === selectedPlatform) &&
      (selectedOperator === '' || brand.operator === selectedOperator)
  )

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  const handlePlatformFilter = (value: string) => {
    setSelectedPlatform(value === 'all' ? '' : value)
  }

  const handleOperatorFilter = (value: string) => {
    setSelectedOperator(value === 'all' ? '' : value)
  }

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand)
    setShowEditDialog(true)
  }

  const handleView = (brand: Brand) => {
    setSelectedBrand(brand)
    setShowDetailsDialog(true)
  }

  const handleDelete = async (brand: Brand) => {
    if (window.confirm(`Are you sure you want to delete brand "${brand.brandName}"?`)) {
      await deleteBrandMutation.mutateAsync(brand._id)
    }
  }

  const handleStatusToggle = async (brand: Brand) => {
    await updateBrandStatusMutation.mutateAsync({
      id: brand._id,
      isActive: !brand.isActive,
    })
  }

  const handleExport = () => {
    const csvContent = [
      ['Brand Name', 'Platform', 'Operator', 'Status', 'Created', 'Updated'],
      ...filteredBrands.map((brand: Brand) => [
        brand.brandName,
        platformOptions.find((p: any) => p.value === brand.platform)?.label || brand.platform,
        operatorOptions.find((o: any) => o.value === brand.operator)?.label || brand.operator,
        brand.isActive ? 'Active' : 'Inactive',
        formatDateSafe(brand.createdAt),
        formatDateSafe(brand.updatedAt),
      ]),
    ]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'brands.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleRefresh = () => {
    refetchAll()
  }

  const activeBrands = filteredBrands.filter((brand: Brand) => brand.isActive).length
  const inactiveBrands = filteredBrands.filter((brand: Brand) => !brand.isActive).length

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
              Brand Management
            </h1>
            <p className='text-sm text-slate-600 dark:text-slate-400 mt-1'>
              Manage brands across platforms and operators
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-2'>
            <Button
              onClick={handleRefresh}
              size='sm'
              disabled={brandsLoading}
              className='flex items-center gap-1 sm:gap-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
            >
              <RefreshCw className={cn('h-3 w-3 sm:h-4 sm:w-4', brandsLoading && 'animate-spin')} />
              <span className='hidden sm:inline'>
                {brandsLoading ? 'Refreshing...' : 'Refresh Data'}
              </span>
              <span className='sm:hidden'>{brandsLoading ? '...' : 'Refresh Data'}</span>
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
                  <span className='hidden sm:inline'>Add Brand</span>
                  <span className='sm:hidden'>Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-2xl'>
                <DialogHeader>
                  <DialogTitle>Create New Brand</DialogTitle>
                  <DialogDescription>Add a new brand to manage under an operator</DialogDescription>
                </DialogHeader>
                <BrandForm
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
          className='grid grid-cols-1 md:grid-cols-4 gap-4'
        >
          <Card className='bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-purple-500 text-white'>
                  <Tag className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-sm font-medium text-purple-600 dark:text-purple-400'>
                    Total Brands
                  </p>
                  <p className='text-2xl font-bold text-purple-900 dark:text-purple-100'>
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
                    Active Brands
                  </p>
                  <p className='text-2xl font-bold text-green-900 dark:text-green-100'>
                    {activeBrands}
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
                    Inactive Brands
                  </p>
                  <p className='text-2xl font-bold text-red-900 dark:text-red-100'>
                    {inactiveBrands}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-blue-500 text-white'>
                  <Filter className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                    Filtered Results
                  </p>
                  <p className='text-2xl font-bold text-blue-900 dark:text-blue-100'>
                    {filteredBrands.length}
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
                    placeholder='Search brands...'
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
                <Select value={selectedOperator || 'all'} onValueChange={handleOperatorFilter}>
                  <SelectTrigger className='w-full sm:w-[200px]'>
                    <SelectValue placeholder='Filter by Operator' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Operators</SelectItem>
                    {operatorOptions.map((operator: any) => (
                      <SelectItem key={operator.value} value={operator.value}>
                        {operator.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Brands Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Tag className='h-5 w-5' />
                Brands ({filteredBrands.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {brandsLoading ? (
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
                        <TableHead>Brand Name</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Operator</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {filteredBrands.map((brand: Brand) => (
                          <motion.tr
                            key={brand._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='group'
                          >
                            <TableCell className='font-medium'>
                              <div className='flex items-center gap-3'>
                                <div className='p-2 rounded-lg bg-slate-100 dark:bg-slate-800'>
                                  <Tag className='h-4 w-4 text-slate-600 dark:text-slate-400' />
                                </div>
                                <div>
                                  <p className='font-semibold'>{brand.brandName}</p>
                                  <p className='text-sm text-slate-500'>ID: {brand._id}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant='outline' className='font-mono text-xs'>
                                {platformOptions.find((p: any) => p.value === brand.platform)
                                  ?.label || brand.platform}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant='secondary' className='font-mono text-xs'>
                                {operatorOptions.find((o: any) => o.value === brand.operator)
                                  ?.label || brand.operator}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center gap-2'>
                                <Switch
                                  checked={brand.isActive}
                                  onCheckedChange={() => handleStatusToggle(brand)}
                                  className='scale-75'
                                />
                                <Badge
                                  variant={brand.isActive ? 'default' : 'secondary'}
                                  className='text-xs'
                                >
                                  {brand.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className='text-slate-600 dark:text-slate-400'>
                              {formatDateSafe(brand.createdAt)}
                            </TableCell>
                            <TableCell className='text-slate-600 dark:text-slate-400'>
                              {formatDateSafe(brand.updatedAt)}
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
                                  <DropdownMenuItem onClick={() => handleView(brand)}>
                                    <Eye className='h-4 w-4 mr-2' />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEdit(brand)}>
                                    <Edit className='h-4 w-4 mr-2' />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusToggle(brand)}>
                                    {brand.isActive ? (
                                      <ToggleLeft className='h-4 w-4 mr-2' />
                                    ) : (
                                      <ToggleRight className='h-4 w-4 mr-2' />
                                    )}
                                    {brand.isActive ? 'Deactivate' : 'Activate'}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(brand)}
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
            <DialogTitle>Edit Brand</DialogTitle>
            <DialogDescription>Update brand information</DialogDescription>
          </DialogHeader>
          {selectedBrand && (
            <BrandForm
              brand={selectedBrand}
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
            <DialogTitle>Brand Details</DialogTitle>
            <DialogDescription>View detailed brand information</DialogDescription>
          </DialogHeader>
          {selectedBrand && <BrandDetails brand={selectedBrand} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
