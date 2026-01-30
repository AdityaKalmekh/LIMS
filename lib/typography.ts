/**
 * Typography Utilities
 * 
 * Consistent typography classes based on design specifications.
 * Use these utilities to ensure consistent text styling across the application.
 * 
 * Design Specifications:
 * - Font Family: Inter, system-ui, sans-serif
 * - Headings: font-semibold
 * - Body: font-normal
 * - Labels: font-medium, text-sm
 */

export const typography = {
  // Page Headings
  h1: 'text-3xl font-semibold text-foreground',
  h2: 'text-2xl font-semibold text-foreground',
  h3: 'text-xl font-semibold text-foreground',
  h4: 'text-lg font-semibold text-foreground',
  
  // Body Text
  body: 'text-base font-normal text-foreground',
  bodyLarge: 'text-lg font-normal text-foreground',
  bodySmall: 'text-sm font-normal text-foreground',
  
  // Labels
  label: 'text-sm font-medium text-foreground',
  labelLarge: 'text-base font-medium text-foreground',
  labelSmall: 'text-xs font-medium text-foreground',
  
  // Muted Text
  muted: 'text-sm text-muted-foreground',
  mutedLarge: 'text-base text-muted-foreground',
  mutedSmall: 'text-xs text-muted-foreground',
  
  // Links
  link: 'text-primary hover:underline font-medium',
  
  // Card Titles
  cardTitle: 'text-lg font-semibold text-card-foreground',
  cardDescription: 'text-sm text-muted-foreground',
} as const

/**
 * Spacing Utilities
 * 
 * Consistent spacing based on Tailwind's spacing scale.
 * Use these utilities to ensure consistent spacing across the application.
 */
export const spacing = {
  // Container Padding
  containerPadding: 'px-4 sm:px-6 lg:px-8',
  
  // Card Padding
  cardPadding: 'p-6',
  
  // Form Spacing
  formSpacing: 'space-y-4',
  formSpacingLarge: 'space-y-6',
  
  // Section Spacing
  sectionSpacing: 'space-y-6',
  sectionSpacingLarge: 'space-y-8',
  
  // Button Padding
  buttonPadding: 'px-4 py-2',
  buttonPaddingLarge: 'px-6 py-3',
  buttonPaddingSmall: 'px-3 py-1.5',
  
  // Gap Utilities
  gapSmall: 'gap-2',
  gapMedium: 'gap-4',
  gapLarge: 'gap-6',
} as const
