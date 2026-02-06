/**
 * Manual Test Script for Status Calculator
 * 
 * This script manually tests the calculateReportStatus function
 * to verify it works correctly before Jest is set up.
 * 
 * Run with: npx tsx scripts/test-status-calculator.ts
 */

import { calculateReportStatus, getReportCompletionSummary } from '../lib/utils/status-calculator'
import { ReportField } from '../types/reports'

// Test data
const bloodGroupFields: ReportField[] = [
  {
    id: '1',
    reportTypeId: 'type1',
    fieldName: 'blood_group',
    fieldLabel: 'Blood Group',
    fieldType: 'dropdown',
    fieldOrder: 1,
    isRequired: true,
    unit: null,
    normalRangeMin: null,
    normalRangeMax: null,
    normalRangeText: null,
    dropdownOptions: ['A', 'B', 'AB', 'O'],
    defaultValue: null,
    validationRules: null,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    reportTypeId: 'type1',
    fieldName: 'rh_factor',
    fieldLabel: 'Rh Factor',
    fieldType: 'dropdown',
    fieldOrder: 2,
    isRequired: true,
    unit: null,
    normalRangeMin: null,
    normalRangeMax: null,
    normalRangeText: null,
    dropdownOptions: ['POSITIVE', 'NEGATIVE'],
    defaultValue: null,
    validationRules: null,
    createdAt: '2024-01-01'
  }
]

console.log('Testing Status Calculator...\n')

// Test 1: Pending status - no values
console.log('Test 1: Pending status (no values)')
const status1 = calculateReportStatus(bloodGroupFields, {})
console.log(`Expected: pending, Got: ${status1}`)
console.log(`✓ PASS: ${status1 === 'pending' ? 'YES' : 'NO'}\n`)

// Test 2: In-progress status - some values
console.log('Test 2: In-progress status (some values)')
const status2 = calculateReportStatus(bloodGroupFields, { blood_group: 'A' })
console.log(`Expected: in-progress, Got: ${status2}`)
console.log(`✓ PASS: ${status2 === 'in-progress' ? 'YES' : 'NO'}\n`)

// Test 3: Completed status - all values
console.log('Test 3: Completed status (all values)')
const status3 = calculateReportStatus(bloodGroupFields, { 
  blood_group: 'A', 
  rh_factor: 'POSITIVE' 
})
console.log(`Expected: completed, Got: ${status3}`)
console.log(`✓ PASS: ${status3 === 'completed' ? 'YES' : 'NO'}\n`)

// Test 4: Pending status - empty strings
console.log('Test 4: Pending status (empty strings)')
const status4 = calculateReportStatus(bloodGroupFields, { 
  blood_group: '', 
  rh_factor: '' 
})
console.log(`Expected: pending, Got: ${status4}`)
console.log(`✓ PASS: ${status4 === 'pending' ? 'YES' : 'NO'}\n`)

// Test 5: Completion summary
console.log('Test 5: Completion summary (1 of 2 filled)')
const summary = getReportCompletionSummary(bloodGroupFields, { blood_group: 'A' })
console.log(`Expected: filledCount=1, totalRequired=2, percentComplete=50`)
console.log(`Got: filledCount=${summary.filledCount}, totalRequired=${summary.totalRequired}, percentComplete=${summary.percentComplete}`)
console.log(`✓ PASS: ${summary.filledCount === 1 && summary.totalRequired === 2 && summary.percentComplete === 50 ? 'YES' : 'NO'}\n`)

// Test 6: Zero value should be considered filled
const numericField: ReportField[] = [
  {
    id: '1',
    reportTypeId: 'type1',
    fieldName: 'count',
    fieldLabel: 'Count',
    fieldType: 'number',
    fieldOrder: 1,
    isRequired: true,
    unit: null,
    normalRangeMin: null,
    normalRangeMax: null,
    normalRangeText: null,
    dropdownOptions: null,
    defaultValue: null,
    validationRules: null,
    createdAt: '2024-01-01'
  }
]

console.log('Test 6: Zero value should be considered filled')
const status6 = calculateReportStatus(numericField, { count: 0 })
console.log(`Expected: completed, Got: ${status6}`)
console.log(`✓ PASS: ${status6 === 'completed' ? 'YES' : 'NO'}\n`)

console.log('All manual tests completed!')
