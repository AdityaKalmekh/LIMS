/**
 * useViewMode Hook
 * 
 * Custom hook to manage and persist the view mode (list/grid) preference.
 * Uses localStorage to persist the user's preference across sessions.
 * 
 * Usage:
 * ```tsx
 * const { viewMode, setViewMode } = useViewMode()
 * ```
 */

'use client'

import { useState, useEffect } from 'react'
import { ViewMode } from '@/types'

const VIEW_MODE_KEY = 'lims-view-mode'

export function useViewMode() {
  const [viewMode, setViewModeState] = useState<ViewMode>('list')
  const [isInitialized, setIsInitialized] = useState(false)

  // Load view mode from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(VIEW_MODE_KEY)
    if (stored === 'list' || stored === 'grid') {
      setViewModeState(stored)
    }
    setIsInitialized(true)
  }, [])

  // Update localStorage when view mode changes
  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode)
    localStorage.setItem(VIEW_MODE_KEY, mode)
  }

  return {
    viewMode,
    setViewMode,
    isInitialized,
  }
}
