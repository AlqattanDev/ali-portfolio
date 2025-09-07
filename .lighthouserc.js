module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/'],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 11024,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.90 }],
        'categories:seo': ['error', { minScore: 0.90 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1500 }],
        'interactive': ['error', { maxNumericValue: 3000 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './tests/performance/lighthouse-reports',
    },
  },
};