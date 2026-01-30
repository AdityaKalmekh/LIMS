# Dashboard Components

This directory contains components specific to the dashboard interface.

## Sidebar Component

The Sidebar component provides navigation and user profile functionality for the LIMS dashboard.

### Features

#### 1. Navigation Structure (Task 4.2.1) ✓
- **Dashboard**: Main dashboard view
- **Patients**: Patient management (coming in future tasks)
- **Reports**: Reports view (coming in future tasks)
- **Settings**: Settings page (coming in future tasks)
- Active route highlighting with blue background
- Smooth hover effects
- Icon-based navigation with labels

#### 2. User Profile Section (Task 4.2.2) ✓
- Displays user avatar (icon-based)
- Shows "Admin User" label
- Displays user email from Supabase Auth
- Loading state while fetching user data
- Graceful error handling

#### 3. Logout Button Integration (Task 4.2.3) ✓
- Integrated LogoutButton component
- Full-width button in user section
- Icon and text display
- Consistent styling with sidebar theme

#### 4. Mobile Collapse Functionality (Task 4.2.4) ✓
- **Desktop (≥1024px)**: Fixed sidebar always visible
- **Mobile (<1024px)**: Drawer-style sidebar
  - Slides in from left
  - Overlay backdrop with opacity
  - Close button in header
  - Closes on route change
  - Closes when clicking overlay
  - Prevents body scroll when open
  - Smooth animations (300ms ease-in-out)

#### 5. Google Drive-Inspired Design (Task 4.2.5) ✓
- Clean, minimal interface
- White background with subtle borders
- Blue accent color for active states
- Gray hover states
- Consistent spacing and typography
- Professional icon set (lucide-react)
- Smooth transitions

### Usage

```tsx
'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  return (
    <div>
      {/* Mobile menu button */}
      <button onClick={() => setIsSidebarOpen(true)}>
        Open Menu
      </button>
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Main content */}
      <main>{children}</main>
    </div>
  )
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Controls whether the sidebar is open on mobile |
| `onClose` | `() => void` | Yes | Callback when the sidebar should close |

### Navigation Items

The sidebar includes the following navigation items:

```typescript
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Patients', href: '/dashboard/patients', icon: Users },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]
```

To add or modify navigation items, update the `navigation` array in `Sidebar.tsx`.

### Styling

The component uses Tailwind CSS with the following key classes:

- **Desktop sidebar**: `w-64` (256px width)
- **Mobile drawer**: Full height, slides from left
- **Active state**: `bg-blue-50 text-blue-600`
- **Hover state**: `hover:bg-gray-50 hover:text-gray-900`
- **Transitions**: `transition-transform duration-300 ease-in-out`

### Accessibility

- Semantic HTML with `<aside>` and `<nav>` elements
- ARIA labels for close button
- Keyboard navigation support
- Focus management
- Screen reader friendly

### Integration with Dashboard Layout

The Sidebar is integrated into the dashboard layout at `app/(dashboard)/layout.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header with mobile menu button */}
        <header>
          <button onClick={() => setIsSidebarOpen(true)}>
            Open Menu
          </button>
        </header>
        
        {/* Main content */}
        <main>{children}</main>
      </div>
    </div>
  )
}
```

### Dependencies

- `next/link`: Client-side navigation
- `next/navigation`: usePathname hook for active route detection
- `lucide-react`: Icon library
- `@/lib/supabase/client`: Supabase client for user data
- `@/components/auth/LogoutButton`: Logout functionality
- `@/components/ui/button`: shadcn/ui Button component
- `@/lib/utils`: cn utility for class merging

### Future Enhancements

- User avatar upload
- Notification badge on navigation items
- Collapsible navigation groups
- Search functionality in sidebar
- Keyboard shortcuts
- Theme toggle (light/dark mode)

### Testing

To test the Sidebar component:

1. **Desktop view**: Verify sidebar is always visible
2. **Mobile view**: 
   - Click menu button to open
   - Verify overlay appears
   - Click overlay to close
   - Click close button to close
   - Navigate to different route (should auto-close)
3. **User profile**: Verify email displays correctly
4. **Logout**: Click logout button and verify redirect
5. **Navigation**: Click each nav item and verify active state

### Related Tasks

- ✅ Task 4.2.1: Create navigation structure
- ✅ Task 4.2.2: Add user profile section
- ✅ Task 4.2.3: Implement logout button
- ✅ Task 4.2.4: Add mobile collapse functionality
- ✅ Task 4.2.5: Style with Google Drive-inspired design
- 🔄 Task 4.3: Implement Header component (next)
