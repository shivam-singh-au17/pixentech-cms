/**
 * Reports Page
 * Generate and view comprehensive business reports
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Download,
  Calendar,
  BarChart,
  TrendingUp,
  DollarSign,
  Users,
  Gamepad2,
  Clock,
  RefreshCw,
  CreditCard,
} from 'lucide-react'

const sampleReports = [
  {
    id: 'RPT001',
    title: 'Daily Revenue Report',
    description: 'Comprehensive daily revenue analysis',
    type: 'revenue',
    frequency: 'daily',
    lastGenerated: '2024-03-15T10:30:00Z',
    status: 'ready',
    size: '2.3 MB',
  },
  {
    id: 'RPT002',
    title: 'Player Activity Report',
    description: 'Weekly player engagement and activity metrics',
    type: 'player',
    frequency: 'weekly',
    lastGenerated: '2024-03-14T09:00:00Z',
    status: 'ready',
    size: '4.1 MB',
  },
  {
    id: 'RPT003',
    title: 'Game Performance Report',
    description: 'Monthly game performance and analytics',
    type: 'game',
    frequency: 'monthly',
    lastGenerated: '2024-03-01T08:00:00Z',
    status: 'ready',
    size: '5.8 MB',
  },
  {
    id: 'RPT004',
    title: 'Financial Summary',
    description: 'Quarterly financial performance summary',
    type: 'financial',
    frequency: 'quarterly',
    lastGenerated: '2024-01-01T08:00:00Z',
    status: 'generating',
    size: '-',
  },
  {
    id: 'RPT005',
    title: 'Compliance Report',
    description: 'Monthly compliance and audit report',
    type: 'compliance',
    frequency: 'monthly',
    lastGenerated: '2024-03-13T07:00:00Z',
    status: 'ready',
    size: '1.9 MB',
  },
]

const reportStats = {
  totalReports: 25,
  readyReports: 20,
  generatingReports: 3,
  failedReports: 2,
}

export function Reports() {
  const [selectedType, setSelectedType] = useState<string>('all')

  const filteredReports = sampleReports.filter(
    report => selectedType === 'all' || report.type === selectedType
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return (
          <Badge variant='outline' className='bg-green-100 text-green-800'>
            Ready
          </Badge>
        )
      case 'generating':
        return (
          <Badge variant='outline' className='bg-yellow-100 text-yellow-800'>
            <Clock className='h-3 w-3 mr-1' />
            Generating
          </Badge>
        )
      case 'failed':
        return (
          <Badge variant='outline' className='bg-red-100 text-red-800'>
            Failed
          </Badge>
        )
      default:
        return <Badge variant='outline'>Unknown</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'revenue':
        return <DollarSign className='h-5 w-5 text-green-600' />
      case 'player':
        return <Users className='h-5 w-5 text-blue-600' />
      case 'game':
        return <Gamepad2 className='h-5 w-5 text-purple-600' />
      case 'financial':
        return <BarChart className='h-5 w-5 text-orange-600' />
      case 'compliance':
        return <FileText className='h-5 w-5 text-gray-600' />
      default:
        return <FileText className='h-5 w-5 text-gray-600' />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Reports</h1>
          <p className='text-muted-foreground mt-1'>Generate and manage business reports</p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            size='sm'
            className='bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
          >
            <FileText className='h-4 w-4 mr-2' />
            New Report
          </Button>
          <Button
            size='sm'
            className='bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
          >
            <RefreshCw className='h-4 w-4 mr-2' />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Report Stats */}
      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardContent className='p-4 sm:p-6'>
            <div className='flex items-center gap-3 sm:gap-4'>
              <div className='h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-blue-100 flex items-center justify-center'>
                <FileText className='h-5 w-5 sm:h-6 sm:w-6 text-blue-600' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-xl sm:text-2xl font-bold truncate'>{reportStats.totalReports}</p>
                <p className='text-muted-foreground text-sm'>Total Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4 sm:p-6'>
            <div className='flex items-center gap-3 sm:gap-4'>
              <div className='h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-green-100 flex items-center justify-center'>
                <Download className='h-5 w-5 sm:h-6 sm:w-6 text-green-600' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-xl sm:text-2xl font-bold truncate'>{reportStats.readyReports}</p>
                <p className='text-muted-foreground text-sm'>Ready to Download</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4 sm:p-6'>
            <div className='flex items-center gap-3 sm:gap-4'>
              <div className='h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-yellow-100 flex items-center justify-center'>
                <Clock className='h-5 w-5 sm:h-6 sm:w-6 text-yellow-600' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-xl sm:text-2xl font-bold truncate'>
                  {reportStats.generatingReports}
                </p>
                <p className='text-muted-foreground text-sm'>Generating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4 sm:p-6'>
            <div className='flex items-center gap-3 sm:gap-4'>
              <div className='h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-red-100 flex items-center justify-center'>
                <TrendingUp className='h-5 w-5 sm:h-6 sm:w-6 text-red-600' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-xl sm:text-2xl font-bold truncate'>
                  {reportStats.failedReports}
                </p>
                <p className='text-muted-foreground text-sm'>Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Report Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'>
            <Link to='/reports/transactions'>
              <Button className='h-20 flex-col gap-2 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'>
                <CreditCard className='h-6 w-6' />
                <span>Transaction Reports</span>
                <Badge variant='secondary' className='text-xs'>
                  New
                </Badge>
              </Button>
            </Link>
            <Button className='h-20 flex-col gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'>
              <DollarSign className='h-6 w-6' />
              <span>Revenue Report</span>
            </Button>
            <Button className='h-20 flex-col gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'>
              <Users className='h-6 w-6' />
              <span>Player Report</span>
            </Button>
            <Button className='h-20 flex-col gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'>
              <Gamepad2 className='h-6 w-6' />
              <span>Game Analytics</span>
            </Button>
            <Button className='h-20 flex-col gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'>
              <BarChart className='h-6 w-6' />
              <span>Performance</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter Buttons */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-wrap gap-2'>
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setSelectedType('all')}
            >
              All Reports
            </Button>
            <Button
              variant={selectedType === 'revenue' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setSelectedType('revenue')}
            >
              Revenue
            </Button>
            <Button
              variant={selectedType === 'player' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setSelectedType('player')}
            >
              Player
            </Button>
            <Button
              variant={selectedType === 'game' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setSelectedType('game')}
            >
              Game
            </Button>
            <Button
              variant={selectedType === 'financial' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setSelectedType('financial')}
            >
              Financial
            </Button>
            <Button
              variant={selectedType === 'compliance' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setSelectedType('compliance')}
            >
              Compliance
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {filteredReports.map(report => (
              <div
                key={report.id}
                className='flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors'
              >
                <div className='flex items-center gap-4'>
                  <div className='h-12 w-12 rounded-lg bg-white flex items-center justify-center shadow-sm'>
                    {getTypeIcon(report.type)}
                  </div>
                  <div>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='font-medium'>{report.title}</span>
                      {getStatusBadge(report.status)}
                    </div>
                    <p className='text-sm text-muted-foreground mb-1'>{report.description}</p>
                    <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                      <div className='flex items-center gap-1'>
                        <Calendar className='h-3 w-3' />
                        <span>Frequency: {report.frequency}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Clock className='h-3 w-3' />
                        <span>Last: {formatTimestamp(report.lastGenerated)}</span>
                      </div>
                      {report.size !== '-' && <span>Size: {report.size}</span>}
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  {report.status === 'ready' && (
                    <Button variant='outline' size='sm'>
                      <Download className='h-4 w-4 mr-1' />
                      Download
                    </Button>
                  )}
                  <Button variant='outline' size='sm'>
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className='text-center py-12'>
              <FileText className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
              <h3 className='text-lg font-medium mb-2'>No reports found</h3>
              <p className='text-muted-foreground'>Try selecting a different report type</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
