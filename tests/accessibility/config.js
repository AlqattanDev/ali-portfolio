// Accessibility Testing Configuration
// Based on WCAG 2.1 Level AA guidelines

export const accessibilityConfig = {
  // Color contrast ratios from specs/001-enhancing-the-overall/contracts/accessibility.yml
  colorContrast: {
    digital: {
      // Digital mode contrast ratios
      primaryText: 14, // 14:1 ratio
      secondaryText: 7, // 7:1 ratio  
      accentText: 12 // 12:1 ratio
    },
    print: {
      // Print mode contrast ratios (higher for print clarity)
      primaryText: 21, // 21:1 ratio
      secondaryText: 12.6, // 12.6:1 ratio
      accentText: 18 // 18:1 ratio (calculated)
    }
  },

  // Keyboard navigation requirements
  keyboardNav: {
    // Tab order should follow logical reading flow
    tabOrder: [
      'mode-toggle',
      'contact-links',
      'project-cards', 
      'skill-sections',
      'footer-links'
    ],
    // Focus indicators must be visible
    focusIndicators: {
      minOutlineWidth: '2px',
      minContrastRatio: 3, // WCAG AA minimum
      style: 'solid'
    },
    // Keyboard shortcuts
    shortcuts: {
      'Escape': 'close-modals',
      'Tab': 'next-element',
      'Shift+Tab': 'previous-element',
      'Enter': 'activate-element',
      'Space': 'activate-button'
    }
  },

  // Screen reader compatibility
  screenReader: {
    // Semantic HTML structure
    landmarks: [
      'header',
      'main', 
      'nav',
      'aside',
      'footer'
    ],
    // ARIA labels required
    ariaLabels: {
      required: [
        'mode-toggle',
        'contact-links',
        'project-showcase',
        'skill-matrix'
      ]
    },
    // Heading hierarchy (must be sequential)
    headingHierarchy: {
      h1: 1, // Only one h1 per page
      h2: 'multiple', // Section headings
      h3: 'multiple', // Subsection headings
      skipLevels: false // No skipping (h1 -> h3)
    },
    // Alternative text requirements
    altText: {
      images: 'required',
      decorativeImages: 'empty-alt',
      complexGraphics: 'detailed-description'
    }
  },

  // Testing tools integration
  tools: {
    // axe-core configuration
    axeCore: {
      rules: {
        // Enable all WCAG 2.1 AA rules
        'wcag21aa': true,
        'color-contrast': true,
        'keyboard': true,
        'focus-order-semantics': true,
        'aria-valid-attr': true,
        'landmark-unique': true
      },
      tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
      // Custom rule configuration
      customRules: {
        'terminal-theme-contrast': {
          enabled: true,
          impact: 'critical'
        }
      }
    },

    // Playwright accessibility testing
    playwright: {
      // Scan entire page
      fullPageScan: true,
      // Include shadow DOM
      includeShadowDom: true,
      // Test keyboard navigation
      keyboardNavigation: true,
      // Screen reader simulation
      screenReaderTest: true
    }
  },

  // Responsive accessibility
  responsive: {
    // Test across viewports
    viewports: [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1280, height: 800, name: 'desktop' }
    ],
    // Touch targets (minimum 44x44px)
    touchTargets: {
      minSize: 44,
      spacing: 8
    }
  },

  // Performance accessibility
  performance: {
    // Animation preferences
    reducedMotion: {
      respectPreference: true,
      fallbackToStatic: true
    },
    // Loading accessibility
    loadingStates: {
      skipLinks: true,
      progressIndicators: true,
      loadingAnnouncements: true
    }
  }
};

export default accessibilityConfig;