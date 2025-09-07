import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4321/ali-portfolio';

// Responsive breakpoints based on common standards
const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 667 },      // iPhone SE
  { name: 'mobile-large', width: 414, height: 896 }, // iPhone XR
  { name: 'tablet', width: 768, height: 1024 },      // iPad
  { name: 'desktop', width: 1280, height: 800 },     // Desktop
  { name: 'desktop-large', width: 1920, height: 1080 } // Large Desktop
];

test.describe('Visual Baseline Screenshots', () => {
  VIEWPORTS.forEach(({ name, width, height }) => {
    test(`Homepage baseline - ${name} (${width}x${height})`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize({ width, height });
      
      // Navigate to homepage
      await page.goto(BASE_URL);
      
      // Wait for page to load completely
      await page.waitForLoadState('networkidle');
      
      // Wait for any animations to settle
      await page.waitForTimeout(2000);
      
      // Take screenshot
      await page.screenshot({
        path: `tests/visual/baseline/homepage-${name}-${width}x${height}.png`,
        fullPage: true,
        animations: 'disabled' // Disable animations for consistent screenshots
      });
    });

    test(`Print mode baseline - ${name} (${width}x${height})`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize({ width, height });
      
      // Navigate to homepage
      await page.goto(BASE_URL);
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Switch to print mode if toggle exists
      const printToggle = await page.locator('[data-mode="print"], .mode-toggle, button:has-text("Print")').first();
      if (await printToggle.isVisible()) {
        await printToggle.click();
        await page.waitForTimeout(1000); // Wait for mode transition
      }
      
      // Take screenshot
      await page.screenshot({
        path: `tests/visual/baseline/print-mode-${name}-${width}x${height}.png`,
        fullPage: true,
        animations: 'disabled'
      });
    });
  });

  // Additional baseline for actual print media
  test('Print media baseline', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Emulate print media
    await page.emulateMedia({ media: 'print' });
    
    // Set to A4 size for print
    await page.setViewportSize({ width: 794, height: 1123 }); // A4 in pixels at 96 DPI
    
    await page.waitForTimeout(1000);
    
    await page.screenshot({
      path: 'tests/visual/baseline/print-media-a4.png',
      fullPage: true,
      animations: 'disabled'
    });
  });
});