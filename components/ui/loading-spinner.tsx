/**
 * Loading Spinner Component
 * 
 * A reusable loading spinner component with consistent styling.
 * Used across the application for loading states.
 * 
 * Usage:
 * ```tsx
 * <LoadingSpinner size="sm" />
 * <LoadingSpinner size="md" text="Loading..." />
 * <LoadingSpinner size="lg" />
 * ```
 */

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  /**
   * Size of the spinner
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Optional text to display below the spinner
   */
  text?: string
  /**
   * Additional CSS classes
   */
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

export function LoadingSpinner({ 
  size = 'md', 
  text,
  className 
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 
        className={cn(
          'animate-spin text-primary',
          sizeClasses[size]
        )} 
      />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  )
}
