# Tailwind CSS Configuration

## Overview

This project uses **Tailwind CSS v4** with a custom configuration based on the LIMS design specifications. Tailwind v4 uses a new configuration approach through CSS variables in the `globals.css` file instead of a separate `tailwind.config.js` file.

## Configuration Location

- **Main Configuration**: `app/globals.css`
- **PostCSS Config**: `postcss.config.mjs`
- **Font Setup**: `app/layout.tsx`

## Color Palette

The application uses a comprehensive color system defined in HSL format:

### Primary Colors
- **Primary**: `hsl(217 91% 60%)` - Blue (main brand color)
- **Primary Foreground**: `hsl(0 0% 100%)` - White text on primary

### Secondary Colors
- **Secondary**: `hsl(210 40% 96%)` - Light gray
- **Secondary Foreground**: `hsl(222 47% 11%)` - Dark text on secondary

### Accent Colors
- **Accent**: `hsl(210 40% 96%)` - Light gray accent
- **Accent Foreground**: `hsl(222 47% 11%)` - Dark text on accent

### Status Colors
- **Success**: `hsl(142 76% 36%)` - Green
- **Error**: `hsl(0 84% 60%)` - Red
- **Warning**: `hsl(38 92% 50%)` - Orange
- **Destructive**: `hsl(0 84% 60%)` - Red (for destructive actions)

### UI Colors
- **Background**: `hsl(0 0% 100%)` - White
- **Foreground**: `hsl(222 47% 11%)` - Dark gray (main text)
- **Card**: `hsl(0 0% 100%)` - White (card backgrounds)
- **Muted**: `hsl(210 40% 96%)` - Light gray (muted elements)
- **Border**: `hsl(214 32% 91%)` - Light gray (borders)
- **Input**: `hsl(214 32% 91%)` - Light gray (input borders)
- **Ring**: `hsl(217 91% 60%)` - Blue (focus rings)

## Typography

### Font Family
- **Primary Font**: Inter (loaded from Google Fonts)
- **Fallback**: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif

### Font Weights
- **Normal**: `font-normal` - Body text
- **Medium**: `font-medium` - Labels and emphasis
- **Semibold**: `font-semibold` - Headings

### Font Sizes
Use Tailwind's default font size utilities:
- `text-sm` - Small text (labels)
- `text-base` - Body text
- `text-lg` - Large text
- `text-xl`, `text-2xl`, etc. - Headings

## Responsive Breakpoints

The application follows these breakpoint definitions:

| Breakpoint | Min Width | Description |
|------------|-----------|-------------|
| Mobile     | < 640px   | Default (mobile-first) |
| Tablet     | 640px     | `sm:` prefix |
| Desktop    | 1024px    | `lg:` prefix |
| Large      | 1280px    | `xl:` prefix |

### Usage Examples
```tsx
// Mobile-first approach
<div className="text-sm sm:text-base lg:text-lg">
  Responsive text
</div>

// Hide on mobile, show on tablet+
<div className="hidden sm:block">
  Tablet and desktop only
</div>
```

## Container Configuration

The container utility is configured with:
- **Max Width**: 80rem (1280px) - equivalent to `max-w-7xl`
- **Responsive Padding**:
  - Mobile: 1rem (16px)
  - Tablet (≥640px): 1.5rem (24px)
  - Desktop (≥1024px): 2rem (32px)

### Usage
```tsx
<div className="container mx-auto">
  {/* Content with responsive padding */}
</div>
```

## Spacing

Use Tailwind's default spacing scale:
- **Card Padding**: `p-6` (1.5rem / 24px)
- **Form Spacing**: `space-y-4` (1rem / 16px between elements)
- **Button Padding**: `px-4 py-2` (horizontal: 1rem, vertical: 0.5rem)

## Border Radius

- **Default**: `rounded-lg` (0.5rem / 8px)
- **Small**: `rounded-md` (0.375rem / 6px)
- **Large**: `rounded-xl` (0.75rem / 12px)
- **Full**: `rounded-full` (9999px for pills/circles)

## Using Custom Colors in Components

### Buttons
```tsx
// Primary button
<button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
  Primary
</button>

// Secondary button
<button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md">
  Secondary
</button>

// Success button
<button className="bg-success text-white px-4 py-2 rounded-md">
  Success
</button>
```

### Cards
```tsx
// Standard card
<div className="bg-card border border-border p-6 rounded-lg">
  <h3 className="text-card-foreground font-semibold">Card Title</h3>
  <p className="text-muted-foreground">Card content</p>
</div>

// Muted card
<div className="bg-muted p-6 rounded-lg">
  <h3 className="text-foreground font-semibold">Muted Card</h3>
</div>
```

### Forms
```tsx
// Input field
<input 
  className="border border-input bg-background px-3 py-2 rounded-md focus:ring-2 focus:ring-ring"
  type="text"
/>

// Error state
<input 
  className="border border-error bg-background px-3 py-2 rounded-md"
  type="text"
/>
```

## Testing the Configuration

A test page has been created at `app/page.tsx` that demonstrates:
- All color palette colors
- Typography styles
- Responsive breakpoints
- Card components
- Button styles
- Container behavior

To view the test page:
```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## Tailwind CSS v4 Features

This project uses Tailwind CSS v4, which includes:
- **CSS-first configuration**: Configuration through CSS variables
- **Improved performance**: Faster build times
- **Better IntelliSense**: Enhanced IDE support
- **Modern CSS features**: Uses native CSS features where possible

## Adding Custom Utilities

To add custom utilities, add them to `globals.css`:

```css
@layer utilities {
  .custom-utility {
    /* Your styles */
  }
}
```

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Next.js with Tailwind CSS](https://nextjs.org/docs/app/building-your-application/styling/tailwind-css)
- [Inter Font on Google Fonts](https://fonts.google.com/specimen/Inter)

## Design Specifications Reference

This configuration implements the design specifications from:
- `.kiro/specs/lims-admin-patient-registration/design.md`

All colors, typography, and spacing follow the Google Drive-inspired design system specified in the requirements.
