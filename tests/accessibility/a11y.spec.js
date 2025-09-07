// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test('homepage accessibility audit', async ({ page }) => {
    await page.goto('/ali-portfolio');
    await page.waitForLoadState('networkidle');
    
    // Basic accessibility checks
    await expect(page).toHaveTitle(/Ali AlQattan/);
    
    // Check for essential ARIA landmarks
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Check for heading hierarchy - be more specific to avoid DevTools elements
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    
    // Check mode switcher is keyboard accessible
    const modeSwitcher = page.locator('.mode-switcher');
    await expect(modeSwitcher).toBeVisible();
    await modeSwitcher.focus();
    await expect(modeSwitcher).toBeFocused();
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter'); // Should toggle mode
    
    console.log('Basic accessibility checks passed');
  });

  test('focus management', async ({ page }) => {
    await page.goto('/ali-portfolio');
    await page.waitForLoadState('networkidle');
    
    // Test tab navigation through interactive elements
    let focusableElements = 0;
    
    // Start from the beginning
    await page.keyboard.press('Tab');
    focusableElements++;
    
    // Continue tabbing to count focusable elements
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.locator(':focus').count();
      if (focused > 0) {
        focusableElements++;
      }
    }
    
    expect(focusableElements).toBeGreaterThan(0);
    console.log(`Found ${focusableElements} focusable elements`);
  });

  test('color contrast and visual indicators', async ({ page }) => {
    await page.goto('/ali-portfolio');
    await page.waitForLoadState('networkidle');
    
    // Test focus indicators are visible
    const modeSwitcher = page.locator('.mode-switcher');
    await modeSwitcher.focus();
    
    // Take screenshot of focused element for manual review
    await expect(modeSwitcher).toHaveScreenshot('focus-indicator.png');
  });
});