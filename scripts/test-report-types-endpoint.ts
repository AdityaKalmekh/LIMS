/**
 * Manual Test Script for Report Types API Endpoint
 * 
 * This script tests the GET /api/reports/types/[reportTypeCode] endpoint
 * by making actual HTTP requests to the running development server.
 * 
 * Prerequisites:
 * 1. Start the development server: npm run dev
 * 2. Ensure database migrations have been applied
 * 3. Have a valid user account for authentication
 * 
 * Usage:
 * ts-node scripts/test-report-types-endpoint.ts
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

async function testReportTypesEndpoint() {
  console.log('🧪 Testing Report Types API Endpoint\n')
  console.log('=' .repeat(60))

  // Initialize Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  // Sign in (you may need to adjust credentials)
  console.log('\n📝 Authenticating...')
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'testpassword123'
  })

  if (authError || !authData.session) {
    console.error('❌ Authentication failed:', authError?.message)
    console.log('\n💡 Tip: Set TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables')
    return
  }

  const accessToken = authData.session.access_token
  console.log('✅ Authenticated successfully')

  // Test 1: Fetch Blood Group report type
  console.log('\n' + '='.repeat(60))
  console.log('Test 1: Fetch Blood Group Report Type')
  console.log('='.repeat(60))

  try {
    const response = await fetch(`${API_BASE_URL}/api/reports/types/BLOOD_GROUP`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    console.log(`Status: ${response.status} ${response.statusText}`)

    const data = await response.json()

    if (response.ok) {
      console.log('✅ Success!')
      console.log('\nReport Type:')
      console.log(`  Code: ${data.reportType.code}`)
      console.log(`  Name: ${data.reportType.name}`)
      console.log(`  Description: ${data.reportType.description}`)
      console.log(`  Active: ${data.reportType.isActive}`)

      console.log(`\nFields (${data.fields.length}):`)
      data.fields.forEach((field: any, index: number) => {
        console.log(`  ${index + 1}. ${field.fieldLabel} (${field.fieldType})`)
        console.log(`     - Name: ${field.fieldName}`)
        console.log(`     - Order: ${field.fieldOrder}`)
        console.log(`     - Required: ${field.isRequired}`)
        if (field.dropdownOptions) {
          console.log(`     - Options: ${field.dropdownOptions.join(', ')}`)
        }
      })
    } else {
      console.log('❌ Failed!')
      console.log('Error:', data)
    }
  } catch (error) {
    console.error('❌ Request failed:', error)
  }

  // Test 2: Fetch CBC report type
  console.log('\n' + '='.repeat(60))
  console.log('Test 2: Fetch CBC Report Type')
  console.log('='.repeat(60))

  try {
    const response = await fetch(`${API_BASE_URL}/api/reports/types/CBC`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    console.log(`Status: ${response.status} ${response.statusText}`)

    const data = await response.json()

    if (response.ok) {
      console.log('✅ Success!')
      console.log('\nReport Type:')
      console.log(`  Code: ${data.reportType.code}`)
      console.log(`  Name: ${data.reportType.name}`)

      console.log(`\nFields (${data.fields.length}):`)
      
      // Show first 3 fields in detail
      data.fields.slice(0, 3).forEach((field: any, index: number) => {
        console.log(`  ${index + 1}. ${field.fieldLabel} (${field.fieldType})`)
        console.log(`     - Name: ${field.fieldName}`)
        console.log(`     - Order: ${field.fieldOrder}`)
        console.log(`     - Required: ${field.isRequired}`)
        if (field.unit) {
          console.log(`     - Unit: ${field.unit}`)
        }
        if (field.normalRangeText) {
          console.log(`     - Normal Range: ${field.normalRangeText}`)
        }
      })

      if (data.fields.length > 3) {
        console.log(`  ... and ${data.fields.length - 3} more fields`)
      }

      // Verify fields are ordered
      const fieldOrders = data.fields.map((f: any) => f.fieldOrder)
      const isOrdered = fieldOrders.every((order: number, i: number) => 
        i === 0 || order >= fieldOrders[i - 1]
      )
      console.log(`\n✅ Fields are properly ordered: ${isOrdered}`)
    } else {
      console.log('❌ Failed!')
      console.log('Error:', data)
    }
  } catch (error) {
    console.error('❌ Request failed:', error)
  }

  // Test 3: Invalid report type code
  console.log('\n' + '='.repeat(60))
  console.log('Test 3: Invalid Report Type Code (should return 404)')
  console.log('='.repeat(60))

  try {
    const response = await fetch(`${API_BASE_URL}/api/reports/types/INVALID_CODE`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    console.log(`Status: ${response.status} ${response.statusText}`)

    const data = await response.json()

    if (response.status === 404) {
      console.log('✅ Correctly returned 404!')
      console.log('Error message:', data.message)
    } else {
      console.log('❌ Expected 404 but got:', response.status)
      console.log('Response:', data)
    }
  } catch (error) {
    console.error('❌ Request failed:', error)
  }

  // Test 4: Unauthenticated request
  console.log('\n' + '='.repeat(60))
  console.log('Test 4: Unauthenticated Request (should return 401)')
  console.log('='.repeat(60))

  try {
    const response = await fetch(`${API_BASE_URL}/api/reports/types/BLOOD_GROUP`)

    console.log(`Status: ${response.status} ${response.statusText}`)

    const data = await response.json()

    if (response.status === 401) {
      console.log('✅ Correctly returned 401!')
      console.log('Error message:', data.message)
    } else {
      console.log('❌ Expected 401 but got:', response.status)
      console.log('Response:', data)
    }
  } catch (error) {
    console.error('❌ Request failed:', error)
  }

  // Test 5: Verify camelCase transformation
  console.log('\n' + '='.repeat(60))
  console.log('Test 5: Verify camelCase Transformation')
  console.log('='.repeat(60))

  try {
    const response = await fetch(`${API_BASE_URL}/api/reports/types/BLOOD_GROUP`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    const data = await response.json()

    if (response.ok) {
      const reportType = data.reportType
      const field = data.fields[0]

      const hasCamelCase = 
        reportType.hasOwnProperty('isActive') &&
        reportType.hasOwnProperty('createdAt') &&
        reportType.hasOwnProperty('updatedAt') &&
        field.hasOwnProperty('reportTypeId') &&
        field.hasOwnProperty('fieldName') &&
        field.hasOwnProperty('fieldLabel') &&
        field.hasOwnProperty('fieldType') &&
        field.hasOwnProperty('fieldOrder') &&
        field.hasOwnProperty('isRequired') &&
        field.hasOwnProperty('normalRangeMin') &&
        field.hasOwnProperty('normalRangeMax') &&
        field.hasOwnProperty('normalRangeText') &&
        field.hasOwnProperty('dropdownOptions') &&
        field.hasOwnProperty('defaultValue') &&
        field.hasOwnProperty('validationRules')

      const hasSnakeCase = 
        reportType.hasOwnProperty('is_active') ||
        reportType.hasOwnProperty('created_at') ||
        field.hasOwnProperty('report_type_id') ||
        field.hasOwnProperty('field_name') ||
        field.hasOwnProperty('is_required')

      if (hasCamelCase && !hasSnakeCase) {
        console.log('✅ Correctly transformed to camelCase!')
        console.log('Sample properties:')
        console.log(`  - reportType.isActive: ${reportType.isActive}`)
        console.log(`  - reportType.createdAt: ${reportType.createdAt}`)
        console.log(`  - field.fieldName: ${field.fieldName}`)
        console.log(`  - field.isRequired: ${field.isRequired}`)
      } else {
        console.log('❌ Transformation issue detected!')
        console.log(`  Has camelCase: ${hasCamelCase}`)
        console.log(`  Has snake_case: ${hasSnakeCase}`)
      }
    }
  } catch (error) {
    console.error('❌ Request failed:', error)
  }

  // Clean up: sign out
  await supabase.auth.signOut()

  console.log('\n' + '='.repeat(60))
  console.log('✅ All tests completed!')
  console.log('='.repeat(60))
}

// Run the tests
testReportTypesEndpoint().catch(console.error)
