/**
 * Settings Page
 * Platform configuration and settings management
 */

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Palette,
  Database,
  Key,
  Globe,
  Smartphone,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react'

export function Settings() {
  const [showPassword, setShowPassword] = useState(false)
  const [activeSection, setActiveSection] = useState('general')

  const settingsSections = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Database },
  ]

  const renderGeneralSettings = () => (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium mb-2 block'>Platform Name</label>
              <Input defaultValue='Crash.Live Gaming Platform' />
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>Default Currency</label>
              <Input defaultValue='INR' />
            </div>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium mb-2 block'>Timezone</label>
              <Input defaultValue='Asia/Kolkata' />
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>Language</label>
              <Input defaultValue='English' />
            </div>
          </div>
          <div>
            <label className='text-sm font-medium mb-2 block'>Platform Description</label>
            <Input defaultValue='Premier online gaming platform with secure transactions' />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Game Settings</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium mb-2 block'>Minimum Bet Amount</label>
              <Input defaultValue='10' type='number' />
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>Maximum Bet Amount</label>
              <Input defaultValue='50000' type='number' />
            </div>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium mb-2 block'>Session Timeout (minutes)</label>
              <Input defaultValue='30' type='number' />
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>Max Concurrent Games</label>
              <Input defaultValue='3' type='number' />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderProfileSettings = () => (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Admin Profile</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center gap-4 mb-6'>
            <div className='h-20 w-20 rounded-lg bg-primary/10 flex items-center justify-center'>
              <User className='h-10 w-10 text-primary' />
            </div>
            <div>
              <h3 className='font-medium'>Admin User</h3>
              <p className='text-sm text-muted-foreground'>Platform Administrator</p>
              <Button variant='outline' size='sm' className='mt-2'>
                Change Avatar
              </Button>
            </div>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium mb-2 block'>First Name</label>
              <Input defaultValue='Admin' />
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>Last Name</label>
              <Input defaultValue='User' />
            </div>
          </div>
          <div>
            <label className='text-sm font-medium mb-2 block'>Email Address</label>
            <Input defaultValue='admin@crash.live.com' type='email' />
          </div>
          <div>
            <label className='text-sm font-medium mb-2 block'>Phone Number</label>
            <Input defaultValue='+91 9876543210' />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Password & Authentication</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <label className='text-sm font-medium mb-2 block'>Current Password</label>
            <div className='relative'>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter current password'
              />
              <Button
                variant='ghost'
                size='sm'
                className='absolute right-2 top-1/2 transform -translate-y-1/2'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              </Button>
            </div>
          </div>
          <div>
            <label className='text-sm font-medium mb-2 block'>New Password</label>
            <Input type='password' placeholder='Enter new password' />
          </div>
          <div>
            <label className='text-sm font-medium mb-2 block'>Confirm New Password</label>
            <Input type='password' placeholder='Confirm new password' />
          </div>
          <Button className='w-full'>
            <Key className='h-4 w-4 mr-2' />
            Update Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h4 className='font-medium'>SMS Authentication</h4>
              <p className='text-sm text-muted-foreground'>Receive codes via SMS</p>
            </div>
            <Badge variant='outline' className='bg-green-100 text-green-800'>
              Enabled
            </Badge>
          </div>
          <div className='flex items-center justify-between'>
            <div>
              <h4 className='font-medium'>App Authentication</h4>
              <p className='text-sm text-muted-foreground'>Use authenticator app</p>
            </div>
            <Badge variant='outline' className='bg-gray-100 text-gray-800'>
              Disabled
            </Badge>
          </div>
          <Button variant='outline' className='w-full'>
            <Smartphone className='h-4 w-4 mr-2' />
            Configure 2FA
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {[
            { label: 'System Alerts', description: 'Critical system notifications', enabled: true },
            {
              label: 'User Registration',
              description: 'New user signup notifications',
              enabled: true,
            },
            {
              label: 'Large Transactions',
              description: 'High-value transaction alerts',
              enabled: true,
            },
            {
              label: 'Game Issues',
              description: 'Game-related problem notifications',
              enabled: false,
            },
            { label: 'Weekly Reports', description: 'Automated weekly reports', enabled: true },
          ].map((notification, index) => (
            <div key={index} className='flex items-center justify-between'>
              <div>
                <h4 className='font-medium'>{notification.label}</h4>
                <p className='text-sm text-muted-foreground'>{notification.description}</p>
              </div>
              <Badge
                variant='outline'
                className={
                  notification.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }
              >
                {notification.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h4 className='font-medium'>Browser Notifications</h4>
              <p className='text-sm text-muted-foreground'>Real-time browser alerts</p>
            </div>
            <Badge variant='outline' className='bg-green-100 text-green-800'>
              Enabled
            </Badge>
          </div>
          <Button variant='outline' className='w-full'>
            <Bell className='h-4 w-4 mr-2' />
            Test Notification
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderAppearanceSettings = () => (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <label className='text-sm font-medium mb-2 block'>Theme Mode</label>
            <div className='flex gap-2'>
              <Button variant='default' size='sm'>
                Light
              </Button>
              <Button variant='outline' size='sm'>
                Dark
              </Button>
              <Button variant='outline' size='sm'>
                Auto
              </Button>
            </div>
          </div>
          <div>
            <label className='text-sm font-medium mb-2 block'>Primary Color</label>
            <div className='flex gap-2'>
              <div className='h-10 w-10 rounded-lg bg-blue-600 cursor-pointer border-2 border-blue-600'></div>
              <div className='h-10 w-10 rounded-lg bg-green-600 cursor-pointer border-2 border-transparent'></div>
              <div className='h-10 w-10 rounded-lg bg-purple-600 cursor-pointer border-2 border-transparent'></div>
              <div className='h-10 w-10 rounded-lg bg-orange-600 cursor-pointer border-2 border-transparent'></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layout Settings</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h4 className='font-medium'>Compact Sidebar</h4>
              <p className='text-sm text-muted-foreground'>Use smaller sidebar icons</p>
            </div>
            <Badge variant='outline' className='bg-gray-100 text-gray-800'>
              Disabled
            </Badge>
          </div>
          <div className='flex items-center justify-between'>
            <div>
              <h4 className='font-medium'>Sticky Header</h4>
              <p className='text-sm text-muted-foreground'>Keep header visible when scrolling</p>
            </div>
            <Badge variant='outline' className='bg-green-100 text-green-800'>
              Enabled
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderIntegrationSettings = () => (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <label className='text-sm font-medium mb-2 block'>API Base URL</label>
            <Input defaultValue='https://api.crash.live.com/v1' />
          </div>
          <div>
            <label className='text-sm font-medium mb-2 block'>API Key</label>
            <div className='flex gap-2'>
              <Input defaultValue='pk_live_xxxxxxxxxxxxxxxx' type='password' className='flex-1' />
              <Button variant='outline'>Regenerate</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Gateways</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {[
            { name: 'Razorpay', status: 'connected', icon: Globe },
            { name: 'PayU', status: 'connected', icon: Globe },
            { name: 'Paytm', status: 'disconnected', icon: Globe },
            { name: 'UPI Gateway', status: 'connected', icon: Smartphone },
          ].map((gateway, index) => (
            <div
              key={index}
              className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'
            >
              <div className='flex items-center gap-3'>
                <gateway.icon className='h-5 w-5 text-muted-foreground' />
                <span className='font-medium'>{gateway.name}</span>
              </div>
              <Badge
                variant='outline'
                className={
                  gateway.status === 'connected'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }
              >
                {gateway.status === 'connected' ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings()
      case 'profile':
        return renderProfileSettings()
      case 'security':
        return renderSecuritySettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'appearance':
        return renderAppearanceSettings()
      case 'integrations':
        return renderIntegrationSettings()
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Settings</h1>
          <p className='text-muted-foreground mt-1'>
            Manage platform configuration and preferences
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm'>
            <RefreshCw className='h-4 w-4 mr-2' />
            Reset to Defaults
          </Button>
          <Button size='sm'>
            <Save className='h-4 w-4 mr-2' />
            Save Changes
          </Button>
        </div>
      </div>

      <div className='flex gap-6'>
        {/* Settings Navigation */}
        <Card className='w-64 h-fit'>
          <CardContent className='p-4'>
            <nav className='space-y-1'>
              {settingsSections.map(section => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? 'default' : 'ghost'}
                  className='w-full justify-start'
                  onClick={() => setActiveSection(section.id)}
                >
                  <section.icon className='h-4 w-4 mr-2' />
                  {section.label}
                </Button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className='flex-1'>{renderSectionContent()}</div>
      </div>
    </div>
  )
}
