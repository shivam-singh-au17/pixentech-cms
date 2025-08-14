/**
 * Transaction Reports Page
 * Comprehensive transaction data with advanced filtering, search, and export capabilities
 * Features responsive design, pagination, and detailed transaction views
 */

import { useState } from 'react'
import { RefreshCw, Download, FileText, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTransactionReports } from '@/hooks/queries/useTransactionQueries'
import { TransactionFilters } from '@/components/transaction/transaction-filters'
import { TransactionTable } from '@/components/transaction/transaction-table'
import { getCurrentDayRange, prepareTransactionExportData } from '@/lib/utils/transaction'
import type { TransactionFilter } from '@/lib/types/transaction'
import { useNavigate } from 'react-router-dom'

// Helper function for CSV export
const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return

  const headers = Object.keys(data[0]).join(',')
  const csvContent = [
    headers,
    ...data.map(row =>
      Object.values(row)
        .map(value => (typeof value === 'string' && value.includes(',') ? `"${value}"` : value))
        .join(',')
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export function TransactionReportsPage() {
  const navigate = useNavigate()

  // Get current day date range
  const { startOfDay, endOfDay } = getCurrentDayRange()

  // Filter state with current day defaults
  const [filters, setFilters] = useState<TransactionFilter>({
    startDate: startOfDay,
    endDate: endOfDay,
    platform: 'ALL',
    operator: 'ALL',
    brand: 'ALL',
    gameAlias: 'ALL',
    status: 'ALL',
    externalPlayerId: '',
    roundId: '',
    betTxnId: '',
    pageNo: 1,
    pageSize: 25,
    sortDirection: -1,
  })

  // Quick search state
  const [quickSearch, setQuickSearch] = useState('')

  // Query for transaction data
  const {
    data: transactionData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useTransactionReports(filters)

  // Handle filter changes
  const handleFiltersChange = (newFilters: Partial<TransactionFilter>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when filters change (except for pagination changes)
      pageNo: newFilters.pageNo !== undefined ? newFilters.pageNo : 1,
    }))
  }

  // Apply filters (mainly for the Apply button)
  const handleApplyFilters = () => {
    setFilters(prev => ({ ...prev, pageNo: 1 }))
  }

  // Reset filters to defaults
  const handleResetFilters = () => {
    const { startOfDay, endOfDay } = getCurrentDayRange()
    setFilters({
      startDate: startOfDay,
      endDate: endOfDay,
      platform: 'ALL',
      operator: 'ALL',
      brand: 'ALL',
      gameAlias: 'ALL',
      status: 'ALL',
      externalPlayerId: '',
      roundId: '',
      betTxnId: '',
      pageNo: 1,
      pageSize: 25,
      sortDirection: -1,
    })
    setQuickSearch('')
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    handleFiltersChange({ pageNo: page })
  }

  const handlePageSizeChange = (pageSize: number) => {
    handleFiltersChange({ pageSize, pageNo: 1 })
  }

  // Manual refresh
  const handleRefresh = async () => {
    await refetch()
  }

  // Navigate to transaction details
  const handleViewDetails = (betTxnId: string) => {
    navigate(`/reports/transactions/${betTxnId}`)
  }

  // Handle quick search with Enter key
  const handleQuickSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFiltersChange({
        betTxnId: quickSearch,
        externalPlayerId: '',
        roundId: '',
        pageNo: 1,
      })
    }
  }

  // Export transactions to CSV
  const handleExport = () => {
    if (!transactionData?.data || transactionData.data.length === 0) {
      return
    }

    const exportData = prepareTransactionExportData(transactionData.data)
    const timestamp = new Date().toISOString().split('T')[0]
    exportToCSV(exportData, `transaction-reports-${timestamp}`)
  }

  // Handle sorting
  const handleSort = (_column: string) => {
    const newDirection = filters.sortDirection === -1 ? 1 : -1
    handleFiltersChange({ sortDirection: newDirection })
  }

  // Quick search for bet transaction ID
  const handleQuickSearchSubmit = () => {
    if (quickSearch.trim()) {
      // Navigate directly to transaction details if it looks like a bet transaction ID
      if (quickSearch.length > 10) {
        handleViewDetails(quickSearch.trim())
      } else {
        // Otherwise use it as a filter
        handleFiltersChange({
          betTxnId: quickSearch.trim(),
          pageNo: 1,
        })
      }
    }
  }

  const transactions = transactionData?.data || []
  const totalCount = transactionData?.totalCount

  return (
    <div className='w-full max-w-full overflow-x-hidden'>
      <div className='py-4 sm:py-6 space-y-4 sm:space-y-6 px-3 sm:px-4'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4'>
          <div>
            <h1 className='text-xl sm:text-2xl font-bold'>Transaction Reports</h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Detailed transaction data with advanced filtering and analysis
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-2'>
            <Button
              onClick={handleExport}
              size='sm'
              disabled={isLoading || transactions.length === 0}
              className='flex items-center gap-1 sm:gap-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
            >
              <Download className='h-3 w-3 sm:h-4 sm:w-4' />
              <span className='hidden sm:inline'>Export CSV</span>
              <span className='sm:hidden'>Export</span>
            </Button>

            <Button
              onClick={handleRefresh}
              size='sm'
              disabled={isLoading || isFetching}
              className='flex items-center gap-1 sm:gap-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
            >
              <RefreshCw
                className={`h-3 w-3 sm:h-4 sm:w-4 ${isLoading || isFetching ? 'animate-spin' : ''}`}
              />
              <span className='hidden sm:inline'>
                {isLoading || isFetching ? 'Refreshing...' : 'Refresh Data'}
              </span>
              <span className='sm:hidden'>{isLoading || isFetching ? '...' : 'Refresh'}</span>
            </Button>
          </div>
        </div>

        {/* Quick Search */}
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base sm:text-lg flex items-center gap-2'>
              <Search className='h-4 w-4' />
              Quick Transaction Lookup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col sm:flex-row gap-2'>
              <div className='flex-1'>
                <Input
                  placeholder='Enter Bet Transaction ID for quick lookup...'
                  value={quickSearch}
                  onChange={e => setQuickSearch(e.target.value)}
                  onKeyDown={handleQuickSearchKeyDown}
                  className='text-xs sm:text-sm'
                />
              </div>
              <Button
                onClick={handleQuickSearchSubmit}
                disabled={!quickSearch.trim()}
                className='text-xs sm:text-sm'
              >
                <Search className='h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2' />
                Search
              </Button>
            </div>
            <p className='text-xs text-muted-foreground mt-2'>
              Enter a Bet Transaction ID to quickly view transaction details or use advanced filters
              below
            </p>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base sm:text-lg flex items-center gap-2'>
              <FileText className='h-4 w-4' />
              Advanced Filters
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <TransactionFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
              loading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Results Summary */}
        {!isLoading && transactions.length > 0 && (
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg p-3'>
            <div>Found {totalCount || transactions.length} transactions</div>
            <div className='text-xs'>
              Page {filters.pageNo} of{' '}
              {Math.ceil((totalCount || transactions.length) / filters.pageSize!)}
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Card>
            <CardContent className='p-6'>
              <div className='text-center text-red-600'>
                <p className='font-medium'>Error loading transactions</p>
                <p className='text-sm mt-1'>
                  {error instanceof Error ? error.message : 'Something went wrong'}
                </p>
                <Button onClick={handleRefresh} variant='outline' size='sm' className='mt-3'>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transaction Table */}
        <TransactionTable
          data={transactions}
          loading={isLoading}
          currentPage={filters.pageNo!}
          pageSize={filters.pageSize!}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onViewDetails={handleViewDetails}
          onSort={handleSort}
        />
      </div>
    </div>
  )
}
