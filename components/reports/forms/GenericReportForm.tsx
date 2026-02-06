/**
 * Generic Report Form Component
 * 
 * A dynamic form component that can render any report type based on field definitions.
 * This component serves as a fallback for report types that don't have a specialized
 * form component, enabling the system to support new report types without code changes.
 * 
 * Features:
 * - Dynamically renders fields based on field definitions
 * - Supports text, number, dropdown, and textarea field types
 * - Applies validation rules from field definitions
 * - Displays units and normal ranges for numeric fields
 * - Shows visual indicators for out-of-range values
 * - Uses shadcn/ui components for consistency
 * 
 * Requirements: 10.4, 7.2
 * 
 * Usage:
 * ```tsx
 * <GenericReportForm
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * GenericReportForm Component
 * 
 * Renders a form dynamically based on field definitions from the database.
 * This enables the system to support any report type without requiring
 * custom form components.
 * 
 * The component handles:
 * - Text fields: Standard text input
 * - Number fields: Numeric input with unit and normal range display
 * - Dropdown fields: Select component with options from field definition
 * - Textarea fields: Multi-line text input
 * 
 * For numeric fields, the component:
 * - Displays the unit of measurement (e.g., "gm/dl", "/Cumm.")
 * - Shows the normal range text (e.g., "13-17")
 * - Highlights values outside the normal range with a warning color
 */
export function GenericReportForm({ fields, data, errors, onChange }: ReportFormProps) {
  // Sort fields by field_order to ensure correct display sequence
  const sortedFields = [...fields].sort((a, b) => a.fieldOrder - b.fieldOrder)

  /**
   * Check if a numeric value is outside the normal range
   */
  const isOutOfRange = (value: any, min: number | null, max: number | null): boolean => {
    if (value === null || value === undefined || value === '') return false
    if (min === null || max === null) return false
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return false
    
    return numValue < min || numValue > max
  }

  /**
   * Render a single field based on its type
   */
  const renderField = (field: typeof sortedFields[0]) => {
    const fieldValue = data[field.fieldName] ?? field.defaultValue ?? ''
    const fieldError = errors[field.fieldName]
    const hasError = !!fieldError
    const outOfRange = field.fieldType === 'number' && 
                       isOutOfRange(fieldValue, field.normalRangeMin, field.normalRangeMax)

    // Common label component
    const fieldLabel = (
      <Label htmlFor={field.fieldName} className="text-sm font-medium">
        {field.fieldLabel}
        {field.isRequired && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </Label>
    )

    switch (field.fieldType) {
      case 'text':
        return (
          <div key={field.id} className="space-y-2">
            {fieldLabel}
            <Input
              id={field.fieldName}
              type="text"
              value={fieldValue}
              onChange={(e) => onChange(field.fieldName, e.target.value)}
              className={cn(hasError && 'border-red-500')}
              placeholder={`Enter ${field.fieldLabel.toLowerCase()}`}
            />
            {fieldError && (
              <p className="text-sm text-red-500">{fieldError}</p>
            )}
          </div>
        )

      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            {fieldLabel}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  id={field.fieldName}
                  type="text"
                  value={fieldValue}
                  onChange={(e) => onChange(field.fieldName, e.target.value)}
                  className={cn(
                    hasError && 'border-red-500',
                    outOfRange && !hasError && 'border-yellow-500'
                  )}
                  placeholder="Enter value"
                />
              </div>
              {outOfRange && !hasError && (
                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {field.unit && <span>Unit: {field.unit}</span>}
              {field.normalRangeText && (
                <span>Normal Range: {field.normalRangeText}</span>
              )}
            </div>
            {fieldError && (
              <p className="text-sm text-red-500">{fieldError}</p>
            )}
            {outOfRange && !hasError && (
              <p className="text-sm text-yellow-600">
                Value is outside normal range
              </p>
            )}
          </div>
        )

      case 'dropdown':
        return (
          <div key={field.id} className="space-y-2">
            {fieldLabel}
            <Select
              value={fieldValue}
              onValueChange={(value) => onChange(field.fieldName, value)}
            >
              <SelectTrigger
                id={field.fieldName}
                className={cn(hasError && 'border-red-500')}
              >
                <SelectValue placeholder={`Select ${field.fieldLabel.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.dropdownOptions?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldError && (
              <p className="text-sm text-red-500">{fieldError}</p>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            {fieldLabel}
            <textarea
              id={field.fieldName}
              value={fieldValue}
              onChange={(e) => onChange(field.fieldName, e.target.value)}
              className={cn(
                'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                hasError && 'border-red-500'
              )}
              placeholder={`Enter ${field.fieldLabel.toLowerCase()}`}
              rows={4}
            />
            {fieldError && (
              <p className="text-sm text-red-500">{fieldError}</p>
            )}
          </div>
        )

      default:
        // Fallback for unknown field types
        return (
          <div key={field.id} className="space-y-2">
            {fieldLabel}
            <Input
              id={field.fieldName}
              type="text"
              value={fieldValue}
              onChange={(e) => onChange(field.fieldName, e.target.value)}
              className={cn(hasError && 'border-red-500')}
              placeholder={`Enter ${field.fieldLabel.toLowerCase()}`}
            />
            {fieldError && (
              <p className="text-sm text-red-500">{fieldError}</p>
            )}
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {sortedFields.map(renderField)}
    </div>
  )
}
