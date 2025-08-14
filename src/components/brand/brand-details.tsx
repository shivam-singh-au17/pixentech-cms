/**
 * Brand Details Component
 * View detailed brand information
 */

import { motion } from 'framer-motion'
import { Tag, Calendar, Building2, Users, ToggleRight, ToggleLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { usePlatformOptions } from '@/hooks/queries/usePlatformQueries'
import { useOperators } from '@/hooks/queries/useOperatorQueries'
import { formatDateSafe } from '@/lib/utils/summary'
import type { Brand } from '@/lib/types/platform-updated'

interface BrandDetailsProps {
  brand: Brand
}

export function BrandDetails({ brand }: BrandDetailsProps) {
  const { data: platformOptions = [] } = usePlatformOptions()

  const { data: operatorData } = useOperators({
    platforms: brand.platform,
    pageNo: 1,
    pageSize: 100,
    sortDirection: 1,
  })

  const operators = operatorData?.operators || []

  const platformName =
    platformOptions.find(p => p.value === brand.platform)?.label || brand.platform
  const operatorName = operators.find(o => o._id === brand.operator)?.operatorName || brand.operator

  return (
    <div className='space-y-6'>
      {/* Brand Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-slate-100 dark:bg-slate-800'>
                <Tag className='h-6 w-6 text-slate-600 dark:text-slate-400' />
              </div>
              <div>
                <h2 className='text-xl font-bold'>{brand.brandName}</h2>
                <p className='text-sm text-slate-600 dark:text-slate-400 font-normal'>
                  Brand ID: {brand._id}
                </p>
              </div>
              <div className='ml-auto'>
                <Badge variant={brand.isActive ? 'default' : 'secondary'} className='gap-2'>
                  {brand.isActive ? (
                    <ToggleRight className='h-3 w-3' />
                  ) : (
                    <ToggleLeft className='h-3 w-3' />
                  )}
                  {brand.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Building2 className='h-4 w-4 text-slate-500' />
                  <span className='text-sm font-medium'>Platform</span>
                </div>
                <div className='ml-6'>
                  <Badge variant='outline' className='font-mono'>
                    {platformName}
                  </Badge>
                  <p className='text-xs text-slate-500 mt-1'>Platform ID: {brand.platform}</p>
                </div>
              </div>
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Users className='h-4 w-4 text-slate-500' />
                  <span className='text-sm font-medium'>Operator</span>
                </div>
                <div className='ml-6'>
                  <Badge variant='secondary' className='font-mono'>
                    {operatorName}
                  </Badge>
                  <p className='text-xs text-slate-500 mt-1'>Operator ID: {brand.operator}</p>
                </div>
              </div>
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Tag className='h-4 w-4 text-slate-500' />
                  <span className='text-sm font-medium'>Brand Name</span>
                </div>
                <p className='text-sm text-slate-600 dark:text-slate-400 ml-6'>{brand.brandName}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Timeline Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Calendar className='h-5 w-5' />
              Timeline Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4 text-slate-500' />
                  <span className='text-sm font-medium'>Created</span>
                </div>
                <p className='text-sm text-slate-600 dark:text-slate-400 ml-6'>
                  {formatDateSafe(brand.createdAt)}
                </p>
              </div>
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4 text-slate-500' />
                  <span className='text-sm font-medium'>Last Updated</span>
                </div>
                <p className='text-sm text-slate-600 dark:text-slate-400 ml-6'>
                  {formatDateSafe(brand.updatedAt)}
                </p>
              </div>
            </div>

            {/* Status Information */}
            <div className='mt-6 p-4 rounded-lg border'>
              <h4 className='font-medium text-sm mb-3'>Status Information</h4>
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                  {brand.isActive ? (
                    <ToggleRight className='h-4 w-4 text-green-500' />
                  ) : (
                    <ToggleLeft className='h-4 w-4 text-red-500' />
                  )}
                  <span className='text-sm font-medium'>
                    {brand.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className='text-xs text-slate-500'>
                  {brand.isActive
                    ? 'This brand is currently active and operational'
                    : 'This brand is currently inactive and not operational'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Hierarchy Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Brand Hierarchy</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border'>
              <h4 className='font-medium text-sm mb-3'>Organizational Structure</h4>
              <div className='flex items-center gap-2 text-sm mb-4'>
                <Badge variant='secondary'>Platform</Badge>
                <span>→</span>
                <Badge variant='default'>Operator</Badge>
                <span>→</span>
                <Badge variant='outline'>Brand</Badge>
              </div>
              <div className='space-y-2 text-xs text-slate-600 dark:text-slate-400'>
                <p>
                  <strong>Platform:</strong> {platformName}
                </p>
                <p>
                  <strong>Operator:</strong> {operatorName}
                </p>
                <p>
                  <strong>Brand:</strong> {brand.brandName}
                </p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
                <h5 className='font-medium text-sm text-blue-700 dark:text-blue-300 mb-1'>
                  Platform Connection
                </h5>
                <p className='text-xs text-blue-600 dark:text-blue-400'>
                  Connected to platform "{platformName}" with full access to platform resources and
                  configuration.
                </p>
              </div>
              <div className='p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
                <h5 className='font-medium text-sm text-green-700 dark:text-green-300 mb-1'>
                  Operator Management
                </h5>
                <p className='text-xs text-green-600 dark:text-green-400'>
                  Managed by operator "{operatorName}" with inherited operational policies and
                  configurations.
                </p>
              </div>
            </div>

            {/* System Information */}
            <div className='mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800'>
              <h4 className='font-medium text-sm text-purple-700 dark:text-purple-300 mb-3'>
                System Information
              </h4>
              <div className='grid grid-cols-2 gap-4 text-xs'>
                <div>
                  <span className='font-medium text-purple-600 dark:text-purple-400'>
                    Brand ID:
                  </span>
                  <span className='ml-2 font-mono'>{brand._id}</span>
                </div>
                <div>
                  <span className='font-medium text-purple-600 dark:text-purple-400'>
                    Platform Ref:
                  </span>
                  <span className='ml-2 font-mono'>{brand.platform}</span>
                </div>
                <div>
                  <span className='font-medium text-purple-600 dark:text-purple-400'>
                    Operator Ref:
                  </span>
                  <span className='ml-2 font-mono'>{brand.operator}</span>
                </div>
                <div>
                  <span className='font-medium text-purple-600 dark:text-purple-400'>Status:</span>
                  <span className='ml-2 font-mono'>{brand.isActive ? 'true' : 'false'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
