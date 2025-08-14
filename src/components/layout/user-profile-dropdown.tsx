/**
 * User Profile Dropdown Component
 * Displays user information and provides logout functionality
 */

import { User, LogOut, Settings, UserCheck, UserX } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { RootState } from '@/store'

export function UserProfileDropdown() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
  }

  if (!user) {
    return null
  }

  // Get initials from email
  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <UserCheck className='h-4 w-4 text-green-600' />
    ) : (
      <UserX className='h-4 w-4 text-red-600' />
    )
  }

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive'
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600' : 'text-red-600'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarFallback className='bg-primary text-primary-foreground'>
              {getInitials(user.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>Profile</p>
            <p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* User Role */}
        <DropdownMenuItem className='cursor-default focus:bg-transparent'>
          <User className='mr-2 h-4 w-4' />
          <span className='flex-1'>Role</span>
          <span className='text-xs text-muted-foreground capitalize'>{user.role}</span>
        </DropdownMenuItem>

        {/* User Status */}
        <DropdownMenuItem className='cursor-default focus:bg-transparent'>
          {getStatusIcon(user.isActive ?? false)}
          <span className='ml-2 flex-1'>Status</span>
          <span className={`text-xs ${getStatusColor(user.isActive ?? false)}`}>
            {getStatusText(user.isActive ?? false)}
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Settings (placeholder for future) */}
        <DropdownMenuItem disabled>
          <Settings className='mr-2 h-4 w-4' />
          <span>Settings</span>
        </DropdownMenuItem>

        {/* Logout */}
        <DropdownMenuItem onClick={handleLogout} className='text-red-600 focus:text-red-600'>
          <LogOut className='mr-2 h-4 w-4' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
