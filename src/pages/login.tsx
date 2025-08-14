/**
 * Login Page Component
 * Provides authentication form with API integration
 */

import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail, LogIn } from 'lucide-react'

import { RootState } from '@/store'
import { loginUser } from '@/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// Validation schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { isLoading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  const [showPassword, setShowPassword] = React.useState(false)

  const from = (location.state as any)?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Redirect if already authenticated
  React.useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, user: !!user })
    if (isAuthenticated) {
      console.log('User is authenticated, navigating to:', from)
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('Login form submitted with:', { email: data.email })
      clearErrors()

      const result = await dispatch(loginUser(data) as any)

      console.log('Login result:', result)

      if (loginUser.fulfilled.match(result)) {
        console.log('Login successful! Auth state should be updated.')
        // Navigation will happen automatically via useEffect when isAuthenticated becomes true
      } else if (loginUser.rejected.match(result)) {
        console.error('Login failed with payload:', result.payload)
      }
    } catch (error) {
      console.error('Login submission error:', error)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        <div className='bg-card p-8 rounded-lg shadow-xl border'>
          <div className='text-center mb-8'>
            <div className='w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4'>
              <Lock className='w-6 h-6 text-primary-foreground' />
            </div>
            <h1 className='text-2xl font-bold'>Welcome back</h1>
            <p className='text-muted-foreground mt-2'>Sign in to your account to continue</p>
          </div>

          {error && (
            <div className='mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg'>
              <p className='text-sm text-destructive'>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <label htmlFor='email' className='text-sm font-medium'>
                Email
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                <Input
                  id='email'
                  type='email'
                  placeholder='Enter your email'
                  className={cn('pl-10', errors.email && 'border-red-500 focus:border-red-500')}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className='text-sm text-red-600'>{errors.email.message}</p>}
            </div>

            <div className='space-y-2'>
              <label htmlFor='password' className='text-sm font-medium'>
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter your password'
                  className={cn(
                    'pl-10 pr-10',
                    errors.password && 'border-red-500 focus:border-red-500'
                  )}
                  {...register('password')}
                />
                <button
                  type='button'
                  onClick={togglePasswordVisibility}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                </button>
              </div>
              {errors.password && <p className='text-sm text-red-600'>{errors.password.message}</p>}
            </div>

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? (
                <div className='flex items-center justify-center'>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
                  Signing in...
                </div>
              ) : (
                <div className='flex items-center justify-center'>
                  <LogIn className='w-4 h-4 mr-2' />
                  Sign In
                </div>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
