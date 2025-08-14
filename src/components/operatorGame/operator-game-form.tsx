/**
 * Operator Game Form Component
 * Form for creating and editing operator games
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
import { usePlatformData } from '@/hooks/usePlatformData'
import { useFilterOptions } from '@/hooks/useGames'
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

  // Get platform data
  const {
    platformOptions,
    operatorOptions,
    brandOptions,
    isLoading: platformDataLoading,
  } = usePlatformData({
    autoFetch: true,
    fetchPlatforms: true,
    fetchOperators: true,
    fetchBrands: true,
  })

  // Get game options
  const { gameOptions } = useFilterOptions()

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

          {/* Platform Selection */}
          <div className='space-y-2'>
            <Label htmlFor='platform'>Platform *</Label>
            <Select
              value={formData.platform}
              onValueChange={value => handleInputChange('platform', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a platform' />
              </SelectTrigger>
              <SelectContent>
                {platformOptions
                  .filter((platform: any) => platform.id !== 'ALL')
                  .map((platform: any) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      {platform.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Operator Selection */}
          <div className='space-y-2'>
            <Label htmlFor='operator'>Operator *</Label>
            <Select
              value={formData.operator}
              onValueChange={value => handleInputChange('operator', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select an operator' />
              </SelectTrigger>
              <SelectContent>
                {operatorOptions
                  .filter((operator: any) => operator.id !== 'ALL')
                  .map((operator: any) => (
                    <SelectItem key={operator.id} value={operator.id}>
                      {operator.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brand Selection */}
          <div className='space-y-2'>
            <Label htmlFor='brand'>Brand *</Label>
            <Select
              value={formData.brand}
              onValueChange={value => handleInputChange('brand', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a brand' />
              </SelectTrigger>
              <SelectContent>
                {brandOptions
                  .filter((brand: any) => brand.id !== 'ALL')
                  .map((brand: any) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
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
