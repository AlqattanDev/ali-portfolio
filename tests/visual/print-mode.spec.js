// T013 - Visual regression test for print mode
// This test MUST FAIL initially to ensure proper TDD implementation
import { test, expect } from '@playwright/test';
import { setupVisualTesting, takeVisualSnapshot, compareVisualSnapshots } from './setup.js';
import { visualRegressionConfig } from './config.js';

const BASE_URL = 'http://localhost:4321/ali-portfolio';

test.describe('Print Mode Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupVisualTesting(page, 'printMode');
  });

  test('Print mode A4 layout (794x1123)', async ({ page }) => {
    // Set A4 dimensions (96 DPI)
    await page.setViewportSize({ width: 794, height: 1123 });
    await page.emulateMedia({ media: 'print' });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Switch to print mode via toggle
    const modeToggle = page.locator('[data-component="mode-toggle"]');
    const hasToggle = await modeToggle.count() > 0;
    
    if (hasToggle) {
      await modeToggle.click();
      await page.waitForTimeout(500);
    }
    
    const screenshotPath = await takeVisualSnapshot(page, 'print-mode-a4-794x1123');
    
    const baselinePath = 'tests/visual/baseline/print-mode-a4-794x1123.png';
    const comparison = await compareVisualSnapshots(
      'print-mode-a4-794x1123',
      screenshotPath,
      baselinePath
    );
    
    // Contract: Print mode should match A4 layout baseline
    // This will likely fail initially since print styles aren't implemented
    expect(comparison.diff, 
      `Print mode A4 layout regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Print mode light theme conversion', async ({ page }) => {
    await page.setViewportSize({ width: 794, height: 1123 });
    await page.emulateMedia({ media: 'print' });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Enable print mode
    const modeToggle = page.locator('[data-component="mode-toggle"]');
    const hasToggle = await modeToggle.count() > 0;
    
    if (hasToggle) {
      await modeToggle.click();
      await page.waitForTimeout(500);
    }
    
    // Check color scheme conversion
    const colorAnalysis = await page.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      
      return {
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
        isDarkBackground: computedStyle.backgroundColor.includes('rgb(0, 0, 0)') || 
                         computedStyle.backgroundColor.includes('rgb(30, 30, 30)'),
        isLightText: computedStyle.color.includes('rgb(255, 255, 255)') ||
                    computedStyle.color.includes('rgb(240, 240, 240)')
      };
    });
    
    // Contract: Print mode should use light theme (dark text on light background)
    // This will fail initially since print theme conversion isn't implemented
    expect(colorAnalysis.isDarkBackground, 
      `Print mode should use light background, found: ${colorAnalysis.backgroundColor}`
    ).toBeFalsy();
    
    expect(colorAnalysis.isLightText,
      `Print mode should use dark text, found: ${colorAnalysis.color}`
    ).toBeFalsy();
    
    const screenshotPath = await takeVisualSnapshot(page, 'print-mode-light-theme');
    
    const baselinePath = 'tests/visual/baseline/print-mode-light-theme.png';
    const comparison = await compareVisualSnapshots(
      'print-mode-light-theme',
      screenshotPath,
      baselinePath
    );
    
    expect(comparison.diff, 
      `Print mode light theme regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('QR code visibility and scannability in print mode', async ({ page }) => {
    await page.setViewportSize({ width: 794, height: 1123 });
    await page.emulateMedia({ media: 'print' });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Enable print mode
    const modeToggle = page.locator('[data-component="mode-toggle"]');
    const hasToggle = await modeToggle.count() > 0;
    
    if (hasToggle) {
      await modeToggle.click();
      await page.waitForTimeout(500);
      
      // Check if QR code icon is now visible
      const qrCodeIcon = page.locator('[data-icon="qr-code"], .qr-icon, svg[data-lucide="qr-code"]');
      const qrVisible = await qrCodeIcon.count() > 0;
      
      if (qrVisible) {
        await qrCodeIcon.waitFor({ state: 'visible' });
        
        // Check QR code size and contrast
        const qrAnalysis = await qrCodeIcon.evaluate(icon => {
          const rect = icon.getBoundingClientRect();
          const styles = window.getComputedStyle(icon);
          
          return {
            width: rect.width,
            height: rect.height,
            minSize: Math.min(rect.width, rect.height),
            color: styles.color,
            fill: styles.fill,
            visibility: styles.visibility,
            opacity: styles.opacity
          };
        });
        
        // Contract: QR code should be large enough to scan (minimum 1cm ≈ 38px at 96 DPI)
        const minQRSize = 38;
        expect(qrAnalysis.minSize, 
          `QR code too small for scanning: ${qrAnalysis.minSize}px (minimum ${minQRSize}px)`
        ).toBeGreaterThanOrEqual(minQRSize);
        
        expect(qrAnalysis.visibility, 'QR code should be visible').toBe('visible');
        expect(parseFloat(qrAnalysis.opacity), 'QR code should be opaque').toBeGreaterThan(0.8);
      } else {
        console.warn('QR code icon not found in print mode');
      }
    }
    
    const screenshotPath = await takeVisualSnapshot(page, 'print-mode-qr-code');
    
    const baselinePath = 'tests/visual/baseline/print-mode-qr-code.png';
    const comparison = await compareVisualSnapshots(
      'print-mode-qr-code',
      screenshotPath,
      baselinePath
    );
    
    expect(comparison.diff, 
      `Print mode QR code regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Print mode removes interactive elements', async ({ page }) => {
    await page.setViewportSize({ width: 794, height: 1123 });
    await page.emulateMedia({ media: 'print' });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Enable print mode
    const modeToggle = page.locator('[data-component="mode-toggle"]');
    const hasToggle = await modeToggle.count() > 0;
    
    if (hasToggle) {
      await modeToggle.click();
      await page.waitForTimeout(500);
    }
    
    // Check for hidden/removed interactive elements
    const interactiveAnalysis = await page.evaluate(() => {
      const hiddenElements = [];
      const visibleInteractive = [];
      
      // Check navigation elements
      const navElements = document.querySelectorAll('nav, .navigation, .menu');
      navElements.forEach(nav => {
        const styles = window.getComputedStyle(nav);
        if (styles.display === 'none' || styles.visibility === 'hidden') {
          hiddenElements.push('navigation');
        } else {
          visibleInteractive.push('navigation');
        }
      });
      
      // Check buttons (except mode toggle which should be hidden in print)
      const buttons = document.querySelectorAll('button:not([data-component="mode-toggle"])');
      buttons.forEach(btn => {
        const styles = window.getComputedStyle(btn);
        if (styles.display === 'none' || styles.visibility === 'hidden') {
          hiddenElements.push('button');
        } else {
          visibleInteractive.push('button');
        }
      });
      
      // Check form elements
      const formElements = document.querySelectorAll('input, select, textarea');
      formElements.forEach(form => {
        const styles = window.getComputedStyle(form);
        if (styles.display === 'none' || styles.visibility === 'hidden') {
          hiddenElements.push('form-element');
        } else {
          visibleInteractive.push('form-element');
        }
      });
      
      return {
        hiddenElements,
        visibleInteractive,
        totalHidden: hiddenElements.length,
        totalVisible: visibleInteractive.length
      };
    });
    
    // Contract: Print mode should hide most interactive elements
    // This will likely fail initially since print-specific hiding isn't implemented
    console.log(`Print mode analysis: ${interactiveAnalysis.totalHidden} hidden, ${interactiveAnalysis.totalVisible} visible interactive elements`);
    
    // We expect more elements to be hidden than visible in print mode
    expect(interactiveAnalysis.totalHidden, 
      'Print mode should hide more interactive elements than it shows'
    ).toBeGreaterThanOrEqual(interactiveAnalysis.totalVisible);
  });

  test('Print mode typography optimization', async ({ page }) => {
    await page.setViewportSize({ width: 794, height: 1123 });
    await page.emulateMedia({ media: 'print' });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Enable print mode
    const modeToggle = page.locator('[data-component="mode-toggle"]');
    const hasToggle = await modeToggle.count() > 0;
    
    if (hasToggle) {
      await modeToggle.click();
      await page.waitForTimeout(500);
    }
    
    // Check typography optimization
    const typographyAnalysis = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const paragraphs = document.querySelectorAll('p');
      const codeBlocks = document.querySelectorAll('pre, code');
      
      const analysis = {
        headings: [],
        paragraphs: [],
        codeBlocks: []
      };
      
      headings.forEach(h => {
        const styles = window.getComputedStyle(h);
        analysis.headings.push({
          level: h.tagName.toLowerCase(),
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          color: styles.color,
          marginBottom: styles.marginBottom
        });
      });
      
      paragraphs.forEach((p, i) => {
        if (i < 3) { // Sample first 3 paragraphs
          const styles = window.getComputedStyle(p);
          analysis.paragraphs.push({
            fontSize: styles.fontSize,
            lineHeight: styles.lineHeight,
            color: styles.color,
            fontFamily: styles.fontFamily
          });
        }
      });
      
      codeBlocks.forEach((code, i) => {
        if (i < 2) { // Sample first 2 code blocks
          const styles = window.getComputedStyle(code);
          analysis.codeBlocks.push({
            fontSize: styles.fontSize,
            fontFamily: styles.fontFamily,
            color: styles.color,
            backgroundColor: styles.backgroundColor
          });
        }
      });
      
      return analysis;
    });
    
    // Contract: Typography should be optimized for print readability
    // This will likely fail initially since print typography isn't optimized
    
    // Check that headings have good contrast and appropriate sizes
    typographyAnalysis.headings.forEach((heading, i) => {
      const fontSize = parseFloat(heading.fontSize);
      expect(fontSize, 
        `Heading ${heading.level} font size should be readable in print (>=12px)`
      ).toBeGreaterThanOrEqual(12);
    });
    
    const screenshotPath = await takeVisualSnapshot(page, 'print-mode-typography');
    
    const baselinePath = 'tests/visual/baseline/print-mode-typography.png';
    const comparison = await compareVisualSnapshots(
      'print-mode-typography',
      screenshotPath,
      baselinePath
    );
    
    expect(comparison.diff, 
      `Print mode typography regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Print mode page breaks and margins', async ({ page }) => {
    await page.setViewportSize({ width: 794, height: 1123 });
    await page.emulateMedia({ media: 'print' });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Enable print mode
    const modeToggle = page.locator('[data-component="mode-toggle"]');
    const hasToggle = await modeToggle.count() > 0;
    
    if (hasToggle) {
      await modeToggle.click();
      await page.waitForTimeout(500);
    }
    
    // Check page margins and print layout
    const printLayoutAnalysis = await page.evaluate(() => {
      const body = document.body;
      const bodyStyles = window.getComputedStyle(body);
      
      // Check for print-specific margins
      return {
        marginTop: bodyStyles.marginTop,
        marginRight: bodyStyles.marginRight,
        marginBottom: bodyStyles.marginBottom,
        marginLeft: bodyStyles.marginLeft,
        paddingTop: bodyStyles.paddingTop,
        paddingRight: bodyStyles.paddingRight,
        paddingBottom: bodyStyles.paddingBottom,
        paddingLeft: bodyStyles.paddingLeft,
        maxWidth: bodyStyles.maxWidth,
        width: bodyStyles.width
      };
    });
    
    // Contract: Print mode should have appropriate margins for A4 paper
    // This will likely fail initially since print margins aren't set
    const margins = [
      parseFloat(printLayoutAnalysis.marginTop),
      parseFloat(printLayoutAnalysis.marginRight),
      parseFloat(printLayoutAnalysis.marginBottom),
      parseFloat(printLayoutAnalysis.marginLeft)
    ];
    
    const hasProperMargins = margins.some(margin => margin >= 20); // At least 20px margin
    expect(hasProperMargins, 
      `Print mode should have proper margins for printing, found: ${JSON.stringify(printLayoutAnalysis)}`
    ).toBeTruthy();
    
    const screenshotPath = await takeVisualSnapshot(page, 'print-mode-margins');
    
    const baselinePath = 'tests/visual/baseline/print-mode-margins.png';
    const comparison = await compareVisualSnapshots(
      'print-mode-margins',
      screenshotPath,
      baselinePath
    );
    
    expect(comparison.diff, 
      `Print mode margins regression: ${(comparison.diff * 100).toFixed(2)}%`
    ).toBeLessThan(visualRegressionConfig.comparison.threshold);
  });

  test('Print mode removes animations and transitions', async ({ page }) => {
    await page.setViewportSize({ width: 794, height: 1123 });
    await page.emulateMedia({ media: 'print' });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Enable print mode
    const modeToggle = page.locator('[data-component="mode-toggle"]');
    const hasToggle = await modeToggle.count() > 0;
    
    if (hasToggle) {
      await modeToggle.click();
      await page.waitForTimeout(500);
    }
    
    // Check for disabled animations
    const animationAnalysis = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const animatedElements = [];
      const staticElements = [];
      
      allElements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const hasTransition = styles.transition !== 'none' && styles.transition !== '';
        const hasAnimation = styles.animation !== 'none' && styles.animation !== '';
        const hasTransform = styles.transform !== 'none';
        
        if (hasTransition || hasAnimation) {
          animatedElements.push({
            tagName: el.tagName,
            className: el.className,
            transition: styles.transition,
            animation: styles.animation
          });
        } else {
          staticElements.push(el.tagName);
        }
      });
      
      return {
        animatedCount: animatedElements.length,
        staticCount: staticElements.length,
        animatedElements: animatedElements.slice(0, 5) // First 5 for debugging
      };
    });
    
    // Contract: Print mode should minimize animations for print clarity
    // This will likely fail initially since print animation removal isn't implemented
    expect(animationAnalysis.animatedCount, 
      `Print mode should minimize animations, found ${animationAnalysis.animatedCount} animated elements: ${JSON.stringify(animationAnalysis.animatedElements)}`
    ).toBeLessThan(5); // Allow minimal animations for essential interactions
  });
});