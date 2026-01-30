/**
 * PatientList Component
 * 
 * Displays a list of patients in either list or grid view with Google Drive-inspired design.
 * 
 * Features:
 * - Fetches patients from API with pagination
 * - List view: Table-like layout with patient details in rows
 * - Grid view: Card-based layout with patient details in cards
 * - Loading skeleton while fetching data
 * - Empty state when no patients exist
 * - Mobile-responsive design
 * 
 * Usage:
 * ```tsx
 * import { PatientList } from '@/components/dashboard/PatientList'
 * 
 * export default function DashboardPage() {
 *   return <PatientList viewMode="list" />
 * }
 * ```
 */

'use client'

import { useEffect, useState } from 'react'
import { Patient } from '@/types'
import { Card } from '@/components/ui/card'
import { User, Phone, Calendar, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PatientListProps {
  /**
   * View mode: list or grid
   */
  viewMode?: 'list' | 'grid'
}

interface ApiResponse {
  success: boolean
  data: Patient[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
  error?: string
  message?: string
}

export function PatientList({ viewMode = 'list' }: PatientListProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/patients?page=1&limit=50')
        const data: ApiResponse = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch patients')
        }

        if (data.success && data.data) {
          setPatients(data.data)
        } else {
          throw new Error(data.message || 'Failed to fetch patients')
        }
      } catch (err) {
        console.error('Error fetching patients:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        {viewMode === 'list' ? (
          <ListViewSkeleton />
        ) : (
          <GridViewSkeleton />
        )}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 mb-2">
          <FileText className="h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Error Loading Patients
        </h3>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    )
  }

  // Empty state
  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-400 mb-4">
          <User className="h-16 w-16" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No patients yet
        </h3>
        <p className="text-sm text-gray-500">
          Get started by registering your first patient
        </p>
      </div>
    )
  }

  // Render based on view mode
  return (
    <div className="space-y-4">
      {viewMode === 'list' ? (
        <ListView patients={patients} />
      ) : (
        <GridView patients={patients} />
      )}
    </div>
  )
}

/**
 * List View Component
 * Table-like layout for displaying patients
 */
function ListView({ patients }: { patients: Patient[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sex
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referred By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registered
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {patient.title} {patient.firstName} {patient.lastName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.mobileNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.sex}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatAge(patient.ageYears, patient.ageMonths, patient.ageDays)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {patient.referredBy || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(patient.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {patient.title} {patient.firstName} {patient.lastName}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Phone className="h-3 w-3 mr-1" />
                  {patient.mobileNumber}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {patient.sex} • {formatAge(patient.ageYears, patient.ageMonths, patient.ageDays)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Grid View Component
 * Card-based layout for displaying patients
 */
function GridView({ patients }: { patients: Patient[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {patients.map((patient) => (
        <Card
          key={patient.id}
          className="p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                {patient.title} {patient.firstName} {patient.lastName}
              </h3>
              <div className="space-y-1">
                <div className="flex items-center text-xs text-gray-500">
                  <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{patient.mobileNumber}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <User className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span>{patient.sex}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span>{formatAge(patient.ageYears, patient.ageMonths, patient.ageDays)}</span>
                </div>
              </div>
            </div>
          </div>
          {patient.referredBy && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                <span className="font-medium">Referred by:</span> {patient.referredBy}
              </div>
            </div>
          )}
          <div className="mt-2 text-xs text-gray-400">
            {formatDate(patient.createdAt)}
          </div>
        </Card>
      ))}
    </div>
  )
}

/**
 * Loading Skeleton for List View
 */
function ListViewSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sex
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referred By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registered
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                    <div className="ml-4">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden divide-y divide-gray-200">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Loading Skeleton for Grid View
 */
function GridViewSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="p-4 border border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

/**
 * Helper function to format age
 */
function formatAge(years: number, months?: number, days?: number): string {
  const parts: string[] = []
  
  if (years > 0) {
    parts.push(`${years}Y`)
  }
  if (months && months > 0) {
    parts.push(`${months}M`)
  }
  if (days && days > 0) {
    parts.push(`${days}D`)
  }
  
  return parts.length > 0 ? parts.join(' ') : '0Y'
}

/**
 * Helper function to format date
 */
function formatDate(dateString: string): string {
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
