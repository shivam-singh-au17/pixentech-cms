/**
 * API Test Utility
 * Simple utility to test API connections and authentication
 */

import { apiClient } from './client'
import { getDailySummary } from './summary'

/**
 * Test if API client is properly configured with authentication
 */
export const testApiAuthentication = async (): Promise<boolean> => {
  try {
    const { token } = apiClient.getTokens()

    if (!token) {
      console.log('❌ No authentication token found')
      return false
    }

    console.log('✅ Authentication token found:', token.substring(0, 20) + '...')
    return true
  } catch (error) {
    console.error('❌ API authentication test failed:', error)
    return false
  }
}

/**
 * Test a summary API call
 */
export const testSummaryApi = async (): Promise<boolean> => {
  try {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

    const filters = {
      startDate: startOfDay,
      endDate: endOfDay,
      platform: 'ALL',
      operator: 'ALL',
      brand: 'ALL',
      currency: 'INR',
      pageNo: 1,
      pageSize: 10,
      sortDirection: -1,
    }

    console.log('🔄 Testing Daily Summary API with filters:', filters)

    const response = await getDailySummary(filters)

    console.log('✅ Daily Summary API test successful:', response)
    return true
  } catch (error) {
    console.error('❌ Summary API test failed:', error)
    return false
  }
}

/**
 * Run all API tests
 */
export const runApiTests = async (): Promise<void> => {
  console.log('🧪 Running API Tests...')

  const authTest = await testApiAuthentication()
  const summaryTest = await testSummaryApi()

  console.log('📊 API Test Results:')
  console.log(`  Authentication: ${authTest ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`  Summary API: ${summaryTest ? '✅ PASS' : '❌ FAIL'}`)

  if (authTest && summaryTest) {
    console.log('🎉 All API tests passed!')
  } else {
    console.log('⚠️  Some API tests failed. Check the logs above.')
  }
}
