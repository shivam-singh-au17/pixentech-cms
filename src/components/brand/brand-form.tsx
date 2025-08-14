/**
 * Brand Form Component
 * Create and edit brand configurations
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, X, Tag, AlertCircle } from 'lucide-react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateBrand, useUpdateBrand } from '@/hooks/queries/useBrandQueries'
import { usePlatformData } from '@/hooks/usePlatformData'
import type { Brand, CreateBrandRequest } from '@/lib/types/platform-updated'

interface BrandFormProps {
  brand?: Brand
  onSuccess: () => void
  onCancel: () => void
}

export function BrandForm({ brand, onSuccess, onCancel }: BrandFormProps) {
  const [formData, setFormData] = useState({
    brandName: brand?.brandName || '',
    platform: brand?.platform || '',
    operator: brand?.operator || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = !!brand
  const createMutation = useCreateBrand()
  const updateMutation = useUpdateBrand()

  // Use centralized Redux-based platform data (authentication-aware)
  const { platformOptions, operatorOptions, platformsLoading, operatorsLoading } = usePlatformData({
    fetchPlatforms: true,
    fetchOperators: true,
    fetchBrands: false,
    autoFetch: true,
  })

  // Reset operator selection when platform changes
  useEffect(() => {
    if (formData.platform && !isEditing) {
      setFormData(prev => ({ ...prev, operator: '' }))
    }
  }, [formData.platform, isEditing])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.brandName.trim()) {
      newErrors.brandName = 'Brand name is required'
    }

    if (!formData.platform && !isEditing) {
      newErrors.platform = 'Platform selection is required'
    }

    if (!formData.operator && !isEditing) {
      newErrors.operator = 'Operator selection is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: brand._id,
          data: {
            brandName: formData.brandName,
          },
        })
      } else {
        const brandData: CreateBrandRequest = {
          brandName: formData.brandName,
          platform: formData.platform,
          operator: formData.operator,
        }
        await createMutation.mutateAsync(brandData)
      }

      onSuccess()
    } catch (error) {
      console.error('Failed to save brand:', error)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <div className='space-y-6'>
      <form onSubmit={onSubmit} className='space-y-6'>
        {/* Basic Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Tag className='h-5 w-5' />
                Brand Details
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='brandName'>Brand Name *</Label>
                <Input
                  id='brandName'
                  placeholder='Enter brand name'
                  value={formData.brandName}
                  onChange={e => handleInputChange('brandName', e.target.value)}
                  className={errors.brandName ? 'border-red-500' : ''}
                />
                {errors.brandName && <p className='text-sm text-red-500'>{errors.brandName}</p>}
                <p className='text-sm text-slate-600 dark:text-slate-400'>
                  A unique name to identify this brand
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='platform'>Platform *</Label>
                {isEditing ? (
                  <div className='p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border'>
                    <p className='text-sm font-medium'>
                      {platformOptions.find((p: any) => p.value === brand.platform)?.label ||
                        brand.platform}
                    </p>
                    <p className='text-xs text-slate-500 mt-1'>
                      Platform cannot be changed after creation
                    </p>
                  </div>
                ) : (
                  <>
                    <Select
                      value={formData.platform}
                      onValueChange={value => handleInputChange('platform', value)}
                    >
                      <SelectTrigger className={errors.platform ? 'border-red-500' : ''}>
                        <SelectValue placeholder='Select platform' />
                      </SelectTrigger>
                      <SelectContent>
                        {platformsLoading ? (
                          <SelectItem value='loading' disabled>
                            Loading platforms...
                          </SelectItem>
                        ) : (
                          platformOptions.map((platform: any) => (
                            <SelectItem key={platform.value} value={platform.value}>
                              {platform.label}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {errors.platform && <p className='text-sm text-red-500'>{errors.platform}</p>}
                    <p className='text-sm text-slate-600 dark:text-slate-400'>
                      Select the platform this brand will belong to
                    </p>
                  </>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='operator'>Operator *</Label>
                {isEditing ? (
                  <div className='p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border'>
                    <p className='text-sm font-medium'>
                      {operatorOptions.find((o: any) => o.value === brand.operator)?.label ||
                        brand.operator}
                    </p>
                    <p className='text-xs text-slate-500 mt-1'>
                      Operator cannot be changed after creation
                    </p>
                  </div>
                ) : (
                  <>
                    <Select
                      value={formData.operator}
                      onValueChange={value => handleInputChange('operator', value)}
                      disabled={!formData.platform}
                    >
                      <SelectTrigger className={errors.operator ? 'border-red-500' : ''}>
                        <SelectValue placeholder='Select operator' />
                      </SelectTrigger>
                      <SelectContent>
                        {operatorsLoading ? (
                          <SelectItem value='loading' disabled>
                            Loading operators...
                          </SelectItem>
                        ) : operatorOptions.length === 0 ? (
                          <SelectItem value='no-operators' disabled>
                            No operators found for selected platform
                          </SelectItem>
                        ) : (
                          operatorOptions.map((operator: any) => (
                            <SelectItem key={operator.value} value={operator.value}>
                              {operator.label}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {errors.operator && <p className='text-sm text-red-500'>{errors.operator}</p>}
                    <p className='text-sm text-slate-600 dark:text-slate-400'>
                      Select the operator this brand will belong to
                    </p>
                  </>
                )}
              </div>

              {isEditing && (
                <div className='grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg'>
                  <div>
                    <Label className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                      Status
                    </Label>
                    <p className='text-sm'>{brand.isActive ? '🟢 Active' : '🔴 Inactive'}</p>
                  </div>
                  <div>
                    <Label className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                      Created At
                    </Label>
                    <p className='text-sm'>{new Date(brand.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Information Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className='flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800'>
            <AlertCircle className='h-5 w-5 text-purple-500 mt-0.5' />
            <div className='text-sm text-purple-700 dark:text-purple-300'>
              <p className='font-medium mb-1'>Brand Information:</p>
              <ul className='list-disc list-inside space-y-1 text-xs'>
                <li>Brands are the end-user facing identity within an operator</li>
                <li>Each brand belongs to exactly one operator within a platform</li>
                <li>Brand status can be toggled between active and inactive</li>
                <li>Platform and operator cannot be changed after creation</li>
                <li>Brand names should be unique within each operator</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Form Actions */}
        <div className='flex items-center justify-end gap-3 pt-6 border-t'>
          <Button type='button' variant='outline' onClick={onCancel}>
            <X className='h-4 w-4 mr-2' />
            Cancel
          </Button>
          <Button type='submit' disabled={isLoading} className='gap-2'>
            <Save className='h-4 w-4' />
            {isLoading
              ? isEditing
                ? 'Updating...'
                : 'Creating...'
              : isEditing
                ? 'Update Brand'
                : 'Create Brand'}
          </Button>
        </div>
      </form>
    </div>
  )
}
