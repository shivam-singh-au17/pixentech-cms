/**
 * Game Form Component
 * Handles create and edit operations for games
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
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, Gamepad2, Settings, DollarSign } from 'lucide-react'
import { useCreateGame, useUpdateGame } from '@/hooks/queries/useGameQueries'
import type { Game, CreateGameData } from '@/lib/api/game'

interface GameFormProps {
  game?: Game
  onSuccess?: () => void
  onCancel?: () => void
}

const GAME_TYPES = [
  { value: 'pg', label: 'Provably Fair Game' },
  { value: 'sg', label: 'Slot Game' },
  { value: 'cg', label: 'Crash Game' },
]

const GAME_MODES = [
  { value: '1', label: 'Mode 1' },
  { value: '3', label: 'Mode 3' },
  { value: '5', label: 'Mode 5' },
  { value: '7', label: 'Mode 7' },
]

export function GameForm({ game, onSuccess, onCancel }: GameFormProps) {
  const isEditing = !!game
  const createGameMutation = useCreateGame()
  const updateGameMutation = useUpdateGame()

  const [formData, setFormData] = useState<CreateGameData>({
    gameName: '',
    gameAlias: '',
    launchPath: '',
    icon: '',
    gameType: 'pg',
    defaultBet: 100,
    maxBet: 25000,
    minBet: 100,
    gameMode: '5',
    homeURL: '',
    extraData: '',
    maxWin: 0,
    isActive: true,
    availableGameModes: ['1', '3', '5', '7'],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form with game data if editing
  useEffect(() => {
    if (game) {
      setFormData({
        gameName: game.gameName || '',
        gameAlias: game.gameAlias || '',
        launchPath: game.launchPath || '',
        icon: game.icon || '',
        gameType: (game.gameType as 'pg' | 'sg' | 'cg') || 'pg',
        defaultBet: game.defaultBet || 100,
        maxBet: game.maxBet || 25000,
        minBet: game.minBet || 100,
        gameMode: game.gameMode || '5',
        homeURL: game.homeURL || '',
        extraData: game.extraData || '',
        maxWin: game.maxWin || 0,
        isActive: game.isActive ?? true,
        availableGameModes: game.availableGameModes || ['1', '3', '5', '7'],
      })
    }
  }, [game])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.gameName.trim()) {
      newErrors.gameName = 'Game name is required'
    }

    if (!formData.gameAlias.trim()) {
      newErrors.gameAlias = 'Game alias is required'
    }

    if (!formData.launchPath.trim()) {
      newErrors.launchPath = 'Launch path is required'
    }

    if (formData.minBet <= 0) {
      newErrors.minBet = 'Minimum bet must be greater than 0'
    }

    if (formData.maxBet <= formData.minBet) {
      newErrors.maxBet = 'Maximum bet must be greater than minimum bet'
    }

    if (formData.defaultBet < formData.minBet || formData.defaultBet > formData.maxBet) {
      newErrors.defaultBet = 'Default bet must be between minimum and maximum bet'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      if (isEditing && game) {
        await updateGameMutation.mutateAsync({
          id: game._id,
          data: formData,
        })
      } else {
        await createGameMutation.mutateAsync(formData)
      }

      onSuccess?.()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleInputChange = (field: keyof CreateGameData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const isLoading = createGameMutation.isPending || updateGameMutation.isPending

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Gamepad2 className='h-5 w-5' />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='gameName'>Game Name *</Label>
              <Input
                id='gameName'
                value={formData.gameName}
                onChange={e => handleInputChange('gameName', e.target.value)}
                placeholder='Enter game name'
                className={errors.gameName ? 'border-red-500' : ''}
              />
              {errors.gameName && <p className='text-sm text-red-500'>{errors.gameName}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='gameAlias'>Game Alias *</Label>
              <Input
                id='gameAlias'
                value={formData.gameAlias}
                onChange={e => handleInputChange('gameAlias', e.target.value.toUpperCase())}
                placeholder='Enter game alias (e.g., AVIATORX)'
                className={errors.gameAlias ? 'border-red-500' : ''}
              />
              {errors.gameAlias && <p className='text-sm text-red-500'>{errors.gameAlias}</p>}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='gameType'>Game Type *</Label>
              <Select
                value={formData.gameType}
                onValueChange={value => handleInputChange('gameType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select game type' />
                </SelectTrigger>
                <SelectContent>
                  {GAME_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='gameMode'>Game Mode</Label>
              <Select
                value={formData.gameMode}
                onValueChange={value => handleInputChange('gameMode', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select game mode' />
                </SelectTrigger>
                <SelectContent>
                  {GAME_MODES.map(mode => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='launchPath'>Launch Path *</Label>
            <Input
              id='launchPath'
              value={formData.launchPath}
              onChange={e => handleInputChange('launchPath', e.target.value)}
              placeholder='Enter launch path (e.g., /aviatorx/index.html)'
              className={errors.launchPath ? 'border-red-500' : ''}
            />
            {errors.launchPath && <p className='text-sm text-red-500'>{errors.launchPath}</p>}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='icon'>Icon Path</Label>
              <Input
                id='icon'
                value={formData.icon}
                onChange={e => handleInputChange('icon', e.target.value)}
                placeholder='Enter icon path (e.g., /images/aviatorx.png)'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='homeURL'>Home URL</Label>
              <Input
                id='homeURL'
                value={formData.homeURL}
                onChange={e => handleInputChange('homeURL', e.target.value)}
                placeholder='Enter home URL or NA'
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Betting Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <DollarSign className='h-5 w-5' />
            Betting Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='minBet'>Minimum Bet *</Label>
              <Input
                id='minBet'
                type='number'
                step='0.01'
                value={formData.minBet}
                onChange={e => handleInputChange('minBet', parseFloat(e.target.value) || 0)}
                placeholder='Enter minimum bet'
                className={errors.minBet ? 'border-red-500' : ''}
              />
              {errors.minBet && <p className='text-sm text-red-500'>{errors.minBet}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='defaultBet'>Default Bet *</Label>
              <Input
                id='defaultBet'
                type='number'
                step='0.01'
                value={formData.defaultBet}
                onChange={e => handleInputChange('defaultBet', parseFloat(e.target.value) || 0)}
                placeholder='Enter default bet'
                className={errors.defaultBet ? 'border-red-500' : ''}
              />
              {errors.defaultBet && <p className='text-sm text-red-500'>{errors.defaultBet}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='maxBet'>Maximum Bet *</Label>
              <Input
                id='maxBet'
                type='number'
                step='0.01'
                value={formData.maxBet}
                onChange={e => handleInputChange('maxBet', parseFloat(e.target.value) || 0)}
                placeholder='Enter maximum bet'
                className={errors.maxBet ? 'border-red-500' : ''}
              />
              {errors.maxBet && <p className='text-sm text-red-500'>{errors.maxBet}</p>}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='maxWin'>Maximum Win (0 for unlimited)</Label>
            <Input
              id='maxWin'
              type='number'
              step='0.01'
              value={formData.maxWin || 0}
              onChange={e => handleInputChange('maxWin', parseFloat(e.target.value) || 0)}
              placeholder='Enter maximum win amount'
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Settings className='h-5 w-5' />
            Advanced Settings
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='extraData'>Extra Data (JSON)</Label>
            <textarea
              id='extraData'
              value={formData.extraData}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange('extraData', e.target.value)
              }
              placeholder='Enter additional game configuration as JSON'
              rows={3}
              className='flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            />
          </div>

          <div className='space-y-2'>
            <Label>Available Game Modes</Label>
            <div className='flex flex-wrap gap-2'>
              {GAME_MODES.map(mode => (
                <Badge
                  key={mode.value}
                  variant={
                    formData.availableGameModes?.includes(mode.value) ? 'default' : 'outline'
                  }
                  className='cursor-pointer'
                  onClick={() => {
                    const currentModes = formData.availableGameModes || []
                    const newModes = currentModes.includes(mode.value)
                      ? currentModes.filter(m => m !== mode.value)
                      : [...currentModes, mode.value]
                    handleInputChange('availableGameModes', newModes)
                  }}
                >
                  {mode.label}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label htmlFor='isActive'>Game Status</Label>
              <p className='text-sm text-muted-foreground'>
                Enable or disable this game for players
              </p>
            </div>
            <Switch
              id='isActive'
              checked={formData.isActive}
              onCheckedChange={checked => handleInputChange('isActive', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className='flex justify-end gap-3'>
        <Button type='button' variant='outline' onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
          {isEditing ? 'Update Game' : 'Create Game'}
        </Button>
      </div>
    </form>
  )
}
