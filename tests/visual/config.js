// Visual Regression Testing Configuration
// Based on specs/001-enhancing-the-overall/contracts/visual-regression.yml

export const visualRegressionConfig = {
  // Screenshot comparison settings
  comparison: {
    // Pixel difference threshold (2% from specs)
    threshold: 0.02, // 2% pixel difference allowed
    // Anti-aliasing threshold
    antialiasing: true,
    // Include/exclude alpha channel
    includeAA: false,
    // Comparison algorithm
    algorithm: 'pixelmatch'
  },

  // Viewport configurations for testing
  viewports: [
    {
      name: 'mobile',
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      isMobile: true
    },
    {
      name: 'mobile-large',
      width: 414, 
      height: 896,
      deviceScaleFactor: 2,
      isMobile: true
    },
    {
      name: 'tablet',
      width: 768,
      height: 1024,
      deviceScaleFactor: 2,
      isMobile: true
    },
    {
      name: 'desktop',
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      isMobile: false
    },
    {
      name: 'desktop-large',
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      isMobile: false
    }
  ],

  // Test scenarios from specs
  scenarios: {
    // Homepage desktop testing (T011)
    homepageDesktop: {
      url: '/',
      viewport: { width: 1280, height: 800 },
      mode: 'digital',
      waitForSelector: '.ascii-name',
      animations: 'disabled',
      fullPage: true
    },
    
    // Mobile responsiveness testing (T012) 
    homepageMobile: {
      url: '/',
      viewport: { width: 375, height: 667 },
      mode: 'digital',
      waitForSelector: '.ascii-name',
      animations: 'disabled',
      fullPage: true
    },

    // Print mode testing (T013)
    printMode: {
      url: '/',
      viewport: { width: 794, height: 1123 }, // A4 dimensions
      mode: 'print',
      waitForSelector: '[data-component="mode-toggle"]',
      animations: 'disabled',
      fullPage: true,
      emulateMedia: 'print'
    },

    // Mode switcher interactions (T014)
    modeSwitcher: {
      url: '/',
      viewport: { width: 1280, height: 800 },
      interactive: true,
      steps: [
        { action: 'hover', selector: '[data-component="mode-toggle"]' },
        { action: 'click', selector: '[data-component="mode-toggle"]' },
        { action: 'wait', duration: 500 }
      ],
      animations: 'allow'
    }
  },

  // Cross-browser testing (T036)
  browsers: [
    {
      name: 'chromium',
      channel: 'chrome',
      enabled: true
    },
    {
      name: 'firefox', 
      enabled: true
    },
    {
      name: 'webkit',
      enabled: true // Safari on macOS
    }
  ],

  // Screenshot settings
  screenshot: {
    // File format and quality
    type: 'png',
    quality: 90,
    // Full page vs viewport
    fullPage: true,
    // Animation handling
    animations: 'disabled', // 'disabled' | 'allow' | 'reduce'
    // Clip to specific area
    clip: null,
    // Omit background
    omitBackground: false,
    // Scale factor
    scale: 'css'
  },

  // Directory structure
  directories: {
    baseline: 'tests/visual/baseline/',
    actual: 'tests/visual/actual/',
    diff: 'tests/visual/diff/',
    reports: 'tests/visual/reports/'
  },

  // Naming conventions
  naming: {
    // Pattern: {scenario}-{browser}-{viewport}-{mode}.png
    pattern: '{scenario}-{browser}-{viewport}-{mode}',
    // Include timestamp in failures
    includeTimestamp: true,
    // Include commit hash
    includeCommitHash: false
  },

  // Wait conditions
  waitConditions: {
    // Network idle
    networkIdle: {
      enabled: true,
      timeout: 30000
    },
    // Element visibility
    elementVisible: {
      enabled: true,
      selectors: [
        '.ascii-name',
        '[data-component="mode-toggle"]',
        '[data-component="contact-info"]'
      ]
    },
    // Custom conditions
    custom: {
      // Wait for fonts to load
      fontsLoaded: {
        enabled: true,
        script: () => document.fonts.ready
      },
      // Wait for terminal animation to complete
      terminalReady: {
        enabled: true,
        script: () => {
          const terminal = document.querySelector('.ascii-name');
          return terminal; // Just check if ASCII art exists
        }
      }
    }
  },

  // Failure handling
  onFailure: {
    // Retry failed screenshots
    retries: 2,
    // Save diff images
    saveDiff: true,
    // Generate failure report
    generateReport: true,
    // Fail fast or continue
    failFast: false
  },

  // Performance considerations
  performance: {
    // Parallel test execution
    parallelBrowsers: 3,
    // Screenshot compression
    compression: true,
    // Memory optimization
    optimizeMemory: true,
    // Cleanup temp files
    cleanupTemp: true
  },

  // Integration settings
  integration: {
    // CI/CD pipeline
    ci: {
      // Update baselines on main branch
      updateBaselines: process.env.CI_BRANCH === 'main',
      // Artifact storage
      storeArtifacts: true,
      // Notification webhooks
      webhooks: []
    },
    // Version control
    git: {
      // Track baseline changes
      trackBaselines: true,
      // Auto-commit approved changes
      autoCommit: false
    }
  }
};

export default visualRegressionConfig;