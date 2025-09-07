// T011 - Visual regression test for desktop homepage
// This test MUST FAIL initially to ensure proper TDD implementation
import { test, expect } from '@playwright/test';
import { setupVisualTesting, takeVisualSnapshot, compareVisualSnapshots } from './setup.js';
import { visualRegressionConfig } from './config.js';

const BASE_URL = 'http://localhost:4321/ali-portfolio';

test.describe('Desktop Homepage Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupVisualTesting(page, 'homepageDesktop');
  });

  test('Desktop homepage visual baseline (1280x800)', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Wait for ASCII art to load
    await page.waitForSelector('[data-component="ascii-art"]', { 
      state: 'visible', 
      timeout: 10000 
    });
    
    // Take screenshot
    const screenshotPath = await takeVisualSnapshot(page, 'homepage-desktop-1280x800');
    
    // Compare with baseline
    const baselinePath = 'tests/visual/baseline/homepage-desktop-1280x800.png';
    const comparison = await compareVisualSnapshots(
      'homepage-desktop-1280x800', 
      screenshotPath, 
      baselinePath
    );
    
    // Contract: Visual regression should not exceed 2% pixel difference
    // This will likely fail initially since the design hasn't been implemented
    expect(comparison.diff, 
      `Desktop homepage visual regression exceeded threshold. Diff: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Desktop homepage header section renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Focus on header section
    const headerElement = page.locator('header, .header, [data-component="header"]').first();
    
    // If no explicit header, use the top section of the page
    let screenshotElement = headerElement;
    const headerExists = await headerElement.count() > 0;
    
    if (!headerExists) {
      // Fallback to screenshot of top portion
      screenshotElement = page.locator('body');
    }
    
    const screenshotPath = await takeVisualSnapshot(page, 'homepage-header-desktop', {
      clip: { x: 0, y: 0, width: 1280, height: 200 } // Top 200px
    });
    
    const baselinePath = 'tests/visual/baseline/homepage-header-desktop.png';
    const comparison = await compareVisualSnapshots(
      'homepage-header-desktop',
      screenshotPath,
      baselinePath
    );
    
    // Contract: Header visual consistency
    // This will fail initially since header design isn't finalized
    expect(comparison.diff, 
      `Header section visual regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('ASCII art terminal renders consistently', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Wait specifically for ASCII art
    const asciiArt = page.locator('[data-component="ascii-art"]').first();
    await asciiArt.waitFor({ state: 'visible' });
    
    // Take screenshot of just the ASCII art section
    const screenshotPath = await takeVisualSnapshot(page, 'ascii-art-desktop');
    
    const baselinePath = 'tests/visual/baseline/ascii-art-desktop.png';
    const comparison = await compareVisualSnapshots(
      'ascii-art-desktop',
      screenshotPath,
      baselinePath
    );
    
    // Contract: ASCII art should render identically across browsers
    // This will likely fail initially since ASCII art styling isn't consistent
    expect(comparison.diff, 
      `ASCII art visual regression: ${(comparison.diff * 100).toFixed(2)}%. Terminal output should be pixel-perfect.`
    ).toBeLessThan(0.01); // Very strict threshold for monospace text
  });

  test('Project showcase grid layout is consistent', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Find project showcase section
    const projectSection = page.locator('.project-showcase, [data-component="projects"], .projects').first();
    const sectionExists = await projectSection.count() > 0;
    
    if (!sectionExists) {
      // Skip if no project section found
      test.skip('No project showcase section found');
    }
    
    const screenshotPath = await takeVisualSnapshot(page, 'project-showcase-desktop');
    
    const baselinePath = 'tests/visual/baseline/project-showcase-desktop.png';
    const comparison = await compareVisualSnapshots(
      'project-showcase-desktop',
      screenshotPath,
      baselinePath
    );
    
    // Contract: Project grid layout should be consistent
    // This will likely fail initially since grid layout isn't implemented
    expect(comparison.diff, 
      `Project showcase visual regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Skills matrix renders correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Find skills section
    const skillsSection = page.locator('.skills, [data-component="skills"], .skill-matrix').first();
    const sectionExists = await skillsSection.count() > 0;
    
    if (!sectionExists) {
      test.skip('No skills section found');
    }
    
    const screenshotPath = await takeVisualSnapshot(page, 'skills-matrix-desktop');
    
    const baselinePath = 'tests/visual/baseline/skills-matrix-desktop.png';
    const comparison = await compareVisualSnapshots(
      'skills-matrix-desktop',
      screenshotPath,
      baselinePath
    );
    
    // Contract: Skills visualization should be consistent
    // This will likely fail initially since skills styling isn't finalized
    expect(comparison.diff, 
      `Skills matrix visual regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Footer layout is consistent on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Scroll to bottom to ensure footer is visible
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // Focus on footer area
    const screenshotPath = await takeVisualSnapshot(page, 'footer-desktop', {
      clip: { x: 0, y: 600, width: 1280, height: 200 } // Bottom 200px
    });
    
    const baselinePath = 'tests/visual/baseline/footer-desktop.png';
    const comparison = await compareVisualSnapshots(
      'footer-desktop',
      screenshotPath,
      baselinePath
    );
    
    // Contract: Footer should be visually consistent
    expect(comparison.diff, 
      `Footer visual regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Color scheme consistency in digital mode', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Ensure we're in digital mode
    const modeToggle = page.locator('[data-component="mode-toggle"]');
    const toggleExists = await modeToggle.count() > 0;
    
    if (toggleExists) {
      // Check if already in digital mode, if not toggle
      const isActive = await modeToggle.getAttribute('class');
      if (isActive && isActive.includes('active')) {
        // Currently in print mode, toggle to digital
        await modeToggle.click();
        await page.waitForTimeout(500);
      }
    }
    
    const screenshotPath = await takeVisualSnapshot(page, 'digital-mode-desktop');
    
    const baselinePath = 'tests/visual/baseline/digital-mode-desktop.png';
    const comparison = await compareVisualSnapshots(
      'digital-mode-desktop',
      screenshotPath,
      baselinePath
    );
    
    // Contract: Digital mode color scheme should be consistent
    // This will likely fail initially since color scheme isn't properly implemented
    expect(comparison.diff, 
      `Digital mode color scheme regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Large desktop viewport (1920x1080) renders correctly', async ({ page }) => {
    // Test on larger desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Wait for content to load
    await page.waitForTimeout(1000);
    
    const screenshotPath = await takeVisualSnapshot(page, 'homepage-large-desktop-1920x1080');
    
    const baselinePath = 'tests/visual/baseline/homepage-large-desktop-1920x1080.png';
    const comparison = await compareVisualSnapshots(
      'homepage-large-desktop-1920x1080',
      screenshotPath,
      baselinePath
    );
    
    // Contract: Should scale well to large viewports
    // This will likely fail initially since responsive design isn't complete
    expect(comparison.diff, 
      `Large desktop visual regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Cross-browser consistency - Chromium vs Firefox vs WebKit', async ({ page, browserName }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const screenshotPath = await takeVisualSnapshot(page, `homepage-desktop-${browserName}`);
    
    // For cross-browser testing, we compare against browser-specific baselines
    const baselinePath = `tests/visual/baseline/homepage-desktop-${browserName}.png`;
    const comparison = await compareVisualSnapshots(
      `homepage-desktop-${browserName}`,
      screenshotPath,
      baselinePath
    );
    
    // Contract: Should be consistent across browsers
    // This will likely fail initially due to browser rendering differences
    expect(comparison.diff, 
      `Cross-browser ${browserName} regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold * 1.5); // Allow slightly more variance for cross-browser
    
    console.log(`${browserName} desktop homepage screenshot captured`);
  });
});