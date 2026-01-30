/**
 * Sidebar Component
 * 
 * A responsive navigation sidebar for the LIMS dashboard with Google Drive-inspired design.
 * 
 * Features:
 * - Navigation structure with links
 * - User profile section showing user email
 * - Integrated logout button
 * - Mobile collapse functionality (drawer/modal)
 * - Google Drive-inspired styling
 * 
 * Usage:
 * ```tsx
 * import { Sidebar } from '@/components/dashboard/Sidebar'
 * 
 * export default function DashboardLayout({ children }) {
 *   const [isSidebarOpen, setIsSidebarOpen] = useState(false)
 *   
 *   return (
 *     <div>
 *       <Sidebar 
 *         isOpen={isSidebarOpen} 
 *         onClose={() => setIsSidebarOpen(false)} 
 *       />
 *       {children}
 *     </div>
 *   )
 * }
 * ```
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Users, 
  FileText, 
  Settings, 
  X,
  User as UserIcon
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  /**
   * Controls whether the sidebar is open on mobile
   */
  isOpen: boolean
  /**
   * Callback when the sidebar should close (mobile only)
   */
  onClose: () => void
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Patients', href: '/dashboard/patients', icon: Users },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user information
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient()
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error('Error fetching user:', error)
          return
        }
        
        setUserEmail(user?.email || null)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo/Brand Section */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">LIMS</h1>
        </Link>
        
        {/* Close button - Mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          aria-label="Close sidebar"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center mb-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {isLoading ? 'Loading...' : 'Admin User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {isLoading ? '...' : userEmail || 'No email'}
            </p>
          </div>
        </div>
        
        {/* Logout Button */}
        <LogoutButton 
          className="w-full justify-start"
          variant="ghost"
          showIcon={true}
        />
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex w-64 flex-col">
          <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
            {sidebarContent}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col border-r border-gray-200">
          {sidebarContent}
        </div>
      </aside>
    </>
  )
}
