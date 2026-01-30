/**
 * Patient Registration Form Component
 * 
 * A comprehensive form for registering new patients with all required fields.
 * Uses react-hook-form for form management and zod for validation.
 * 
 * Features:
 * - Mobile number input with +91 prefix
 * - Title dropdown (Mr., Mrs., Ms., Dr., Master, Miss)
 * - First name and last name inputs
 * - Sex radio buttons (Male, Female, Other)
 * - Age inputs (Years, Months, Days)
 * - Referred by input
 * - Form validation with error display
 * - Mobile-responsive layout
 * 
 * Usage:
 * ```tsx
 * <PatientRegistrationForm
 *   onSuccess={(patient) => console.log('Patient registered:', patient)}
 *   onCancel={() => console.log('Form cancelled')}
 * />
 * ```
 */

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PatientFormData, patientSchema } from '@/lib/validations/patient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface PatientRegistrationFormProps {
  /**
   * Callback when form is successfully submitted
   */
  onSuccess: (patient: PatientFormData) => void
  /**
   * Callback when form is cancelled
   */
  onCancel: () => void
}

export function PatientRegistrationForm({
  onSuccess,
  onCancel,
}: PatientRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      mobileNumber: '+91',
      ageMonths: 0,
      ageDays: 0,
    },
  })

  const selectedTitle = watch('title')
  const selectedSex = watch('sex')

  const onSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true)
    try {
      // Call the API to create the patient
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        // Handle error response
        if (response.status === 400 && result.errors) {
          // Validation errors from server
          toast.error('Validation Error', {
            description: result.errors.map((err: any) => err.message).join(', '),
          })
        } else if (response.status === 401) {
          // Authentication error
          toast.error('Authentication Required', {
            description: result.message || 'Please log in to continue',
          })
        } else {
          // Other errors
          toast.error('Error', {
            description: result.message || 'Failed to register patient',
          })
        }
        return
      }

      // Success - show toast notification
      toast.success('Patient Registered Successfully', {
        description: `${data.title} ${data.firstName} ${data.lastName || ''} has been registered.`,
      })

      // Reset form
      reset({
        mobileNumber: '+91',
        title: undefined,
        firstName: '',
        lastName: '',
        sex: undefined,
        ageYears: 0,
        ageMonths: 0,
        ageDays: 0,
        referredBy: '',
      })

      // Call success callback
      onSuccess(data)
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Network Error', {
        description: 'Failed to connect to the server. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Mobile Number */}
      <div className="space-y-2">
        <Label htmlFor="mobileNumber" className="text-sm font-medium">
          Mobile Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="mobileNumber"
          type="tel"
          placeholder="+91XXXXXXXXXX"
          {...register('mobileNumber')}
          className={errors.mobileNumber ? 'border-red-500' : ''}
        />
        {errors.mobileNumber && (
          <p className="text-sm text-red-500">{errors.mobileNumber.message}</p>
        )}
        <p className="text-xs text-gray-500">Format: +91 followed by 10 digits</p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Title <span className="text-red-500">*</span>
        </Label>
        <Select
          value={selectedTitle}
          onValueChange={(value) =>
            setValue('title', value as PatientFormData['title'], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger
            id="title"
            className={errors.title ? 'border-red-500' : ''}
          >
            <SelectValue placeholder="Select title" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mr.">Mr.</SelectItem>
            <SelectItem value="Mrs.">Mrs.</SelectItem>
            <SelectItem value="Ms.">Ms.</SelectItem>
            <SelectItem value="Dr.">Dr.</SelectItem>
            <SelectItem value="Master">Master</SelectItem>
            <SelectItem value="Miss">Miss</SelectItem>
          </SelectContent>
        </Select>
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* First Name and Last Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Enter first name"
            {...register('firstName')}
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Enter last name (optional)"
            {...register('lastName')}
            className={errors.lastName ? 'border-red-500' : ''}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Sex */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Sex <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={selectedSex}
          onValueChange={(value) =>
            setValue('sex', value as PatientFormData['sex'], {
              shouldValidate: true,
            })
          }
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Male" id="male" />
            <Label htmlFor="male" className="font-normal cursor-pointer">
              Male
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Female" id="female" />
            <Label htmlFor="female" className="font-normal cursor-pointer">
              Female
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Other" id="other" />
            <Label htmlFor="other" className="font-normal cursor-pointer">
              Other
            </Label>
          </div>
        </RadioGroup>
        {errors.sex && (
          <p className="text-sm text-red-500">{errors.sex.message}</p>
        )}
      </div>

      {/* Age */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Age <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ageYears" className="text-xs text-gray-600">
              Years
            </Label>
            <Input
              id="ageYears"
              type="number"
              min="0"
              max="150"
              placeholder="0"
              {...register('ageYears', { valueAsNumber: true })}
              className={errors.ageYears ? 'border-red-500' : ''}
            />
            {errors.ageYears && (
              <p className="text-xs text-red-500">{errors.ageYears.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ageMonths" className="text-xs text-gray-600">
              Months
            </Label>
            <Input
              id="ageMonths"
              type="number"
              min="0"
              max="11"
              placeholder="0"
              {...register('ageMonths', { valueAsNumber: true })}
              className={errors.ageMonths ? 'border-red-500' : ''}
            />
            {errors.ageMonths && (
              <p className="text-xs text-red-500">{errors.ageMonths.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ageDays" className="text-xs text-gray-600">
              Days
            </Label>
            <Input
              id="ageDays"
              type="number"
              min="0"
              max="30"
              placeholder="0"
              {...register('ageDays', { valueAsNumber: true })}
              className={errors.ageDays ? 'border-red-500' : ''}
            />
            {errors.ageDays && (
              <p className="text-xs text-red-500">{errors.ageDays.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Referred By */}
      <div className="space-y-2">
        <Label htmlFor="referredBy" className="text-sm font-medium">
          Referred By
        </Label>
        <Input
          id="referredBy"
          type="text"
          placeholder="Enter referrer name (optional)"
          {...register('referredBy')}
          className={errors.referredBy ? 'border-red-500' : ''}
        />
        {errors.referredBy && (
          <p className="text-sm text-red-500">{errors.referredBy.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            'Register Patient'
          )}
        </Button>
      </div>
    </form>
  )
}
