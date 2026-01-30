import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-semibold text-foreground">
              LIMS - Laboratory Information Management System
            </h1>
            <p className="text-lg text-muted-foreground">
              Tailwind CSS Configuration Test Page
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Link 
                href="/login"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                Login
              </Link>
              <Link 
                href="/signup"
                className="border border-border bg-background text-foreground px-6 py-2 rounded-md font-medium hover:bg-accent transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Color Palette Test */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Color Palette</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Primary */}
              <div className="bg-primary text-primary-foreground p-6 rounded-lg">
                <h3 className="font-medium text-sm mb-2">Primary</h3>
                <p className="text-xs">Blue - Main brand color</p>
              </div>

              {/* Secondary */}
              <div className="bg-secondary text-secondary-foreground p-6 rounded-lg">
                <h3 className="font-medium text-sm mb-2">Secondary</h3>
                <p className="text-xs">Light gray background</p>
              </div>

              {/* Accent */}
              <div className="bg-accent text-accent-foreground p-6 rounded-lg">
                <h3 className="font-medium text-sm mb-2">Accent</h3>
                <p className="text-xs">Accent color</p>
              </div>

              {/* Success */}
              <div className="bg-success text-white p-6 rounded-lg">
                <h3 className="font-medium text-sm mb-2">Success</h3>
                <p className="text-xs">Green - Success states</p>
              </div>

              {/* Error */}
              <div className="bg-error text-white p-6 rounded-lg">
                <h3 className="font-medium text-sm mb-2">Error</h3>
                <p className="text-xs">Red - Error states</p>
              </div>

              {/* Warning */}
              <div className="bg-warning text-white p-6 rounded-lg">
                <h3 className="font-medium text-sm mb-2">Warning</h3>
                <p className="text-xs">Orange - Warning states</p>
              </div>
            </div>
          </div>

          {/* Typography Test */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Typography</h2>
            <div className="space-y-2">
              <p className="text-sm font-medium">Font Family: Inter (from Google Fonts)</p>
              <p className="text-base font-normal">Body text - font-normal</p>
              <p className="text-lg font-medium">Label text - font-medium</p>
              <p className="text-xl font-semibold">Heading text - font-semibold</p>
            </div>
          </div>

          {/* Responsive Breakpoints Test */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Responsive Breakpoints</h2>
            <div className="bg-card border border-border p-6 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Current breakpoint:</p>
              <p className="text-base">
                <span className="inline sm:hidden">Mobile (&lt; 640px)</span>
                <span className="hidden sm:inline md:hidden">Tablet (640px - 1024px)</span>
                <span className="hidden md:inline">Desktop (&gt; 1024px)</span>
              </p>
            </div>
          </div>

          {/* Card Component Test */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Card Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card border border-border p-6 rounded-lg space-y-2">
                <h3 className="font-semibold text-card-foreground">Card Title</h3>
                <p className="text-sm text-muted-foreground">
                  This is a card component with proper spacing and border.
                </p>
              </div>
              <div className="bg-muted p-6 rounded-lg space-y-2">
                <h3 className="font-semibold text-foreground">Muted Card</h3>
                <p className="text-sm text-muted-foreground">
                  This card uses the muted background color.
                </p>
              </div>
            </div>
          </div>

          {/* Button Test */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Buttons</h2>
            <div className="flex flex-wrap gap-4">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity">
                Primary Button
              </button>
              <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-medium hover:bg-secondary/80 transition-colors">
                Secondary Button
              </button>
              <button className="border border-border bg-background text-foreground px-4 py-2 rounded-md font-medium hover:bg-accent transition-colors">
                Outline Button
              </button>
            </div>
          </div>

          {/* Container Test */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Container</h2>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                This page uses the container class with max-width of 80rem (max-w-7xl) and responsive padding:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                <li>Mobile: 1rem padding</li>
                <li>Tablet (≥640px): 1.5rem padding</li>
                <li>Desktop (≥1024px): 2rem padding</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
