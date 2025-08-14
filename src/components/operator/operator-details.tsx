/**
 * Operator Details Component
 * View detailed operator information
 */

import { motion } from 'framer-motion'
import { Building2, Calendar, Users, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { usePlatformOptions } from '@/hooks/queries/usePlatformQueries'
import { formatDateSafe } from '@/lib/utils/summary'
import type { Operator } from '@/lib/types/platform-updated'

interface OperatorDetailsProps {
  operator: Operator
}

export function OperatorDetails({ operator }: OperatorDetailsProps) {
  const { data: platformOptions = [] } = usePlatformOptions()

  const platformName =
    platformOptions.find(p => p.value === operator.platform)?.label || operator.platform

  return (
    <div className='space-y-6'>
      {/* Operator Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-slate-100 dark:bg-slate-800'>
                <Building2 className='h-6 w-6 text-slate-600 dark:text-slate-400' />
              </div>
              <div>
                <h2 className='text-xl font-bold'>{operator.operatorName}</h2>
                <p className='text-sm text-slate-600 dark:text-slate-400 font-normal'>
                  Operator ID: {operator._id}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <ExternalLink className='h-4 w-4 text-slate-500' />
                  <span className='text-sm font-medium'>Platform</span>
                </div>
                <div className='ml-6'>
                  <Badge variant='outline' className='font-mono'>
                    {platformName}
                  </Badge>
                  <p className='text-xs text-slate-500 mt-1'>Platform ID: {operator.platform}</p>
                </div>
              </div>
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Users className='h-4 w-4 text-slate-500' />
                  <span className='text-sm font-medium'>Operator Name</span>
                </div>
                <p className='text-sm text-slate-600 dark:text-slate-400 ml-6'>
                  {operator.operatorName}
                </p>
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
                  {formatDateSafe(operator.createdAt)}
                </p>
              </div>
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4 text-slate-500' />
                  <span className='text-sm font-medium'>Last Updated</span>
                </div>
                <p className='text-sm text-slate-600 dark:text-slate-400 ml-6'>
                  {formatDateSafe(operator.updatedAt)}
                </p>
              </div>
            </div>

            <Separator />

            {/* Additional Information */}
            <div className='space-y-4'>
              <h4 className='font-medium text-sm'>System Information</h4>
              <div className='grid grid-cols-2 gap-4 text-xs'>
                <div>
                  <span className='font-medium text-slate-600 dark:text-slate-400'>Object ID:</span>
                  <span className='ml-2 font-mono'>{operator._id}</span>
                </div>
                <div>
                  <span className='font-medium text-slate-600 dark:text-slate-400'>
                    Platform Ref:
                  </span>
                  <span className='ml-2 font-mono'>{operator.platform}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Relationship Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Operator Relationships</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border'>
              <h4 className='font-medium text-sm mb-3'>Platform Hierarchy</h4>
              <div className='flex items-center gap-2 text-sm'>
                <Badge variant='secondary'>Platform</Badge>
                <span>→</span>
                <Badge variant='default'>Operator</Badge>
                <span>→</span>
                <Badge variant='outline'>Brands</Badge>
              </div>
              <p className='text-xs text-slate-500 mt-2'>
                This operator belongs to the "{platformName}" platform and can have multiple brands
                associated with it.
              </p>
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
                  Brand Management
                </h5>
                <p className='text-xs text-green-600 dark:text-green-400'>
                  Can manage multiple brands under this operator umbrella for different market
                  segments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
