/**
 * Simplified Platform Details Component
 * Display platform information without technical details
 */

import { motion } from 'framer-motion'
import { Server, Calendar, Globe, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Platform } from '@/lib/types/platform-updated'

interface PlatformDetailsProps {
  platform: Platform
}

export function PlatformDetails({ platform }: PlatformDetailsProps) {
  const endpoints = [
    {
      key: 'bet',
      label: 'Bet Endpoint',
      request: platform.betRequest,
      color: 'bg-blue-500',
    },
    {
      key: 'win',
      label: 'Win Endpoint',
      request: platform.winRequest,
      color: 'bg-green-500',
    },
    {
      key: 'balance',
      label: 'Balance Endpoint',
      request: platform.balanceRequest,
      color: 'bg-yellow-500',
    },
    {
      key: 'refund',
      label: 'Refund Endpoint',
      request: platform.refundRequest,
      color: 'bg-red-500',
    },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className='space-y-6'>
      {/* Platform Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Server className='h-5 w-5' />
              Platform Overview
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <h3 className='text-lg font-semibold mb-2'>{platform.platformName}</h3>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400'>
                    <Calendar className='h-4 w-4' />
                    Created: {formatDate(platform.createdAt)}
                  </div>
                  <div className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400'>
                    <Calendar className='h-4 w-4' />
                    Updated: {formatDate(platform.updatedAt)}
                  </div>
                </div>
              </div>

              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Globe className='h-4 w-4 text-green-500' />
                  <span className='text-sm font-medium'>Status: Active</span>
                </div>
                <div className='flex items-center gap-2'>
                  <ExternalLink className='h-4 w-4 text-blue-500' />
                  <span className='text-sm font-medium'>
                    API Endpoints: {endpoints.length} configured
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* API Endpoints Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {endpoints.map(endpoint => (
                <div
                  key={endpoint.key}
                  className='p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'
                >
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-2'>
                      <div className={`w-3 h-3 rounded-full ${endpoint.color}`} />
                      <h4 className='font-medium'>{endpoint.label}</h4>
                    </div>
                    <Badge variant='outline' className='text-xs'>
                      {endpoint.request.method}
                    </Badge>
                  </div>

                  <div className='space-y-2'>
                    <div>
                      <p className='text-xs text-slate-500 dark:text-slate-400 mb-1'>URL</p>
                      <p className='text-sm font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded text-slate-800 dark:text-slate-200 break-all'>
                        {endpoint.request.url}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Configuration Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg'>
                <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                  {endpoints.filter(e => e.request.method === 'POST').length}
                </p>
                <p className='text-xs text-slate-600 dark:text-slate-400'>POST Endpoints</p>
              </div>

              <div className='text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg'>
                <p className='text-2xl font-bold text-green-600 dark:text-green-400'>
                  {endpoints.filter(e => e.request.method === 'GET').length}
                </p>
                <p className='text-xs text-slate-600 dark:text-slate-400'>GET Endpoints</p>
              </div>

              <div className='text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg'>
                <p className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
                  {endpoints.length}
                </p>
                <p className='text-xs text-slate-600 dark:text-slate-400'>Total Endpoints</p>
              </div>

              <div className='text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg'>
                <p className='text-2xl font-bold text-orange-600 dark:text-orange-400'>1</p>
                <p className='text-xs text-slate-600 dark:text-slate-400'>Active Platform</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
