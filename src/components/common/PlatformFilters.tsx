/**
 * Reusable Platform Filter Components
 * Can be used across the project for hierarchical platform selection
 * Platform → Operator → Brand selection with proper dependencies
 */

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useHierarchicalPlatformData } from '@/hooks/useHierarchicalPlatformData'

// Platform Filter Component
interface PlatformFilterProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  label?: string
  showLabel?: boolean
  className?: string
}

export function PlatformFilter({
  value,
  onChange,
  placeholder = 'All Platforms',
  disabled = false,
  label = 'Platform',
  showLabel = true,
  className = '',
}: PlatformFilterProps) {
  const { platformOptions, isLoading } = useHierarchicalPlatformData({
    includeAllOption: false,
  })

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && <Label>{label}</Label>}
      <Select value={value || 'all'} onValueChange={onChange} disabled={disabled || isLoading}>
        <SelectTrigger className='h-9'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Platforms</SelectItem>
          {platformOptions.map(platform => (
            <SelectItem key={platform.id} value={platform.id}>
              {platform.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Operator Filter Component
interface OperatorFilterProps {
  selectedPlatform?: string
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  label?: string
  showLabel?: boolean
  className?: string
}

export function OperatorFilter({
  selectedPlatform,
  value,
  onChange,
  placeholder = 'All Operators',
  disabled = false,
  label = 'Operator',
  showLabel = true,
  className = '',
}: OperatorFilterProps) {
  const { operatorOptions, isLoading } = useHierarchicalPlatformData({
    selectedPlatform,
    includeAllOption: false,
  })

  const isDisabled = disabled || isLoading || !selectedPlatform || operatorOptions.length === 0

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && <Label>{label}</Label>}
      <Select value={value || 'all'} onValueChange={onChange} disabled={isDisabled}>
        <SelectTrigger className='h-9'>
          <SelectValue
            placeholder={
              !selectedPlatform
                ? 'Select platform first'
                : operatorOptions.length === 0
                  ? 'No operators available'
                  : placeholder
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Operators</SelectItem>
          {operatorOptions.map(operator => (
            <SelectItem key={operator.id} value={operator.id}>
              {operator.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Brand Filter Component
interface BrandFilterProps {
  selectedPlatform?: string
  selectedOperator?: string
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  label?: string
  showLabel?: boolean
  className?: string
}

export function BrandFilter({
  selectedPlatform,
  selectedOperator,
  value,
  onChange,
  placeholder = 'All Brands',
  disabled = false,
  label = 'Brand',
  showLabel = true,
  className = '',
}: BrandFilterProps) {
  const { brandOptions, isLoading } = useHierarchicalPlatformData({
    selectedPlatform,
    selectedOperator,
    includeAllOption: false,
  })

  const isDisabled =
    disabled || isLoading || !selectedPlatform || !selectedOperator || brandOptions.length === 0

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && <Label>{label}</Label>}
      <Select value={value || 'all'} onValueChange={onChange} disabled={isDisabled}>
        <SelectTrigger className='h-9'>
          <SelectValue
            placeholder={
              !selectedPlatform
                ? 'Select platform first'
                : !selectedOperator
                  ? 'Select operator first'
                  : brandOptions.length === 0
                    ? 'No brands available'
                    : placeholder
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Brands</SelectItem>
          {brandOptions.map(brand => (
            <SelectItem key={brand.id} value={brand.id}>
              {brand.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Combined Platform Filters Component for easy use
interface PlatformFiltersProps {
  selectedPlatform?: string
  selectedOperator?: string
  selectedBrand?: string
  onPlatformChange: (value: string) => void
  onOperatorChange: (value: string) => void
  onBrandChange: (value: string) => void
  disabled?: boolean
  labels?: {
    platform?: string
    operator?: string
    brand?: string
  }
  showLabels?: boolean
  layout?: 'horizontal' | 'vertical'
  className?: string
}

export function PlatformFilters({
  selectedPlatform,
  selectedOperator,
  selectedBrand,
  onPlatformChange,
  onOperatorChange,
  onBrandChange,
  disabled = false,
  labels = {
    platform: 'Platform',
    operator: 'Operator',
    brand: 'Brand',
  },
  showLabels = true,
  layout = 'horizontal',
  className = '',
}: PlatformFiltersProps) {
  const containerClass =
    layout === 'horizontal' ? 'grid grid-cols-1 sm:grid-cols-3 gap-4' : 'space-y-4'

  return (
    <div className={`${containerClass} ${className}`}>
      <PlatformFilter
        value={selectedPlatform}
        onChange={onPlatformChange}
        disabled={disabled}
        label={labels.platform}
        showLabel={showLabels}
        className='w-full'
      />

      <OperatorFilter
        selectedPlatform={selectedPlatform}
        value={selectedOperator}
        onChange={onOperatorChange}
        disabled={disabled}
        label={labels.operator}
        showLabel={showLabels}
        className='w-full'
      />

      <BrandFilter
        selectedPlatform={selectedPlatform}
        selectedOperator={selectedOperator}
        value={selectedBrand}
        onChange={onBrandChange}
        disabled={disabled}
        label={labels.brand}
        showLabel={showLabels}
        className='w-full'
      />
    </div>
  )
}
