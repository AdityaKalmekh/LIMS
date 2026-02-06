/**
 * Report Form Registry
 * 
 * This module provides a registry that maps report type codes to their corresponding
 * form components. It enables dynamic form rendering based on the report type,
 * allowing the system to display specialized forms for known report types and
 * fall back to a generic form for new or unknown report types.
 * 
 * Features:
 * - Maps report type codes to React components
 * - Provides type-safe component lookup
 * - Falls back to GenericReportForm for unknown report types
 * - Supports easy addition of new report types
 * 
 * Requirements: 10.4
 * 
 * Usage:
 * ```tsx
 * import { getReportFormComponent } from './registry'
 * 
 * const FormComponent = getReportFormComponent('BLOOD_GROUP')
 * return <FormComponent fields={fields} data={data} errors={errors} onChange={onChange} />
 * ```
 */

import { ReportFormComponent, ReportFormRegistry } from '@/types/reports'
import { BloodGroupForm } from './BloodGroupForm'
import { CBCForm } from './CBCForm'
import { GenericReportForm } from './GenericReportForm'

/**
 * Report Form Registry
 * 
 * Maps report type codes to their corresponding form components.
 * Each entry in the registry associates a report type code (e.g., 'BLOOD_GROUP')
 * with a React component that renders the form for that report type.
 * 
 * To add a new report type:
 * 1. Create a new form component that implements ReportFormProps
 * 2. Import the component in this file
 * 3. Add an entry to the registry mapping the report type code to the component
 * 
 * Example:
 * ```typescript
 * import { MyNewReportForm } from './MyNewReportForm'
 * 
 * const reportFormRegistry: ReportFormRegistry = {
 *   'BLOOD_GROUP': BloodGroupForm,
 *   'CBC': CBCForm,
 *   'MY_NEW_REPORT': MyNewReportForm,
 * }
 * ```
 */
const reportFormRegistry: ReportFormRegistry = {
  'BLOOD_GROUP': BloodGroupForm,
  'CBC': CBCForm,
}

/**
 * Get Report Form Component
 * 
 * Retrieves the appropriate form component for a given report type code.
 * If the report type code is not found in the registry, returns the
 * GenericReportForm component as a fallback.
 * 
 * The GenericReportForm can render any report type dynamically based on
 * field definitions, ensuring that new report types can be added to the
 * system without requiring code changes.
 * 
 * @param reportTypeCode - The code identifying the report type (e.g., 'BLOOD_GROUP', 'CBC')
 * @returns The React component for rendering the report form
 * 
 * @example
 * ```tsx
 * // Get a specialized form component
 * const BloodGroupComponent = getReportFormComponent('BLOOD_GROUP')
 * 
 * // Get the generic form for an unknown report type
 * const UnknownComponent = getReportFormComponent('UNKNOWN_TYPE')
 * // Returns GenericReportForm
 * ```
 */
export function getReportFormComponent(reportTypeCode: string): ReportFormComponent {
  return reportFormRegistry[reportTypeCode] || GenericReportForm
}

/**
 * Export the registry for testing purposes
 * This allows tests to verify that specific report types are registered
 */
export { reportFormRegistry }
