/**
 * Test Selection Dropdown Component
 * 
 * A multi-select dropdown for assigning lab tests to patients.
 * Uses shadcn/ui DropdownMenu with checkboxes for test selection.
 * 
 * Features:
 * - Multi-select functionality with checkboxes
 * - Three test options: CBC, BG, VDRL
 * - Shows selected count when closed (e.g., "2 tests selected")
 * - Consistent styling with existing components
 * 
 * Usage:
 * ```tsx
 * <TestSelectionDropdown
 *   patientId="123"
 *   selectedTests={new Set(['CBC', 'BG'])}
 *   onChange={(tests) => console.log('Selected tests:', tests)}
 * />
 * ```
 */

'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TestType } from '@/types'

/**
 * Test option configuration
 */
interface TestOption {
  value: TestType
  label: string
  description: string
}

/**
 * Available test options
 */
const TEST_OPTIONS: TestOption[] = [
  {
    value: 'CBC',
    label: 'CBC',
    description: 'Complete Blood Count',
  },
  {
    value: 'BG',
    label: 'BG',
    description: 'Blood Glucose',
  },
  {
    value: 'VDRL',
    label: 'VDRL',
    description: 'Venereal Disease Research Laboratory',
  },
]

/**
 * Props for TestSelectionDropdown component
 */
export interface TestSelectionDropdownProps {
  /**
   * Patient ID for tracking which patient's tests are being selected
   */
  patientId: string
  /**
   * Set of currently selected test types
   */
  selectedTests: Set<TestType>
  /**
   * Callback when test selection changes
   */
  onChange: (tests: Set<TestType>) => void
}

/**
 * TestSelectionDropdown Component
 * 
 * Multi-select dropdown for assigning lab tests to a patient.
 * Displays selected test count when closed and checkboxes when open.
 */
export function TestSelectionDropdown({
  patientId,
  selectedTests,
  onChange,
}: TestSelectionDropdownProps) {
  const [open, setOpen] = useState(false)

  /**
   * Handle checkbox toggle for a test type
   */
  const handleTestToggle = (testType: TestType, checked: boolean) => {
    const newTests = new Set(selectedTests)
    
    if (checked) {
      newTests.add(testType)
    } else {
      newTests.delete(testType)
    }
    
    onChange(newTests)
  }

  /**
   * Get display text for the dropdown trigger button
   */
  const getDisplayText = () => {
    const count = selectedTests.size
    
    if (count === 0) {
      return 'Select tests'
    } else if (count === 1) {
      return '1 test selected'
    } else {
      return `${count} tests selected`
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between min-h-[44px] touch-manipulation"
          aria-label={`Select tests for patient ${patientId}`}
        >
          <span className="text-sm">{getDisplayText()}</span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Select Lab Tests</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {TEST_OPTIONS.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selectedTests.has(option.value)}
            onCheckedChange={(checked) => handleTestToggle(option.value, checked)}
            className="min-h-[44px] py-3"
          >
            <div className="flex flex-col">
              <span className="font-medium">{option.label}</span>
              <span className="text-xs text-muted-foreground">
                {option.description}
              </span>
            </div>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
