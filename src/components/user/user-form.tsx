/**
 * User Form Component
 * Form for creating and editing users
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  Eye,
  EyeOff,
  Crown,
  Shield,
  UserCheck,
  Briefcase,
  Headphones,
  X,
  Plus,
} from 'lucide-react'
import { useHierarchicalPlatformData } from '@/hooks/useHierarchicalPlatformData'
import { PlatformFilter, OperatorFilter, BrandFilter } from '@/components/common/PlatformFilters'
import type { User, CreateUserData, UpdateUserData } from '@/lib/api/user'

const USER_ROLES = [
  { value: 'ROOT', label: 'Root', icon: Crown },
  { value: 'SUPER_ADMIN', label: 'Super Admin', icon: Shield },
  { value: 'SUB_ADMIN', label: 'Sub Admin', icon: UserCheck },
  { value: 'MANAGER', label: 'Manager', icon: Briefcase },
  { value: 'SUPPORT', label: 'Support', icon: Headphones },
]

interface UserFormProps {
  user?: User
  onSubmit: (data: CreateUserData | UpdateUserData) => void
  onCancel: () => void
  isLoading?: boolean
  mode: 'create' | 'edit'
}

export function UserForm({ user, onSubmit, onCancel, isLoading = false, mode }: UserFormProps) {
  const [formData, setFormData] = useState({
    userName: user?.userName || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'SUPPORT',
    allowedPlatforms: user?.allowedPlatforms || [],
    allowedOperators: user?.allowedOperators || [],
    allowedBrands: user?.allowedBrands || [],
  })

  // Current selection state for adding new permissions
  const [currentSelection, setCurrentSelection] = useState({
    platform: '',
    operator: '',
    brand: '',
  })

  const [showPassword, setShowPassword] = useState(false)

  // Get hierarchical platform data
  const {
    platformOptions,
    getOperatorsByPlatform,
    getBrandsByPlatformAndOperator,
    isLoading: platformDataLoading,
  } = useHierarchicalPlatformData({
    selectedPlatform: currentSelection.platform,
    selectedOperator: currentSelection.operator,
  })

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || '',
        email: user.email || '',
        password: '',
        role: user.role || 'SUPPORT',
        allowedPlatforms: user.allowedPlatforms || [],
        allowedOperators: user.allowedOperators || [],
        allowedBrands: user.allowedBrands || [],
      })
    }
  }, [user])

  // Handle current selection changes (for adding new permissions)
  const handleCurrentSelectionChange = (field: string, value: string) => {
    const selectedValue = value === 'all' ? '' : value
    setCurrentSelection(prev => {
      const updated = { ...prev, [field]: selectedValue }

      // Reset dependent fields when parent changes
      if (field === 'platform') {
        updated.operator = ''
        updated.brand = ''
      } else if (field === 'operator') {
        updated.brand = ''
      }

      return updated
    })
  }

  // Add selected combination to permissions
  const addPermission = () => {
    if (!currentSelection.platform) return

    const newPlatforms = [...formData.allowedPlatforms]
    const newOperators = [...formData.allowedOperators]
    const newBrands = [...formData.allowedBrands]

    // Add platform if not already added
    if (!newPlatforms.includes(currentSelection.platform)) {
      newPlatforms.push(currentSelection.platform)
    }

    // Add operator if selected and not already added
    if (currentSelection.operator && !newOperators.includes(currentSelection.operator)) {
      newOperators.push(currentSelection.operator)
    }

    // Add brand if selected and not already added
    if (currentSelection.brand && !newBrands.includes(currentSelection.brand)) {
      newBrands.push(currentSelection.brand)
    }

    setFormData(prev => ({
      ...prev,
      allowedPlatforms: newPlatforms,
      allowedOperators: newOperators,
      allowedBrands: newBrands,
    }))

    // Reset current selection
    setCurrentSelection({ platform: '', operator: '', brand: '' })
  }

  // Remove permission
  const removePermission = (type: 'platform' | 'operator' | 'brand', value: string) => {
    setFormData(prev => {
      if (type === 'platform') {
        return {
          ...prev,
          allowedPlatforms: prev.allowedPlatforms.filter(p => p !== value),
        }
      } else if (type === 'operator') {
        return {
          ...prev,
          allowedOperators: prev.allowedOperators.filter(o => o !== value),
        }
      } else {
        return {
          ...prev,
          allowedBrands: prev.allowedBrands.filter(b => b !== value),
        }
      }
    })
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const submitData: any = {
      userName: formData.userName,
      email: formData.email,
      role: formData.role,
      allowedPlatforms: formData.allowedPlatforms,
      allowedOperators: formData.allowedOperators,
      allowedBrands: formData.allowedBrands,
    }

    // Add password only for create or if provided in edit
    if (mode === 'create' || formData.password) {
      submitData.password = formData.password
    }

    onSubmit(submitData)
  }

  const isFormValid = () => {
    if (mode === 'create') {
      return formData.userName && formData.email && formData.password && formData.role
    }
    return formData.userName && formData.email && formData.role
  }

  if (platformDataLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <Loader2 className='h-6 w-6 animate-spin' />
        <span className='ml-2'>Loading form data...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Basic Information */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='userName'>User Name *</Label>
          <Input
            id='userName'
            placeholder='Enter user name'
            value={formData.userName}
            onChange={e => handleInputChange('userName', e.target.value)}
            required
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='email'>Email *</Label>
          <Input
            id='email'
            type='email'
            placeholder='Enter email address'
            value={formData.email}
            onChange={e => handleInputChange('email', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Password */}
      <div className='space-y-2'>
        <Label htmlFor='password'>
          Password {mode === 'create' ? '*' : '(leave blank to keep current)'}
        </Label>
        <div className='relative'>
          <Input
            id='password'
            type={showPassword ? 'text' : 'password'}
            placeholder={mode === 'create' ? 'Enter password' : 'Enter new password'}
            value={formData.password}
            onChange={e => handleInputChange('password', e.target.value)}
            required={mode === 'create'}
            className='pr-10'
          />
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className='h-4 w-4 text-gray-400' />
            ) : (
              <Eye className='h-4 w-4 text-gray-400' />
            )}
          </Button>
        </div>
      </div>

      {/* Role */}
      <div className='space-y-2'>
        <Label htmlFor='role'>Role *</Label>
        <Select value={formData.role} onValueChange={value => handleInputChange('role', value)}>
          <SelectTrigger>
            <SelectValue placeholder='Select a role' />
          </SelectTrigger>
          <SelectContent>
            {USER_ROLES.map(role => {
              const IconComponent = role.icon
              return (
                <SelectItem key={role.value} value={role.value}>
                  <div className='flex items-center gap-2'>
                    <IconComponent className='h-4 w-4' />
                    {role.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Permissions */}
      <div className='space-y-6'>
        <div>
          <Label className='text-base font-medium'>Platform Permissions</Label>
          <p className='text-sm text-gray-600 mt-1'>
            Add multiple platform, operator, and brand permissions for this user. Each combination
            will be added separately.
          </p>
        </div>

        {/* Add New Permission Section */}
        <div className='border rounded-lg p-4 bg-gray-50'>
          <Label className='text-sm font-medium mb-3 block'>Add New Permission</Label>

          {/* Hierarchical Platform Filters */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4'>
            <div className='space-y-2'>
              <Label htmlFor='platform' className='text-xs font-medium text-gray-700'>
                Platform
              </Label>
              <PlatformFilter
                value={currentSelection.platform}
                onChange={value => handleCurrentSelectionChange('platform', value)}
                placeholder='Select platform'
                className='w-full'
                showLabel={false}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='operator' className='text-xs font-medium text-gray-700'>
                Operator
              </Label>
              <OperatorFilter
                value={currentSelection.operator}
                onChange={value => handleCurrentSelectionChange('operator', value)}
                selectedPlatform={currentSelection.platform}
                placeholder='Select operator'
                disabled={!currentSelection.platform}
                className='w-full'
                showLabel={false}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='brand' className='text-xs font-medium text-gray-700'>
                Brand
              </Label>
              <BrandFilter
                value={currentSelection.brand}
                onChange={value => handleCurrentSelectionChange('brand', value)}
                selectedPlatform={currentSelection.platform}
                selectedOperator={currentSelection.operator}
                placeholder='Select brand'
                disabled={!currentSelection.operator}
                className='w-full'
                showLabel={false}
              />
            </div>
          </div>

          {/* Add Button */}
          <Button
            type='button'
            size='sm'
            onClick={addPermission}
            disabled={!currentSelection.platform}
            className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white'
          >
            <Plus className='h-4 w-4' />
            Add Permission
          </Button>
        </div>

        {/* Current Permissions Display */}
        {(formData.allowedPlatforms.length > 0 ||
          formData.allowedOperators.length > 0 ||
          formData.allowedBrands.length > 0) && (
          <div className='space-y-4'>
            <Label className='text-sm font-medium'>Current Permissions</Label>

            {/* Platforms */}
            {formData.allowedPlatforms.length > 0 && (
              <div className='space-y-2'>
                <Label className='text-xs font-medium text-gray-700'>Platforms:</Label>
                <div className='flex flex-wrap gap-2'>
                  {formData.allowedPlatforms.map(platformId => {
                    const platform = platformOptions.find(p => p.value === platformId)
                    return (
                      <Badge
                        key={platformId}
                        variant='secondary'
                        className='flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200'
                      >
                        {platform?.label || platformId}
                        <X
                          className='h-3 w-3 cursor-pointer hover:text-red-600'
                          onClick={() => removePermission('platform', platformId)}
                        />
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Operators */}
            {formData.allowedOperators.length > 0 && (
              <div className='space-y-2'>
                <Label className='text-xs font-medium text-gray-700'>Operators:</Label>
                <div className='flex flex-wrap gap-2'>
                  {formData.allowedOperators.map(operatorId => {
                    // Get all operators to find the label
                    let operatorLabel = operatorId
                    formData.allowedPlatforms.forEach(platformId => {
                      const operators = getOperatorsByPlatform(platformId)
                      const operator = operators.find(o => o.value === operatorId)
                      if (operator) operatorLabel = operator.label
                    })
                    return (
                      <Badge
                        key={operatorId}
                        variant='secondary'
                        className='flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200'
                      >
                        {operatorLabel}
                        <X
                          className='h-3 w-3 cursor-pointer hover:text-red-600'
                          onClick={() => removePermission('operator', operatorId)}
                        />
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Brands */}
            {formData.allowedBrands.length > 0 && (
              <div className='space-y-2'>
                <Label className='text-xs font-medium text-gray-700'>Brands:</Label>
                <div className='flex flex-wrap gap-2'>
                  {formData.allowedBrands.map(brandId => {
                    // Get all brands to find the label
                    let brandLabel = brandId
                    formData.allowedPlatforms.forEach(platformId => {
                      formData.allowedOperators.forEach(operatorId => {
                        const brands = getBrandsByPlatformAndOperator(platformId, operatorId)
                        const brand = brands.find(b => b.value === brandId)
                        if (brand) brandLabel = brand.label
                      })
                    })
                    return (
                      <Badge
                        key={brandId}
                        variant='secondary'
                        className='flex items-center gap-1 bg-purple-100 text-purple-800 hover:bg-purple-200'
                      >
                        {brandLabel}
                        <X
                          className='h-3 w-3 cursor-pointer hover:text-red-600'
                          onClick={() => removePermission('brand', brandId)}
                        />
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type='button' variant='outline' onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={!isFormValid() || isLoading}
          className='bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
        >
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          {mode === 'create' ? 'Create' : 'Update'} User
        </Button>
      </DialogFooter>
    </form>
  )
}
