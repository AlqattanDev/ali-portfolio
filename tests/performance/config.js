// Performance Testing Configuration  
// Based on specs/001-enhancing-the-overall/contracts/performance.yml

export const performanceConfig = {
  // Core Web Vitals thresholds (from performance.yml)
  coreWebVitals: {
    // Largest Contentful Paint - measures loading performance
    lcp: {
      good: 2500, // <2.5s is good
      needsImprovement: 4000, // 2.5-4s needs improvement  
      poor: 4001 // >4s is poor
    },
    // Cumulative Layout Shift - measures visual stability
    cls: {
      good: 0.1, // <0.1 is good
      needsImprovement: 0.25, // 0.1-0.25 needs improvement
      poor: 0.251 // >0.25 is poor
    },
    // Interaction to Next Paint - measures responsiveness
    inp: {
      good: 200, // <200ms is good
      needsImprovement: 500, // 200-500ms needs improvement
      poor: 501 // >500ms is poor
    }
  },

  // Resource budget thresholds (from performance.yml)
  resourceBudgets: {
    // Total page size limits
    totalPage: {
      budget: 1500000, // <1.5MB total
      warning: 1200000, // 1.2MB warning threshold
      critical: 1500000 // 1.5MB critical threshold
    },
    // CSS bundle size
    css: {
      budget: 51200, // <50KB CSS
      warning: 40960, // 40KB warning
      critical: 51200 // 50KB critical
    },
    // Combined font size
    fonts: {
      budget: 153600, // <150KB combined fonts  
      warning: 122880, // 120KB warning
      critical: 153600 // 150KB critical
    },
    // JavaScript bundle size
    javascript: {
      budget: 512000, // <500KB JS
      warning: 409600, // 400KB warning
      critical: 512000 // 500KB critical
    },
    // Image optimization
    images: {
      budget: 1000000, // <1MB total images
      warning: 800000, // 800KB warning
      critical: 1000000, // 1MB critical
      formats: ['webp', 'avif', 'jpeg', 'png'] // Preferred formats
    }
  },

  // Lighthouse score thresholds (from performance.yml)
  lighthouseScores: {
    performance: {
      target: 95, // ≥95 target score
      minimum: 90, // 90 minimum acceptable
      warning: 85 // <85 triggers warning
    },
    accessibility: {
      target: 100, // 100% accessibility required
      minimum: 100, // No compromise on accessibility
      warning: 95 // <95 triggers warning
    },
    bestPractices: {
      target: 95, // ≥95 target score
      minimum: 90, // 90 minimum acceptable  
      warning: 85 // <85 triggers warning
    },
    seo: {
      target: 100, // Perfect SEO score
      minimum: 95, // 95 minimum
      warning: 90 // <90 triggers warning
    }
  },

  // Network conditions for testing
  networkConditions: {
    // Fast 3G simulation
    fast3G: {
      offline: false,
      downloadThroughput: 1500000, // 1.5 Mbps
      uploadThroughput: 750000, // 750 Kbps  
      latency: 40 // 40ms RTT
    },
    // Slow 3G simulation
    slow3G: {
      offline: false,
      downloadThroughput: 500000, // 500 Kbps
      uploadThroughput: 500000, // 500 Kbps
      latency: 300 // 300ms RTT
    },
    // Regular 4G
    regular4G: {
      offline: false,
      downloadThroughput: 4000000, // 4 Mbps
      uploadThroughput: 3000000, // 3 Mbps
      latency: 20 // 20ms RTT
    }
  },

  // Responsive performance testing
  devices: [
    {
      name: 'Mobile',
      viewport: { width: 375, height: 667 },
      deviceScaleFactor: 2,
      isMobile: true,
      network: 'fast3G'
    },
    {
      name: 'Tablet', 
      viewport: { width: 768, height: 1024 },
      deviceScaleFactor: 2,
      isMobile: true,
      network: 'regular4G'
    },
    {
      name: 'Desktop',
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
      isMobile: false,
      network: 'regular4G'
    }
  ],

  // Performance metrics to collect
  metrics: {
    // Runtime performance
    runtime: [
      'firstContentfulPaint',
      'largestContentfulPaint',
      'firstMeaningfulPaint',
      'speedIndex',
      'totalBlockingTime',
      'cumulativeLayoutShift',
      'interactionToNextPaint'
    ],
    // Resource metrics
    resources: [
      'totalResourceCount',
      'totalResourceSize',
      'cssResourceCount', 
      'cssResourceSize',
      'jsResourceCount',
      'jsResourceSize',
      'fontResourceCount',
      'fontResourceSize',
      'imageResourceCount',
      'imageResourceSize'
    ],
    // Custom metrics
    custom: [
      'terminalRenderTime', // Time to render ASCII art
      'modeToggleResponseTime', // Print mode switch speed
      'scrollAnimationPerformance', // Smooth scrolling metrics
      'interactiveBudget' // Main thread budget
    ]
  },

  // Performance testing scenarios
  scenarios: {
    // Cold cache - first visit
    coldCache: {
      clearCache: true,
      disableCache: false,
      iterations: 3
    },
    // Warm cache - repeat visit
    warmCache: {
      clearCache: false, 
      disableCache: false,
      iterations: 3
    },
    // No cache - worst case
    noCache: {
      clearCache: true,
      disableCache: true,
      iterations: 3
    }
  },

  // Alert thresholds
  alerts: {
    // Performance regression detection
    regression: {
      lcp: 500, // 500ms increase triggers alert
      cls: 0.05, // 0.05 increase triggers alert
      inp: 100, // 100ms increase triggers alert
      lighthouse: 5 // 5 point decrease triggers alert
    },
    // Resource budget violations
    budget: {
      css: 10240, // 10KB over budget triggers alert
      js: 51200, // 50KB over budget triggers alert 
      fonts: 15360, // 15KB over budget triggers alert
      total: 153600 // 150KB over total budget triggers alert
    }
  }
};

export default performanceConfig;