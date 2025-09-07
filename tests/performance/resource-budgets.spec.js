// T009 - Performance contract test for resource budgets
// This test MUST FAIL initially to ensure proper TDD implementation
import { test, expect } from '@playwright/test';
import { setupPerformanceTesting, analyzeResourceBudgets } from './setup.js';
import { performanceConfig } from './config.js';

const BASE_URL = 'http://localhost:4321/ali-portfolio';

test.describe('Resource Budget Performance Contract Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupPerformanceTesting(page, 'coldCache');
  });

  test('Total page size ≤1.5MB', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const resourceAnalysis = await analyzeResourceBudgets(page);
    const totalSizeBytes = resourceAnalysis.total.size;
    const totalSizeMB = (totalSizeBytes / 1024 / 1024).toFixed(2);
    const budgetMB = (performanceConfig.resourceBudgets.totalPage.budget / 1024 / 1024).toFixed(1);
    
    // Contract: Total page size must be ≤1.5MB
    // This will likely fail initially since resources haven't been optimized
    expect(totalSizeBytes, 
      `Total page size should be ≤${budgetMB}MB but was ${totalSizeMB}MB. Optimize resources and enable compression.`
    ).toBeLessThanOrEqual(performanceConfig.resourceBudgets.totalPage.budget);
    
    // Additional insights
    console.log(`Resource breakdown: CSS: ${(resourceAnalysis.css.size/1024).toFixed(1)}KB, JS: ${(resourceAnalysis.js.size/1024).toFixed(1)}KB, Fonts: ${(resourceAnalysis.fonts.size/1024).toFixed(1)}KB, Images: ${(resourceAnalysis.images.size/1024).toFixed(1)}KB`);
  });

  test('CSS bundle size ≤50KB', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const resourceAnalysis = await analyzeResourceBudgets(page);
    const cssSizeBytes = resourceAnalysis.css.size;
    const cssSizeKB = (cssSizeBytes / 1024).toFixed(1);
    const budgetKB = (performanceConfig.resourceBudgets.css.budget / 1024).toFixed(0);
    
    // Contract: CSS size must be ≤50KB
    // This might fail initially if CSS is not optimized or if we have large embedded styles
    expect(cssSizeBytes, 
      `CSS size should be ≤${budgetKB}KB but was ${cssSizeKB}KB. Minimize and compress CSS files.`
    ).toBeLessThanOrEqual(performanceConfig.resourceBudgets.css.budget);
    
    // Log CSS files for debugging
    if (resourceAnalysis.css.files.length > 0) {
      console.log('CSS files loaded:', resourceAnalysis.css.files.map(f => 
        `${f.url.split('/').pop()} (${(f.size/1024).toFixed(1)}KB)`).join(', '));
    }
  });

  test('Combined font size ≤150KB', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const resourceAnalysis = await analyzeResourceBudgets(page);
    const fontsSizeBytes = resourceAnalysis.fonts.size;
    const fontsSizeKB = (fontsSizeBytes / 1024).toFixed(1);
    const budgetKB = (performanceConfig.resourceBudgets.fonts.budget / 1024).toFixed(0);
    
    // Contract: Combined fonts must be ≤150KB
    // This will likely fail initially since font optimization isn't implemented
    expect(fontsSizeBytes, 
      `Font size should be ≤${budgetKB}KB but was ${fontsSizeKB}KB. Optimize font loading and use font subsets.`
    ).toBeLessThanOrEqual(performanceConfig.resourceBudgets.fonts.budget);
    
    // Log font files for debugging
    if (resourceAnalysis.fonts.files.length > 0) {
      console.log('Font files loaded:', resourceAnalysis.fonts.files.map(f => 
        `${f.url.split('/').pop()} (${(f.size/1024).toFixed(1)}KB)`).join(', '));
    }
  });

  test('JavaScript bundle size ≤500KB', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const resourceAnalysis = await analyzeResourceBudgets(page);
    const jsSizeBytes = resourceAnalysis.js.size;
    const jsSizeKB = (jsSizeBytes / 1024).toFixed(1);
    const budgetKB = (performanceConfig.resourceBudgets.javascript.budget / 1024).toFixed(0);
    
    // Contract: JavaScript size must be ≤500KB
    // This might fail if we have large JS bundles or unoptimized code
    expect(jsSizeBytes, 
      `JavaScript size should be ≤${budgetKB}KB but was ${jsSizeKB}KB. Optimize JS bundles and remove unused code.`
    ).toBeLessThanOrEqual(performanceConfig.resourceBudgets.javascript.budget);
    
    // Log JS files for debugging
    if (resourceAnalysis.js.files.length > 0) {
      console.log('JS files loaded:', resourceAnalysis.js.files.map(f => 
        `${f.url.split('/').pop()} (${(f.size/1024).toFixed(1)}KB)`).join(', '));
    }
  });

  test('Images are optimized and within budget', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const resourceAnalysis = await analyzeResourceBudgets(page);
    const imagesSizeBytes = resourceAnalysis.images.size;
    const imagesSizeMB = (imagesSizeBytes / 1024 / 1024).toFixed(2);
    const budgetMB = (performanceConfig.resourceBudgets.images.budget / 1024 / 1024).toFixed(1);
    
    // Contract: Images should be ≤1MB total
    // This might fail if we have unoptimized images
    expect(imagesSizeBytes, 
      `Images size should be ≤${budgetMB}MB but was ${imagesSizeMB}MB. Optimize and compress images.`
    ).toBeLessThanOrEqual(performanceConfig.resourceBudgets.images.budget);
    
    // Check for modern image formats
    if (resourceAnalysis.images.files.length > 0) {
      const imageFormats = resourceAnalysis.images.files.map(f => {
        const url = f.url.toLowerCase();
        if (url.includes('.webp')) return 'webp';
        if (url.includes('.avif')) return 'avif';
        if (url.includes('.png')) return 'png';
        if (url.includes('.jpg') || url.includes('.jpeg')) return 'jpeg';
        return 'other';
      });
      
      const modernFormats = imageFormats.filter(f => ['webp', 'avif'].includes(f));
      const totalImages = imageFormats.length;
      
      // Encourage modern formats (not required, but logged for improvement)
      if (totalImages > 0 && modernFormats.length === 0) {
        console.warn(`Consider using modern image formats (WebP, AVIF) for better compression`);
      }
      
      console.log('Image files loaded:', resourceAnalysis.images.files.map(f => 
        `${f.url.split('/').pop()} (${(f.size/1024).toFixed(1)}KB)`).join(', '));
    }
  });

  test('Resource count is reasonable', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const resourceAnalysis = await analyzeResourceBudgets(page);
    const totalResources = resourceAnalysis.total.count;
    const maxReasonableResources = 50; // Reasonable limit for HTTP requests
    
    // Contract: Keep HTTP requests reasonable to avoid waterfall delays
    // This might fail if we have too many small resources that should be bundled
    expect(totalResources, 
      `Total HTTP requests should be ≤${maxReasonableResources} but was ${totalResources}. Consider bundling resources.`
    ).toBeLessThanOrEqual(maxReasonableResources);
    
    console.log(`Resource count breakdown: CSS: ${resourceAnalysis.css.count}, JS: ${resourceAnalysis.js.count}, Fonts: ${resourceAnalysis.fonts.count}, Images: ${resourceAnalysis.images.count}, Total: ${totalResources}`);
  });

  test('No single resource exceeds 1MB', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Get all resource sizes
    const allResources = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      return resources.map(resource => ({
        url: resource.name,
        size: resource.transferSize || resource.decodedBodySize || 0,
        type: resource.initiatorType
      })).filter(r => r.size > 0);
    });
    
    const largeSingleResources = allResources.filter(r => r.size > 1024 * 1024); // >1MB
    const maxSingleResourceSize = 1024 * 1024; // 1MB limit
    
    // Contract: No single resource should be larger than 1MB
    // This might fail if we have large unoptimized assets
    expect(largeSingleResources, 
      `These resources exceed 1MB: ${largeSingleResources.map(r => 
        `${r.url.split('/').pop()} (${(r.size/1024/1024).toFixed(2)}MB)`).join(', ')}`
    ).toHaveLength(0);
    
    // Log largest resources for debugging
    const largestResources = allResources
      .sort((a, b) => b.size - a.size)
      .slice(0, 5);
    
    console.log('Largest resources:', largestResources.map(r => 
      `${r.url.split('/').pop()} (${(r.size/1024).toFixed(1)}KB)`).join(', '));
  });

  test('Critical CSS is inlined and under budget', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check for inlined CSS in the document
    const inlinedCSS = await page.evaluate(() => {
      const styleElements = document.querySelectorAll('style');
      let totalInlinedSize = 0;
      
      styleElements.forEach(style => {
        if (style.textContent) {
          totalInlinedSize += style.textContent.length;
        }
      });
      
      return {
        count: styleElements.length,
        size: totalInlinedSize,
        hasInlined: totalInlinedSize > 0
      };
    });
    
    const inlinedKB = (inlinedCSS.size / 1024).toFixed(1);
    const maxInlinedKB = 14; // Recommended critical CSS size
    
    // Contract: Critical CSS should be inlined but not exceed reasonable size
    // This might fail if we haven't implemented critical CSS inlining or if it's too large
    if (inlinedCSS.hasInlined) {
      expect(inlinedCSS.size, 
        `Inlined CSS should be ≤${maxInlinedKB}KB but was ${inlinedKB}KB. Keep critical CSS minimal.`
      ).toBeLessThanOrEqual(maxInlinedKB * 1024);
    } else {
      console.warn('No inlined CSS found. Consider inlining critical CSS for better performance.');
    }
    
    console.log(`Inlined CSS: ${inlinedCSS.count} style blocks, ${inlinedKB}KB total`);
  });

  test('Resources are properly compressed', async ({ page }) => {
    // Track compression by checking response headers
    const compressionInfo = [];
    
    page.on('response', response => {
      const contentEncoding = response.headers()['content-encoding'];
      const contentType = response.headers()['content-type'] || '';
      const url = response.url();
      
      if (contentType.includes('text/') || contentType.includes('application/javascript') || 
          contentType.includes('application/json') || contentType.includes('text/css')) {
        compressionInfo.push({
          url: url.split('/').pop(),
          contentType,
          compressed: !!(contentEncoding && (contentEncoding.includes('gzip') || contentEncoding.includes('br') || contentEncoding.includes('deflate'))),
          encoding: contentEncoding || 'none'
        });
      }
    });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const uncompressedResources = compressionInfo.filter(r => !r.compressed);
    const compressibleResources = compressionInfo.filter(r => 
      r.contentType.includes('text/') || 
      r.contentType.includes('javascript') || 
      r.contentType.includes('css')
    );
    
    // Contract: All compressible resources should be compressed
    // This will likely fail initially since compression may not be configured
    if (compressibleResources.length > 0) {
      const compressionRate = ((compressibleResources.length - uncompressedResources.length) / compressibleResources.length * 100).toFixed(1);
      
      expect(uncompressedResources.length, 
        `${uncompressedResources.length} compressible resources are not compressed (${compressionRate}% compression rate). Enable gzip/brotli compression.`
      ).toBe(0);
      
      console.log('Compression status:', compressionInfo.map(r => 
        `${r.url}: ${r.compressed ? r.encoding : 'uncompressed'}`).join(', '));
    }
  });

  test('Font loading is optimized', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check font loading strategy
    const fontLoadingInfo = await page.evaluate(() => {
      const linkElements = document.querySelectorAll('link[rel="preload"][as="font"]');
      const fontFaceRules = Array.from(document.styleSheets).flatMap(sheet => {
        try {
          return Array.from(sheet.cssRules).filter(rule => rule instanceof CSSFontFaceRule);
        } catch {
          return [];
        }
      });
      
      return {
        preloadedFonts: linkElements.length,
        fontFaceRules: fontFaceRules.length,
        hasFontDisplay: fontFaceRules.some(rule => rule.style.fontDisplay),
        fontDisplayValues: fontFaceRules.map(rule => rule.style.fontDisplay).filter(Boolean)
      };
    });
    
    await page.waitForLoadState('networkidle');
    
    // Contract: Fonts should use font-display for better loading UX
    // This will likely fail initially since font-display optimization isn't implemented
    if (fontLoadingInfo.fontFaceRules > 0) {
      expect(fontLoadingInfo.hasFontDisplay, 
        'Font faces should include font-display property for better loading performance'
      ).toBeTruthy();
      
      // Prefer swap or fallback values
      const goodFontDisplayValues = fontLoadingInfo.fontDisplayValues.filter(val => 
        ['swap', 'fallback', 'optional'].includes(val)
      );
      
      expect(goodFontDisplayValues.length, 
        `Use font-display: swap/fallback/optional for better UX. Found: ${fontLoadingInfo.fontDisplayValues.join(', ')}`
      ).toBeGreaterThan(0);
    }
    
    console.log(`Font loading: ${fontLoadingInfo.preloadedFonts} preloaded, ${fontLoadingInfo.fontFaceRules} font-face rules, font-display values: ${fontLoadingInfo.fontDisplayValues.join(', ') || 'none'}`);
  });
});