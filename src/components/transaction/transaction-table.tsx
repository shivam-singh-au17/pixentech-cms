/**
 * Transaction Table Component
 * Displays transaction data in a responsive table with sorting, pagination, and row actions
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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  formatCurrency,
  formatDateSafe,
  getStatusColorClass,
  getStatusDisplayText,
  calculateProfitLoss,
  getProfitLossColorClass,
  formatProfitLoss,
  calculateMultiplier,
  formatMultiplier,
} from '@/lib/utils/transaction'
import type { TransactionReport } from '@/lib/types/transaction'

interface TransactionTableProps {
  data: TransactionReport[]
  loading?: boolean
  currentPage: number
  pageSize: number
  totalCount?: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onViewDetails: (betTxnId: string) => void
  onSort?: (column: string) => void
}

export function TransactionTable({
  data,
  loading = false,
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  onViewDetails,
  onSort,
}: TransactionTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSort = (column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortColumn(column)
    setSortDirection(newDirection)
    onSort?.(column)
  }

  const totalPages = totalCount
    ? Math.ceil(totalCount / pageSize)
    : Math.ceil(data.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(currentPage * pageSize, totalCount || data.length)

  const formatTableCurrency = (amount: number, currency: string = 'INR') => {
    return formatCurrency(amount, currency).replace('₹', '₹ ')
  }

  if (loading && data.length === 0) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-center h-32'>
            <div className='text-muted-foreground'>Loading transactions...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-center h-32'>
            <div className='text-muted-foreground'>No transactions found</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='w-full max-w-full overflow-x-hidden'>
      <Card>
        <CardContent className='p-0'>
          {/* Mobile Card View */}
          <div className='lg:hidden'>
            <div className='space-y-3 p-4'>
              {data.map(transaction => {
                const profitLoss = calculateProfitLoss(
                  transaction.betAmount,
                  transaction.winAmount || 0
                )
                const multiplier = calculateMultiplier(
                  transaction.betAmount,
                  transaction.winAmount || 0
                )

                return (
                  <Card key={transaction._id} className='p-4'>
                    <div className='space-y-3'>
                      {/* Header Row */}
                      <div className='flex items-start justify-between'>
                        <div className='space-y-1'>
                          <div className='font-medium text-sm'>{transaction.externalPlayerId}</div>
                          <div className='text-xs text-muted-foreground'>
                            {transaction.gameAlias}
                          </div>
                        </div>
                        <Badge
                          variant='outline'
                          className={cn('text-xs', getStatusColorClass(transaction.status))}
                        >
                          {getStatusDisplayText(transaction.status)}
                        </Badge>
                      </div>

                      {/* Amounts Row */}
                      <div className='grid grid-cols-2 gap-4 text-xs'>
                        <div>
                          <div className='text-muted-foreground'>Bet Amount</div>
                          <div className='font-medium'>
                            {formatTableCurrency(
                              transaction.betAmount,
                              transaction.playerCurrencyCode
                            )}
                          </div>
                        </div>
                        <div>
                          <div className='text-muted-foreground'>Win Amount</div>
                          <div className='font-medium'>
                            {formatTableCurrency(
                              transaction.winAmount || 0,
                              transaction.playerCurrencyCode
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Profit/Loss and Multiplier */}
                      <div className='grid grid-cols-2 gap-4 text-xs'>
                        <div>
                          <div className='text-muted-foreground'>Profit/Loss</div>
                          <div className={cn('font-medium', getProfitLossColorClass(profitLoss))}>
                            {formatProfitLoss(profitLoss, transaction.playerCurrencyCode)}
                          </div>
                        </div>
                        <div>
                          <div className='text-muted-foreground'>Multiplier</div>
                          <div className='font-medium'>{formatMultiplier(multiplier)}</div>
                        </div>
                      </div>

                      {/* Transaction IDs */}
                      <div className='space-y-1 text-xs'>
                        <div className='text-muted-foreground'>Bet ID: {transaction.betTxnId}</div>
                        <div className='text-muted-foreground'>Round ID: {transaction.roundId}</div>
                      </div>

                      {/* Date and Action */}
                      <div className='flex items-center justify-between pt-2 border-t'>
                        <div className='text-xs text-muted-foreground'>
                          {formatDateSafe(transaction.createdAt)}
                        </div>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => onViewDetails(transaction.betTxnId)}
                          className='text-xs'
                        >
                          <Eye className='h-3 w-3 mr-1' />
                          Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className='hidden lg:block'>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className='cursor-pointer hover:bg-muted/50'
                      onClick={() => handleSort('externalPlayerId')}
                    >
                      Player ID
                    </TableHead>
                    <TableHead
                      className='cursor-pointer hover:bg-muted/50'
                      onClick={() => handleSort('gameAlias')}
                    >
                      Game
                    </TableHead>
                    <TableHead
                      className='cursor-pointer hover:bg-muted/50'
                      onClick={() => handleSort('betAmount')}
                    >
                      Bet Amount
                    </TableHead>
                    <TableHead
                      className='cursor-pointer hover:bg-muted/50'
                      onClick={() => handleSort('winAmount')}
                    >
                      Win Amount
                    </TableHead>
                    <TableHead>Profit/Loss</TableHead>
                    <TableHead>Multiplier</TableHead>
                    <TableHead
                      className='cursor-pointer hover:bg-muted/50'
                      onClick={() => handleSort('status')}
                    >
                      Status
                    </TableHead>
                    <TableHead>Bet ID</TableHead>
                    <TableHead
                      className='cursor-pointer hover:bg-muted/50'
                      onClick={() => handleSort('createdAt')}
                    >
                      Date
                    </TableHead>
                    <TableHead className='w-[80px]'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map(transaction => {
                    const profitLoss = calculateProfitLoss(
                      transaction.betAmount,
                      transaction.winAmount || 0
                    )
                    const multiplier = calculateMultiplier(
                      transaction.betAmount,
                      transaction.winAmount || 0
                    )

                    return (
                      <TableRow key={transaction._id} className='hover:bg-muted/50'>
                        <TableCell className='font-medium'>
                          {transaction.externalPlayerId}
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <span>{transaction.gameAlias}</span>
                            {transaction.isFreeBet && (
                              <Badge variant='secondary' className='text-xs'>
                                Free
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className='font-medium'>
                          {formatTableCurrency(
                            transaction.betAmount,
                            transaction.playerCurrencyCode
                          )}
                        </TableCell>
                        <TableCell className='font-medium'>
                          {formatTableCurrency(
                            transaction.winAmount || 0,
                            transaction.playerCurrencyCode
                          )}
                        </TableCell>
                        <TableCell
                          className={cn('font-medium', getProfitLossColorClass(profitLoss))}
                        >
                          {formatProfitLoss(profitLoss, transaction.playerCurrencyCode)}
                        </TableCell>
                        <TableCell className='font-medium'>
                          {formatMultiplier(multiplier)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant='outline'
                            className={cn('text-xs', getStatusColorClass(transaction.status))}
                          >
                            {getStatusDisplayText(transaction.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className='font-mono text-sm'>
                          <div className='max-w-[120px] truncate' title={transaction.betTxnId}>
                            {transaction.betTxnId}
                          </div>
                        </TableCell>
                        <TableCell className='text-sm'>
                          {formatDateSafe(transaction.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => onViewDetails(transaction.betTxnId)}
                            className='h-8 w-8 p-0'
                          >
                            <Eye className='h-4 w-4' />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t'>
            <div className='text-sm text-muted-foreground'>
              Showing {startIndex} to {endIndex} of {totalCount || data.length} transactions
            </div>

            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-2 text-sm'>
                <span>Rows per page:</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={value => onPageSizeChange(Number(value))}
                >
                  <SelectTrigger className='h-8 w-16'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='10'>10</SelectItem>
                    <SelectItem value='25'>25</SelectItem>
                    <SelectItem value='50'>50</SelectItem>
                    <SelectItem value='100'>100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex items-center gap-1'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className='h-8 w-8 p-0'
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>

                <div className='flex items-center gap-1'>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size='sm'
                        onClick={() => onPageChange(pageNum)}
                        className='h-8 w-8 p-0'
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className='h-8 w-8 p-0'
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
