/**
 * API Test - Temporary file to test the login API
 * This file can be deleted after testing
 */

// Test the actual API response format
const testLogin = async () => {
  try {
    const response = await fetch('https://be.pixentech.com/bo/cms/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test-user1@example.com',
        password: 'TestUser123456',
      }),
    })

    const data = await response.json()
    console.log('API Response Status:', response.status)
    console.log('API Response Data:', data)

    return data
  } catch (error) {
    console.error('API Test Error:', error)
  }
}

// Uncomment the line below to test the API
// testLogin();

export { testLogin }
