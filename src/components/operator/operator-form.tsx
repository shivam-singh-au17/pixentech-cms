/**
 * Operator Form Component
 * Create and edit operator configurations
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, X, Building2, AlertCircle } from 'lucide-react'
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
import { useCreateOperator, useUpdateOperator } from '@/hooks/queries/useOperatorQueries'
import { usePlatformOptions } from '@/hooks/queries/usePlatformQueries'
import type { Operator, CreateOperatorRequest } from '@/lib/types/platform-updated'

interface OperatorFormProps {
  operator?: Operator
  onSuccess: () => void
  onCancel: () => void
}

export function OperatorForm({ operator, onSuccess, onCancel }: OperatorFormProps) {
  const [formData, setFormData] = useState({
    operatorName: operator?.operatorName || '',
    platform: operator?.platform || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = !!operator
  const createMutation = useCreateOperator()
  const updateMutation = useUpdateOperator()

  // Fetch platform options
  const { data: platformOptions = [], isLoading: platformsLoading } = usePlatformOptions()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.operatorName.trim()) {
      newErrors.operatorName = 'Operator name is required'
    }

    if (!formData.platform && !isEditing) {
      newErrors.platform = 'Platform selection is required'
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
          id: operator._id,
          data: {
            operatorName: formData.operatorName,
          },
        })
      } else {
        const operatorData: CreateOperatorRequest = {
          operatorName: formData.operatorName,
          platform: formData.platform,
        }
        await createMutation.mutateAsync(operatorData)
      }

      onSuccess()
    } catch (error) {
      console.error('Failed to save operator:', error)
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
                <Building2 className='h-5 w-5' />
                Operator Details
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='operatorName'>Operator Name *</Label>
                <Input
                  id='operatorName'
                  placeholder='Enter operator name'
                  value={formData.operatorName}
                  onChange={e => handleInputChange('operatorName', e.target.value)}
                  className={errors.operatorName ? 'border-red-500' : ''}
                />
                {errors.operatorName && (
                  <p className='text-sm text-red-500'>{errors.operatorName}</p>
                )}
                <p className='text-sm text-slate-600 dark:text-slate-400'>
                  A unique name to identify this operator
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='platform'>Platform *</Label>
                {isEditing ? (
                  <div className='p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border'>
                    <p className='text-sm font-medium'>
                      {platformOptions.find(p => p.value === operator.platform)?.label ||
                        operator.platform}
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
                          platformOptions.map(platform => (
                            <SelectItem key={platform.value} value={platform.value}>
                              {platform.label}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {errors.platform && <p className='text-sm text-red-500'>{errors.platform}</p>}
                    <p className='text-sm text-slate-600 dark:text-slate-400'>
                      Select the platform this operator will belong to
                    </p>
                  </>
                )}
              </div>

              {isEditing && (
                <div className='grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg'>
                  <div>
                    <Label className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                      Created At
                    </Label>
                    <p className='text-sm'>{new Date(operator.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                      Last Updated
                    </Label>
                    <p className='text-sm'>{new Date(operator.updatedAt).toLocaleString()}</p>
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
          <div className='flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
            <AlertCircle className='h-5 w-5 text-blue-500 mt-0.5' />
            <div className='text-sm text-blue-700 dark:text-blue-300'>
              <p className='font-medium mb-1'>Operator Information:</p>
              <ul className='list-disc list-inside space-y-1 text-xs'>
                <li>Operators manage gaming operations within a specific platform</li>
                <li>Each operator is tied to a single platform and cannot be moved</li>
                <li>Operator names should be unique within each platform</li>
                <li>Multiple brands can be associated with a single operator</li>
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
                ? 'Update Operator'
                : 'Create Operator'}
          </Button>
        </div>
      </form>
    </div>
  )
}
