/**
 * Integration Test Script for Patient Test Reports
 * 
 * This script tests the complete integration of the patient test report system:
 * 1. Verifies database schema is set up correctly
 * 2. Creates test data (patients and test assignments)
 * 3. Tests API endpoints
 * 4. Verifies data flow through the system
 * 
 * Run with: npx tsx scripts/test-reports-integration.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Test 1: Verify database schema
 */
async function testDatabaseSchema() {
  console.log('\n📋 Test 1: Verifying database schema...')
  
  try {
    // Check report_types table
    const { data: reportTypes, error: rtError } = await supabase
      .from('report_types')
      .select('*')
      .limit(1)
    
    if (rtError) throw new Error(`report_types table error: ${rtError.message}`)
    console.log('✅ report_types table exists')
    
    // Check report_fields table
    const { data: reportFields, error: rfError } = await supabase
      .from('report_fields')
      .select('*')
      .limit(1)
    
    if (rfError) throw new Error(`report_fields table error: ${rfError.message}`)
    console.log('✅ report_fields table exists')
    
    // Check report_instances table
    const { data: reportInstances, error: riError } = await supabase
      .from('report_instances')
      .select('*')
      .limit(1)
    
    if (riError) throw new Error(`report_instances table error: ${riError.message}`)
    console.log('✅ report_instances table exists')
    
    // Check report_values table
    const { data: reportValues, error: rvError } = await supabase
      .from('report_values')
      .select('*')
      .limit(1)
    
    if (rvError) throw new Error(`report_values table error: ${rvError.message}`)
    console.log('✅ report_values table exists')
    
    return true
  } catch (error) {
    console.error('❌ Database schema verification failed:', error)
    return false
  }
}

/**
 * Test 2: Verify report type seed data
 */
async function testReportTypeSeedData() {
  console.log('\n📋 Test 2: Verifying report type seed data...')
  
  try {
    // Check Blood Group report type
    const { data: bloodGroup, error: bgError } = await supabase
      .from('report_types')
      .select('*, report_fields(*)')
      .eq('code', 'BLOOD_GROUP')
      .single()
    
    if (bgError) throw new Error(`Blood Group report type error: ${bgError.message}`)
    if (!bloodGroup) throw new Error('Blood Group report type not found')
    
    console.log(`✅ Blood Group report type exists with ${bloodGroup.report_fields?.length || 0} fields`)
    
    // Check CBC report type
    const { data: cbc, error: cbcError } = await supabase
      .from('report_types')
      .select('*, report_fields(*)')
      .eq('code', 'CBC')
      .single()
    
    if (cbcError) throw new Error(`CBC report type error: ${cbcError.message}`)
    if (!cbc) throw new Error('CBC report type not found')
    
    console.log(`✅ CBC report type exists with ${cbc.report_fields?.length || 0} fields`)
    
    return { bloodGroupId: bloodGroup.id, cbcId: cbc.id }
  } catch (error) {
    console.error('❌ Report type seed data verification failed:', error)
    return null
  }
}

/**
 * Test 3: Create test patients and test assignments
 */
async function createTestData() {
  console.log('\n📋 Test 3: Creating test data...')
  
  try {
    // Get current user for assigned_by field
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.log('⚠️  No authenticated user found. Test assignments will need a valid user.')
      console.log('   Please ensure you are logged in to the application.')
      return null
    }
    
    // Create test patient 1
    const { data: patient1, error: p1Error } = await supabase
      .from('patients')
      .upsert({
        mobile_number: '+91-555-0101',
        title: 'Mr.',
        first_name: 'John',
        last_name: 'Doe',
        sex: 'Male',
        age_years: 35,
        age_months: 0,
        age_days: 0,
        created_by: user.id
      }, { onConflict: 'mobile_number' })
      .select()
      .single()
    
    if (p1Error) throw new Error(`Patient 1 creation error: ${p1Error.message}`)
    console.log('✅ Test patient 1 created: John Doe')
    
    // Create test patient 2
    const { data: patient2, error: p2Error } = await supabase
      .from('patients')
      .upsert({
        mobile_number: '+91-555-0102',
        title: 'Ms.',
        first_name: 'Jane',
        last_name: 'Smith',
        sex: 'Female',
        age_years: 28,
        age_months: 0,
        age_days: 0,
        created_by: user.id
      }, { onConflict: 'mobile_number' })
      .select()
      .single()
    
    if (p2Error) throw new Error(`Patient 2 creation error: ${p2Error.message}`)
    console.log('✅ Test patient 2 created: Jane Smith')
    
    // Create test assignments for patient 1
    const { data: assignment1, error: a1Error } = await supabase
      .from('test_assignments')
      .upsert({
        patient_id: patient1.id,
        test_type: 'BG', // Maps to BLOOD_GROUP
        assigned_by: user.id,
        status: 'pending'
      }, { onConflict: 'patient_id,test_type' })
      .select()
      .single()
    
    if (a1Error) throw new Error(`Assignment 1 creation error: ${a1Error.message}`)
    console.log('✅ Blood Group test assigned to John Doe')
    
    const { data: assignment2, error: a2Error } = await supabase
      .from('test_assignments')
      .upsert({
        patient_id: patient1.id,
        test_type: 'CBC', // Maps to CBC
        assigned_by: user.id,
        status: 'pending'
      }, { onConflict: 'patient_id,test_type' })
      .select()
      .single()
    
    if (a2Error) throw new Error(`Assignment 2 creation error: ${a2Error.message}`)
    console.log('✅ CBC test assigned to John Doe')
    
    // Create test assignment for patient 2
    const { data: assignment3, error: a3Error } = await supabase
      .from('test_assignments')
      .upsert({
        patient_id: patient2.id,
        test_type: 'BG', // Maps to BLOOD_GROUP
        assigned_by: user.id,
        status: 'pending'
      }, { onConflict: 'patient_id,test_type' })
      .select()
      .single()
    
    if (a3Error) throw new Error(`Assignment 3 creation error: ${a3Error.message}`)
    console.log('✅ Blood Group test assigned to Jane Smith')
    
    return {
      patient1,
      patient2,
      assignment1,
      assignment2,
      assignment3
    }
  } catch (error) {
    console.error('❌ Test data creation failed:', error)
    return null
  }
}

/**
 * Test 4: Test API endpoints
 */
async function testAPIEndpoints() {
  console.log('\n📋 Test 4: Testing API endpoints...')
  
  try {
    const baseUrl = 'http://localhost:3000'
    
    // Test GET /api/reports/patients
    console.log('Testing GET /api/reports/patients...')
    const patientsResponse = await fetch(`${baseUrl}/api/reports/patients`)
    if (!patientsResponse.ok) {
      throw new Error(`Patients API failed: ${patientsResponse.status}`)
    }
    const patientsData = await patientsResponse.json()
    console.log(`✅ Patients API returned ${patientsData.patients?.length || 0} patients`)
    
    if (patientsData.patients && patientsData.patients.length > 0) {
      const firstPatient = patientsData.patients[0]
      
      // Test GET /api/reports/types/BLOOD_GROUP
      console.log('Testing GET /api/reports/types/BLOOD_GROUP...')
      const bloodGroupResponse = await fetch(`${baseUrl}/api/reports/types/BLOOD_GROUP`)
      if (!bloodGroupResponse.ok) {
        throw new Error(`Blood Group type API failed: ${bloodGroupResponse.status}`)
      }
      const bloodGroupData = await bloodGroupResponse.json()
      console.log(`✅ Blood Group type API returned ${bloodGroupData.fields?.length || 0} fields`)
      
      // Test GET /api/reports/types/CBC
      console.log('Testing GET /api/reports/types/CBC...')
      const cbcResponse = await fetch(`${baseUrl}/api/reports/types/CBC`)
      if (!cbcResponse.ok) {
        throw new Error(`CBC type API failed: ${cbcResponse.status}`)
      }
      const cbcData = await cbcResponse.json()
      console.log(`✅ CBC type API returned ${cbcData.fields?.length || 0} fields`)
      
      // Test with first test assignment
      if (firstPatient.testAssignments && firstPatient.testAssignments.length > 0) {
        const firstAssignment = firstPatient.testAssignments[0]
        
        // Test GET /api/reports/instances/[testAssignmentId]
        console.log(`Testing GET /api/reports/instances/${firstAssignment.id}...`)
        const instanceResponse = await fetch(`${baseUrl}/api/reports/instances/${firstAssignment.id}`)
        if (!instanceResponse.ok) {
          throw new Error(`Instance API failed: ${instanceResponse.status}`)
        }
        const instanceData = await instanceResponse.json()
        console.log(`✅ Instance API returned data (instance exists: ${!!instanceData.reportInstance})`)
      }
    }
    
    return true
  } catch (error) {
    console.error('❌ API endpoint testing failed:', error)
    return false
  }
}

/**
 * Test 5: Test save operation
 */
async function testSaveOperation() {
  console.log('\n📋 Test 5: Testing save operation...')
  
  try {
    const baseUrl = 'http://localhost:3000'
    
    // Get a test assignment
    const patientsResponse = await fetch(`${baseUrl}/api/reports/patients`)
    const patientsData = await patientsResponse.json()
    
    if (!patientsData.patients || patientsData.patients.length === 0) {
      throw new Error('No patients found for save test')
    }
    
    const firstPatient = patientsData.patients[0]
    const bloodGroupAssignment = firstPatient.testAssignments?.find(
      (a: any) => a.reportTypeCode === 'BLOOD_GROUP'
    )
    
    if (!bloodGroupAssignment) {
      throw new Error('No Blood Group assignment found for save test')
    }
    
    // Get report type ID
    const typeResponse = await fetch(`${baseUrl}/api/reports/types/BLOOD_GROUP`)
    const typeData = await typeResponse.json()
    
    // Test save operation
    console.log('Testing POST /api/reports/instances...')
    const saveResponse = await fetch(`${baseUrl}/api/reports/instances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        testAssignmentId: bloodGroupAssignment.id,
        reportTypeId: typeData.reportType.id,
        values: {
          blood_group: 'A',
          rh_factor: 'POSITIVE'
        }
      })
    })
    
    if (!saveResponse.ok) {
      const errorData = await saveResponse.json()
      throw new Error(`Save operation failed: ${errorData.message || saveResponse.status}`)
    }
    
    const saveData = await saveResponse.json()
    console.log(`✅ Save operation successful (status: ${saveData.reportInstance?.status})`)
    
    // Verify the saved data can be retrieved
    console.log('Verifying saved data can be retrieved...')
    const retrieveResponse = await fetch(`${baseUrl}/api/reports/instances/${bloodGroupAssignment.id}`)
    const retrieveData = await retrieveResponse.json()
    
    if (retrieveData.values.blood_group !== 'A' || retrieveData.values.rh_factor !== 'POSITIVE') {
      throw new Error('Retrieved data does not match saved data')
    }
    
    console.log('✅ Saved data retrieved successfully')
    
    return true
  } catch (error) {
    console.error('❌ Save operation testing failed:', error)
    return false
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🚀 Starting Patient Test Reports Integration Tests')
  console.log('=' .repeat(60))
  
  let allTestsPassed = true
  
  // Test 1: Database schema
  const schemaTest = await testDatabaseSchema()
  if (!schemaTest) {
    allTestsPassed = false
    console.log('\n⚠️  Skipping remaining tests due to schema issues')
    return
  }
  
  // Test 2: Report type seed data
  const seedTest = await testReportTypeSeedData()
  if (!seedTest) {
    allTestsPassed = false
    console.log('\n⚠️  Skipping remaining tests due to seed data issues')
    return
  }
  
  // Test 3: Create test data
  const testData = await createTestData()
  if (!testData) {
    allTestsPassed = false
    console.log('\n⚠️  Skipping remaining tests due to test data creation issues')
    return
  }
  
  // Test 4: API endpoints
  const apiTest = await testAPIEndpoints()
  if (!apiTest) {
    allTestsPassed = false
  }
  
  // Test 5: Save operation
  const saveTest = await testSaveOperation()
  if (!saveTest) {
    allTestsPassed = false
  }
  
  // Summary
  console.log('\n' + '='.repeat(60))
  if (allTestsPassed) {
    console.log('✅ All integration tests passed!')
    console.log('\n📝 Next steps:')
    console.log('1. Open http://localhost:3000/reports in your browser')
    console.log('2. You should see test patients: John Doe and Jane Smith')
    console.log('3. Click on a patient to view their test assignments')
    console.log('4. Click on a test to expand the report form')
    console.log('5. Enter data and save')
    console.log('6. Test keyboard navigation with arrow keys')
  } else {
    console.log('❌ Some integration tests failed')
    console.log('Please review the errors above and fix any issues')
  }
}

// Run the tests
runTests().catch(console.error)
