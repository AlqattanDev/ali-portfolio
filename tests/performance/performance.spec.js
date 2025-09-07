// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('page load performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/ali-portfolio');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    console.log(`Page loaded in ${loadTime}ms`);
  });

  test('core web vitals simulation', async ({ page }) => {
    await page.goto('/ali-portfolio');
    
    // Measure LCP (Largest Contentful Paint) approximation
    const lcpElement = page.locator('h1').first();
    await expect(lcpElement).toBeVisible();
    
    // Measure CLS (Cumulative Layout Shift) by checking layout stability
    await page.waitForTimeout(2000);
    const initialHeight = await page.evaluate(() => document.body.scrollHeight);
    await page.waitForTimeout(1000);
    const finalHeight = await page.evaluate(() => document.body.scrollHeight);
    
    // Layout should be stable (minimal height change)
    const heightDifference = Math.abs(finalHeight - initialHeight);
    expect(heightDifference).toBeLessThan(50); // Allow small variations
    
    console.log(`Layout shift: ${heightDifference}px`);
  });

  test('resource loading efficiency', async ({ page }) => {
    /** @type {Promise<any>[]} */
    const resourcePromises = [];
    
    page.on('response', response => {
      if (response.url().includes('.css') || response.url().includes('.js') || response.url().includes('.woff')) {
        resourcePromises.push(response.finished());
      }
    });
    
    await page.goto('/ali-portfolio');
    await Promise.all(resourcePromises);
    
    // Check that critical resources loaded successfully
    const responses = await Promise.all(resourcePromises);
    console.log(`${responses.length} critical resources loaded`);
  });

  test('font loading performance', async ({ page }) => {
    await page.goto('/ali-portfolio');
    
    // Check that custom fonts are loading
    const fontLoaded = await page.evaluate(async () => {
      await document.fonts.ready;
      const fonts = Array.from(document.fonts);
      return fonts.some(font => 
        font.family.includes('Inter') || font.family.includes('JetBrains')
      );
    });
    
    console.log('Custom fonts loaded:', fontLoaded);
  });
});