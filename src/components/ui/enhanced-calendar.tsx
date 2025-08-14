'use client'

import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function EnhancedCalendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [month, setMonth] = React.useState<Date>(new Date())

  // Generate year options (2020-2030)
  const yearOptions = Array.from({ length: 11 }, (_, i) => 2020 + i)

  // Month names
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const handleYearChange = (year: string) => {
    const newDate = new Date(month)
    newDate.setFullYear(parseInt(year))
    setMonth(newDate)
  }

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(month)
    newDate.setMonth(parseInt(monthIndex))
    setMonth(newDate)
  }

  return (
    <div className='bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden w-full max-w-sm mx-auto'>
      {/* Compact Header */}
      <div className='relative bg-gradient-to-r from-violet-500 to-purple-600 text-white p-3 sm:p-4'>
        <div className='absolute inset-0 bg-gradient-to-r from-white/5 to-transparent'></div>

        <div className='relative flex items-center justify-center space-x-2'>
          <CalendarIcon className='h-4 w-4 sm:h-5 sm:w-5' />
          <h3 className='text-sm sm:text-base font-semibold'>Select Date</h3>
        </div>

        {/* Compact Month/Year Selectors */}
        <div className='flex items-center justify-center mt-3 space-x-2 max-w-full'>
          <Select
            value={monthNames[month.getMonth()]}
            onValueChange={value => handleMonthChange(monthNames.indexOf(value).toString())}
          >
            <SelectTrigger className='h-8 text-xs sm:text-sm bg-white/20 border-white/30 text-white placeholder:text-purple-100 hover:bg-white/30 transition-all duration-200 rounded-lg flex-1 min-w-0 max-w-[140px]'>
              <SelectValue className='font-medium truncate' />
            </SelectTrigger>
            <SelectContent className='bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-[200px] overflow-y-auto'>
              {monthNames.map(monthName => (
                <SelectItem
                  key={monthName}
                  value={monthName}
                  className='hover:bg-violet-50 dark:hover:bg-gray-700 focus:bg-violet-100 dark:focus:bg-gray-600 transition-all duration-200 text-xs sm:text-sm'
                >
                  {monthName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={month.getFullYear().toString()} onValueChange={handleYearChange}>
            <SelectTrigger className='h-8 w-16 sm:w-20 text-xs sm:text-sm bg-white/20 border-white/30 text-white placeholder:text-purple-100 hover:bg-white/30 transition-all duration-200 rounded-lg'>
              <SelectValue className='font-medium' />
            </SelectTrigger>
            <SelectContent className='bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-[200px] overflow-y-auto'>
              {yearOptions.map(year => (
                <SelectItem
                  key={year}
                  value={year.toString()}
                  className='hover:bg-violet-50 dark:hover:bg-gray-700 focus:bg-violet-100 dark:focus:bg-gray-600 transition-all duration-200 text-xs sm:text-sm'
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Compact Calendar Body */}
      <div className='p-3 sm:p-4'>
        <DayPicker
          month={month}
          onMonthChange={setMonth}
          showOutsideDays={showOutsideDays}
          className={cn('p-0 w-full', className)}
          classNames={{
            months: 'flex flex-col space-y-4',
            month: 'space-y-3',
            caption: 'hidden', // Hide default caption since we have custom header
            caption_label: 'text-sm font-medium',
            nav: 'space-x-1 flex items-center',
            nav_button: cn(
              buttonVariants({ variant: 'outline' }),
              'h-7 w-7 sm:h-8 sm:w-8 bg-white dark:bg-gray-800 p-0 opacity-70 hover:opacity-100 hover:bg-violet-50 dark:hover:bg-gray-700 transition-all duration-200 rounded-lg border-gray-200 dark:border-gray-600'
            ),
            nav_button_previous: 'absolute left-1',
            nav_button_next: 'absolute right-1',
            table: 'w-full border-collapse',
            head_row: 'flex mb-2',
            head_cell:
              'text-gray-500 dark:text-gray-400 rounded w-8 h-8 sm:w-9 sm:h-9 font-medium text-xs sm:text-sm flex items-center justify-center',
            row: 'flex w-full mt-1',
            cell: 'relative flex-1',
            day: cn(
              'h-8 w-8 sm:h-9 sm:w-9 p-0 font-medium rounded-lg text-xs sm:text-sm transition-all duration-200 hover:scale-105 focus:scale-105 transform mx-auto text-center',
              'hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-700 dark:hover:text-violet-300',
              'focus:bg-violet-200 dark:focus:bg-violet-800/50 focus:outline-none focus:ring-1 focus:ring-violet-500',
              'active:scale-95 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-600',
              'touch-manipulation', // Better touch interaction on mobile
              'select-none' // Prevent text selection on mobile
            ),
            day_range_end: 'day-range-end',
            day_selected: cn(
              'bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold border-0',
              'hover:from-violet-600 hover:to-purple-700',
              'focus:from-violet-600 focus:to-purple-700',
              'transform hover:scale-110 focus:scale-110 relative z-10 shadow-lg',
              'min-h-[32px] sm:min-h-[36px]' // Ensure minimum touch target size
            ),
            day_today: cn(
              'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 font-bold border border-orange-300 dark:border-orange-600',
              'hover:bg-orange-200 dark:hover:bg-orange-800/70'
            ),
            day_outside:
              'text-gray-300 dark:text-gray-600 opacity-50 hover:text-gray-400 dark:hover:text-gray-500',
            day_disabled:
              'text-gray-200 dark:text-gray-700 opacity-30 cursor-not-allowed hover:scale-100',
            day_range_middle:
              'aria-selected:bg-violet-100 dark:aria-selected:bg-violet-900/30 aria-selected:text-violet-900 dark:aria-selected:text-violet-100',
            day_hidden: 'invisible',
            ...classNames,
          }}
          components={{
            Chevron: ({ orientation }) =>
              orientation === 'left' ? (
                <ChevronLeft className='h-3 w-3 sm:h-4 sm:w-4' />
              ) : (
                <ChevronRight className='h-3 w-3 sm:h-4 sm:w-4' />
              ),
          }}
          {...props}
        />
      </div>
    </div>
  )
}
EnhancedCalendar.displayName = 'EnhancedCalendar'

export { EnhancedCalendar }
