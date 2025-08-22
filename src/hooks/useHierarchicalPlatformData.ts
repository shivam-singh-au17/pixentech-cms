/**
 * Hierarchical Platform Data Hook
 * Implements cascading Platform → Operator → Brand selection logic
 *
 * Usage:
 * - Shows all platforms initially
 * - When platform is selected, filters operators by that platform
 * - When operator is selected, filters brands by that platform and operator
 */

import { useMemo } from 'react'
import { usePlatformData } from './data'
import type { Platform, Operator, Brand } from '@/lib/types/platform-updated'

// Option interface compatible with the platform data system
interface FilterOption {
  id: string
  label: string
  value: string
}

interface HierarchicalPlatformDataOptions {
  selectedPlatform?: string
  selectedOperator?: string
  autoFetch?: boolean
  includeAllOption?: boolean
}

interface HierarchicalPlatformDataReturn {
  // Raw data
  platforms: Platform[]
  operators: Operator[]
  brands: Brand[]

  // Filtered options for dropdowns
  platformOptions: FilterOption[]
  operatorOptions: FilterOption[]
  brandOptions: FilterOption[]

  // Loading states
  isLoading: boolean
  platformsLoading: boolean
  operatorsLoading: boolean
  brandsLoading: boolean

  // Utility functions
  getOperatorsByPlatform: (platformId: string) => FilterOption[]
  getBrandsByPlatformAndOperator: (platformId: string, operatorId: string) => FilterOption[]
  getBrandsByOperator: (operatorId: string) => FilterOption[]
}

export const useHierarchicalPlatformData = (
  options: HierarchicalPlatformDataOptions = {}
): HierarchicalPlatformDataReturn => {
  const { selectedPlatform, selectedOperator, autoFetch = true, includeAllOption = true } = options

  // Get the raw platform data
  const {
    platforms,
    operators,
    brands,
    platformOptions: allPlatformOptions,
    operatorOptions: allOperatorOptions,
    brandOptions: allBrandOptions,
    platformsLoading,
    operatorsLoading,
    brandsLoading,
  } = usePlatformData({
    autoFetch,
    fetchPlatforms: true,
    fetchOperators: true,
    fetchBrands: true,
  })

  // Utility function to get operators filtered by platform
  const getOperatorsByPlatform = useMemo(() => {
    return (platformId: string): FilterOption[] => {
      if (!platformId || platformId === 'all') {
        return allOperatorOptions
      }

      return allOperatorOptions.filter((operator: FilterOption) => {
        // Find the operator in raw data to check its platform
        const rawOperator = operators.find((op: Operator) => op._id === operator.id)
        return rawOperator?.platform === platformId
      })
    }
  }, [allOperatorOptions, operators])

  // Utility function to get brands filtered by platform and operator
  const getBrandsByPlatformAndOperator = useMemo(() => {
    return (platformId: string, operatorId: string): FilterOption[] => {
      if (!platformId || platformId === 'all') {
        if (!operatorId || operatorId === 'all') {
          return allBrandOptions
        }
        return allBrandOptions.filter((brand: FilterOption) => {
          const rawBrand = brands.find((b: Brand) => b._id === brand.id)
          return rawBrand?.operator === operatorId
        })
      }

      if (!operatorId || operatorId === 'all') {
        return allBrandOptions.filter((brand: FilterOption) => {
          const rawBrand = brands.find((b: Brand) => b._id === brand.id)
          return rawBrand?.platform === platformId
        })
      }

      return allBrandOptions.filter((brand: FilterOption) => {
        const rawBrand = brands.find((b: Brand) => b._id === brand.id)
        return rawBrand?.platform === platformId && rawBrand?.operator === operatorId
      })
    }
  }, [allBrandOptions, brands])

  // Utility function to get brands filtered by operator only
  const getBrandsByOperator = useMemo(() => {
    return (operatorId: string): FilterOption[] => {
      if (!operatorId || operatorId === 'all') {
        return allBrandOptions
      }

      return allBrandOptions.filter((brand: FilterOption) => {
        const rawBrand = brands.find((b: Brand) => b._id === brand.id)
        return rawBrand?.operator === operatorId
      })
    }
  }, [allBrandOptions, brands])

  // Filtered platform options (always show all platforms)
  const platformOptions = useMemo(() => {
    const options = [...allPlatformOptions]

    if (includeAllOption && !options.some(opt => opt.id === 'all')) {
      options.unshift({ id: 'all', label: 'All Platforms', value: 'all' })
    }

    return options
  }, [allPlatformOptions, includeAllOption])

  // Filtered operator options based on selected platform
  const operatorOptions = useMemo(() => {
    let filteredOptions: FilterOption[] = []

    if (selectedPlatform && selectedPlatform !== 'all') {
      filteredOptions = getOperatorsByPlatform(selectedPlatform)
    } else {
      filteredOptions = [...allOperatorOptions]
    }

    if (
      includeAllOption &&
      filteredOptions.length > 0 &&
      !filteredOptions.some(opt => opt.id === 'all')
    ) {
      filteredOptions.unshift({ id: 'all', label: 'All Operators', value: 'all' })
    }

    return filteredOptions
  }, [selectedPlatform, getOperatorsByPlatform, allOperatorOptions, includeAllOption])

  // Filtered brand options based on selected platform and operator
  const brandOptions = useMemo(() => {
    let filteredOptions: FilterOption[] = []

    if (selectedPlatform && selectedOperator) {
      filteredOptions = getBrandsByPlatformAndOperator(selectedPlatform, selectedOperator)
    } else if (selectedPlatform && selectedPlatform !== 'all') {
      // Show brands for selected platform only
      filteredOptions = allBrandOptions.filter((brand: FilterOption) => {
        const rawBrand = brands.find((b: Brand) => b._id === brand.id)
        return rawBrand?.platform === selectedPlatform
      })
    } else if (selectedOperator && selectedOperator !== 'all') {
      // Show brands for selected operator only
      filteredOptions = getBrandsByOperator(selectedOperator)
    } else {
      filteredOptions = [...allBrandOptions]
    }

    if (
      includeAllOption &&
      filteredOptions.length > 0 &&
      !filteredOptions.some(opt => opt.id === 'all')
    ) {
      filteredOptions.unshift({ id: 'all', label: 'All Brands', value: 'all' })
    }

    return filteredOptions
  }, [
    selectedPlatform,
    selectedOperator,
    getBrandsByPlatformAndOperator,
    getBrandsByOperator,
    allBrandOptions,
    brands,
    includeAllOption,
  ])

  const isLoading = platformsLoading || operatorsLoading || brandsLoading

  return {
    // Raw data
    platforms,
    operators,
    brands,

    // Filtered options
    platformOptions,
    operatorOptions,
    brandOptions,

    // Loading states
    isLoading,
    platformsLoading,
    operatorsLoading,
    brandsLoading,

    // Utility functions
    getOperatorsByPlatform,
    getBrandsByPlatformAndOperator,
    getBrandsByOperator,
  }
}
