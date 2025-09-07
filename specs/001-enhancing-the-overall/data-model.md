# Visual Design System Specification

## Color Palette

### Digital Mode (Dark Theme)
```css
:root {
  /* Background Layers */
  --bg-primary: #0a0a0a;      /* Main background */
  --bg-secondary: #1a1a1a;    /* Cards, sections */
  --bg-tertiary: #2a2a2a;     /* Elevated elements */
  
  /* Text Colors */
  --text-primary: #e0e0e0;    /* Main text (14:1 contrast) */
  --text-secondary: #a0a0a0;  /* Secondary text (7:1 contrast) */
  --text-muted: #666666;      /* Muted text (4.5:1 contrast) */
  
  /* Accent Colors */
  --accent-primary: #00ff41;   /* Main terminal green (12:1 contrast) */
  --accent-secondary: #39ff14; /* Bright highlights (15:1 contrast) */
  --accent-tertiary: #ffffff;  /* Important CTAs (21:1 contrast) */
  
  /* Functional Colors */
  --border-primary: #333333;   /* Main borders */
  --border-secondary: #1f1f1f; /* Subtle dividers */
  --surface-hover: #2d2d2d;    /* Interactive surface hover */
}
```

### Print Mode (Light Theme)
```css
body.print-view {
  /* Background Layers */
  --bg-primary: #ffffff;      /* White background */
  --bg-secondary: #f8f8f8;    /* Light gray sections */
  --bg-tertiary: #f0f0f0;     /* Subtle elevation */
  
  /* Text Colors */
  --text-primary: #000000;    /* Black text (21:1 contrast) */
  --text-secondary: #333333;  /* Dark gray text (12.6:1 contrast) */
  --text-muted: #666666;      /* Medium gray (7:1 contrast) */
  
  /* Accent Colors */
  --accent-primary: #000000;   /* Black for print clarity */
  --accent-secondary: #333333; /* Dark gray emphasis */
  --accent-tertiary: #000000;  /* Strong emphasis */
  
  /* Functional Colors */
  --border-primary: #000000;   /* Black borders for print */
  --border-secondary: #cccccc; /* Light gray dividers */
}
```

## Typography System

### Font Stack
```css
:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', monospace;
}
```

### Type Scale (Modular Scale: 1.25 - Major Third)
```css
:root {
  /* Base size: 16px */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.563rem;  /* 25px */
  --text-3xl: 1.953rem;  /* 31px */
  --text-4xl: 2.441rem;  /* 39px */
  --text-5xl: 3.052rem;  /* 49px */
  --text-6xl: 3.815rem;  /* 61px */
}
```

### Typography Hierarchy
```css
/* Level 1: Primary Headlines */
.text-hero {
  font-family: var(--font-primary);
  font-size: clamp(var(--text-3xl), 5vw, var(--text-5xl));
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

/* Level 2: Section Headers */
.text-section {
  font-family: var(--font-primary);
  font-size: clamp(var(--text-xl), 3vw, var(--text-2xl));
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

/* Level 3: Subsection Headers */
.text-subsection {
  font-family: var(--font-primary);
  font-size: var(--text-lg);
  font-weight: 600;
  line-height: 1.3;
}

/* Body Text */
.text-body {
  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: 400;
  line-height: 1.5;
}

/* Code/Terminal Text */
.text-mono {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 400;
  line-height: 1.4;
}
```

## Spacing System

### Base Spacing Scale (0.5rem base unit)
```css
:root {
  --space-px: 1px;
  --space-0: 0;
  --space-1: 0.125rem;  /* 2px */
  --space-2: 0.25rem;   /* 4px */
  --space-3: 0.375rem;  /* 6px */
  --space-4: 0.5rem;    /* 8px */
  --space-5: 0.625rem;  /* 10px */
  --space-6: 0.75rem;   /* 12px */
  --space-8: 1rem;      /* 16px */
  --space-10: 1.25rem;  /* 20px */
  --space-12: 1.5rem;   /* 24px */
  --space-16: 2rem;     /* 32px */
  --space-20: 2.5rem;   /* 40px */
  --space-24: 3rem;     /* 48px */
  --space-32: 4rem;     /* 64px */
  --space-40: 5rem;     /* 80px */
  --space-48: 6rem;     /* 96px */
  --space-64: 8rem;     /* 128px */
}
```

### Responsive Container Widths
```css
:root {
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
}

.container {
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
  padding-inline: var(--space-8);
}

@media (min-width: 768px) {
  .container {
    padding-inline: var(--space-16);
  }
}
```

## Responsive Breakpoints

### Breakpoint System
```css
:root {
  --breakpoint-sm: 640px;   /* Small devices */
  --breakpoint-md: 768px;   /* Tablets */
  --breakpoint-lg: 1024px;  /* Laptops */
  --breakpoint-xl: 1280px;  /* Desktops */
  --breakpoint-2xl: 1536px; /* Large desktops */
}
```

### Media Query Mixins (CSS Custom Properties approach)
```css
/* Mobile-first responsive typography */
.responsive-text {
  font-size: clamp(var(--text-base), 2.5vw, var(--text-lg));
}

/* Responsive grid columns */
.portfolio-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}

@media (min-width: 768px) {
  .portfolio-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-16);
  }
}

@media (min-width: 1024px) {
  .portfolio-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-20);
  }
}
```

## Component Design Tokens

### Interactive States
```css
:root {
  /* Timing Functions */
  --ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);
  --ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);
  
  /* Animation Durations */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  
  /* Focus Ring */
  --focus-ring: 0 0 0 2px var(--accent-primary);
  --focus-ring-offset: 2px;
}

/* Interactive Element Base */
.interactive {
  transition: all var(--duration-fast) var(--ease-out-cubic);
  cursor: pointer;
}

.interactive:hover {
  transform: translateY(-2px);
}

.interactive:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
}

/* Reduced Motion Respect */
@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Shadow System
```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  
  /* Glow effects for terminal theme */
  --glow-sm: 0 0 10px rgb(0 255 65 / 0.3);
  --glow-md: 0 0 20px rgb(0 255 65 / 0.4);
  --glow-lg: 0 0 30px rgb(0 255 65 / 0.5);
}
```

## Print Optimizations

### Print-Specific Tokens
```css
@media print {
  :root {
    /* Override colors for print */
    --bg-primary: #ffffff;
    --text-primary: #000000;
    --accent-primary: #000000;
    
    /* Print-optimized spacing */
    --space-print-margin: 2cm;
    --space-print-gutter: 1cm;
  }
  
  @page {
    margin: var(--space-print-margin);
    size: A4;
  }
  
  body {
    font-size: 11pt;
    line-height: 1.3;
    color: var(--text-primary) !important;
    background: var(--bg-primary) !important;
  }
  
  /* Hide interactive elements */
  .no-print {
    display: none !important;
  }
  
  /* Ensure page breaks */
  .print-break {
    page-break-after: always;
  }
  
  /* Show URLs for links */
  a[href]:not(.no-print-url):after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: var(--text-secondary);
  }
}
```

## Accessibility Tokens

### High Contrast Mode Support
```css
@media (prefers-contrast: high) {
  :root {
    --bg-primary: #000000;
    --text-primary: #ffffff;
    --accent-primary: #ffffff;
    --border-primary: #ffffff;
  }
}

/* Focus management */
.focus-trap {
  isolation: isolate;
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## Performance Tokens

### Critical CSS Loading Strategy
```css
/* Critical above-the-fold styles */
.critical {
  /* Essential layout and typography */
  font-family: var(--font-primary);
  color: var(--text-primary);
  background-color: var(--bg-primary);
}

/* Non-critical styles loaded separately */
.non-critical {
  /* Animations, hover effects, etc. */
}
```

This design system provides a comprehensive foundation for consistent, accessible, and performant styling across the portfolio while maintaining the terminal aesthetic and supporting both digital and print modes.