/**
 * Page Loading Component
 * 
 * A full-page loading component with consistent styling.
 * Used for page-level loading states.
 * 
 * Usage:
 * ```tsx
 * <PageLoading />
 * <PageLoading text="Loading dashboard..." />
 * ```
 */

import { LoadingSpinner } from './loading-spinner'

interface PageLoadingProps {
  /**
   * Optional text to display below the spinner
   */
  text?: string
}

export function PageLoading({ text = 'Loading...' }: PageLoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}
