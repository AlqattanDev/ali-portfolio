// T005 - Accessibility contract test for color contrast ratios
import { test, expect } from '@playwright/test';
import { setupAccessibilityTesting, testColorContrast } from './setup.js';
import { accessibilityConfig } from './config.js';

const BASE_URL = 'http://localhost:4321/ali-portfolio';

// Color contrast calculation helper
function calculateContrastRatio(color1, color2) {
  function parseColor(color) {
    // Handle rgb() and rgba() formats
    if (color.startsWith('rgb')) {
      const matches = color.match(/\d+/g);
      return [parseInt(matches[0]), parseInt(matches[1]), parseInt(matches[2])];
    }
    // Handle hex colors if needed
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16)
      ];
    }
    // Default to black
    return [0, 0, 0];
  }

  function getLuminance(rgb) {
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);
  
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

test.describe('Color Contrast Accessibility Contract Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupAccessibilityTesting(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('Digital mode - Primary text contrast ratio ≥14:1', async ({ page }) => {
    // Ensure we're in digital mode by checking if it's already active
    await page.waitForTimeout(500);
    
    // Test primary text elements (headers, main content)
    const primaryTextSelectors = [
      '.ascii-name', // Terminal ASCII art  
      '.system-info span', // System info text
      'h2', // Section headers
      '.terminal-command' // Terminal commands
    ];

    for (const selector of primaryTextSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        // Get computed styles and calculate actual contrast
        const contrast = await elements.first().evaluate((el) => {
          const styles = window.getComputedStyle(el);
          const textColor = styles.color;
          const backgroundColor = styles.backgroundColor || 'rgba(0, 0, 0, 0)';
          
          // If background is transparent, get the actual background
          let actualBg = backgroundColor;
          if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
            let parent = el.parentElement;
            while (parent && (actualBg === 'rgba(0, 0, 0, 0)' || actualBg === 'transparent')) {
              const parentStyles = window.getComputedStyle(parent);
              actualBg = parentStyles.backgroundColor;
              parent = parent.parentElement;
            }
            if (actualBg === 'rgba(0, 0, 0, 0)' || actualBg === 'transparent') {
              actualBg = 'rgb(0, 0, 0)'; // Default to black background
            }
          }
          
          return {
            textColor,
            backgroundColor: actualBg
          };
        });

        // Calculate actual contrast ratio
        const ratio = calculateContrastRatio(contrast.textColor, contrast.backgroundColor);
        
        // Contract: Primary text must have ≥4.5:1 contrast ratio (WCAG AA)
        expect(ratio, 
          `Primary text ${selector} contrast ratio must be ≥4.5:1, got ${ratio.toFixed(1)}:1`
        ).toBeGreaterThanOrEqual(accessibilityConfig.colorContrast.digital.primaryText);
      }
    }
  });

  test('Digital mode - Secondary text contrast ratio ≥7:1', async ({ page }) => {
    // Test secondary text elements (metadata, descriptions)
    const secondaryTextSelectors = [
      '.comment', // Comments in terminal
      'p:not(.terminal-command)', // Paragraph text (excluding terminal commands)
      '.checksum', // Footer checksum
      '.project-card p' // Project descriptions if they exist
    ];

    for (const selector of secondaryTextSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        const contrast = await elements.first().evaluate((el) => {
          const styles = window.getComputedStyle(el);
          const textColor = styles.color;
          let backgroundColor = styles.backgroundColor || 'rgba(0, 0, 0, 0)';
          
          // If background is transparent, get the actual background
          if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
            let parent = el.parentElement;
            while (parent && (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent')) {
              const parentStyles = window.getComputedStyle(parent);
              backgroundColor = parentStyles.backgroundColor;
              parent = parent.parentElement;
            }
            if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
              backgroundColor = 'rgb(0, 0, 0)'; // Default to black background
            }
          }
          
          return {
            textColor,
            backgroundColor
          };
        });

        // Calculate actual contrast ratio
        const ratio = calculateContrastRatio(contrast.textColor, contrast.backgroundColor);

        // Contract: Secondary text must have ≥4.5:1 contrast ratio (WCAG AA)
        expect(ratio,
          `Secondary text ${selector} contrast ratio must be ≥4.5:1, got ${ratio.toFixed(1)}:1`
        ).toBeGreaterThanOrEqual(accessibilityConfig.colorContrast.digital.secondaryText);
      }
    }
  });

  test('Digital mode - Accent text contrast ratio ≥12:1', async ({ page }) => {
    // Test accent text elements (links, highlights, interactive elements)
    const accentTextSelectors = [
      'a', // Links
      'button', // Button text
      '[data-component="mode-toggle"] .sr-only', // Mode toggle text
      '.skill-bar', // Skill indicators if they exist
      '.project-tech' // Project technology labels if they exist
    ];

    for (const selector of accentTextSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        const contrast = await elements.first().evaluate((el) => {
          const styles = window.getComputedStyle(el);
          const textColor = styles.color;
          let backgroundColor = styles.backgroundColor || 'rgba(0, 0, 0, 0)';
          
          // If background is transparent, get the actual background
          if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
            let parent = el.parentElement;
            while (parent && (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent')) {
              const parentStyles = window.getComputedStyle(parent);
              backgroundColor = parentStyles.backgroundColor;
              parent = parent.parentElement;
            }
            if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
              backgroundColor = 'rgb(0, 0, 0)'; // Default to black background
            }
          }
          
          return {
            textColor,
            backgroundColor
          };
        });

        // Calculate actual contrast ratio
        const ratio = calculateContrastRatio(contrast.textColor, contrast.backgroundColor);

        // Contract: Accent text must have ≥4.5:1 contrast ratio (WCAG AA)
        expect(ratio,
          `Accent text ${selector} contrast ratio must be ≥4.5:1, got ${ratio.toFixed(1)}:1`
        ).toBeGreaterThanOrEqual(accessibilityConfig.colorContrast.digital.accentText);
      }
    }
  });

  test('Print mode - Primary text contrast ratio ≥21:1', async ({ page }) => {
    // Switch to print mode
    const modeToggle = page.locator('[data-component="mode-toggle"]');
    await modeToggle.click();
    await page.waitForTimeout(500);
    
    // Verify we're in print mode by checking aria-checked attribute
    const isChecked = await modeToggle.getAttribute('aria-checked');
    expect(isChecked).toBe('true'); // Print mode should set aria-checked to true

    // Test primary text in print mode
    const primaryTextSelectors = [
      '.ascii-name', // Terminal ASCII art  
      '.system-info span', // System info text
      'h2', // Section headers
      '.terminal-command' // Terminal commands
    ];

    for (const selector of primaryTextSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        const contrast = await elements.first().evaluate((el) => {
          const styles = window.getComputedStyle(el);
          const textColor = styles.color;
          let backgroundColor = styles.backgroundColor || 'rgba(0, 0, 0, 0)';
          
          // If background is transparent, get the actual background
          if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
            let parent = el.parentElement;
            while (parent && (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent')) {
              const parentStyles = window.getComputedStyle(parent);
              backgroundColor = parentStyles.backgroundColor;
              parent = parent.parentElement;
            }
            if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
              backgroundColor = 'rgb(255, 255, 255)'; // Default to white background for print mode
            }
          }
          
          return {
            textColor,
            backgroundColor
          };
        });

        // Calculate actual contrast ratio
        const ratio = calculateContrastRatio(contrast.textColor, contrast.backgroundColor);

        // Contract: Print mode primary text must have ≥7:1 contrast ratio (WCAG AAA)
        expect(ratio,
          `Print mode primary text ${selector} contrast ratio must be ≥7:1, got ${ratio.toFixed(1)}:1`
        ).toBeGreaterThanOrEqual(accessibilityConfig.colorContrast.print.primaryText);
      }
    }
  });

  test('Print mode - Secondary text contrast ratio ≥12.6:1', async ({ page }) => {
    // Switch to print mode
    await page.locator('[data-component="mode-toggle"]').click();
    await page.waitForTimeout(500);

    // Test secondary text in print mode
    const secondaryTextSelectors = [
      '.comment', // Comments in terminal
      'p:not(.terminal-command)', // Paragraph text (excluding terminal commands)
      '.checksum', // Footer checksum
      '.project-card p' // Project descriptions if they exist
    ];

    for (const selector of secondaryTextSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        const contrast = await elements.first().evaluate((el) => {
          const styles = window.getComputedStyle(el);
          const textColor = styles.color;
          let backgroundColor = styles.backgroundColor || 'rgba(0, 0, 0, 0)';
          
          // If background is transparent, get the actual background
          if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
            let parent = el.parentElement;
            while (parent && (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent')) {
              const parentStyles = window.getComputedStyle(parent);
              backgroundColor = parentStyles.backgroundColor;
              parent = parent.parentElement;
            }
            if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
              backgroundColor = 'rgb(255, 255, 255)'; // Default to white background for print mode
            }
          }
          
          return {
            textColor,
            backgroundColor
          };
        });

        // Calculate actual contrast ratio
        const ratio = calculateContrastRatio(contrast.textColor, contrast.backgroundColor);

        // Contract: Print mode secondary text must have ≥4.5:1 contrast ratio (WCAG AA)
        expect(ratio,
          `Print mode secondary text ${selector} contrast ratio must be ≥4.5:1, got ${ratio.toFixed(1)}:1`
        ).toBeGreaterThanOrEqual(accessibilityConfig.colorContrast.print.secondaryText);
      }
    }
  });

  test('Interactive elements have sufficient focus contrast', async ({ page }) => {
    // Test focus indicators on interactive elements
    const interactiveSelectors = [
      'button',
      'a', 
      '[data-component="mode-toggle"]'
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
          const focusOutlineColor = styles.outlineColor || styles.borderColor || 'rgb(0, 0, 0)';
          
          // For focus indicators, we need to check contrast against the page background,
          // not the element's own background (which might be styled for focus)
          let pageBackground = window.getComputedStyle(document.body).backgroundColor;
          
          // If body background is transparent, check html or use default
          if (pageBackground === 'rgba(0, 0, 0, 0)' || pageBackground === 'transparent') {
            pageBackground = window.getComputedStyle(document.documentElement).backgroundColor;
            if (pageBackground === 'rgba(0, 0, 0, 0)' || pageBackground === 'transparent') {
              pageBackground = 'rgb(0, 0, 0)'; // Default to black background for digital mode
            }
          }
          
          return {
            focusOutlineColor,
            backgroundColor: pageBackground
          };
        });

        // Calculate actual contrast ratio
        const ratio = calculateContrastRatio(focusContrast.focusOutlineColor, focusContrast.backgroundColor);

        // Contract: Focus indicators must have ≥3:1 contrast (WCAG AA minimum)
        expect(ratio,
          `Focus indicator for ${selector} must have ≥3:1 contrast ratio, got ${ratio.toFixed(1)}:1`
        ).toBeGreaterThanOrEqual(3);
      }
    }
  });
});