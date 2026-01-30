/**
 * Dashboard Layout
 * 
 * This layout wraps all dashboard pages and provides:
 * - Responsive grid layout structure
 * - Sidebar navigation area (left)
 * - Main content area (right)
 * - Mobile-responsive design
 * 
 * The layout uses a CSS Grid approach that:
 * - On mobile: Stacks content vertically with drawer sidebar
 * - On desktop: Shows sidebar and content side-by-side
 * 
 * Components:
 * - Sidebar component (task 4.2) ✓
 * - Header component (task 4.3) ✓
 */

'use client'

import { ReactNode, useState } from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { PatientRegistrationModal } from '@/components/patients/PatientRegistrationModal'
import { useViewMode } from '@/lib/hooks/useViewMode'
import { Menu } from 'lucide-react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { viewMode, setViewMode } = useViewMode()
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false)

  const handleNewPatient = () => {
    setIsPatientModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 
        Responsive Grid Layout:
        - Mobile: Single column with drawer sidebar
        - Desktop: Two columns with fixed sidebar width
      */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar Component */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header Area */}
          <header className="w-full">
            <div className="relative z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white shadow-sm">
              <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 items-center gap-4">
                  {/* Mobile menu button */}
                  <div className="flex items-center lg:hidden">
                    <button
                      type="button"
                      onClick={() => setIsSidebarOpen(true)}
                      className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                      aria-label="Open sidebar"
                    >
                      <Menu className="h-6 w-6" />
                    </button>
                  </div>
                  
                  {/* Header Component */}
                  <Header 
                    onNewPatient={handleNewPatient}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content - This is where page content renders */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Patient Registration Modal */}
      <PatientRegistrationModal
        open={isPatientModalOpen}
        onOpenChange={setIsPatientModalOpen}
      />
    </div>
  )
}
