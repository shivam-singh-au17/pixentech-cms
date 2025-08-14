import * as React from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface FilterOption {
  label: string
  value: string
  count?: number
}

interface FilterDropdownProps {
  title: string
  options: FilterOption[]
  value?: string[]
  onValueChange?: (value: string[]) => void
  className?: string
}

export function FilterDropdown({
  title,
  options,
  value = [],
  onValueChange,
  className,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const selectedValues = new Set(value)

  const handleSelect = (optionValue: string) => {
    const newValues = Array.from(selectedValues)
    if (selectedValues.has(optionValue)) {
      newValues.splice(newValues.indexOf(optionValue), 1)
    } else {
      newValues.push(optionValue)
    }
    onValueChange?.(newValues)
  }

  const handleClear = () => {
    onValueChange?.([])
  }

  return (
    <div className={cn('relative', className)}>
      <Button
        variant='outline'
        size='sm'
        className='h-8 border-dashed'
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {selectedValues.size > 0 && (
          <>
            <div className='ml-2 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center'>
              {selectedValues.size}
            </div>
          </>
        )}
        <ChevronDown className='ml-2 h-4 w-4' />
      </Button>

      {isOpen && (
        <div className='absolute top-8 left-0 z-50 min-w-[200px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md'>
          <div className='flex items-center justify-between p-2'>
            <span className='text-sm font-medium'>{title}</span>
            {selectedValues.size > 0 && (
              <Button variant='ghost' size='sm' className='h-6 px-2 text-xs' onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>
          <div className='max-h-64 overflow-auto'>
            {options.map(option => {
              const isSelected = selectedValues.has(option.value)
              return (
                <div
                  key={option.value}
                  className='flex items-center space-x-2 p-2 hover:bg-accent cursor-pointer'
                  onClick={() => handleSelect(option.value)}
                >
                  <div className='h-4 w-4 flex items-center justify-center'>
                    {isSelected && <Check className='h-3 w-3' />}
                  </div>
                  <span className='text-sm'>{option.label}</span>
                  {option.count && (
                    <span className='ml-auto text-xs text-muted-foreground'>{option.count}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
