// T008 - Performance contract test for Core Web Vitals
// This test MUST FAIL initially to ensure proper TDD implementation
import { test, expect } from '@playwright/test';
import { setupPerformanceTesting, collectCoreWebVitals } from './setup.js';
import { performanceConfig } from './config.js';

const BASE_URL = 'http://localhost:4321/ali-portfolio';

test.describe('Core Web Vitals Performance Contract Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupPerformanceTesting(page, 'coldCache');
  });

  test('Largest Contentful Paint (LCP) ≤2.5s', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Wait for page to fully load and collect metrics
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Allow time for LCP to be measured
    
    const metrics = await collectCoreWebVitals(page);
    const lcpSeconds = metrics.lcp / 1000;
    const threshold = performanceConfig.coreWebVitals.lcp.good / 1000;
    
    // Contract: LCP must be ≤2.5s for good performance
    // This will likely fail initially since we haven't optimized for performance
    expect(lcpSeconds, 
      `LCP should be ≤${threshold}s but was ${lcpSeconds.toFixed(2)}s. Optimize critical resource loading.`
    ).toBeLessThanOrEqual(threshold);
    
    // Additional check for warning threshold
    const warningThreshold = performanceConfig.coreWebVitals.lcp.needsImprovement / 1000;
    if (lcpSeconds > threshold && lcpSeconds <= warningThreshold) {
      console.warn(`LCP ${lcpSeconds.toFixed(2)}s needs improvement (target: ≤${threshold}s)`);
    }
  });

  test('Cumulative Layout Shift (CLS) ≤0.1', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Simulate some user interactions to trigger potential layout shifts
    await page.hover('body');
    await page.click('[data-component="mode-toggle"]', { timeout: 5000 });
    await page.waitForTimeout(1000);
    
    // Scroll to trigger any layout shifts during scroll
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await page.waitForTimeout(500);
    
    const metrics = await collectCoreWebVitals(page);
    const clsScore = metrics.cls;
    const threshold = performanceConfig.coreWebVitals.cls.good;
    
    // Contract: CLS must be ≤0.1 for good visual stability
    // This will likely fail initially since layout shifts haven't been prevented
    expect(clsScore, 
      `CLS should be ≤${threshold} but was ${clsScore.toFixed(3)}. Minimize unexpected layout shifts.`
    ).toBeLessThanOrEqual(threshold);
    
    // Log warning for improvement range
    const warningThreshold = performanceConfig.coreWebVitals.cls.needsImprovement;
    if (clsScore > threshold && clsScore <= warningThreshold) {
      console.warn(`CLS ${clsScore.toFixed(3)} needs improvement (target: ≤${threshold})`);
    }
  });

  test('Interaction to Next Paint (INP) ≤200ms', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Perform various interactions to measure INP
    const interactions = [
      async () => await page.hover('[data-component="mode-toggle"]'),
      async () => await page.click('[data-component="mode-toggle"]'),
      async () => await page.click('[data-component="mode-toggle"]'), // Toggle back
      async () => await page.hover('a[href]'),
      async () => await page.keyboard.press('Tab'),
      async () => await page.keyboard.press('Tab')
    ];
    
    // Execute interactions with small delays
    for (const interaction of interactions) {
      try {
        await interaction();
        await page.waitForTimeout(200);
      } catch (error) {
        console.warn('Interaction failed:', error.message);
      }
    }
    
    await page.waitForTimeout(1000);
    
    const metrics = await collectCoreWebVitals(page);
    const inpMs = metrics.inp;
    const threshold = performanceConfig.coreWebVitals.inp.good;
    
    // Contract: INP must be ≤200ms for good responsiveness
    // This will likely fail initially since interaction optimizations haven't been implemented
    expect(inpMs, 
      `INP should be ≤${threshold}ms but was ${inpMs.toFixed(1)}ms. Optimize interaction response times.`
    ).toBeLessThanOrEqual(threshold);
    
    // Log warning for improvement range
    const warningThreshold = performanceConfig.coreWebVitals.inp.needsImprovement;
    if (inpMs > threshold && inpMs <= warningThreshold) {
      console.warn(`INP ${inpMs.toFixed(1)}ms needs improvement (target: ≤${threshold}ms)`);
    }
  });

  test('First Contentful Paint (FCP) ≤1.8s', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const metrics = await collectCoreWebVitals(page);
    const fcpSeconds = metrics.fcp / 1000;
    const threshold = 1.8; // Good FCP threshold
    
    // Contract: FCP should be ≤1.8s for perceived loading performance
    // This will likely fail initially without performance optimizations
    expect(fcpSeconds, 
      `FCP should be ≤${threshold}s but was ${fcpSeconds.toFixed(2)}s. Optimize critical rendering path.`
    ).toBeLessThanOrEqual(threshold);
  });

  test('Time to First Byte (TTFB) ≤600ms', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const metrics = await collectCoreWebVitals(page);
    const ttfbMs = metrics.ttfb;
    const threshold = 600; // Good TTFB threshold in ms
    
    // Contract: TTFB should be ≤600ms for good server response
    // This will likely pass since we're running locally, but might fail in production
    expect(ttfbMs, 
      `TTFB should be ≤${threshold}ms but was ${ttfbMs.toFixed(1)}ms. Optimize server response time.`
    ).toBeLessThanOrEqual(threshold);
  });

  // Mobile-specific Core Web Vitals tests
  test('Mobile LCP ≤2.5s on slow 3G', async ({ page }) => {
    // Simulate slow 3G network
    await page.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
      await route.continue();
    });
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000); // Allow more time for slow network
    
    const metrics = await collectCoreWebVitals(page);
    const lcpSeconds = metrics.lcp / 1000;
    const threshold = performanceConfig.coreWebVitals.lcp.good / 1000;
    
    // Contract: Mobile LCP must still meet threshold even on slow networks
    // This will likely fail initially since mobile performance isn't optimized
    expect(lcpSeconds, 
      `Mobile LCP on slow 3G should be ≤${threshold}s but was ${lcpSeconds.toFixed(2)}s. Optimize for mobile networks.`
    ).toBeLessThanOrEqual(threshold * 1.2); // Allow 20% margin for mobile
  });

  test('Print mode transition doesn\'t cause layout shifts', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Measure CLS before mode switch
    await page.waitForTimeout(1000);
    const initialMetrics = await collectCoreWebVitals(page);
    const initialCLS = initialMetrics.cls;
    
    // Toggle to print mode
    await page.click('[data-component="mode-toggle"]');
    await page.waitForTimeout(500);
    
    // Toggle back to digital mode
    await page.click('[data-component="mode-toggle"]');
    await page.waitForTimeout(500);
    
    // Measure CLS after mode switches
    const finalMetrics = await collectCoreWebVitals(page);
    const finalCLS = finalMetrics.cls;
    
    const clsIncrease = finalCLS - initialCLS;
    const maxAllowedIncrease = 0.05;
    
    // Contract: Mode switching should not cause significant layout shifts
    // This will likely fail initially since mode transitions aren't optimized
    expect(clsIncrease, 
      `Mode switching caused ${clsIncrease.toFixed(3)} CLS increase. Should be ≤${maxAllowedIncrease}.`
    ).toBeLessThanOrEqual(maxAllowedIncrease);
  });

  test('Terminal ASCII art doesn\'t block main thread', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Measure main thread blocking time
    const mainThreadMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        let startTime = performance.now();
        let blockingTime = 0;
        
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) { // Long task threshold
              blockingTime += entry.duration - 50;
            }
          }
        });
        
        observer.observe({ entryTypes: ['longtask'] });
        
        setTimeout(() => {
          observer.disconnect();
          resolve({
            totalBlockingTime: blockingTime,
            duration: performance.now() - startTime
          });
        }, 3000);
      });
    });
    
    const threshold = 200; // TBT threshold in ms
    
    // Contract: Terminal rendering should not create excessive main thread blocking
    // This might fail if ASCII art rendering blocks the main thread
    expect(mainThreadMetrics.totalBlockingTime, 
      `Total Blocking Time should be ≤${threshold}ms but was ${mainThreadMetrics.totalBlockingTime.toFixed(1)}ms. Optimize terminal rendering.`
    ).toBeLessThanOrEqual(threshold);
  });

  test('Core Web Vitals pass on repeat visits (warm cache)', async ({ page }) => {
    // First visit to warm the cache
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Second visit (warm cache)
    await setupPerformanceTesting(page, 'warmCache');
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const metrics = await collectCoreWebVitals(page);
    
    const lcpSeconds = metrics.lcp / 1000;
    const clsScore = metrics.cls;
    const inpMs = metrics.inp;
    
    const lcpThreshold = performanceConfig.coreWebVitals.lcp.good / 1000;
    const clsThreshold = performanceConfig.coreWebVitals.cls.good;
    const inpThreshold = performanceConfig.coreWebVitals.inp.good;
    
    // Contract: Warm cache should have even better performance
    // These might fail initially but should pass more easily than cold cache tests
    expect(lcpSeconds, 
      `Warm cache LCP should be ≤${lcpThreshold}s but was ${lcpSeconds.toFixed(2)}s`
    ).toBeLessThanOrEqual(lcpThreshold * 0.8); // Expect 20% better with warm cache
    
    expect(clsScore, 
      `Warm cache CLS should be ≤${clsThreshold} but was ${clsScore.toFixed(3)}`
    ).toBeLessThanOrEqual(clsThreshold);
    
    expect(inpMs, 
      `Warm cache INP should be ≤${inpThreshold}ms but was ${inpMs.toFixed(1)}ms`
    ).toBeLessThanOrEqual(inpThreshold);
  });
});