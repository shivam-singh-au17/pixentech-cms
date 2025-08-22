import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import {
  Home,
  Package,
  Users,
  Settings,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { RootState } from '@/store'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: string
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: FileText,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const location = useLocation()
  const dispatch = useDispatch()
  const { sidebarCollapsed, isMobile } = useSelector((state: RootState) => state.ui)

  // Only close sidebar on mobile when a navigation link is clicked
  const handleNavClick = () => {
    if (isMobile && !sidebarCollapsed) {
      setTimeout(() => dispatch(toggleSidebar()), 150) // Small delay for navigation
    }
  }

  const sidebarVariants = {
    expanded: {
      width: isMobile ? '280px' : '250px',
      opacity: 1,
      x: 0,
    },
    collapsed: {
      width: isMobile ? '280px' : '70px',
      opacity: isMobile ? 1 : 1,
      x: isMobile ? '-100%' : 0,
    },
  }

  return (
    <motion.aside
      initial={false}
      animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'relative z-50 flex flex-col border-r bg-background',
        isMobile ? 'fixed inset-y-0 left-0' : 'relative'
      )}
    >
      {/* Logo */}
      <div className='flex h-16 items-center justify-center border-b px-4'>
        {!sidebarCollapsed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className='flex items-center gap-2'
          >
            <Package className='h-8 w-8 text-primary' />
            <span className='text-xl font-bold'>Crash.Live CMS</span>
          </motion.div>
        ) : (
          <Package className='h-8 w-8 text-primary' />
        )}
      </div>

      {/* Navigation */}
      <nav className='flex-1 space-y-1 p-4'>
        {navigation.map(item => {
          const isActive = location.pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.href} to={item.href} onClick={handleNavClick}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className='h-5 w-5 flex-shrink-0' />
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className='truncate'
                  >
                    {item.title}
                  </motion.span>
                )}
                {item.badge && !sidebarCollapsed && (
                  <span className='ml-auto rounded-full bg-primary/20 px-2 py-1 text-xs'>
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle (desktop only) */}
      {!isMobile && (
        <div className='border-t p-4'>
          <Button
            variant='ghost'
            size='icon'
            className='w-full'
            onClick={() => dispatch(toggleSidebar())}
          >
            {sidebarCollapsed ? (
              <ChevronRight className='h-4 w-4' />
            ) : (
              <ChevronLeft className='h-4 w-4' />
            )}
          </Button>
        </div>
      )}
    </motion.aside>
  )
}
