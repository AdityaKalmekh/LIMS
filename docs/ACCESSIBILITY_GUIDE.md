# Accessibility Guide

This document outlines the accessibility features implemented in the LIMS application to ensure WCAG AA compliance.

## Focus States

All interactive elements have visible focus states for keyboard navigation:

### Buttons
- Focus ring with 3px width using primary color
- Smooth transition on focus (150ms)
- High contrast for visibility

### Links
- Focus ring with 2px width
- Ring offset for better visibility
- Rounded corners for smooth appearance

### Form Inputs
- Focus ring with 3px width
- Border color changes to primary
- Smooth transition on focus

### Navigation Links
- Focus ring with 2px width
- Ring offset for separation from background
- Maintains active state styling

## Keyboard Navigation

All interactive elements are keyboard accessible:

### Tab Order
- Logical tab order follows visual layout
- Skip links available for main content
- Modal dialogs trap focus appropriately

### Keyboard Shortcuts
- `Tab`: Move to next interactive element
- `Shift + Tab`: Move to previous interactive element
- `Enter`: Activate buttons and links
- `Space`: Activate buttons and checkboxes
- `Escape`: Close modals and dialogs

## Screen Reader Support

### Semantic HTML
- Proper heading hierarchy (h1, h2, h3)
- Semantic landmarks (nav, main, aside)
- Descriptive labels for form inputs

### ARIA Labels
- Icon buttons have `aria-label` attributes
- Loading states have `aria-live` regions
- Error messages are announced
- Success messages are announced

### Form Accessibility
- All inputs have associated labels
- Required fields are marked with `*` and `aria-required`
- Error messages are linked to inputs with `aria-describedby`
- Validation errors are announced

## Color Contrast

All text meets WCAG AA contrast requirements:

### Text Colors
- Body text: 4.5:1 contrast ratio minimum
- Large text (18pt+): 3:1 contrast ratio minimum
- Interactive elements: 3:1 contrast ratio minimum

### Status Colors
- Success: Green with sufficient contrast
- Error: Red with sufficient contrast
- Warning: Orange with sufficient contrast
- Info: Blue with sufficient contrast

## Touch Targets

All interactive elements meet minimum touch target sizes:

### Minimum Sizes
- Buttons: 44x44px minimum
- Links: 44x44px minimum (with padding)
- Form inputs: 44px height minimum
- Checkboxes/Radio buttons: 24x24px with larger hit area

## Loading States

Loading states are accessible:

### Visual Indicators
- Spinning loader icon
- Loading text for context
- Disabled state for buttons during loading

### Screen Reader Announcements
- Loading states announced with `aria-live`
- Completion states announced
- Error states announced

## Toast Notifications

Toast notifications are accessible:

### Visual Design
- High contrast colors
- Clear icons for status
- Sufficient size and padding

### Screen Reader Support
- Announced with `aria-live="polite"`
- Descriptive messages
- Action buttons are keyboard accessible

## Testing Checklist

Use this checklist to verify accessibility:

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus states are visible
- [ ] No keyboard traps

### Screen Reader
- [ ] All content is announced correctly
- [ ] Form labels are associated
- [ ] Error messages are announced
- [ ] Loading states are announced

### Color Contrast
- [ ] Text meets contrast requirements
- [ ] Interactive elements meet contrast requirements
- [ ] Focus indicators are visible

### Touch Targets
- [ ] All buttons meet minimum size
- [ ] All links meet minimum size
- [ ] Form inputs meet minimum size

## Tools for Testing

### Browser Extensions
- **axe DevTools**: Automated accessibility testing
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Accessibility audit in Chrome DevTools

### Screen Readers
- **NVDA** (Windows): Free screen reader
- **JAWS** (Windows): Professional screen reader
- **VoiceOver** (macOS/iOS): Built-in screen reader
- **TalkBack** (Android): Built-in screen reader

### Keyboard Testing
- Test all functionality with keyboard only
- Verify focus states are visible
- Check tab order is logical

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
