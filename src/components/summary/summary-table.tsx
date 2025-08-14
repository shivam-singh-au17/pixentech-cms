/**
 * Summary Data Table Component
 * Reusable table component for all summary reports
 */

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Download,
  Search,
} from 'lucide-react'
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  getRTPColorClass,
  getGGRColorClass,
  exportToCSV,
  calculateSummaryStats,
} from '@/lib/utils/summary'
import type { ExportField } from '@/lib/types/summary'

interface SummaryTableColumn {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

interface SummaryTableProps {
  data: any[]
  columns: SummaryTableColumn[]
  loading?: boolean
  currentPage: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  exportFields: ExportField[]
  exportFilename: string
  searchPlaceholder?: string
  showSummary?: boolean
}

export function SummaryTable({
  data,
  columns,
  loading = false,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSort,
  exportFields,
  exportFilename,
  searchPlaceholder = 'Search...',
  showSummary = true,
}: SummaryTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Filter data based on search term
  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  // Handle sorting
  const handleSort = (key: string) => {
    const direction = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortKey(key)
    setSortDirection(direction)
    onSort?.(key, direction)
  }

  // Handle export
  const handleExport = () => {
    exportToCSV(filteredData, exportFields, exportFilename)
  }

  // Calculate summary statistics
  const summaryStats = showSummary ? calculateSummaryStats(filteredData) : null

  const pageSizeOptions = [10, 25, 50, 100]

  return (
    <div className='space-y-4'>
      {/* Actions Row */}
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-2 flex-1 max-w-md'>
          <Search className='h-4 w-4 text-gray-400' />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='flex-1'
          />
        </div>
        <div className='flex items-center gap-2'>
          <Button
            onClick={handleExport}
            size='sm'
            className='gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
          >
            <Download className='h-4 w-4' />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      {summaryStats && (
        <Card className='bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-xl border-0 shadow-lg'>
          <CardHeader className='pb-3 sm:pb-4'>
            <CardTitle className='text-base sm:text-lg font-semibold'>Summary Statistics</CardTitle>
          </CardHeader>
          <CardContent className='pt-0'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4'>
              <div className='text-center p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800'>
                <div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1'>
                  Total Rounds
                </div>
                <div className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white'>
                  {formatNumber(summaryStats.totalRounds)}
                </div>
              </div>
              <div className='text-center p-3 rounded-lg bg-green-50/50 dark:bg-green-900/20 border border-green-100 dark:border-green-800'>
                <div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1'>
                  Won Rounds
                </div>
                <div className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white'>
                  {formatNumber(summaryStats.wonRounds)}
                </div>
              </div>
              <div className='text-center p-3 rounded-lg bg-purple-50/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800'>
                <div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1'>
                  Total Bet
                </div>
                <div className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white break-words'>
                  {formatCurrency(summaryStats.totalBet)}
                </div>
              </div>
              <div className='text-center p-3 rounded-lg bg-orange-50/50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800'>
                <div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1'>
                  Total Win
                </div>
                <div className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white break-words'>
                  {formatCurrency(summaryStats.totalWin)}
                </div>
              </div>
              <div className='text-center p-3 rounded-lg bg-red-50/50 dark:bg-red-900/20 border border-red-100 dark:border-red-800'>
                <div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1'>GGR</div>
                <div
                  className={`text-lg sm:text-xl font-bold break-words ${getGGRColorClass(summaryStats.ggr)}`}
                >
                  {formatCurrency(summaryStats.ggr)}
                </div>
              </div>
              <div className='text-center p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800'>
                <div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1'>
                  Avg RTP
                </div>
                <div
                  className={`text-lg sm:text-xl font-bold ${getRTPColorClass(summaryStats.avgRTP.toString())}`}
                >
                  {formatPercentage(summaryStats.avgRTP)}
                </div>
              </div>
              <div className='text-center p-3 rounded-lg bg-yellow-50/50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800'>
                <div className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1'>
                  Win Rate
                </div>
                <div className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white'>
                  {formatPercentage(summaryStats.winRate)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      <Card>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map(column => (
                    <TableHead key={column.key} className='whitespace-nowrap'>
                      {column.sortable ? (
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-auto p-0 font-semibold hover:bg-transparent'
                          onClick={() => handleSort(column.key)}
                        >
                          {column.label}
                          <ArrowUpDown className='ml-2 h-3 w-3' />
                        </Button>
                      ) : (
                        <span className='font-semibold'>{column.label}</span>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className='text-center py-8'>
                      <div className='flex items-center justify-center space-x-2'>
                        <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600'></div>
                        <span>Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className='text-center py-8 text-gray-500'>
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row, index) => (
                    <TableRow key={index} className='hover:bg-gray-50 dark:hover:bg-gray-800'>
                      {columns.map(column => (
                        <TableCell key={column.key} className='whitespace-nowrap'>
                          {column.render ? column.render(row[column.key], row) : row[column.key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-2 bg-muted/30 rounded-lg p-3'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <span>Show</span>
          <Select
            value={pageSize.toString()}
            onValueChange={value => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className='w-16 h-8 text-xs'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map(size => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>entries</span>
        </div>

        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3'>
          <span className='text-xs sm:text-sm text-muted-foreground'>
            Page {currentPage} of {totalPages}
          </span>

          <div className='flex items-center gap-1'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className='h-8 w-8 p-0'
            >
              <ChevronsLeft className='h-3 w-3' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='h-8 w-8 p-0'
            >
              <ChevronLeft className='h-3 w-3' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='h-8 w-8 p-0'
            >
              <ChevronRight className='h-3 w-3' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className='h-8 w-8 p-0'
            >
              <ChevronsRight className='h-3 w-3' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
