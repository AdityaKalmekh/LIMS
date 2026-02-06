/**
 * CBC (Complete Blood Count) Form Component
 * 
 * A specialized form component for entering Complete Blood Count test results.
 * This form is used within the report management system to capture comprehensive
 * blood analysis data including RBC parameters, WBC differential, and platelet information.
 * 
 * Features:
 * - 14 numeric input fields with units and normal ranges
 * - 2 dropdown fields with default values
 * - Organized in logical groups (RBC, WBC, Platelets)
 * - Visual indicators for out-of-range values
 * - Uses shadcn/ui Input and Select components
 * - Displays validation errors
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4
 * 
 * Usage:
 * ```tsx
 * <CBCForm
 *   fields={reportFields}
 *   data={formData}
 *   errors={validationErrors}
 *   onChange={(fieldName, value) => handleFieldChange(fieldName, value)}
 * />
 * ```
 */

'use client'

import { ReportFormProps, ReportField } from '@/types/reports'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle } from 'lucide-react'

/**
 * Helper function to check if a numeric value is outside the normal range
 */
function isOutOfRange(
  value: string | number,
  min: number | null,
  max: number | null
): boolean {
  if (!value || min === null || max === null) return false
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numValue)) return false
  return numValue < min || numValue > max
}

/**
 * NumericFieldProps interface for the NumericField component
 */
interface NumericFieldProps {
  field: ReportField
  value: string | number
  error: string | undefined
  onChange: (fieldName: string, value: any) => void
}

/**
 * NumericField Component
 * 
 * Renders a numeric input field with label, unit, normal range, and validation
 */
function NumericField({ field, value, error, onChange }: NumericFieldProps) {
  const isOutOfNormalRange = isOutOfRange(
    value,
    field.normalRangeMin,
    field.normalRangeMax
  )

  return (
    <div className="space-y-2">
      <Label htmlFor={field.fieldName} className="text-sm font-medium">
        {field.fieldLabel}
        {field.isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            id={field.fieldName}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(field.fieldName, e.target.value)}
            className={`${error ? 'border-red-500' : ''} ${
              isOutOfNormalRange && !error ? 'border-yellow-500' : ''
            }`}
            placeholder="Enter value"
          />
        </div>
        {isOutOfNormalRange && !error && (
          <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {field.unit && <span>Unit: {field.unit}</span>}
        {field.normalRangeText && (
          <span>Normal Range: {field.normalRangeText}</span>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {isOutOfNormalRange && !error && (
        <p className="text-sm text-yellow-600">
          Value is outside normal range
        </p>
      )}
    </div>
  )
}

/**
 * DropdownFieldProps interface for the DropdownField component
 */
interface DropdownFieldProps {
  field: ReportField
  value: string
  error: string | undefined
  onChange: (fieldName: string, value: any) => void
}

/**
 * DropdownField Component
 * 
 * Renders a dropdown field with label and validation
 */
function DropdownField({ field, value, error, onChange }: DropdownFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.fieldName} className="text-sm font-medium">
        {field.fieldLabel}
        {field.isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select
        value={value || field.defaultValue || ''}
        onValueChange={(val) => onChange(field.fieldName, val)}
      >
        <SelectTrigger
          id={field.fieldName}
          className={error ? 'border-red-500' : ''}
        >
          <SelectValue placeholder={`Select ${field.fieldLabel}`} />
        </SelectTrigger>
        <SelectContent>
          {field.dropdownOptions?.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

/**
 * CBCForm Component
 * 
 * Renders a comprehensive form for Complete Blood Count test results.
 * Fields are organized into logical groups:
 * - RBC Parameters: Hb, RBC, PCV/Haematocrit, MCV, MCH, MCHC, RDW-CV
 * - WBC Parameters: Total Leukocyte Count, Neutrophil, Lymphocyte, Monocyte, Eosinophil, Basophil
 * - Platelet Parameters: Platelet Count, Platelet on Smear
 * - Other: Malarial Parasite
 */
export function CBCForm({ fields, data, errors, onChange }: ReportFormProps) {
  // Group fields by category for better organization
  const rbcFields = [
    'hb',
    'rbc',
    'pcv_haematocrit',
    'mcv',
    'mch',
    'mchc',
    'rdw_cv',
  ]
  const wbcFields = [
    'total_leukocyte_count',
    'neutrophil',
    'lymphocyte',
    'monocyte',
    'eosinophil',
    'basophil',
  ]
  const plateletFields = ['platelet_count', 'platelet_on_smear']
  const otherFields = ['malarial_parasite']

  // Helper function to get field by name
  const getField = (fieldName: string): ReportField | undefined =>
    fields.find((f) => f.fieldName === fieldName)

  // Helper function to render a field based on its type
  const renderField = (fieldName: string) => {
    const field = getField(fieldName)
    if (!field) return null

    const value = data[fieldName]
    const error = errors[fieldName]

    if (field.fieldType === 'number') {
      return (
        <NumericField
          key={fieldName}
          field={field}
          value={value}
          error={error}
          onChange={onChange}
        />
      )
    } else if (field.fieldType === 'dropdown') {
      return (
        <DropdownField
          key={fieldName}
          field={field}
          value={value}
          error={error}
          onChange={onChange}
        />
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* RBC Parameters Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">
          RBC Parameters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rbcFields.map((fieldName) => renderField(fieldName))}
        </div>
      </div>

      {/* WBC Parameters Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">
          WBC Parameters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wbcFields.map((fieldName) => renderField(fieldName))}
        </div>
      </div>

      {/* Platelet Parameters Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">
          Platelet Parameters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plateletFields.map((fieldName) => renderField(fieldName))}
        </div>
      </div>

      {/* Other Tests Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">
          Other Tests
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {otherFields.map((fieldName) => renderField(fieldName))}
        </div>
      </div>
    </div>
  )
}
