/**
 * Patient Registration Validation Schema
 * 
 * Zod schema for validating patient registration form data.
 * 
 * Validation Rules:
 * - Mobile number: Must be in format +91XXXXXXXXXX (10 digits after +91)
 * - Title: Must be one of the predefined options
 * - First name: Required, max 100 characters
 * - Last name: Optional, max 100 characters
 * - Sex: Must be Male, Female, or Other
 * - Age Years: Required, must be 0-150
 * - Age Months: Optional, must be 0-11
 * - Age Days: Optional, must be 0-30
 * - Referred by: Optional, max 200 characters
 */

import { z } from 'zod'

export const patientSchema = z.object({
  mobileNumber: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^\+91\d{10}$/, 'Mobile number must be in format +91XXXXXXXXXX (10 digits)'),
  
  title: z.enum(['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Master', 'Miss'], {
    message: 'Please select a valid title',
  }),
  
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters')
    .trim(),
  
  lastName: z
    .string()
    .max(100, 'Last name must be less than 100 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  
  sex: z.enum(['Male', 'Female', 'Other'], {
    message: 'Please select a valid option',
  }),
  
  ageYears: z
    .number({
      message: 'Age in years is required',
    })
    .int('Age must be a whole number')
    .min(0, 'Age cannot be negative')
    .max(150, 'Please enter a valid age'),
  
  ageMonths: z
    .number({
      message: 'Months must be a number',
    })
    .int('Months must be a whole number')
    .min(0, 'Months cannot be negative')
    .max(11, 'Months must be between 0 and 11')
    .optional()
    .or(z.literal(0)),
  
  ageDays: z
    .number({
      message: 'Days must be a number',
    })
    .int('Days must be a whole number')
    .min(0, 'Days cannot be negative')
    .max(30, 'Days must be between 0 and 30')
    .optional()
    .or(z.literal(0)),
  
  referredBy: z
    .string()
    .max(200, 'Referred by must be less than 200 characters')
    .trim()
    .optional()
    .or(z.literal('')),
})

export type PatientFormData = z.infer<typeof patientSchema>

// Type for the patient data as stored in the database
export interface Patient extends PatientFormData {
  id: string
  createdAt: string
  createdBy: string
  updatedAt?: string
}
