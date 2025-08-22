/**
 * Operator Game Form Component
 * Form for creating and editing operator games with hierarchical platform selection
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DialogFooter } from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { useHierarchicalPlatformData } from '@/hooks/useHierarchicalPlatformData'
import { PlatformFilter, OperatorFilter, BrandFilter } from '@/components/common/PlatformFilters'
import { useGameOptions } from '@/hooks/data'
import type {
  OperatorGame,
  CreateOperatorGameData,
  UpdateOperatorGameData,
} from '@/lib/api/operatorGame'

interface OperatorGameFormProps {
  operatorGame?: OperatorGame
  onSubmit: (data: CreateOperatorGameData | UpdateOperatorGameData) => void
  onCancel: () => void
  isLoading?: boolean
  mode: 'create' | 'edit'
}

export function OperatorGameForm({
  operatorGame,
  onSubmit,
  onCancel,
  isLoading = false,
  mode,
}: OperatorGameFormProps) {
  const [formData, setFormData] = useState({
    game: operatorGame?.game || '',
    platform: operatorGame?.platform || '',
    operator: operatorGame?.operator || '',
    brand: operatorGame?.brand || '',
    minBet: operatorGame?.minBet?.toString() || '',
    maxBet: operatorGame?.maxBet?.toString() || '',
    defaultBet: operatorGame?.defaultBet?.toString() || '',
    maxWin: operatorGame?.maxWin?.toString() || '',
  })

  // Get hierarchical platform data for filter components (they manage their own data)
  const { isLoading: platformDataLoading } = useHierarchicalPlatformData({
    selectedPlatform: formData.platform,
    selectedOperator: formData.operator,
  })

  // Get game options using the unified data hook
  const { data: gameData } = useGameOptions()
  const gameOptions = gameData?.options || []

  // Update form when operatorGame changes
  useEffect(() => {
    if (operatorGame) {
      setFormData({
        game: operatorGame.game || '',
        platform: operatorGame.platform || '',
        operator: operatorGame.operator || '',
        brand: operatorGame.brand || '',
        minBet: operatorGame.minBet?.toString() || '',
        maxBet: operatorGame.maxBet?.toString() || '',
        defaultBet: operatorGame.defaultBet?.toString() || '',
        maxWin: operatorGame.maxWin?.toString() || '',
      })
    }
  }, [operatorGame])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle hierarchical platform filter changes
  const handlePlatformChange = (value: string) => {
    const platformId = value === 'all' ? '' : value
    setFormData(prev => ({
      ...prev,
      platform: platformId,
      operator: '', // Reset operator when platform changes
      brand: '', // Reset brand when platform changes
    }))
  }

  const handleOperatorChange = (value: string) => {
    const operatorId = value === 'all' ? '' : value
    setFormData(prev => ({
      ...prev,
      operator: operatorId,
      brand: '', // Reset brand when operator changes
    }))
  }

  const handleBrandChange = (value: string) => {
    const brandId = value === 'all' ? '' : value
    setFormData(prev => ({
      ...prev,
      brand: brandId,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const submitData: any = {}

    if (mode === 'create') {
      submitData.game = formData.game
      submitData.platform = formData.platform
      submitData.operator = formData.operator
      submitData.brand = formData.brand
    }

    // Add numerical fields
    if (formData.minBet) submitData.minBet = parseFloat(formData.minBet)
    if (formData.maxBet) submitData.maxBet = parseFloat(formData.maxBet)
    if (formData.defaultBet) submitData.defaultBet = parseFloat(formData.defaultBet)
    if (formData.maxWin) submitData.maxWin = parseFloat(formData.maxWin)

    onSubmit(submitData)
  }

  const isFormValid = () => {
    if (mode === 'create') {
      return formData.game && formData.platform && formData.operator && formData.brand
    }
    return true // For edit mode, all fields are optional
  }

  if (platformDataLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <Loader2 className='h-6 w-6 animate-spin' />
        <span className='ml-2'>Loading form data...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {mode === 'create' && (
        <>
          {/* Game Selection */}
          <div className='space-y-2'>
            <Label htmlFor='game'>Game *</Label>
            <Select value={formData.game} onValueChange={value => handleInputChange('game', value)}>
              <SelectTrigger>
                <SelectValue placeholder='Select a game' />
              </SelectTrigger>
              <SelectContent>
                {gameOptions.map(game => (
                  <SelectItem key={game.id} value={game.id}>
                    {game.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hierarchical Platform Selection */}
          <div className='col-span-1 md:col-span-3 space-y-4'>
            <Label className='text-base font-medium'>Platform Configuration *</Label>
            <p className='text-sm text-gray-600'>
              Select platform, operator, and brand. The selections work hierarchically.
            </p>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='platform'>Platform</Label>
                <PlatformFilter
                  value={formData.platform}
                  onChange={handlePlatformChange}
                  placeholder='Select platform'
                  className='w-full'
                  showLabel={false}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='operator'>Operator</Label>
                <OperatorFilter
                  value={formData.operator}
                  onChange={handleOperatorChange}
                  selectedPlatform={formData.platform}
                  placeholder='Select operator'
                  disabled={!formData.platform}
                  className='w-full'
                  showLabel={false}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='brand'>Brand</Label>
                <BrandFilter
                  value={formData.brand}
                  onChange={handleBrandChange}
                  selectedPlatform={formData.platform}
                  selectedOperator={formData.operator}
                  placeholder='Select brand'
                  disabled={!formData.operator}
                  className='w-full'
                  showLabel={false}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Betting Configuration */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='minBet'>Min Bet</Label>
          <Input
            id='minBet'
            type='number'
            step='0.01'
            min='0'
            placeholder='0.00'
            value={formData.minBet}
            onChange={e => handleInputChange('minBet', e.target.value)}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='maxBet'>Max Bet</Label>
          <Input
            id='maxBet'
            type='number'
            step='0.01'
            min='0'
            placeholder='0.00'
            value={formData.maxBet}
            onChange={e => handleInputChange('maxBet', e.target.value)}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='defaultBet'>Default Bet</Label>
          <Input
            id='defaultBet'
            type='number'
            step='0.01'
            min='0'
            placeholder='0.00'
            value={formData.defaultBet}
            onChange={e => handleInputChange('defaultBet', e.target.value)}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='maxWin'>Max Win</Label>
          <Input
            id='maxWin'
            type='number'
            step='0.01'
            min='0'
            placeholder='0.00'
            value={formData.maxWin}
            onChange={e => handleInputChange('maxWin', e.target.value)}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type='button' variant='outline' onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={!isFormValid() || isLoading}
          className='bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0'
        >
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          {mode === 'create' ? 'Create' : 'Update'} Operator Game
        </Button>
      </DialogFooter>
    </form>
  )
}
