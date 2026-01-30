# Dashboard Layout Structure

## Overview

This directory contains the dashboard layout and pages for the LIMS application. The layout provides a responsive grid structure with a sidebar and main content area.

## Structure

```
app/(dashboard)/
├── layout.tsx          # Dashboard layout with sidebar and header areas
└── dashboard/
    └── page.tsx        # Main dashboard page
```

## Layout Features

The dashboard layout (`layout.tsx`) provides:

### 1. Responsive Grid Layout
- **Desktop (lg+)**: Two-column layout with fixed sidebar (256px) and flexible main content
- **Mobile/Tablet**: Single column with collapsible sidebar (to be implemented in task 4.2.4)

### 2. Layout Areas

#### Sidebar Area (Left)
- Fixed width: 256px (w-64)
- Hidden on mobile, visible on desktop (lg:flex)
- White background with right border
- Prepared for navigation items (task 4.2)
- Currently shows placeholder content

#### Header Area (Top)
- Full width, fixed height: 64px (h-16)
- White background with bottom border and shadow
- Contains mobile menu button (placeholder)
- Prepared for:
  - "New" button (task 4.3.1)
  - Search bar (task 4.3.2)
  - View toggle (task 4.3.3)
  - Mobile menu toggle (task 4.3.4)

#### Main Content Area (Right)
- Flexible width, fills remaining space
- Scrollable overflow (overflow-y-auto)
- Gray background (bg-gray-50)
- Max width container: 1280px (max-w-7xl)
- Responsive padding

### 3. Mobile Responsiveness

The layout is mobile-first and responsive:
- **Mobile (<1024px)**: 
  - Sidebar hidden
  - Mobile menu button visible
  - Full-width content
  - Vertical stacking

- **Desktop (≥1024px)**:
  - Sidebar visible
  - Mobile menu button hidden
  - Side-by-side layout
  - Horizontal arrangement

## CSS Classes Used

### Layout Container
- `min-h-screen`: Full viewport height
- `bg-gray-50`: Light gray background
- `flex h-screen overflow-hidden`: Flexbox with controlled overflow

### Sidebar
- `hidden lg:flex lg:flex-shrink-0`: Hidden on mobile, flex on desktop
- `w-64`: Fixed width of 256px
- `border-r border-gray-200`: Right border
- `bg-white`: White background

### Main Content
- `flex-1`: Grows to fill available space
- `overflow-y-auto`: Vertical scrolling
- `max-w-7xl mx-auto`: Centered with max width
- `px-4 sm:px-6 lg:px-8`: Responsive padding

## Next Steps

The following tasks will enhance this layout:

1. **Task 4.2**: Implement Sidebar component
   - Navigation structure
   - User profile section
   - Logout button integration
   - Mobile collapse functionality

2. **Task 4.3**: Implement Header component
   - "New" button for patient registration
   - Search bar
   - View toggle (list/grid)
   - Mobile menu toggle

3. **Task 4.4**: Mobile responsiveness enhancements
   - Mobile sidebar drawer
   - Touch-friendly interactions
   - Responsive breakpoint testing

## Usage

The layout automatically wraps all pages in the `(dashboard)` route group. To create a new dashboard page:

```tsx
// app/(dashboard)/new-page/page.tsx
export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
      {/* Your content here */}
    </div>
  )
}
```

The page content will automatically be wrapped with:
- Sidebar navigation (left)
- Header (top)
- Proper spacing and responsive layout

## Design Inspiration

The layout follows Google Drive's interface design principles:
- Clean, minimal design
- Clear visual hierarchy
- Responsive grid layout
- Ample whitespace
- Modern shadow and border styling

## Technical Details

- **Framework**: Next.js 14+ App Router
- **Styling**: Tailwind CSS
- **Layout Type**: Server Component (default)
- **Route Group**: `(dashboard)` - groups routes without affecting URL structure

## Accessibility

The layout includes:
- Semantic HTML elements (`<aside>`, `<header>`, `<main>`, `<nav>`)
- ARIA labels for interactive elements
- Keyboard navigation support (to be enhanced in task 4.2 and 4.3)
- Focus management (to be implemented)

## Browser Support

Tested and supported on:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Related Files

- `/components/auth/LogoutButton.tsx` - Logout button component (used in sidebar)
- `/app/layout.tsx` - Root layout with global styles
- `/app/globals.css` - Global CSS styles
