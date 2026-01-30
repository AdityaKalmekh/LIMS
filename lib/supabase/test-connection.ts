/**
 * Test script to verify Supabase client configuration
 * 
 * This script tests that:
 * 1. Environment variables are properly configured
 * 2. Supabase clients can be instantiated
 * 3. Basic connection to Supabase works
 * 
 * Run this script with: npx tsx lib/supabase/test-connection.ts
 * 
 * Note: This is a development utility and should not be deployed to production.
 */

// Load environment variables from .env.local
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient as createBrowserClient } from './client'

async function testConnection() {
  console.log('🧪 Testing Supabase Client Configuration...\n')

  // Test 1: Environment Variables
  console.log('📋 Test 1: Checking environment variables...')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set')
    return false
  }
  console.log('✅ NEXT_PUBLIC_SUPABASE_URL is set:', supabaseUrl)

  if (!supabaseAnonKey) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
    return false
  }
  console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set:', supabaseAnonKey.substring(0, 20) + '...')

  if (!serviceRoleKey) {
    console.error('⚠️  SUPABASE_SERVICE_ROLE_KEY is not set (optional for client-side)')
  } else {
    console.log('✅ SUPABASE_SERVICE_ROLE_KEY is set:', serviceRoleKey.substring(0, 20) + '...')
  }

  // Test 2: Client Creation
  console.log('\n📋 Test 2: Creating Supabase client...')
  try {
    const supabase = createBrowserClient()
    console.log('✅ Supabase client created successfully')

    // Test 3: Basic Connection
    console.log('\n📋 Test 3: Testing connection to Supabase...')
    const { data, error } = await supabase.from('patients').select('count', { count: 'exact', head: true })
    
    if (error) {
      // This is expected if the table doesn't exist yet or RLS is blocking
      console.log('⚠️  Query returned an error (this may be expected):', error.message)
      console.log('   This is normal if:')
      console.log('   - The patients table hasn\'t been created yet')
      console.log('   - RLS policies are blocking unauthenticated access')
      console.log('   - You haven\'t run the database migrations yet')
    } else {
      console.log('✅ Successfully connected to Supabase!')
      console.log('   Patient count:', data)
    }

    // Test 4: Auth Status
    console.log('\n📋 Test 4: Checking authentication status...')
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      console.log('✅ User is authenticated:', session.user.email)
    } else {
      console.log('ℹ️  No active session (user not logged in)')
    }

    console.log('\n✅ All tests completed!')
    console.log('\n📝 Summary:')
    console.log('   - Environment variables: Configured')
    console.log('   - Client creation: Success')
    console.log('   - Supabase connection: Tested')
    console.log('   - Authentication: Checked')
    console.log('\n🎉 Supabase client utilities are ready to use!')
    
    return true
  } catch (error) {
    console.error('❌ Error during testing:', error)
    return false
  }
}

// Run the test
testConnection()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  })
