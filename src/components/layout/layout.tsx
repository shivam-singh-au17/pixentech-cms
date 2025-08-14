import React from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { toggleSidebar, setIsMobile } from '@/store/slices/uiSlice'
import { cn } from '@/lib/utils'
import { Sidebar } from './enhanced-sidebar'
import { Header } from './header'

export function Layout() {
  const dispatch = useDispatch()
  const { sidebarCollapsed, isMobile } = useSelector((state: RootState) => state.ui)

  React.useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      const wasMobile = isMobile
      dispatch(setIsMobile(mobile))

      // Auto-expand sidebar when switching from mobile to desktop
      if (!mobile && wasMobile && sidebarCollapsed) {
        dispatch(toggleSidebar())
      }
      // Auto-collapse sidebar when switching to mobile
      else if (mobile && !wasMobile && !sidebarCollapsed) {
        dispatch(toggleSidebar())
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [dispatch, isMobile, sidebarCollapsed])

  return (
    <div className='flex h-screen bg-background'>
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {isMobile && !sidebarCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-40 bg-black/50 lg:hidden'
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Main content */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        <div
          className={cn(
            'relative z-60', // Higher z-index than sidebar
            isMobile && !sidebarCollapsed && 'bg-background/95 backdrop-blur-sm'
          )}
        >
          <Header />
        </div>
        <main
          className={cn(
            'flex-1 overflow-auto',
            isMobile && !sidebarCollapsed && 'pointer-events-none'
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className='container mx-auto p-6'
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
