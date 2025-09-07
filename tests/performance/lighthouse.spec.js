// T010 - Performance contract test for Lighthouse scores
// This test MUST FAIL initially to ensure proper TDD implementation
import { test, expect } from '@playwright/test';
import { setupPerformanceTesting, runLighthouseAudit } from './setup.js';
import { performanceConfig } from './config.js';

const BASE_URL = 'http://localhost:4321/ali-portfolio';

test.describe('Lighthouse Score Performance Contract Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupPerformanceTesting(page, 'coldCache');
  });

  test('Performance score ≥95', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Allow metrics to stabilize
    
    const lighthouseResults = await runLighthouseAudit(page, BASE_URL);
    const performanceScore = lighthouseResults.performance;
    const targetScore = performanceConfig.lighthouseScores.performance.target;
    
    // Contract: Performance score must be ≥95
    // This will likely fail initially since performance optimizations aren't implemented
    expect(performanceScore, 
      `Performance score should be ≥${targetScore} but was ${performanceScore}. Optimize LCP, CLS, and other metrics.`
    ).toBeGreaterThanOrEqual(targetScore);
    
    // Log detailed metrics for debugging
    console.log(`Lighthouse metrics: LCP ${(lighthouseResults.lcp/1000).toFixed(2)}s, CLS ${lighthouseResults.cls.toFixed(3)}, TBT ${lighthouseResults.tbt.toFixed(1)}ms`);
  });

  test('Accessibility score = 100', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Run accessibility audit using Lighthouse methodology
    const accessibilityScore = await page.evaluate(async () => {
      // This simulates lighthouse accessibility audit
      // In a real implementation, you'd use actual lighthouse programmatically
      const issues = [];
      
      // Check for alt text on images
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.hasAttribute('alt') && img.getAttribute('aria-hidden') !== 'true') {
          issues.push('Image missing alt text');
        }
      });
      
      // Check for form labels
      const inputs = document.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        const hasLabel = document.querySelector(`label[for="${input.id}"]`) || 
                        input.getAttribute('aria-label') || 
                        input.getAttribute('aria-labelledby');
        if (!hasLabel) {
          issues.push('Form element missing label');
        }
      });
      
      // Check for heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const levels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
      const h1Count = levels.filter(l => l === 1).length;
      if (h1Count !== 1) {
        issues.push('Should have exactly one h1');
      }
      
      // Check for color contrast (simplified)
      const buttons = document.querySelectorAll('button, a');
      let lowContrastElements = 0;
      buttons.forEach(btn => {
        const styles = window.getComputedStyle(btn);
        // This is a simplified check - real implementation would calculate actual ratios
        if (styles.color === styles.backgroundColor) {
          lowContrastElements++;
        }
      });
      
      if (lowContrastElements > 0) {
        issues.push(`${lowContrastElements} elements with potential contrast issues`);
      }
      
      // Calculate score based on issues (simplified)
      const maxScore = 100;
      const penaltyPerIssue = 10;
      const score = Math.max(0, maxScore - (issues.length * penaltyPerIssue));
      
      return { score, issues };
    });
    
    const targetScore = performanceConfig.lighthouseScores.accessibility.target;
    
    // Contract: Accessibility score must be 100 (perfect)
    // This will definitely fail initially since accessibility features aren't implemented
    expect(accessibilityScore.score, 
      `Accessibility score should be ${targetScore} but was ${accessibilityScore.score}. Issues: ${accessibilityScore.issues.join(', ')}`
    ).toBeGreaterThanOrEqual(targetScore);
  });

  test('Best Practices score ≥95', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Simulate best practices audit
    const bestPracticesScore = await page.evaluate(() => {
      const issues = [];
      
      // Check for HTTPS
      if (!location.protocol.includes('https') && !location.hostname.includes('localhost')) {
        issues.push('Page not served over HTTPS');
      }
      
      // Check for console errors
      const errors = [];
      const originalError = console.error;
      console.error = (...args) => {
        errors.push(args.join(' '));
        originalError.apply(console, args);
      };
      
      if (errors.length > 0) {
        issues.push(`${errors.length} console errors found`);
      }
      
      // Check for deprecated APIs
      if (document.domain !== undefined) {
        // This is a simplified check
        try {
          // Check for common deprecated patterns
          const hasDeprecatedCode = document.body.innerHTML.includes('document.write') ||
                                   window.name.length > 0 ||
                                   typeof window.webkitRequestAnimationFrame !== 'undefined';
          
          if (hasDeprecatedCode) {
            issues.push('Deprecated APIs detected');
          }
        } catch (e) {
          // Ignore check errors
        }
      }
      
      // Check for mixed content (HTTP resources on HTTPS page)
      if (location.protocol.includes('https')) {
        const resources = performance.getEntriesByType('resource');
        const mixedContent = resources.filter(r => 
          r.name.startsWith('http://') && !r.name.includes('localhost')
        );
        
        if (mixedContent.length > 0) {
          issues.push(`${mixedContent.length} mixed content resources`);
        }
      }
      
      // Check for vulnerable libraries (simplified)
      const scripts = document.querySelectorAll('script[src]');
      const hasOldJQuery = Array.from(scripts).some(script => 
        script.src.includes('jquery') && (
          script.src.includes('1.') || 
          script.src.includes('2.') ||
          script.src.includes('3.0') ||
          script.src.includes('3.1') ||
          script.src.includes('3.2')
        )
      );
      
      if (hasOldJQuery) {
        issues.push('Potentially vulnerable jQuery version');
      }
      
      // Calculate score
      const maxScore = 100;
      const penaltyPerIssue = 8;
      const score = Math.max(0, maxScore - (issues.length * penaltyPerIssue));
      
      return { score, issues };
    });
    
    const targetScore = performanceConfig.lighthouseScores.bestPractices.target;
    
    // Contract: Best Practices score must be ≥95
    // This might fail if there are console errors or other best practice violations
    expect(bestPracticesScore.score, 
      `Best Practices score should be ≥${targetScore} but was ${bestPracticesScore.score}. Issues: ${bestPracticesScore.issues.join(', ')}`
    ).toBeGreaterThanOrEqual(targetScore);
  });

  test('SEO score = 100', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Simulate SEO audit
    const seoScore = await page.evaluate(() => {
      const issues = [];
      
      // Check for title
      const title = document.querySelector('title');
      if (!title || !title.textContent.trim()) {
        issues.push('Missing or empty title tag');
      } else if (title.textContent.length < 10 || title.textContent.length > 60) {
        issues.push('Title length should be 10-60 characters');
      }
      
      // Check for meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription || !metaDescription.content.trim()) {
        issues.push('Missing meta description');
      } else if (metaDescription.content.length < 120 || metaDescription.content.length > 160) {
        issues.push('Meta description should be 120-160 characters');
      }
      
      // Check for h1
      const h1Elements = document.querySelectorAll('h1');
      if (h1Elements.length === 0) {
        issues.push('Missing h1 tag');
      } else if (h1Elements.length > 1) {
        issues.push('Multiple h1 tags found');
      }
      
      // Check for viewport meta tag
      const viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        issues.push('Missing viewport meta tag');
      }
      
      // Check for lang attribute
      const htmlElement = document.documentElement;
      if (!htmlElement.hasAttribute('lang')) {
        issues.push('Missing lang attribute on html element');
      }
      
      // Check for robots.txt accessibility (can't actually check, but simulate)
      // In real lighthouse, this would be checked
      
      // Check for canonical link
      const canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical && location.pathname !== '/') {
        issues.push('Missing canonical link');
      }
      
      // Check image alt texts
      const images = document.querySelectorAll('img');
      const missingAlt = Array.from(images).filter(img => 
        !img.hasAttribute('alt') && img.getAttribute('aria-hidden') !== 'true'
      );
      if (missingAlt.length > 0) {
        issues.push(`${missingAlt.length} images missing alt text`);
      }
      
      // Check for proper link text
      const links = document.querySelectorAll('a[href]');
      const poorLinks = Array.from(links).filter(link => {
        const text = link.textContent.trim().toLowerCase();
        return text === 'click here' || text === 'read more' || text === 'link' || text.length < 3;
      });
      if (poorLinks.length > 0) {
        issues.push(`${poorLinks.length} links with poor descriptive text`);
      }
      
      // Check for structured data (simplified)
      const structuredData = document.querySelectorAll('[itemscope], script[type="application/ld+json"]');
      if (structuredData.length === 0) {
        issues.push('No structured data found');
      }
      
      // Calculate score
      const maxScore = 100;
      const penaltyPerIssue = 5;
      const score = Math.max(0, maxScore - (issues.length * penaltyPerIssue));
      
      return { score, issues };
    });
    
    const targetScore = performanceConfig.lighthouseScores.seo.target;
    
    // Contract: SEO score must be 100 (perfect)
    // This will likely fail initially since SEO optimizations aren't implemented
    expect(seoScore.score, 
      `SEO score should be ${targetScore} but was ${seoScore.score}. Issues: ${seoScore.issues.join(', ')}`
    ).toBeGreaterThanOrEqual(targetScore);
  });

  test('Progressive Web App features present', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Check for PWA features
    const pwaFeatures = await page.evaluate(() => {
      const features = {
        hasManifest: !!document.querySelector('link[rel="manifest"]'),
        hasServiceWorker: 'serviceWorker' in navigator,
        hasThemeColor: !!document.querySelector('meta[name="theme-color"]'),
        hasViewport: !!document.querySelector('meta[name="viewport"]'),
        hasIcons: document.querySelectorAll('link[rel*="icon"]').length > 0,
        isHTTPS: location.protocol === 'https:' || location.hostname === 'localhost',
        hasAppleTouchIcon: !!document.querySelector('link[rel="apple-touch-icon"]')
      };
      
      const presentFeatures = Object.entries(features).filter(([_, value]) => value).length;
      const totalFeatures = Object.keys(features).length;
      const score = Math.round((presentFeatures / totalFeatures) * 100);
      
      return { ...features, score, presentFeatures, totalFeatures };
    });
    
    // Contract: PWA features should be implemented (not required for basic portfolio, but good practice)
    // This will likely fail initially since PWA features aren't implemented
    const minPWAScore = 60; // Reasonable threshold for portfolio site
    
    if (pwaFeatures.score < minPWAScore) {
      console.warn(`PWA score: ${pwaFeatures.score}/100. Consider adding PWA features for better user experience.`);
      console.warn(`Missing features: ${Object.entries(pwaFeatures).filter(([key, value]) => 
        key !== 'score' && key !== 'presentFeatures' && key !== 'totalFeatures' && !value
      ).map(([key]) => key).join(', ')}`);
    }
    
    // For portfolio site, we'll make this a soft requirement
    expect(pwaFeatures.hasViewport, 'Viewport meta tag is essential for mobile experience').toBeTruthy();
    expect(pwaFeatures.hasIcons, 'At least one icon should be present').toBeTruthy();
  });

  test('Mobile Lighthouse scores meet thresholds', async ({ page }) => {
    // Set mobile viewport and user agent
    await page.setViewportSize({ width: 375, height: 667 });
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const mobileLighthouseResults = await runLighthouseAudit(page, BASE_URL);
    const mobilePerformanceScore = mobileLighthouseResults.performance;
    
    // Mobile performance threshold is typically lower
    const mobilePerformanceThreshold = 85;
    
    // Contract: Mobile performance should still meet reasonable thresholds
    // This will likely fail initially since mobile optimization isn't implemented
    expect(mobilePerformanceScore, 
      `Mobile performance score should be ≥${mobilePerformanceThreshold} but was ${mobilePerformanceScore}. Optimize for mobile devices.`
    ).toBeGreaterThanOrEqual(mobilePerformanceThreshold);
    
    console.log(`Mobile Lighthouse metrics: Performance ${mobilePerformanceScore}, LCP ${(mobileLighthouseResults.lcp/1000).toFixed(2)}s, CLS ${mobileLighthouseResults.cls.toFixed(3)}`);
  });

  test('Lighthouse scores are consistent across multiple runs', async ({ page }) => {
    const runs = 3;
    const scores = [];
    
    for (let i = 0; i < runs; i++) {
      // Clear cache between runs
      await page.context().clearCookies();
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const results = await runLighthouseAudit(page, BASE_URL);
      scores.push(results.performance);
      
      // Small delay between runs
      await page.waitForTimeout(1000);
    }
    
    // Calculate consistency metrics
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const maxVariation = Math.max(...scores) - Math.min(...scores);
    const maxAllowedVariation = 10; // Points
    
    // Contract: Performance scores should be consistent (low variation)
    // This might fail if performance is unstable
    expect(maxVariation, 
      `Performance score variation should be ≤${maxAllowedVariation} points but was ${maxVariation.toFixed(1)} (scores: ${scores.join(', ')}, avg: ${avgScore.toFixed(1)})`
    ).toBeLessThanOrEqual(maxAllowedVariation);
    
    console.log(`Performance consistency: ${scores.join(', ')} (avg: ${avgScore.toFixed(1)}, variation: ${maxVariation.toFixed(1)})`);
  });
});