/**
 * Daily Summary Page
 * Shows daily aggregated report data with advanced filtering and export capabilities
 * Now using TanStack Query for optimized data fetching
 */

import { useState } from 'react'
import { TrendingUp, TrendingDown, Calendar, RefreshCw } from 'lucide-react'
import { useFilterOptions } from '@/hooks/useGames'
import { useDailySummary, useSummaryData } from '@/hooks/queries/useSummaryQueries'
import { SummaryFilters } from '@/components/summary/summary-filters'
import { SummaryTable } from '@/components/summary/summary-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDateSafe,
  getRTPColorClass,
  getGGRColorClass,
  dailySummaryExportFields,
} from '@/lib/utils/summary'
import type { DailySummaryData, DailySummaryFilter } from '@/lib/types/summary'

// Get current day date range helper
const getCurrentDayRange = () => {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
  return { startOfDay, endOfDay }
}

export function DailySummaryPage() {
  // Use games hook for filter options
  const { gameOptions } = useFilterOptions()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  // Filter state with current day defaults
  const { startOfDay, endOfDay } = getCurrentDayRange()
  const [filters, setFilters] = useState<DailySummaryFilter>({
    startDate: startOfDay,
    endDate: endOfDay,
    platform: 'ALL',
    operator: 'ALL',
    brand: 'ALL',
    gameAlias: 'ALL',
    currency: 'INR',
    pageNo: currentPage,
    pageSize,
    sortDirection: -1,
  })

  // TanStack Query for data fetching
  const queryFilters = { ...filters, pageNo: currentPage, pageSize }
  const summaryQuery = useDailySummary(queryFilters)
  const { data, totalPages, isLoading, isFetching } = useSummaryData(summaryQuery, pageSize)

  // Refresh handler for manual data refresh
  const handleRefresh = async () => {
    await summaryQuery.refetch()
  }

  // Table columns definition
  const columns = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value: string | null | undefined) => {
        const formattedDate = formatDateSafe(value)
        const isValidDate = formattedDate !== 'No Date' && formattedDate !== 'Invalid Date'

        return (
          <div className='flex items-center gap-2'>
            <Calendar className='h-4 w-4 text-gray-400' />
            <span
              className={`font-medium ${
                !isValidDate ? (formattedDate === 'No Date' ? 'text-gray-500' : 'text-red-500') : ''
              }`}
            >
              {formattedDate}
            </span>
          </div>
        )
      },
    },
    {
      key: 'totalRounds',
      label: 'Total Rounds',
      sortable: true,
      render: (value: number) => <span className='font-mono'>{formatNumber(value)}</span>,
    },
    {
      key: 'wonRounds',
      label: 'Won Rounds',
      sortable: true,
      render: (value: number, row: DailySummaryData) => (
        <div className='text-center'>
          <div className='font-mono'>{formatNumber(value)}</div>
          <div className='text-xs text-gray-500'>
            {formatPercentage((value / row.totalRounds) * 100)}
          </div>
        </div>
      ),
    },
    {
      key: 'totalBet',
      label: 'Total Bet',
      sortable: true,
      render: (value: number) => (
        <span className='font-mono text-blue-600 font-semibold'>{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'totalWin',
      label: 'Total Win',
      sortable: true,
      render: (value: number) => (
        <span className='font-mono text-green-600 font-semibold'>{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'ggr',
      label: 'GGR',
      sortable: true,
      render: (value: number) => (
        <div className='flex items-center gap-1'>
          {value > 0 ? (
            <TrendingUp className='h-4 w-4 text-green-500' />
          ) : value < 0 ? (
            <TrendingDown className='h-4 w-4 text-red-500' />
          ) : null}
          <span className={`font-mono font-semibold ${getGGRColorClass(value)}`}>
            {formatCurrency(value)}
          </span>
        </div>
      ),
    },
    {
      key: 'rtp',
      label: 'RTP %',
      sortable: true,
      render: (value: string) => (
        <Badge variant='secondary' className={getRTPColorClass(value)}>
          {formatPercentage(value)}
        </Badge>
      ),
    },
  ]

  // Handle filter changes
  const handleFiltersChange = (newFilters: Partial<DailySummaryFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  // Handle sorting
  const handleSort = (_key: string, direction: 'asc' | 'desc') => {
    setFilters(prev => ({
      ...prev,
      sortDirection: direction === 'desc' ? -1 : 1,
    }))
  }

  // Manual refetch (for apply filters button)
  const handleSubmit = () => {
    summaryQuery.refetch()
  }

  return (
    <div className='w-full max-w-full overflow-x-hidden'>
      <div className='py-4 sm:py-6 space-y-4 sm:space-y-6 px-3 sm:px-4'>
        {/* Page Header */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold'>Daily Summary</h1>
            <p className='text-gray-600 mt-2'>
              View daily aggregated gaming data with comprehensive analytics and insights.
            </p>
          </div>
          <div className='flex items-center gap-4'>
            {/* Refresh Button */}
            <Button
              onClick={handleRefresh}
              size='sm'
              disabled={isLoading || isFetching}
              className='flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
            >
              <RefreshCw className={`h-4 w-4 ${isLoading || isFetching ? 'animate-spin' : ''}`} />
              {isLoading || isFetching ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <SummaryFilters
          startDate={filters.startDate}
          endDate={filters.endDate}
          platform={filters.platform}
          operator={filters.operator}
          brand={filters.brand}
          gameAlias={filters.gameAlias}
          currency={filters.currency}
          onFiltersChange={handleFiltersChange}
          onSubmit={handleSubmit}
          loading={isLoading || isFetching}
          gameOptions={gameOptions}
          showGameFilter={true}
        />

        {/* Data Table */}
        <SummaryTable
          data={data}
          columns={columns}
          loading={isLoading || isFetching}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSort={handleSort}
          exportFields={dailySummaryExportFields}
          exportFilename='daily_summary'
          searchPlaceholder='Search by date, rounds, amounts...'
          showSummary={true}
        />
      </div>
    </div>
  )
}
