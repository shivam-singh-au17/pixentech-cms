/**
 * Toast Hook
 * Simple toast utilities
 */

import * as React from 'react'

interface ToastMessage {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([])

  const toast = React.useCallback((message: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts(prev => [...prev, { id, ...message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }, [])

  const success = React.useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: 'default' })
    },
    [toast]
  )

  const error = React.useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: 'destructive' })
    },
    [toast]
  )

  const dismiss = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return {
    toast,
    success,
    error,
    dismiss,
    toasts,
  }
}

export { useToast }
