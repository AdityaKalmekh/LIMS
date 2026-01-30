/**
 * Dashboard Page
 * 
 * Main dashboard page that displays the patient list.
 * The view mode (list/grid) is controlled by the layout component.
 */

'use client'

import { PatientList } from '@/components/dashboard/PatientList'
import { useViewMode } from '@/lib/hooks/useViewMode'
import { typography, spacing } from '@/lib/typography'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const { viewMode } = useViewMode()

  return (
    <div className={spacing.sectionSpacing}>
      <div className="border-b border-gray-200 pb-5">
        <h1 className={typography.h1}>
          Patients
        </h1>
        <p className={cn('mt-2', typography.muted)}>
          Manage and view all registered patients
        </p>
      </div>
      
      <PatientList viewMode={viewMode} />
    </div>
  )
}
