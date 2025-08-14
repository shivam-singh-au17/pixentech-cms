/**
 * Enhanced Sidebar with Submenu Support
 * Modern navigation with collapsible submenus and mobile responsiveness
 */

import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Package,
  Users,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Dices,
  Gamepad2,
  Building2,
  Tag,
  School2,
  Globe,
} from 'lucide-react'
import { RootState } from '@/store'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SubMenuItem {
  title: string
  href: string
  badge?: string
  description?: string
}

interface NavItem {
  title: string
  href?: string
  icon: React.ElementType
  badge?: string
  subItems?: SubMenuItem[]
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    title: 'Game Bets Summary',
    icon: Dices,
    subItems: [
      {
        title: 'Daily Summary',
        href: '/summary/daily',
        description: 'Daily wise game bets summary',
      },
      {
        title: 'Game Summary',
        href: '/summary/game',
        description: 'Game wise game bets summary',
      },
      {
        title: 'Player Summary',
        href: '/summary/player',
        description: 'Player wise game bets summary',
      },
      {
        title: 'Player Game Summary',
        href: '/summary/player-game',
        description: 'Player wise games summary',
      },
    ],
  },
  {
    title: 'Reports & Analytics',
    href: '/reports/transactions',
    icon: BarChart3,
  },
  {
    title: 'Platforms Management',
    href: '/platforms',
    icon: School2,
    badge: 'New',
  },
  {
    title: 'Operators Management',
    href: '/operators',
    icon: Building2,
  },
  {
    title: 'Brands Management',
    href: '/brands',
    icon: Tag,
  },
  {
    title: 'Game Management',
    href: '/games',
    icon: Package,
  },
  {
    title: 'Operator Game Management',
    href: '/operator-games',
    icon: Gamepad2,
    badge: 'New',
  },
  {
    title: 'User Management',
    href: '/users',
    icon: Users,
  },
  {
    title: 'API Management',
    href: '/api-management',
    icon: Globe,
    badge: 'New',
  },
  {
    title: 'System Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const location = useLocation()
  const dispatch = useDispatch()
  const { sidebarCollapsed, isMobile } = useSelector((state: RootState) => state.ui)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Auto-expand parent menu if child is active
  React.useEffect(() => {
    navigation.forEach(item => {
      if (item.subItems) {
        const hasActiveChild = item.subItems.some(subItem => location.pathname === subItem.href)
        if (hasActiveChild) {
          setExpandedItems(prev => {
            if (!prev.includes(item.title)) {
              return [...prev, item.title]
            }
            return prev
          })
        }
      }
    })
  }, [location.pathname])

  const handleNavClick = () => {
    if (isMobile && !sidebarCollapsed) {
      setTimeout(() => dispatch(toggleSidebar()), 150)
    }
  }

  const toggleSubmenu = (itemTitle: string) => {
    // Only prevent toggle if sidebar is collapsed - this allows expanding/collapsing when sidebar is open
    if (sidebarCollapsed) return

    setExpandedItems(prev => {
      if (prev.includes(itemTitle)) {
        return prev.filter(title => title !== itemTitle)
      } else {
        return [...prev, itemTitle]
      }
    })
  }

  const sidebarVariants = {
    expanded: {
      width: isMobile ? '320px' : '280px',
      opacity: 1,
      x: 0,
    },
    collapsed: {
      width: isMobile ? '320px' : '70px',
      opacity: isMobile ? 1 : 1,
      x: isMobile ? '-100%' : 0,
    },
  }

  const isItemActive = (item: NavItem) => {
    if (item.href) {
      return location.pathname === item.href
    }
    if (item.subItems) {
      return item.subItems.some(subItem => location.pathname === subItem.href)
    }
    return false
  }

  const getActiveSubItem = (item: NavItem) => {
    if (!item.subItems) return null
    return item.subItems.find(subItem => location.pathname === subItem.href)
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
            <Gamepad2 className='h-8 w-8 text-primary' />
            <span className='text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent'>
              PixenTech CMS
            </span>
          </motion.div>
        ) : (
          <Gamepad2 className='h-8 w-8 text-primary' />
        )}
      </div>

      {/* Navigation */}
      <nav className='flex-1 space-y-1 p-4 overflow-y-auto'>
        {navigation.map(item => {
          const isActive = isItemActive(item)
          const activeSubItem = getActiveSubItem(item)
          const Icon = item.icon
          const isExpanded = expandedItems.includes(item.title)
          const hasSubItems = item.subItems && item.subItems.length > 0

          // Simple item without subitems
          if (!hasSubItems && item.href) {
            return (
              <Link key={item.href} to={item.href} onClick={handleNavClick}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className='h-5 w-5 flex-shrink-0' />
                  {!sidebarCollapsed && (
                    <>
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className='truncate font-medium'
                      >
                        {item.title}
                      </motion.span>
                      {item.badge && (
                        <Badge variant='secondary' className='ml-auto text-xs'>
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </motion.div>
              </Link>
            )
          }

          // Parent item with subitems
          return (
            <div key={item.title}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleSubmenu(item.title)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 cursor-pointer',
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className='h-5 w-5 flex-shrink-0' />
                {!sidebarCollapsed && (
                  <>
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className='truncate font-medium flex-1'
                    >
                      {item.title}
                    </motion.span>
                    <div className='flex items-center gap-2'>
                      {item.badge && (
                        <Badge variant='secondary' className='text-xs'>
                          {item.badge}
                        </Badge>
                      )}
                      {activeSubItem && (
                        <Badge
                          variant='default'
                          className='text-xs bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary-foreground'
                        >
                          {activeSubItem.title}
                        </Badge>
                      )}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className='h-4 w-4' />
                      </motion.div>
                    </div>
                  </>
                )}
              </motion.div>

              {/* Submenu */}
              <AnimatePresence>
                {isExpanded && !sidebarCollapsed && hasSubItems && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className='overflow-hidden'
                  >
                    <div className='ml-8 mt-1 space-y-1'>
                      {item.subItems?.map(subItem => {
                        const isSubActive = location.pathname === subItem.href
                        return (
                          <Link key={subItem.href} to={subItem.href} onClick={handleNavClick}>
                            <motion.div
                              whileHover={{ scale: 1.02, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              className={cn(
                                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200 border-l-2',
                                isSubActive
                                  ? 'bg-primary text-primary-foreground border-l-primary shadow-sm'
                                  : 'text-muted-foreground dark:text-gray-300 hover:bg-accent hover:text-accent-foreground dark:hover:text-white border-l-transparent hover:border-l-primary/30'
                              )}
                            >
                              <div className='flex-1'>
                                <div className='flex items-center gap-2'>
                                  <span className='font-medium'>{subItem.title}</span>
                                  {subItem.badge && (
                                    <Badge
                                      variant={isSubActive ? 'secondary' : 'outline'}
                                      className='text-xs'
                                    >
                                      {subItem.badge}
                                    </Badge>
                                  )}
                                </div>
                                {subItem.description && (
                                  <p
                                    className={cn(
                                      'text-xs mt-0.5',
                                      isSubActive
                                        ? 'text-primary-foreground/80'
                                        : 'text-muted-foreground dark:text-gray-300'
                                    )}
                                  >
                                    {subItem.description}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          </Link>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
