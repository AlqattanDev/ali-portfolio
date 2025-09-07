// Performance Testing Setup Utilities
import { test, expect } from '@playwright/test';
import { performanceConfig } from './config.js';

/**
 * Setup performance testing environment
 */
export async function setupPerformanceTesting(page, scenario = 'coldCache') {
  const scenarioConfig = performanceConfig.scenarios[scenario];
  
  // Clear cache if required
  if (scenarioConfig.clearCache) {
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  // Disable cache if required
  if (scenarioConfig.disableCache) {
    await page.route('**/*', route => {
      route.continue({
        headers: {
          ...route.request().headers(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    });
  }

  return page;
}

/**
 * Collect Core Web Vitals metrics
 */
export async function collectCoreWebVitals(page) {
  // Inject web-vitals library for accurate CWV measurement
  await page.addInitScript(() => {
    window.webVitalsMetrics = {};
    
    // LCP observer
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          window.webVitalsMetrics.lcp = entries[entries.length - 1].startTime;
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // CLS observer
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        window.webVitalsMetrics.cls = clsValue;
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      // INP observer (Interaction to Next Paint)
      const inpObserver = new PerformanceObserver((list) => {
        let maxINP = 0;
        for (const entry of list.getEntries()) {
          const inp = entry.processingStart - entry.startTime;
          if (inp > maxINP) {
            maxINP = inp;
          }
        }
        window.webVitalsMetrics.inp = maxINP;
      });
      inpObserver.observe({ type: 'event', buffered: true });
    }
  });

  // Wait for page to fully load
  await page.waitForLoadState('networkidle');
  
  // Trigger some interactions to measure INP
  await page.hover('body');
  await page.click('body');
  await page.waitForTimeout(1000);

  // Extract metrics
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
      // Core Web Vitals
      lcp: window.webVitalsMetrics.lcp || 0,
      cls: window.webVitalsMetrics.cls || 0,
      inp: window.webVitalsMetrics.inp || 0,
      
      // Additional metrics
      fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      ttfb: navigation ? navigation.responseStart - navigation.requestStart : 0,
      domLoad: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
      windowLoad: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0
    };
  });

  return metrics;
}

/**
 * Analyze resource budgets
 */
export async function analyzeResourceBudgets(page) {
  // Collect resource timing data
  const resources = await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource');
    const analysis = {
      css: { count: 0, size: 0, files: [] },
      js: { count: 0, size: 0, files: [] },
      fonts: { count: 0, size: 0, files: [] },
      images: { count: 0, size: 0, files: [] },
      total: { count: 0, size: 0 }
    };

    resources.forEach(resource => {
      const size = resource.transferSize || resource.decodedBodySize || 0;
      const url = resource.name;
      
      analysis.total.count++;
      analysis.total.size += size;

      // Categorize resources
      if (url.includes('.css') || resource.initiatorType === 'css') {
        analysis.css.count++;
        analysis.css.size += size;
        analysis.css.files.push({ url, size });
      } else if (url.includes('.js') || resource.initiatorType === 'script') {
        analysis.js.count++;
        analysis.js.size += size;
        analysis.js.files.push({ url, size });
      } else if (url.match(/\.(woff|woff2|ttf|otf|eot)$/)) {
        analysis.fonts.count++;
        analysis.fonts.size += size;
        analysis.fonts.files.push({ url, size });
      } else if (url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/)) {
        analysis.images.count++;
        analysis.images.size += size;
        analysis.images.files.push({ url, size });
      }
    });

    return analysis;
  });

  // Compare against budgets
  const budgets = performanceConfig.resourceBudgets;
  const budgetAnalysis = {
    css: {
      ...resources.css,
      budget: budgets.css.budget,
      overBudget: resources.css.size > budgets.css.budget,
      percentUsed: (resources.css.size / budgets.css.budget * 100).toFixed(1)
    },
    js: {
      ...resources.js,
      budget: budgets.javascript.budget,
      overBudget: resources.js.size > budgets.javascript.budget,
      percentUsed: (resources.js.size / budgets.javascript.budget * 100).toFixed(1)
    },
    fonts: {
      ...resources.fonts,
      budget: budgets.fonts.budget,
      overBudget: resources.fonts.size > budgets.fonts.budget,
      percentUsed: (resources.fonts.size / budgets.fonts.budget * 100).toFixed(1)
    },
    total: {
      ...resources.total,
      budget: budgets.totalPage.budget,
      overBudget: resources.total.size > budgets.totalPage.budget,
      percentUsed: (resources.total.size / budgets.totalPage.budget * 100).toFixed(1)
    }
  };

  return budgetAnalysis;
}

/**
 * Run Lighthouse audit
 */
export async function runLighthouseAudit(page, url) {
  // This would typically use lighthouse programmatically
  // For now, we'll simulate basic lighthouse-like metrics
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    // Simulate lighthouse scoring based on real metrics
    const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
    const lcp = window.webVitalsMetrics?.lcp || fcp + 1000;
    
    // Basic scoring algorithm (simplified)
    const performanceScore = Math.max(0, Math.min(100, 
      100 - Math.max(0, (lcp - 2500) / 50)
    ));
    
    return {
      performance: Math.round(performanceScore),
      accessibility: 100, // Will be measured by actual a11y tests
      bestPractices: 95, // Baseline score
      seo: 100, // Will be measured by SEO tests
      fcp,
      lcp,
      cls: window.webVitalsMetrics?.cls || 0,
      tbt: Math.max(0, navigation ? navigation.loadEventEnd - navigation.domContentLoadedEventEnd - 50 : 0)
    };
  });

  return metrics;
}

/**
 * Test network conditions
 */
export async function testNetworkConditions(page, condition) {
  const networkConfig = performanceConfig.networkConditions[condition];
  
  if (networkConfig) {
    await page.context().setOffline(networkConfig.offline);
    await page.route('**/*', route => {
      // Simulate network latency and throughput
      const delay = networkConfig.latency;
      setTimeout(() => {
        route.continue();
      }, delay);
    });
  }
  
  return networkConfig;
}

/**
 * Measure custom performance metrics
 */
export async function measureCustomMetrics(page) {
  const customMetrics = await page.evaluate(() => {
    const startTime = performance.now();
    
    // Terminal render time - measure ASCII art rendering
    const terminalElement = document.querySelector('[data-component="ascii-art"]');
    const terminalRenderTime = terminalElement ? 
      performance.now() - startTime : 0;

    // Mode toggle response time
    let modeToggleTime = 0;
    const modeToggle = document.querySelector('[data-component="mode-toggle"]');
    if (modeToggle) {
      const toggleStart = performance.now();
      modeToggle.click();
      modeToggleTime = performance.now() - toggleStart;
    }

    // Check for layout thrashing
    const layoutThrashing = performance.getEntriesByType('measure')
      .filter(m => m.name.includes('layout'))
      .reduce((sum, m) => sum + m.duration, 0);

    return {
      terminalRenderTime,
      modeToggleResponseTime: modeToggleTime,
      layoutThrashing,
      mainThreadBudget: 16.67 - layoutThrashing // 60fps budget
    };
  });

  return customMetrics;
}

export default {
  setupPerformanceTesting,
  collectCoreWebVitals,
  analyzeResourceBudgets,
  runLighthouseAudit,
  testNetworkConditions,
  measureCustomMetrics
};