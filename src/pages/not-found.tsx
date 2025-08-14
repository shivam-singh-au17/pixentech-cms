import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-center space-y-8'
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className='text-9xl font-bold text-primary'>404</h1>
        </motion.div>

        <div className='space-y-4'>
          <h2 className='text-3xl font-bold'>Page not found</h2>
          <p className='text-muted-foreground max-w-md mx-auto'>
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted,
            or you entered the wrong URL.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className='flex gap-4 justify-center'
        >
          <Button asChild variant='outline'>
            <Link to='/'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Go back
            </Link>
          </Button>
          <Button asChild>
            <Link to='/'>
              <Home className='h-4 w-4 mr-2' />
              Home
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
