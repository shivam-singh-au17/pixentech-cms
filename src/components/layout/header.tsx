import { useDispatch } from 'react-redux'
import { Menu, Search, Bell, Sun, Moon, Monitor } from 'lucide-react'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTheme } from '@/components/theme-provider'
import { UserProfileDropdown } from './user-profile-dropdown'

export function Header() {
  const dispatch = useDispatch()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const ThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className='h-4 w-4' />
      case 'dark':
        return <Moon className='h-4 w-4' />
      default:
        return <Monitor className='h-4 w-4' />
    }
  }

  return (
    <header className='flex h-16 items-center justify-between border-b bg-background px-6'>
      {/* Left side */}
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => dispatch(toggleSidebar())}
          className='lg:hidden'
        >
          <Menu className='h-5 w-5' />
        </Button>

        {/* Search */}
        <div className='relative hidden md:block'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input placeholder='Search...' className='w-64 pl-9' />
        </div>
      </div>

      {/* Right side */}
      <div className='flex items-center gap-2'>
        {/* Theme toggle */}
        <Button
          variant='ghost'
          size='icon'
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
        >
          <ThemeIcon />
        </Button>

        {/* Notifications */}
        <Button variant='ghost' size='icon'>
          <Bell className='h-5 w-5' />
        </Button>

        {/* User menu */}
        <UserProfileDropdown />
      </div>
    </header>
  )
}
