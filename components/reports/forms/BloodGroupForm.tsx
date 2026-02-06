/**
 * Blood Group Form Component
 * 
 * A specialized form component for entering blood group test results.
 * This form is used within the report management system to capture
 * blood type and Rh factor information.
 * 
 * Features:
 * - Blood Group dropdown (A, B, AB, O)
 * - Rh Factor dropdown (POSITIVE, NEGATIVE)
 * - Both fields are required
 * - Uses shadcn/ui Select component
 * - Displays validation errors
 * 
 * Requirements: 6.1, 6.2, 6.3
 * 
 * Usage:
 * ```tsx
 * <BloodGroupForm
 *   fields={reportFields}
 *   data={formData}
 *   errors={validationErrors}
 *   onChange={(fieldName, value) => handleFieldChange(fieldName, value)}
 * />
 * ```
 */

'use client'

import { ReportFormProps } from '@/types/reports'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/**
 * Blood Group options
 */
const BLOOD_GROUP_OPTIONS = ['A', 'B', 'AB', 'O'] as const

/**
 * Rh Factor options
 */
const RH_FACTOR_OPTIONS = ['POSITIVE', 'NEGATIVE'] as const

/**
 * BloodGroupForm Component
 * 
 * Renders a form for entering blood group test results with two dropdown fields:
 * - Blood Group (A, B, AB, O)
 * - Rh Factor (POSITIVE, NEGATIVE)
 * 
 * Both fields are marked as required and validation errors are displayed below each field.
 */
export function BloodGroupForm({ fields, data, errors, onChange }: ReportFormProps) {
  // Find the blood group and rh factor fields from the field definitions
  const bloodGroupField = fields.find(f => f.fieldName === 'blood_group')
  const rhFactorField = fields.find(f => f.fieldName === 'rh_factor')

  // Get current values from data
  const bloodGroupValue = data['blood_group'] || ''
  const rhFactorValue = data['rh_factor'] || ''

  // Get validation errors
  const bloodGroupError = errors['blood_group']
  const rhFactorError = errors['rh_factor']

  return (
    <div className="space-y-6">
      {/* Blood Group Field */}
      {bloodGroupField && (
        <div className="space-y-2">
          <Label htmlFor="blood_group" className="text-sm font-medium">
            {bloodGroupField.fieldLabel}
            {bloodGroupField.isRequired && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </Label>
          <Select
            value={bloodGroupValue}
            onValueChange={(value) => onChange('blood_group', value)}
          >
            <SelectTrigger
              id="blood_group"
              className={bloodGroupError ? 'border-red-500' : ''}
            >
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              {BLOOD_GROUP_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {bloodGroupError && (
            <p className="text-sm text-red-500">{bloodGroupError}</p>
          )}
        </div>
      )}

      {/* Rh Factor Field */}
      {rhFactorField && (
        <div className="space-y-2">
          <Label htmlFor="rh_factor" className="text-sm font-medium">
            {rhFactorField.fieldLabel}
            {rhFactorField.isRequired && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </Label>
          <Select
            value={rhFactorValue}
            onValueChange={(value) => onChange('rh_factor', value)}
          >
            <SelectTrigger
              id="rh_factor"
              className={rhFactorError ? 'border-red-500' : ''}
            >
              <SelectValue placeholder="Select Rh factor" />
            </SelectTrigger>
            <SelectContent>
              {RH_FACTOR_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {rhFactorError && (
            <p className="text-sm text-red-500">{rhFactorError}</p>
          )}
        </div>
      )}
    </div>
  )
}
