/**
 * API Management Form Component
 * Form for creating and editing API endpoints with validation
 */

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, X, Plus, Shield, Building, Users } from 'lucide-react'
import { usePlatforms } from '@/hooks/queries/usePlatformQueries'
import { useOperators } from '@/hooks/queries/useOperatorQueries'
import { useBrands } from '@/hooks/queries/useBrandQueries'
import type { ApiManagement, CreateApiManagementData } from '@/lib/api/apiManagement'

// Available roles
const ROLES = [
  { value: 'ROOT', label: 'Root', icon: Shield, color: 'destructive' },
  { value: 'SUPER_ADMIN', label: 'Super Admin', icon: Shield, color: 'default' },
  { value: 'SUB_ADMIN', label: 'Sub Admin', icon: Shield, color: 'secondary' },
  { value: 'ADMIN', label: 'Admin', icon: Shield, color: 'outline' },
  { value: 'USER', label: 'User', icon: Users, color: 'outline' },
] as const

// Form validation schema
const apiManagementSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  endPoint: z
    .string()
    .min(1, 'Endpoint is required')
    .max(200, 'Endpoint must be less than 200 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  status: z.boolean(),
  role: z.array(z.string()).min(1, 'At least one role is required'),
  platforms: z.array(z.string()).min(1, 'At least one platform is required'),
  operators: z.array(z.string()).min(1, 'At least one operator is required'),
  brands: z.array(z.string()).min(1, 'At least one brand is required'),
})

type FormData = z.infer<typeof apiManagementSchema>

interface ApiManagementFormProps {
  mode: 'create' | 'edit'
  apiEndpoint?: ApiManagement
  onSubmit: (data: CreateApiManagementData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ApiManagementForm({
  mode,
  apiEndpoint,
  onSubmit,
  onCancel,
  isLoading = false,
}: ApiManagementFormProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedOperators, setSelectedOperators] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  // Fetch platform, operator, and brand data
  const { data: platformsData } = usePlatforms()
  const { data: operatorsData } = useOperators({})
  const { data: brandsData } = useBrands({})

  const platforms = platformsData?.platforms || []
  const operators = operatorsData?.operators || []
  const brands = brandsData?.brands || []

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(apiManagementSchema),
    defaultValues: {
      name: '',
      endPoint: '',
      description: '',
      status: true,
      role: [],
      platforms: [],
      operators: [],
      brands: [],
    },
    mode: 'onChange',
  })

  // Initialize form with existing data in edit mode
  useEffect(() => {
    if (mode === 'edit' && apiEndpoint) {
      reset({
        name: apiEndpoint.name || '',
        endPoint: apiEndpoint.endPoint || '',
        description: apiEndpoint.description || '',
        status: apiEndpoint.status ?? true,
        role: apiEndpoint.role || [],
        platforms: apiEndpoint.platforms || [],
        operators: apiEndpoint.operators || [],
        brands: apiEndpoint.brands || [],
      })
      setSelectedRoles(apiEndpoint.role || [])
      setSelectedPlatforms(apiEndpoint.platforms || [])
      setSelectedOperators(apiEndpoint.operators || [])
      setSelectedBrands(apiEndpoint.brands || [])
    }
  }, [mode, apiEndpoint, reset])

  // Handle role selection
  const handleRoleToggle = (roleValue: string) => {
    const newRoles = selectedRoles.includes(roleValue)
      ? selectedRoles.filter(r => r !== roleValue)
      : [...selectedRoles, roleValue]

    setSelectedRoles(newRoles)
    setValue('role', newRoles, { shouldValidate: true })
  }

  // Handle platform selection
  const handlePlatformToggle = (platformId: string) => {
    const newPlatforms = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter(p => p !== platformId)
      : [...selectedPlatforms, platformId]

    setSelectedPlatforms(newPlatforms)
    setValue('platforms', newPlatforms, { shouldValidate: true })
  }

  // Handle operator selection
  const handleOperatorToggle = (operatorId: string) => {
    const newOperators = selectedOperators.includes(operatorId)
      ? selectedOperators.filter(o => o !== operatorId)
      : [...selectedOperators, operatorId]

    setSelectedOperators(newOperators)
    setValue('operators', newOperators, { shouldValidate: true })
  }

  // Handle brand selection
  const handleBrandToggle = (brandId: string) => {
    const newBrands = selectedBrands.includes(brandId)
      ? selectedBrands.filter(b => b !== brandId)
      : [...selectedBrands, brandId]

    setSelectedBrands(newBrands)
    setValue('brands', newBrands, { shouldValidate: true })
  }

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Shield className='h-5 w-5' />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Name */}
          <div className='space-y-2'>
            <Label htmlFor='name'>
              API Name <span className='text-red-500'>*</span>
            </Label>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id='name'
                  placeholder='Enter API name'
                  className={errors.name ? 'border-red-500' : ''}
                />
              )}
            />
            {errors.name && (
              <p className='text-sm text-red-500 flex items-center gap-1'>
                <AlertCircle className='h-4 w-4' />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Endpoint */}
          <div className='space-y-2'>
            <Label htmlFor='endPoint'>
              Endpoint <span className='text-red-500'>*</span>
            </Label>
            <Controller
              name='endPoint'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id='endPoint'
                  placeholder='/api/endpoint'
                  className={errors.endPoint ? 'border-red-500' : ''}
                />
              )}
            />
            {errors.endPoint && (
              <p className='text-sm text-red-500 flex items-center gap-1'>
                <AlertCircle className='h-4 w-4' />
                {errors.endPoint.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <Label htmlFor='description'>
              Description <span className='text-red-500'>*</span>
            </Label>
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  id='description'
                  placeholder='Describe the API endpoint'
                  rows={3}
                  className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.description ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.description && (
              <p className='text-sm text-red-500 flex items-center gap-1'>
                <AlertCircle className='h-4 w-4' />
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Status</Label>
              <p className='text-sm text-muted-foreground'>Enable or disable this API endpoint</p>
            </div>
            <Controller
              name='status'
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Roles */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Shield className='h-5 w-5' />
            Roles <span className='text-red-500'>*</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            <p className='text-sm text-muted-foreground'>
              Select which roles can access this API endpoint
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              {ROLES.map(role => {
                const IconComponent = role.icon
                const isSelected = selectedRoles.includes(role.value)
                return (
                  <div
                    key={role.value}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                    }`}
                    onClick={() => handleRoleToggle(role.value)}
                  >
                    <input
                      type='checkbox'
                      checked={isSelected}
                      onChange={() => handleRoleToggle(role.value)}
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
                    />
                    <IconComponent className='h-4 w-4' />
                    <span className='font-medium'>{role.label}</span>
                  </div>
                )
              })}
            </div>
            {errors.role && (
              <p className='text-sm text-red-500 flex items-center gap-1'>
                <AlertCircle className='h-4 w-4' />
                {errors.role.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Platforms */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Building className='h-5 w-5' />
            Platforms <span className='text-red-500'>*</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            <p className='text-sm text-muted-foreground'>
              Select which platforms can access this API endpoint
            </p>
            <div className='grid grid-cols-1 gap-3 max-h-48 overflow-y-auto'>
              {platforms.map(platform => {
                const isSelected = selectedPlatforms.includes(platform._id)
                return (
                  <div
                    key={platform._id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                    }`}
                    onClick={() => handlePlatformToggle(platform._id)}
                  >
                    <input
                      type='checkbox'
                      checked={isSelected}
                      onChange={() => handlePlatformToggle(platform._id)}
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
                    />
                    <span className='font-medium'>{platform.platformName}</span>
                  </div>
                )
              })}
            </div>
            {errors.platforms && (
              <p className='text-sm text-red-500 flex items-center gap-1'>
                <AlertCircle className='h-4 w-4' />
                {errors.platforms.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Operators */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Operators <span className='text-red-500'>*</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            <p className='text-sm text-muted-foreground'>
              Select which operators can access this API endpoint
            </p>
            <div className='grid grid-cols-1 gap-3 max-h-48 overflow-y-auto'>
              {operators.map(operator => {
                const isSelected = selectedOperators.includes(operator._id)
                return (
                  <div
                    key={operator._id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                    }`}
                    onClick={() => handleOperatorToggle(operator._id)}
                  >
                    <input
                      type='checkbox'
                      checked={isSelected}
                      onChange={() => handleOperatorToggle(operator._id)}
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
                    />
                    <span className='font-medium'>{operator.operatorName}</span>
                  </div>
                )
              })}
            </div>
            {errors.operators && (
              <p className='text-sm text-red-500 flex items-center gap-1'>
                <AlertCircle className='h-4 w-4' />
                {errors.operators.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Building className='h-5 w-5' />
            Brands <span className='text-red-500'>*</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            <p className='text-sm text-muted-foreground'>
              Select which brands can access this API endpoint
            </p>
            <div className='grid grid-cols-1 gap-3 max-h-48 overflow-y-auto'>
              {brands.map(brand => {
                const isSelected = selectedBrands.includes(brand._id)
                return (
                  <div
                    key={brand._id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                    }`}
                    onClick={() => handleBrandToggle(brand._id)}
                  >
                    <input
                      type='checkbox'
                      checked={isSelected}
                      onChange={() => handleBrandToggle(brand._id)}
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
                    />
                    <span className='font-medium'>{brand.brandName}</span>
                  </div>
                )
              })}
            </div>
            {errors.brands && (
              <p className='text-sm text-red-500 flex items-center gap-1'>
                <AlertCircle className='h-4 w-4' />
                {errors.brands.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className='flex flex-col sm:flex-row gap-3 pt-6'>
        <Button
          type='submit'
          disabled={!isValid || isLoading}
          className='flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
        >
          {isLoading ? (
            <>
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
              {mode === 'create' ? 'Creating...' : 'Updating...'}
            </>
          ) : (
            <>
              {mode === 'create' ? (
                <>
                  <Plus className='w-4 h-4 mr-2' />
                  Create API Endpoint
                </>
              ) : (
                'Update API Endpoint'
              )}
            </>
          )}
        </Button>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          disabled={isLoading}
          className='flex-1'
        >
          <X className='w-4 h-4 mr-2' />
          Cancel
        </Button>
      </div>
    </form>
  )
}
