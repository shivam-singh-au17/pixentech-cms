/**
 * Simplified Platform Form Component
 * Create and edit platform configurations with method selection
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, X, Server } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreatePlatform, useUpdatePlatform } from '@/hooks/queries/usePlatformQueries'
import type { Platform, CreatePlatformRequest } from '@/lib/types/platform-updated'

interface PlatformFormProps {
  platform?: Platform
  onSuccess: () => void
  onCancel: () => void
}

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const

export function PlatformForm({ platform, onSuccess, onCancel }: PlatformFormProps) {
  const [formData, setFormData] = useState({
    platformName: platform?.platformName || '',
    betUrl: platform?.betRequest?.url || '',
    betMethod: platform?.betRequest?.method || 'POST',
    winUrl: platform?.winRequest?.url || '',
    winMethod: platform?.winRequest?.method || 'POST',
    balanceUrl: platform?.balanceRequest?.url || '',
    balanceMethod: platform?.balanceRequest?.method || 'POST',
    refundUrl: platform?.refundRequest?.url || '',
    refundMethod: platform?.refundRequest?.method || 'POST',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = !!platform
  const createMutation = useCreatePlatform()
  const updateMutation = useUpdatePlatform()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.platformName.trim()) {
      newErrors.platformName = 'Platform name is required'
    }

    const urlFields = [
      { key: 'betUrl', label: 'Bet URL' },
      { key: 'winUrl', label: 'Win URL' },
      { key: 'balanceUrl', label: 'Balance URL' },
      { key: 'refundUrl', label: 'Refund URL' },
    ]

    urlFields.forEach(({ key, label }) => {
      const value = formData[key as keyof typeof formData] as string
      if (!value.trim()) {
        newErrors[key] = `${label} is required`
      } else {
        try {
          new URL(value)
        } catch {
          newErrors[key] = `${label} must be a valid URL`
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const platformData: CreatePlatformRequest = {
        platformName: formData.platformName,
        betRequest: {
          url: formData.betUrl,
          method: formData.betMethod as any,
        },
        winRequest: {
          url: formData.winUrl,
          method: formData.winMethod as any,
        },
        balanceRequest: {
          url: formData.balanceUrl,
          method: formData.balanceMethod as any,
        },
        refundRequest: {
          url: formData.refundUrl,
          method: formData.refundMethod as any,
        },
      }

      if (isEditing) {
        await updateMutation.mutateAsync({
          id: platform._id,
          data: {
            betRequest: platformData.betRequest,
            winRequest: platformData.winRequest,
            balanceRequest: platformData.balanceRequest,
            refundRequest: platformData.refundRequest,
          },
        })
      } else {
        await createMutation.mutateAsync(platformData)
      }

      onSuccess()
    } catch (error) {
      console.error('Failed to save platform:', error)
    }
  }

  const endpoints = [
    {
      key: 'bet',
      label: 'Bet Endpoint',
      urlKey: 'betUrl',
      methodKey: 'betMethod',
      description: 'Endpoint for placing bets',
    },
    {
      key: 'win',
      label: 'Win Endpoint',
      urlKey: 'winUrl',
      methodKey: 'winMethod',
      description: 'Endpoint for processing wins',
    },
    {
      key: 'balance',
      label: 'Balance Endpoint',
      urlKey: 'balanceUrl',
      methodKey: 'balanceMethod',
      description: 'Endpoint for checking balance',
    },
    {
      key: 'refund',
      label: 'Refund Endpoint',
      urlKey: 'refundUrl',
      methodKey: 'refundMethod',
      description: 'Endpoint for processing refunds',
    },
  ]

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Platform Basic Information */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Server className='h-5 w-5' />
              Platform Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <Label htmlFor='platformName'>Platform Name</Label>
              <Input
                id='platformName'
                value={formData.platformName}
                onChange={e => setFormData(prev => ({ ...prev, platformName: e.target.value }))}
                placeholder='Enter platform name'
                className={errors.platformName ? 'border-red-500' : ''}
              />
              {errors.platformName && (
                <p className='text-sm text-red-500 mt-1'>{errors.platformName}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* API Endpoints */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {endpoints.map(endpoint => (
              <div key={endpoint.key} className='p-4 border rounded-lg space-y-4'>
                <div>
                  <Label className='text-base font-medium'>{endpoint.label}</Label>
                  <p className='text-sm text-slate-600 dark:text-slate-400'>
                    {endpoint.description}
                  </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                  <div className='md:col-span-3'>
                    <Label htmlFor={endpoint.urlKey}>URL</Label>
                    <Input
                      id={endpoint.urlKey}
                      value={formData[endpoint.urlKey as keyof typeof formData] as string}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, [endpoint.urlKey]: e.target.value }))
                      }
                      placeholder={`https://api.example.com/${endpoint.key}`}
                      className={errors[endpoint.urlKey] ? 'border-red-500' : ''}
                    />
                    {errors[endpoint.urlKey] && (
                      <p className='text-sm text-red-500 mt-1'>{errors[endpoint.urlKey]}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={endpoint.methodKey}>Method</Label>
                    <Select
                      value={formData[endpoint.methodKey as keyof typeof formData] as string}
                      onValueChange={value =>
                        setFormData(prev => ({ ...prev, [endpoint.methodKey]: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select method' />
                      </SelectTrigger>
                      <SelectContent>
                        {HTTP_METHODS.map(method => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Form Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='flex justify-end gap-3'
      >
        <Button type='button' variant='outline' onClick={onCancel}>
          <X className='h-4 w-4 mr-2' />
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={createMutation.isPending || updateMutation.isPending}
          className='bg-gradient-to-r from-blue-600 to-blue-700'
        >
          <Save className='h-4 w-4 mr-2' />
          {createMutation.isPending || updateMutation.isPending
            ? 'Saving...'
            : isEditing
              ? 'Update Platform'
              : 'Create Platform'}
        </Button>
      </motion.div>
    </form>
  )
}
