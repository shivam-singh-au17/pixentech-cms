import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/layout'
import { ProtectedRoute, PublicRoute } from './protected-route'
import { Dashboard } from '@/pages/dashboard'
import { Login } from '@/pages/login'
import { NotFound } from '@/pages/not-found'

// Summary Pages
import { DailySummaryPage } from '@/pages/summary/daily'
import { GameSummaryPage } from '@/pages/summary/game'
import { PlayerSummaryPage } from '@/pages/summary/player'
import { PlayerGameSummaryPage } from '@/pages/summary/playerGame'

// Game Management
import GameManagementPage from '@/pages/games/management'

// User Management
import UserManagement from '@/pages/users/management'

// API Management
import ApiManagementPage from '@/pages/api-management'

// Reports
import { TransactionReportsPage } from '@/pages/reports/transactions'
import { TransactionDetailsPage } from '@/pages/reports/transaction-details'

// Settings
import { Settings } from '@/pages/settings/general'

// Platform Management
import { PlatformManagementPage } from '@/pages/platform/management'
import { OperatorManagementPage } from '@/pages/operator/management'
import { BrandManagementPage } from '@/pages/brand/management'

// Operator Game Management
import OperatorGameManagementPage from '@/pages/operatorGame/management'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'summary',
        children: [
          {
            path: 'daily',
            element: <DailySummaryPage />,
          },
          {
            path: 'game',
            element: <GameSummaryPage />,
          },
          {
            path: 'player',
            element: <PlayerSummaryPage />,
          },
          {
            path: 'player-game',
            element: <PlayerGameSummaryPage />,
          },
        ],
      },
      {
        path: 'reports',
        children: [
          {
            index: true,
            element: <Navigate to='/reports/transactions' replace />,
          },
          {
            path: 'transactions',
            element: <TransactionReportsPage />,
          },
          {
            path: 'transactions/:betTxnId',
            element: <TransactionDetailsPage />,
          },
        ],
      },
      {
        path: 'platforms',
        element: <PlatformManagementPage />,
      },
      {
        path: 'operators',
        element: <OperatorManagementPage />,
      },
      {
        path: 'brands',
        element: <BrandManagementPage />,
      },
      {
        path: 'games',
        element: <GameManagementPage />,
      },
      {
        path: 'operator-games',
        element: <OperatorGameManagementPage />,
      },
      {
        path: 'users',
        element: <UserManagement />,
      },
      {
        path: 'api-management',
        element: <ApiManagementPage />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '/404',
    element: <NotFound />,
  },
  {
    path: '*',
    element: <Navigate to='/404' replace />,
  },
])
