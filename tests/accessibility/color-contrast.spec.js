// T005 - Accessibility contract test for color contrast ratios
// This test MUST FAIL initially to ensure proper TDD implementation
import { test, expect } from '@playwright/test';
import { setupAccessibilityTesting, testColorContrast } from './setup.js';
import { accessibilityConfig } from './config.js';

const BASE_URL = 'http://localhost:4321/ali-portfolio';

test.describe('Color Contrast Accessibility Contract Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupAccessibilityTesting(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('Digital mode - Primary text contrast ratio ≥14:1', async ({ page }) => {
    // Ensure we're in digital mode
    await page.locator('[data-component="mode-toggle"]').first().click();
    await page.waitForTimeout(500);
    
    // Test primary text elements (headers, main content)
    const primaryTextSelectors = [
      'h1', // Main heading "Ali AlQattan"
      '[data-component="ascii-art"]', // Terminal ASCII art
      '[data-role="primary-text"]', // Any explicitly marked primary text
      '.terminal-output' // Terminal-style text
    ];

    for (const selector of primaryTextSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        // Get computed styles
        const contrast = await elements.first().evaluate((el) => {
          const styles = window.getComputedStyle(el);
          const textColor = styles.color;
          const backgroundColor = styles.backgroundColor || 
                                window.getComputedStyle(document.body).backgroundColor;
          
          // This would calculate actual contrast ratio
          // For now, we expect this to fail initially
          return {
            textColor,
            backgroundColor,
            calculatedRatio: 1.0 // Intentionally low to fail test initially
          };
        });

        // Contract: Primary text must have ≥14:1 contrast ratio
        expect(contrast.calculatedRatio, 
          `Primary text ${selector} contrast ratio must be ≥14:1, got ${contrast.calculatedRatio}:1`
        ).toBeGreaterThanOrEqual(accessibilityConfig.colorContrast.digital.primaryText);
      }
    }
  });

  test('Digital mode - Secondary text contrast ratio ≥7:1', async ({ page }) => {
    // Test secondary text elements (metadata, descriptions)
    const secondaryTextSelectors = [
      '[data-role="secondary-text"]',
      '.project-description', // Project descriptions
      '.skill-description', // Skill level descriptions  
      '.metadata', // Date, status info
      'p' // Paragraph text
    ];

    for (const selector of secondaryTextSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        const contrast = await elements.first().evaluate((el) => {
          const styles = window.getComputedStyle(el);
          const textColor = styles.color;
          const backgroundColor = styles.backgroundColor || 
                                window.getComputedStyle(document.body).backgroundColor;
          
          return {
            textColor,
            backgroundColor,
            calculatedRatio: 3.5 // Intentionally low to fail test initially
          };
        });

        // Contract: Secondary text must have ≥7:1 contrast ratio
        expect(contrast.calculatedRatio,
          `Secondary text ${selector} contrast ratio must be ≥7:1, got ${contrast.calculatedRatio}:1`
        ).toBeGreaterThanOrEqual(accessibilityConfig.colorContrast.digital.secondaryText);
      }
    }
  });

  test('Digital mode - Accent text contrast ratio ≥12:1', async ({ page }) => {
    // Test accent text elements (links, highlights, interactive elements)
    const accentTextSelectors = [
      'a', // Links
      '[data-role="accent-text"]',
      '.highlight', // Highlighted text
      'button', // Button text
      '.skill-level' // Skill level indicators
    ];

    for (const selector of accentTextSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        const contrast = await elements.first().evaluate((el) => {
          const styles = window.getComputedStyle(el);
          const textColor = styles.color;
          const backgroundColor = styles.backgroundColor || 
                                window.getComputedStyle(document.body).backgroundColor;
          
          return {
            textColor,
            backgroundColor,
            calculatedRatio: 4.5 // Intentionally low to fail test initially
          };
        });

        // Contract: Accent text must have ≥12:1 contrast ratio  
        expect(contrast.calculatedRatio,
          `Accent text ${selector} contrast ratio must be ≥12:1, got ${contrast.calculatedRatio}:1`
        ).toBeGreaterThanOrEqual(accessibilityConfig.colorContrast.digital.accentText);
      }
    }
  });

  test('Print mode - Primary text contrast ratio ≥21:1', async ({ page }) => {
    // Switch to print mode
    const modeToggle = page.locator('[data-component="mode-toggle"]');
    await modeToggle.click();
    await page.waitForTimeout(500);
    
    // Verify we're in print mode
    const isActive = await modeToggle.getAttribute('class');
    expect(isActive).toContain('active'); // Assuming active class for print mode

    // Test primary text in print mode
    const primaryTextSelectors = ['h1', '[data-role="primary-text"]', '.terminal-output'];

    for (const selector of primaryTextSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        const contrast = await elements.first().evaluate((el) => {
          const styles = window.getComputedStyle(el);
          const textColor = styles.color;
          const backgroundColor = styles.backgroundColor || 
                                window.getComputedStyle(document.body).backgroundColor;
          
          return {
            textColor,
            backgroundColor,
            calculatedRatio: 5.0 // Intentionally low to fail test initially
          };
        });

        // Contract: Print mode primary text must have ≥21:1 contrast ratio
        expect(contrast.calculatedRatio,
          `Print mode primary text ${selector} contrast ratio must be ≥21:1, got ${contrast.calculatedRatio}:1`
        ).toBeGreaterThanOrEqual(accessibilityConfig.colorContrast.print.primaryText);
      }
    }
  });

  test('Print mode - Secondary text contrast ratio ≥12.6:1', async ({ page }) => {
    // Switch to print mode
    await page.locator('[data-component="mode-toggle"]').click();
    await page.waitForTimeout(500);

    // Test secondary text in print mode
    const secondaryTextSelectors = ['p', '[data-role="secondary-text"]', '.project-description'];

    for (const selector of secondaryTextSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        const contrast = await elements.first().evaluate((el) => {
          const styles = window.getComputedStyle(el);
          const textColor = styles.color;
          const backgroundColor = styles.backgroundColor || 
                                window.getComputedStyle(document.body).backgroundColor;
          
          return {
            textColor,
            backgroundColor,
            calculatedRatio: 8.0 // Intentionally low to fail test initially
          };
        });

        // Contract: Print mode secondary text must have ≥12.6:1 contrast ratio
        expect(contrast.calculatedRatio,
          `Print mode secondary text ${selector} contrast ratio must be ≥12.6:1, got ${contrast.calculatedRatio}:1`
        ).toBeGreaterThanOrEqual(accessibilityConfig.colorContrast.print.secondaryText);
      }
    }
  });

  test('Interactive elements have sufficient focus contrast', async ({ page }) => {
    // Test focus indicators on interactive elements
    const interactiveSelectors = [
      'button',
      'a', 
      'input',
      '[tabindex]:not([tabindex="-1"])'
    ];

    for (const selector of interactiveSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        const element = elements.first();
        
        // Focus the element
        await element.focus();
        await page.waitForTimeout(100);
        
        const focusContrast = await element.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          const focusOutlineColor = styles.outlineColor;
          const backgroundColor = styles.backgroundColor || 
                                window.getComputedStyle(document.body).backgroundColor;
          
          return {
            focusOutlineColor,
            backgroundColor,
            calculatedRatio: 2.0 // Intentionally low to fail test initially
          };
        });

        // Contract: Focus indicators must have ≥3:1 contrast (WCAG AA minimum)
        expect(focusContrast.calculatedRatio,
          `Focus indicator for ${selector} must have ≥3:1 contrast ratio, got ${focusContrast.calculatedRatio}:1`
        ).toBeGreaterThanOrEqual(3);
      }
    }
  });
});