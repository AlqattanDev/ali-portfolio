// T012 - Visual regression test for mobile responsiveness
// This test MUST FAIL initially to ensure proper TDD implementation
import { test, expect } from '@playwright/test';
import { setupVisualTesting, takeVisualSnapshot, compareVisualSnapshots } from './setup.js';
import { visualRegressionConfig } from './config.js';

const BASE_URL = 'http://localhost:4321/ali-portfolio';

test.describe('Mobile Responsiveness Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupVisualTesting(page, 'homepageMobile');
  });

  test('Mobile homepage (375x667) iPhone SE layout', async ({ page }) => {
    // Set iPhone SE viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15');
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Wait for mobile layout to adjust
    await page.waitForTimeout(1000);
    
    const screenshotPath = await takeVisualSnapshot(page, 'homepage-mobile-375x667');
    
    const baselinePath = 'tests/visual/baseline/homepage-mobile-375x667.png';
    const comparison = await compareVisualSnapshots(
      'homepage-mobile-375x667',
      screenshotPath,
      baselinePath
    );
    
    // Contract: Mobile layout should match baseline
    // This will likely fail initially since mobile-responsive design isn't implemented
    expect(comparison.diff, 
      `Mobile iPhone SE layout regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Mobile large (414x896) iPhone XR layout', async ({ page }) => {
    // Set iPhone XR viewport
    await page.setViewportSize({ width: 414, height: 896 });
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15');
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const screenshotPath = await takeVisualSnapshot(page, 'homepage-mobile-414x896');
    
    const baselinePath = 'tests/visual/baseline/homepage-mobile-414x896.png';
    const comparison = await compareVisualSnapshots(
      'homepage-mobile-414x896',
      screenshotPath,
      baselinePath
    );
    
    // Contract: Large mobile layout should be optimized
    expect(comparison.diff, 
      `Mobile iPhone XR layout regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Mobile ASCII art readability', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Focus on ASCII art section
    const asciiArt = page.locator('[data-component="ascii-art"]');
    const artExists = await asciiArt.count() > 0;
    
    if (!artExists) {
      test.skip('ASCII art component not found');
    }
    
    await asciiArt.waitFor({ state: 'visible' });
    
    const screenshotPath = await takeVisualSnapshot(page, 'ascii-art-mobile');
    
    const baselinePath = 'tests/visual/baseline/ascii-art-mobile.png';
    const comparison = await compareVisualSnapshots(
      'ascii-art-mobile',
      screenshotPath,
      baselinePath
    );
    
    // Contract: ASCII art should be readable on mobile
    // This will likely fail initially since mobile ASCII optimization isn't implemented
    expect(comparison.diff, 
      `Mobile ASCII art regression: ${(comparison.diff * 100).toFixed(2)}%. Terminal text must be readable on small screens.`
    ).toBeLessThan(0.02); // Strict threshold for text readability
  });

  test('Mobile navigation and header layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Check for mobile navigation (hamburger menu, collapsed nav, etc.)
    const mobileNav = page.locator('.mobile-nav, .hamburger, [data-mobile="nav"]');
    const hasSpecificMobileNav = await mobileNav.count() > 0;
    
    // Take screenshot of top area (header/nav)
    const screenshotPath = await takeVisualSnapshot(page, 'mobile-header-nav', {
      clip: { x: 0, y: 0, width: 375, height: 150 }
    });
    
    const baselinePath = 'tests/visual/baseline/mobile-header-nav.png';
    const comparison = await compareVisualSnapshots(
      'mobile-header-nav',
      screenshotPath,
      baselinePath
    );
    
    // Contract: Mobile header should be properly optimized
    expect(comparison.diff, 
      `Mobile header/nav regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
    
    if (hasSpecificMobileNav) {
      console.log('Mobile-specific navigation detected');
    }
  });

  test('Mobile touch targets are appropriately sized', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Check touch target sizes
    const touchTargetIssues = await page.evaluate(() => {
      const minTouchSize = 44; // 44px minimum as per WCAG
      const interactiveElements = document.querySelectorAll('button, a, input, [tabindex]:not([tabindex="-1"])');
      const issues = [];
      
      interactiveElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        if (rect.width < minTouchSize || rect.height < minTouchSize) {
          issues.push({
            index,
            element: element.tagName,
            className: element.className,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            text: element.textContent?.slice(0, 20)
          });
        }
      });
      
      return issues;
    });
    
    // Contract: All interactive elements should meet minimum touch target size
    // This will likely fail initially since touch target optimization isn't implemented
    expect(touchTargetIssues, 
      `Touch targets too small: ${JSON.stringify(touchTargetIssues)}`
    ).toHaveLength(0);
  });

  test('Mobile project cards stack vertically', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Find project section
    const projectSection = page.locator('.projects, [data-component="projects"], .project-showcase');
    const hasProjects = await projectSection.count() > 0;
    
    if (!hasProjects) {
      test.skip('No project section found');
    }
    
    // Scroll to project section
    await projectSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    const screenshotPath = await takeVisualSnapshot(page, 'mobile-projects-stack');
    
    const baselinePath = 'tests/visual/baseline/mobile-projects-stack.png';
    const comparison = await compareVisualSnapshots(
      'mobile-projects-stack',
      screenshotPath,
      baselinePath
    );
    
    // Contract: Projects should stack vertically on mobile
    // This will likely fail initially since mobile layout isn't implemented
    expect(comparison.diff, 
      `Mobile project stacking regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Mobile skills section is readable', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Find and scroll to skills section
    const skillsSection = page.locator('.skills, [data-component="skills"], .skill-matrix');
    const hasSkills = await skillsSection.count() > 0;
    
    if (!hasSkills) {
      test.skip('No skills section found');
    }
    
    await skillsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    const screenshotPath = await takeVisualSnapshot(page, 'mobile-skills-readable');
    
    const baselinePath = 'tests/visual/baseline/mobile-skills-readable.png';
    const comparison = await compareVisualSnapshots(
      'mobile-skills-readable',
      screenshotPath,
      baselinePath
    );
    
    // Contract: Skills should be readable and well-organized on mobile
    expect(comparison.diff, 
      `Mobile skills readability regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Mobile mode toggle is accessible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Find mode toggle
    const modeToggle = page.locator('[data-component="mode-toggle"]');
    const hasToggle = await modeToggle.count() > 0;
    
    if (!hasToggle) {
      test.skip('Mode toggle not found');
    }
    
    // Check that toggle is visible and properly sized
    await modeToggle.waitFor({ state: 'visible' });
    
    const screenshotPath = await takeVisualSnapshot(page, 'mobile-mode-toggle');
    
    const baselinePath = 'tests/visual/baseline/mobile-mode-toggle.png';
    const comparison = await compareVisualSnapshots(
      'mobile-mode-toggle',
      screenshotPath,
      baselinePath
    );
    
    // Contract: Mode toggle should be accessible on mobile
    expect(comparison.diff, 
      `Mobile mode toggle regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Mobile landscape (667x375) orientation', async ({ page }) => {
    // Test landscape orientation
    await page.setViewportSize({ width: 667, height: 375 });
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15');
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const screenshotPath = await takeVisualSnapshot(page, 'homepage-mobile-landscape-667x375');
    
    const baselinePath = 'tests/visual/baseline/homepage-mobile-landscape-667x375.png';
    const comparison = await compareVisualSnapshots(
      'homepage-mobile-landscape-667x375',
      screenshotPath,
      baselinePath
    );
    
    // Contract: Should handle landscape orientation gracefully
    expect(comparison.diff, 
      `Mobile landscape regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Mobile text scaling and readability', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Test with different text scaling
    await page.addInitScript(() => {
      // Simulate user text scaling preferences
      document.documentElement.style.fontSize = '18px'; // Larger base font
    });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const screenshotPath = await takeVisualSnapshot(page, 'mobile-large-text-scaling');
    
    const baselinePath = 'tests/visual/baseline/mobile-large-text-scaling.png';
    const comparison = await compareVisualSnapshots(
      'mobile-large-text-scaling',
      screenshotPath,
      baselinePath
    );
    
    // Contract: Should handle text scaling gracefully
    expect(comparison.diff, 
      `Mobile text scaling regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold * 1.2); // Allow more variance for text scaling
  });

  test('Mobile performance - no horizontal scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Check for horizontal overflow
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    
    // Contract: Should not have horizontal scroll on mobile
    // This will likely fail initially since responsive breakpoints aren't implemented
    expect(hasHorizontalScroll, 
      'Mobile layout should not cause horizontal scrolling'
    ).toBeFalsy();
    
    // Also take a screenshot to capture any overflow visually
    const screenshotPath = await takeVisualSnapshot(page, 'mobile-no-overflow');
    
    const baselinePath = 'tests/visual/baseline/mobile-no-overflow.png';
    const comparison = await compareVisualSnapshots(
      'mobile-no-overflow',
      screenshotPath,
      baselinePath
    );
    
    expect(comparison.diff, 
      `Mobile overflow regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });
});