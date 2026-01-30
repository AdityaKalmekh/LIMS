/**
 * Header Component
 * 
 * A responsive header for the LIMS dashboard with Google Drive-inspired design.
 * 
 * Features:
 * - "New" button prominently displayed (will open patient registration modal)
 * - Search bar (UI only for now, functionality in future tasks)
 * - View toggle for list/grid views (UI only for now)
 * - Mobile menu toggle (handled by layout)
 * - Google Drive-inspired styling
 * 
 * Usage:
 * ```tsx
 * import { Header } from '@/components/dashboard/Header'
 * 
 * export default function DashboardLayout({ children }) {
 *   return (
 *     <div>
 *       <Header 
 *         onNewPatient={() => console.log('Open patient form')}
 *       />
 *       {children}
 *     </div>
 *   )
 * }
 * ```
 */

'use client'

import { useState } from 'react'
import { Plus, Search, LayoutGrid, LayoutList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface HeaderProps {
  /**
   * Callback when the "New" button is clicked
   */
  onNewPatient?: () => void
  /**
   * Current view mode (list or grid)
   */
  viewMode?: 'list' | 'grid'
  /**
   * Callback when view mode changes
   */
  onViewModeChange?: (mode: 'list' | 'grid') => void
}

export function Header({ 
  onNewPatient, 
  viewMode = 'list',
  onViewModeChange 
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="flex flex-1 items-center justify-between gap-4">
      {/* Left Section: New Button */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onNewPatient}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          size="default"
        >
          <Plus className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">New</span>
        </Button>
        
        {/* Mobile Search Button - Shows on mobile when search bar is hidden */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Search"
          title="Search patients"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Center Section: Search Bar */}
      <div className="flex-1 max-w-2xl hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Right Section: View Toggle */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center rounded-md border border-gray-200 bg-white p-1">
          <button
            onClick={() => onViewModeChange?.('list')}
            className={cn(
              'p-2 rounded transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
              viewMode === 'list'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            )}
            aria-label="List view"
            title="List view"
          >
            <LayoutList className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange?.('grid')}
            className={cn(
              'p-2 rounded transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
              viewMode === 'grid'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            )}
            aria-label="Grid view"
            title="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
