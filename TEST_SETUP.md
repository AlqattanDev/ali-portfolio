# Test Environment Setup

This document provides solutions for common test environment issues.

## ChromeDriver Installation Issues

If you encounter ChromeDriver installation failures during `npm install`, this is typically an environment-specific issue. Here are solutions:

### For Local Development:
```bash
# Option 1: Install without optional dependencies
npm install --omit=optional

# Option 2: Use CI flag to skip optional post-install scripts
npm ci --omit=optional

# Option 3: Set environment variable to skip chromedriver
CHROMEDRIVER_SKIP_DOWNLOAD=true npm install
```

### For CI Environment:
The CI environment uses Playwright's built-in browsers, which are installed separately:
```bash
npx playwright install --with-deps
```

### Package.json Scripts:
- Use `npm run test` (uses Playwright's browsers)
- Use `npm run test:accessibility` (uses axe-core)
- Use `npm run test:lhci` (uses Lighthouse CI)

## Fixed Issues:

1. **Lighthouse Config**: Changed from `.lighthouserc.json` to `.lighthouserc.js`
2. **Server URLs**: Updated to use `npm run preview` with correct base path
3. **Playwright Config**: Updated baseURL to include `/ali-portfolio` base path
4. **Workflow URLs**: All wait-on commands now use correct endpoints

## Test Commands:

```bash
# Visual regression tests
npm run test:visual

# Accessibility tests
npm run test:accessibility

# Performance tests
npm run test:performance

# All tests
npm run test:all
```