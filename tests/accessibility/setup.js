// Accessibility Testing Setup Utilities
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { accessibilityConfig } from './config.js';

/**
 * Setup accessibility testing environment
 */
export async function setupAccessibilityTesting(page) {
  // Inject axe-core accessibility testing library
  await page.addInitScript(() => {
    // Ensure high contrast mode detection
    window.matchMedia = window.matchMedia || function(query) {
      return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
      };
    };
  });

  // Configure reduced motion preferences for testing
  await page.emulateMedia({ reducedMotion: 'reduce' });
  
  return page;
}

/**
 * Run comprehensive accessibility scan
 */
export async function runAccessibilityScan(page, options = {}) {
  const axeBuilder = new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .exclude('#__playwright-inspector'); // Exclude Playwright UI

  // Apply custom rules from config
  if (accessibilityConfig.tools.axeCore.customRules) {
    Object.entries(accessibilityConfig.tools.axeCore.customRules).forEach(([rule, config]) => {
      if (config.enabled) {
        axeBuilder.include(`[data-rule="${rule}"]`);
      }
    });
  }

  // Run the accessibility scan
  const results = await axeBuilder.analyze();
  
  return results;
}

/**
 * Test keyboard navigation flow
 */
export async function testKeyboardNavigation(page) {
  const tabOrder = accessibilityConfig.keyboardNav.tabOrder;
  const focusedElements = [];

  // Start from first tabbable element
  await page.keyboard.press('Tab');
  
  for (let i = 0; i < tabOrder.length; i++) {
    // Get currently focused element
    const focusedElement = await page.evaluate(() => {
      const focused = document.activeElement;
      return {
        tagName: focused.tagName,
        className: focused.className,
        id: focused.id,
        textContent: focused.textContent?.slice(0, 50)
      };
    });
    
    focusedElements.push(focusedElement);
    
    // Move to next element
    if (i < tabOrder.length - 1) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100); // Small delay for focus change
    }
  }

  return focusedElements;
}

/**
 * Test color contrast ratios
 */
export async function testColorContrast(page, mode = 'digital') {
  const contrastConfig = accessibilityConfig.colorContrast[mode];
  
  // Get all text elements and their computed styles
  const contrastResults = await page.evaluate((config) => {
    const elements = document.querySelectorAll('*');
    const results = [];

    elements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const textColor = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Only test elements with actual text content
      if (element.textContent?.trim() && textColor && backgroundColor) {
        results.push({
          element: element.tagName + (element.className ? `.${element.className}` : ''),
          textColor,
          backgroundColor,
          textContent: element.textContent.slice(0, 30)
        });
      }
    });

    return results;
  }, contrastConfig);

  return contrastResults;
}

/**
 * Test screen reader compatibility
 */
export async function testScreenReaderCompatibility(page) {
  const srConfig = accessibilityConfig.screenReader;
  
  // Check for required landmarks
  const landmarks = await page.evaluate((config) => {
    const foundLandmarks = {};
    
    config.landmarks.forEach(landmark => {
      const elements = document.querySelectorAll(landmark);
      foundLandmarks[landmark] = elements.length;
    });

    return foundLandmarks;
  }, srConfig);

  // Check heading hierarchy
  const headingHierarchy = await page.evaluate(() => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    return Array.from(headings).map(h => ({
      level: parseInt(h.tagName.charAt(1)),
      text: h.textContent?.slice(0, 50),
      hasId: !!h.id
    }));
  });

  // Check ARIA labels
  const ariaLabels = await page.evaluate((config) => {
    const results = {};
    
    config.ariaLabels.required.forEach(selector => {
      const elements = document.querySelectorAll(`[data-component="${selector}"]`);
      results[selector] = Array.from(elements).map(el => ({
        hasAriaLabel: !!el.getAttribute('aria-label'),
        hasAriaDescribedBy: !!el.getAttribute('aria-describedby'),
        role: el.getAttribute('role')
      }));
    });

    return results;
  }, srConfig);

  return {
    landmarks,
    headingHierarchy,
    ariaLabels
  };
}

/**
 * Test responsive accessibility
 */
export async function testResponsiveAccessibility(page, viewport) {
  await page.setViewportSize(viewport);
  
  // Test touch targets on mobile
  if (viewport.width <= 768) {
    const touchTargets = await page.evaluate((config) => {
      const interactive = document.querySelectorAll('button, a, input, [tabindex]:not([tabindex="-1"])');
      const results = [];

      interactive.forEach(element => {
        const rect = element.getBoundingClientRect();
        results.push({
          element: element.tagName + (element.className ? `.${element.className.split(' ')[0]}` : ''),
          width: rect.width,
          height: rect.height,
          meetsMinSize: rect.width >= config.minSize && rect.height >= config.minSize
        });
      });

      return results;
    }, accessibilityConfig.responsive.touchTargets);

    return { touchTargets };
  }

  return {};
}

export default {
  setupAccessibilityTesting,
  runAccessibilityScan,
  testKeyboardNavigation,
  testColorContrast,
  testScreenReaderCompatibility,
  testResponsiveAccessibility
};