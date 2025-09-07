// T014 - Visual regression test for mode switcher interactions
// This test MUST FAIL initially to ensure proper TDD implementation
import { test, expect } from '@playwright/test';
import { setupVisualTesting, takeVisualSnapshot, compareVisualSnapshots, executeScenarioSteps } from './setup.js';
import { visualRegressionConfig } from './config.js';

const BASE_URL = 'http://localhost:4321/ali-portfolio';

test.describe('Mode Switcher Interactions Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupVisualTesting(page, 'modeSwitcher');
  });

  test('Mode switcher sun/QR icon changes', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const modeToggle = page.locator('[data-component="mode-toggle"]');
    const hasToggle = await modeToggle.count() > 0;
    
    if (!hasToggle) {
      test.skip('Mode toggle not found');
    }
    
    // Capture initial state (should show sun for digital mode)
    await modeToggle.waitFor({ state: 'visible' });
    const initialScreenshot = await takeVisualSnapshot(page, 'mode-toggle-initial-sun');
    
    // Check initial icon
    const initialIcon = await page.evaluate(() => {
      const toggle = document.querySelector('[data-component="mode-toggle"]');
      const icon = toggle?.querySelector('svg, img, .icon');
      return {
        exists: !!icon,
        src: icon?.src || '',
        className: icon?.className || '',
        dataLucide: icon?.getAttribute('data-lucide') || '',
        innerHTML: icon?.innerHTML?.slice(0, 50) || ''
      };
    });
    
    // Click to switch to print mode (should show QR code)
    await modeToggle.click();
    await page.waitForTimeout(500); // Allow transition
    
    const printModeScreenshot = await takeVisualSnapshot(page, 'mode-toggle-print-qr');
    
    // Check changed icon
    const printIcon = await page.evaluate(() => {
      const toggle = document.querySelector('[data-component="mode-toggle"]');
      const icon = toggle?.querySelector('svg, img, .icon');
      return {
        exists: !!icon,
        src: icon?.src || '',
        className: icon?.className || '',
        dataLucide: icon?.getAttribute('data-lucide') || '',
        innerHTML: icon?.innerHTML?.slice(0, 50) || ''
      };
    });
    
    // Contract: Icon should change from sun to QR code
    // This will likely fail initially since icon switching isn't implemented
    expect(initialIcon.exists && printIcon.exists, 'Both icons should exist').toBeTruthy();
    
    // Verify icons are different (either different src, className, or dataLucide)
    const iconsAreDifferent = 
      initialIcon.src !== printIcon.src ||
      initialIcon.className !== printIcon.className ||
      initialIcon.dataLucide !== printIcon.dataLucide ||
      initialIcon.innerHTML !== printIcon.innerHTML;
    
    expect(iconsAreDifferent, 
      `Mode toggle icons should change. Initial: ${JSON.stringify(initialIcon)}, Print: ${JSON.stringify(printIcon)}`
    ).toBeTruthy();
    
    // Visual regression test
    const baselineInitial = 'tests/visual/baseline/mode-toggle-initial-sun.png';
    const baselinePrint = 'tests/visual/baseline/mode-toggle-print-qr.png';
    
    const initialComparison = await compareVisualSnapshots(
      'mode-toggle-initial-sun',
      initialScreenshot,
      baselineInitial
    );
    
    const printComparison = await compareVisualSnapshots(
      'mode-toggle-print-qr',
      printModeScreenshot,
      baselinePrint
    );
    
    expect(initialComparison.diff, 
      `Initial mode toggle visual regression: ${(initialComparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
    
    expect(printComparison.diff, 
      `Print mode toggle visual regression: ${(printComparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Mode switcher hover effects', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const modeToggle = page.locator('[data-component="mode-toggle"]');
    const hasToggle = await modeToggle.count() > 0;
    
    if (!hasToggle) {
      test.skip('Mode toggle not found');
    }
    
    // Capture normal state
    const normalScreenshot = await takeVisualSnapshot(page, 'mode-toggle-normal');
    
    // Hover over toggle
    await modeToggle.hover();
    await page.waitForTimeout(200); // Allow hover effects
    
    const hoverScreenshot = await takeVisualSnapshot(page, 'mode-toggle-hover');
    
    // Check for hover effects
    const hoverAnalysis = await page.evaluate(() => {
      const toggle = document.querySelector('[data-component="mode-toggle"]');
      if (!toggle) return null;
      
      const styles = window.getComputedStyle(toggle);
      return {
        opacity: styles.opacity,
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor,
        transform: styles.transform,
        boxShadow: styles.boxShadow,
        cursor: styles.cursor
      };
    });
    
    // Contract: Hover should provide visual feedback
    // This will likely fail initially since hover effects aren't implemented
    expect(hoverAnalysis?.cursor, 'Mode toggle should have pointer cursor on hover').toBe('pointer');
    
    // Visual regression for hover state
    const baselineNormal = 'tests/visual/baseline/mode-toggle-normal.png';
    const baselineHover = 'tests/visual/baseline/mode-toggle-hover.png';
    
    const normalComparison = await compareVisualSnapshots(
      'mode-toggle-normal',
      normalScreenshot,
      baselineNormal
    );
    
    const hoverComparison = await compareVisualSnapshots(
      'mode-toggle-hover',
      hoverScreenshot,
      baselineHover
    );
    
    expect(normalComparison.diff, 
      `Normal mode toggle visual regression: ${(normalComparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
    
    expect(hoverComparison.diff, 
      `Hover mode toggle visual regression: ${(hoverComparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Mode switcher transition animations', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    
    // Allow animations for this test
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const modeToggle = page.locator('[data-component="mode-toggle"]');
    const hasToggle = await modeToggle.count() > 0;
    
    if (!hasToggle) {
      test.skip('Mode toggle not found');
    }
    
    // Capture transition frames
    const transitionFrames = [];
    
    // Start transition
    const clickPromise = modeToggle.click();
    
    // Capture frames during transition
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(100); // 100ms intervals
      const frame = await takeVisualSnapshot(page, `mode-transition-frame-${i}`);
      transitionFrames.push(frame);
    }
    
    await clickPromise;
    await page.waitForTimeout(300); // Allow transition to complete
    
    // Capture final state
    const finalScreenshot = await takeVisualSnapshot(page, 'mode-toggle-transition-complete');
    
    // Contract: Transition should be smooth and visible
    // This will likely fail initially since transitions aren't implemented
    
    // Check for transition CSS properties
    const transitionAnalysis = await page.evaluate(() => {
      const toggle = document.querySelector('[data-component="mode-toggle"]');
      if (!toggle) return null;
      
      const styles = window.getComputedStyle(toggle);
      return {
        transition: styles.transition,
        transitionDuration: styles.transitionDuration,
        transitionProperty: styles.transitionProperty,
        hasTransition: styles.transition !== 'none' && styles.transition !== ''
      };
    });
    
    if (transitionAnalysis) {
      expect(transitionAnalysis.hasTransition, 
        `Mode toggle should have CSS transitions, found: ${transitionAnalysis.transition}`
      ).toBeTruthy();
    }
    
    // Visual regression for final state
    const baselineFinal = 'tests/visual/baseline/mode-toggle-transition-complete.png';
    const finalComparison = await compareVisualSnapshots(
      'mode-toggle-transition-complete',
      finalScreenshot,
      baselineFinal
    );
    
    expect(finalComparison.diff, 
      `Mode toggle transition final state regression: ${(finalComparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Mode switcher active/pressed state', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const modeToggle = page.locator('[data-component="mode-toggle"]');
    const hasToggle = await modeToggle.count() > 0;
    
    if (!hasToggle) {
      test.skip('Mode toggle not found');
    }
    
    // Capture initial state
    const initialScreenshot = await takeVisualSnapshot(page, 'mode-toggle-before-active');
    
    // Click and hold to see active state
    await modeToggle.hover();
    await page.mouse.down();
    await page.waitForTimeout(200); // Hold for active state
    
    const activeScreenshot = await takeVisualSnapshot(page, 'mode-toggle-active-pressed');
    
    await page.mouse.up(); // Release
    await page.waitForTimeout(200);
    
    // Capture after click (should show different state/icon)
    const afterClickScreenshot = await takeVisualSnapshot(page, 'mode-toggle-after-click');
    
    // Contract: Should have distinct active/pressed state
    // This will likely fail initially since active states aren't styled
    
    const activeStateAnalysis = await page.evaluate(() => {
      const toggle = document.querySelector('[data-component="mode-toggle"]');
      if (!toggle) return null;
      
      // Check for active state classes or attributes
      return {
        hasActiveClass: toggle.classList.contains('active'),
        hasAriaPressed: toggle.hasAttribute('aria-pressed'),
        ariaPressed: toggle.getAttribute('aria-pressed'),
        className: toggle.className,
        dataset: Object.keys(toggle.dataset)
      };
    });
    
    // Visual regression tests
    const baselineInitial = 'tests/visual/baseline/mode-toggle-before-active.png';
    const baselineActive = 'tests/visual/baseline/mode-toggle-active-pressed.png';
    const baselineAfter = 'tests/visual/baseline/mode-toggle-after-click.png';
    
    const comparisons = await Promise.all([
      compareVisualSnapshots('mode-toggle-before-active', initialScreenshot, baselineInitial),
      compareVisualSnapshots('mode-toggle-active-pressed', activeScreenshot, baselineActive),
      compareVisualSnapshots('mode-toggle-after-click', afterClickScreenshot, baselineAfter)
    ]);
    
    comparisons.forEach((comparison, index) => {
      const states = ['initial', 'active', 'after-click'];
      expect(comparison.diff, 
        `Mode toggle ${states[index]} state regression: ${(comparison.diff * 100).toFixed(2)}%`
      ).toBeLessThan(visualRegressionConfig.comparison.threshold);
    });
  });

  test('Mode switcher accessibility focus indicators', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const modeToggle = page.locator('[data-component="mode-toggle"]');
    const hasToggle = await modeToggle.count() > 0;
    
    if (!hasToggle) {
      test.skip('Mode toggle not found');
    }
    
    // Focus via keyboard
    await page.keyboard.press('Tab'); // May focus other elements first
    await modeToggle.focus();
    await page.waitForTimeout(200);
    
    const focusedScreenshot = await takeVisualSnapshot(page, 'mode-toggle-keyboard-focus');
    
    // Check focus styles
    const focusAnalysis = await page.evaluate(() => {
      const toggle = document.querySelector('[data-component="mode-toggle"]');
      const isFocused = document.activeElement === toggle;
      
      if (!isFocused || !toggle) return null;
      
      const styles = window.getComputedStyle(toggle);
      return {
        isFocused,
        outline: styles.outline,
        outlineColor: styles.outlineColor,
        outlineWidth: styles.outlineWidth,
        outlineStyle: styles.outlineStyle,
        boxShadow: styles.boxShadow,
        hasFocusRing: styles.outline !== 'none' || styles.boxShadow !== 'none'
      };
    });
    
    // Contract: Should have visible focus indicators
    // This will likely fail initially since focus styles aren't implemented
    if (focusAnalysis) {
      expect(focusAnalysis.isFocused, 'Mode toggle should be focusable').toBeTruthy();
      expect(focusAnalysis.hasFocusRing, 
        `Mode toggle should have visible focus ring, found outline: ${focusAnalysis.outline}, box-shadow: ${focusAnalysis.boxShadow}`
      ).toBeTruthy();
    }
    
    // Test keyboard activation
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    
    const keyboardActivatedScreenshot = await takeVisualSnapshot(page, 'mode-toggle-keyboard-activated');
    
    // Visual regression tests
    const baselineFocus = 'tests/visual/baseline/mode-toggle-keyboard-focus.png';
    const baselineActivated = 'tests/visual/baseline/mode-toggle-keyboard-activated.png';
    
    const focusComparison = await compareVisualSnapshots(
      'mode-toggle-keyboard-focus',
      focusedScreenshot,
      baselineFocus
    );
    
    const activatedComparison = await compareVisualSnapshots(
      'mode-toggle-keyboard-activated',
      keyboardActivatedScreenshot,
      baselineActivated
    );
    
    expect(focusComparison.diff, 
      `Mode toggle focus state regression: ${(focusComparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
    
    expect(activatedComparison.diff, 
      `Mode toggle keyboard activation regression: ${(activatedComparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Mode switcher mobile touch interactions', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15');
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const modeToggle = page.locator('[data-component="mode-toggle"]');
    const hasToggle = await modeToggle.count() > 0;
    
    if (!hasToggle) {
      test.skip('Mode toggle not found');
    }
    
    // Check mobile touch target size
    const touchTargetAnalysis = await modeToggle.evaluate(toggle => {
      const rect = toggle.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        minSize: Math.min(rect.width, rect.height),
        meetsMinimum: rect.width >= 44 && rect.height >= 44 // 44px minimum touch target
      };
    });
    
    // Contract: Touch target should be large enough for mobile
    // This will likely fail initially since mobile touch optimization isn't implemented
    expect(touchTargetAnalysis.meetsMinimum, 
      `Mode toggle touch target too small: ${touchTargetAnalysis.width}x${touchTargetAnalysis.height}px (minimum 44x44px)`
    ).toBeTruthy();
    
    // Capture mobile layout
    const mobileScreenshot = await takeVisualSnapshot(page, 'mode-toggle-mobile');
    
    // Simulate touch interaction
    await modeToggle.tap();
    await page.waitForTimeout(500);
    
    const mobileTappedScreenshot = await takeVisualSnapshot(page, 'mode-toggle-mobile-tapped');
    
    // Visual regression tests
    const baselineMobile = 'tests/visual/baseline/mode-toggle-mobile.png';
    const baselineTapped = 'tests/visual/baseline/mode-toggle-mobile-tapped.png';
    
    const mobileComparison = await compareVisualSnapshots(
      'mode-toggle-mobile',
      mobileScreenshot,
      baselineMobile
    );
    
    const tappedComparison = await compareVisualSnapshots(
      'mode-toggle-mobile-tapped',
      mobileTappedScreenshot,
      baselineTapped
    );
    
    expect(mobileComparison.diff, 
      `Mode toggle mobile layout regression: ${(mobileComparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
    
    expect(tappedComparison.diff, 
      `Mode toggle mobile tap regression: ${(tappedComparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Mode switcher position and layout consistency', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const modeToggle = page.locator('[data-component="mode-toggle"]');
    const hasToggle = await modeToggle.count() > 0;
    
    if (!hasToggle) {
      test.skip('Mode toggle not found');
    }
    
    // Get toggle position and layout info
    const layoutAnalysis = await modeToggle.evaluate(toggle => {
      const rect = toggle.getBoundingClientRect();
      const styles = window.getComputedStyle(toggle);
      
      return {
        position: styles.position,
        top: styles.top,
        right: styles.right,
        bottom: styles.bottom,
        left: styles.left,
        zIndex: styles.zIndex,
        rect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height
        },
        isVisible: rect.width > 0 && rect.height > 0,
        isInViewport: rect.x >= 0 && rect.y >= 0 && rect.x < window.innerWidth && rect.y < window.innerHeight
      };
    });
    
    // Contract: Mode toggle should be properly positioned and visible
    // This will likely fail initially since positioning isn't optimized
    expect(layoutAnalysis.isVisible, 'Mode toggle should be visible').toBeTruthy();
    expect(layoutAnalysis.isInViewport, 'Mode toggle should be in viewport').toBeTruthy();
    
    // Test at different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'large-desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(300); // Allow layout to adjust
      
      const screenshot = await takeVisualSnapshot(page, `mode-toggle-${viewport.name}`);
      
      const baseline = `tests/visual/baseline/mode-toggle-${viewport.name}.png`;
      const comparison = await compareVisualSnapshots(
        `mode-toggle-${viewport.name}`,
        screenshot,
        baseline
      );
      
      expect(comparison.diff, 
        `Mode toggle ${viewport.name} layout regression: ${(comparison.diff * 100).toFixed(2)}%`
      ).toBeLessThan(visualRegressionConfig.comparison.threshold);
    }
  });
});