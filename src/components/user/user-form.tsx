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
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { usePlatformData } from '@/hooks/usePlatformData'
import type { User, CreateUserData, UpdateUserData } from '@/lib/api/user'

const USER_ROLES = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'SUB_ADMIN', label: 'Sub Admin' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'USER', label: 'User' },
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
    role: user?.role || 'USER',
    allowedPlatforms: user?.allowedPlatforms || [],
    allowedOperators: user?.allowedOperators || [],
    allowedBrands: user?.allowedBrands || [],
  })

  const [showPassword, setShowPassword] = useState(false)

  // Get platform data
  const {
    platformOptions,
    operatorOptions,
    brandOptions,
    isLoading: platformDataLoading,
  } = usePlatformData({
    autoFetch: true,
    fetchPlatforms: true,
    fetchOperators: true,
    fetchBrands: true,
  })

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || '',
        email: user.email || '',
        password: '',
        role: user.role || 'USER',
        allowedPlatforms: user.allowedPlatforms || [],
        allowedOperators: user.allowedOperators || [],
        allowedBrands: user.allowedBrands || [],
      })
    }
  }, [user])

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleMultiSelectChange = (field: string, value: string) => {
    setFormData(prev => {
      const currentValues = prev[field as keyof typeof prev] as string[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      return { ...prev, [field]: newValues }
    })
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
            {USER_ROLES.map(role => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Permissions */}
      <div className='space-y-4'>
        <Label className='text-base font-medium'>Permissions</Label>

        {/* Platform Selection */}
        <div className='space-y-2'>
          <Label htmlFor='platforms'>Allowed Platforms</Label>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-2'>
            {platformOptions
              .filter((platform: any) => platform.id !== 'ALL')
              .map((platform: any) => (
                <label key={platform.id} className='flex items-center space-x-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={formData.allowedPlatforms.includes(platform.id)}
                    onChange={() => handleMultiSelectChange('allowedPlatforms', platform.id)}
                    className='rounded border-gray-300'
                  />
                  <span className='text-sm'>{platform.label}</span>
                </label>
              ))}
          </div>
        </div>

        {/* Operator Selection */}
        <div className='space-y-2'>
          <Label htmlFor='operators'>Allowed Operators</Label>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-2'>
            {operatorOptions
              .filter((operator: any) => operator.id !== 'ALL')
              .map((operator: any) => (
                <label key={operator.id} className='flex items-center space-x-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={formData.allowedOperators.includes(operator.id)}
                    onChange={() => handleMultiSelectChange('allowedOperators', operator.id)}
                    className='rounded border-gray-300'
                  />
                  <span className='text-sm'>{operator.label}</span>
                </label>
              ))}
          </div>
        </div>

        {/* Brand Selection */}
        <div className='space-y-2'>
          <Label htmlFor='brands'>Allowed Brands</Label>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-2'>
            {brandOptions
              .filter((brand: any) => brand.id !== 'ALL')
              .map((brand: any) => (
                <label key={brand.id} className='flex items-center space-x-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={formData.allowedBrands.includes(brand.id)}
                    onChange={() => handleMultiSelectChange('allowedBrands', brand.id)}
                    className='rounded border-gray-300'
                  />
                  <span className='text-sm'>{brand.label}</span>
                </label>
              ))}
          </div>
        </div>
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
