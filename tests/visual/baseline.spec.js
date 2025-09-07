// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Visual Regression Baselines', () => {
  test('capture desktop baseline (1280x800)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/ali-portfolio');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Allow animations/particles to settle
    
    // Take screenshot for baseline
    await expect(page).toHaveScreenshot('baseline-desktop.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('capture tablet baseline (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/ali-portfolio');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take screenshot for baseline
    await expect(page).toHaveScreenshot('baseline-tablet.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('capture mobile baseline (375x667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/ali-portfolio');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take screenshot for baseline
    await expect(page).toHaveScreenshot('baseline-mobile.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('capture mode switcher states', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/ali-portfolio');
    await page.waitForLoadState('networkidle');
    
    // Test digital mode (default)
    await expect(page.locator('.view-switcher')).toHaveScreenshot('mode-switcher-digital.png');
    
    // Switch to print mode and test
    await page.click('.view-switcher');
    await page.waitForTimeout(500); // Wait for mode switch animation
    await expect(page.locator('.view-switcher')).toHaveScreenshot('mode-switcher-print.png');
  });
});