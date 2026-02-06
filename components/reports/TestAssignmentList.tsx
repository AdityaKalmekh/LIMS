/**
 * TestAssignmentList Component
 * 
 * Displays a list of test assignments for a selected patient with:
 * - Test name and assignment date
 * - Status badges (pending, in-progress, completed) with distinct colors
 * - Visual highlighting of selected test assignment
 * - Click handling to expand report form
 * 
 * This component is used in the Reports page to show all tests assigned to a patient
 * and allow the lab technician to select a test to view/edit its report.
 * 
 * Requirements: 2.2, 2.3, 3.1, 9.4
 * 
 * Usage:
 * ```tsx
 * <TestAssignmentList
 *   testAssignments={assignments}
 *   selectedTestId={selectedId}
 *   onTestSelect={handleTestSelect}
 * />
 * ```
 */

'use client'

import { TestAssignmentListProps, TestAssignmentWithStatus } from '@/types/reports'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Get badge variant based on report status
 * - pending: gray/secondary
 * - in-progress: yellow/warning
 * - completed: green/success
 */
function getStatusBadgeVariant(status: 'pending' | 'in-progress' | 'completed') {
  switch (status) {
    case 'pending':
      return 'secondary'
    case 'in-progress':
      return 'warning'
    case 'completed':
      return 'success'
    default:
      return 'secondary'
  }
}

/**
 * Format status text for display
 */
function formatStatusText(status: 'pending' | 'in-progress' | 'completed'): string {
  switch (status) {
    case 'pending':
      return 'Pending'
    case 'in-progress':
      return 'In Progress'
    case 'completed':
      return 'Completed'
    default:
      return status
  }
}

/**
 * Format date for display
 * Shows relative time for recent dates, absolute date for older ones
 */
function formatAssignmentDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  }
}

/**
 * TestAssignmentList Component
 * 
 * Renders a list of test assignments with status indicators and selection handling
 */
export function TestAssignmentList({
  testAssignments,
  selectedTestId,
  onTestSelect
}: TestAssignmentListProps) {
  // Empty state
  if (testAssignments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-gray-400 mb-4">
            <FileText className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No test assignments
          </h3>
          <p className="text-sm text-gray-500">
            This patient has no assigned tests
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {testAssignments.map((assignment) => (
        <TestAssignmentCard
          key={assignment.id}
          assignment={assignment}
          isSelected={assignment.id === selectedTestId}
          onSelect={() => onTestSelect(assignment.id)}
        />
      ))}
    </div>
  )
}

/**
 * TestAssignmentCard Component
 * 
 * Individual card for a single test assignment
 */
interface TestAssignmentCardProps {
  assignment: TestAssignmentWithStatus
  isSelected: boolean
  onSelect: () => void
}

function TestAssignmentCard({
  assignment,
  isSelected,
  onSelect
}: TestAssignmentCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        isSelected && 'ring-2 ring-primary shadow-md bg-primary/5'
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left side: Test info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <FileText className={cn(
                'h-4 w-4 flex-shrink-0',
                isSelected ? 'text-primary' : 'text-gray-500'
              )} />
              <h3 className={cn(
                'text-sm font-medium truncate',
                isSelected ? 'text-primary' : 'text-gray-900'
              )}>
                {assignment.testName}
              </h3>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span>Assigned {formatAssignmentDate(assignment.assignedDate)}</span>
            </div>
          </div>

          {/* Right side: Status badge */}
          <div className="flex-shrink-0">
            <Badge variant={getStatusBadgeVariant(assignment.reportStatus)}>
              {formatStatusText(assignment.reportStatus)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
