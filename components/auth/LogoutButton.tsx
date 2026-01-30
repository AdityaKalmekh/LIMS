/**
 * Logout Button Component
 * 
 * A reusable button component that handles user logout.
 * This component can be used in the dashboard sidebar, header, or any other location.
 * 
 * Features:
 * - Calls the logout server action
 * - Shows loading state during logout
 * - Displays toast notification on error
 * - Fully accessible with keyboard support
 * - Customizable styling via className prop
 * 
 * Usage:
 * ```tsx
 * import { LogoutButton } from '@/components/auth/LogoutButton'
 * 
 * export function Sidebar() {
 *   return (
 *     <div>
 *       <LogoutButton />
 *     </div>
 *   )
 * }
 * ```
 */

'use client'

import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { logout } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface LogoutButtonProps {
  /**
   * Optional className for custom styling
   */
  className?: string
  /**
   * Button variant - defaults to 'ghost'
   */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /**
   * Whether to show the logout icon
   */
  showIcon?: boolean
  /**
   * Custom button text - defaults to 'Logout'
   */
  children?: React.ReactNode
}

export function LogoutButton({
  className,
  variant = 'ghost',
  showIcon = true,
  children = 'Logout',
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      
      // Call the logout server action
      await logout()
      
      // Note: If logout is successful, the user will be redirected
      // to the login page, so the code below won't execute.
      // The toast is only shown if there's an error.
    } catch (error) {
      // Handle logout errors
      console.error('Logout error:', error)
      
      toast.error('Logout failed', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
      
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant={variant}
      className={className}
      aria-label="Logout"
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {isLoading ? 'Logging out...' : children}
    </Button>
  )
}
