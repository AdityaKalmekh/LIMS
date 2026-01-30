/**
 * Patient Registration Modal Component
 * 
 * A modal dialog that wraps the PatientRegistrationForm component.
 * Integrates with the Header's "New" button to open the registration form.
 * 
 * Features:
 * - Opens/closes via controlled state
 * - Displays PatientRegistrationForm in a dialog
 * - Handles form submission and cancellation
 * - Shows success toast notification
 * - Mobile-responsive
 * 
 * Usage:
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false)
 * 
 * <PatientRegistrationModal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 * />
 * ```
 */

'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PatientRegistrationForm } from './PatientRegistrationForm'
import { PatientFormData } from '@/lib/validations/patient'
import { toast } from 'sonner'

interface PatientRegistrationModalProps {
  /**
   * Whether the modal is open
   */
  open: boolean
  /**
   * Callback when the modal open state changes
   */
  onOpenChange: (open: boolean) => void
}

export function PatientRegistrationModal({
  open,
  onOpenChange,
}: PatientRegistrationModalProps) {
  const handleSuccess = (data: PatientFormData) => {
    // Close the modal
    onOpenChange(false)
    
    // Show success toast
    toast.success('Patient registered successfully', {
      description: `${data.title} ${data.firstName} ${data.lastName || ''} has been registered.`,
    })
    
    // TODO: Refresh patient list (will be implemented in task 6.3)
    console.log('Patient registered:', data)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Register New Patient
          </DialogTitle>
          <DialogDescription>
            Fill in the patient details below. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <PatientRegistrationForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
