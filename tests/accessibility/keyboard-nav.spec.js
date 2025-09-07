// T006 - Accessibility contract test for keyboard navigation
// This test MUST FAIL initially to ensure proper TDD implementation
import { test, expect } from '@playwright/test';
import { setupAccessibilityTesting, testKeyboardNavigation } from './setup.js';
import { accessibilityConfig } from './config.js';

const BASE_URL = 'http://localhost:4321/ali-portfolio';

test.describe('Keyboard Navigation Accessibility Contract Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupAccessibilityTesting(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('Tab order follows logical reading flow', async ({ page }) => {
    // Expected tab order from config
    const expectedTabOrder = accessibilityConfig.keyboardNav.tabOrder;
    const actualTabOrder = [];

    // Start with first focusable element
    await page.keyboard.press('Tab');
    
    // Navigate through all tabbable elements
    for (let i = 0; i < 10; i++) {
      const focusedElement = await page.evaluate(() => {
        const focused = document.activeElement;
        if (focused && focused !== document.body) {
          return {
            tagName: focused.tagName.toLowerCase(),
            className: focused.className,
            id: focused.id,
            dataComponent: focused.getAttribute('data-component'),
            textContent: focused.textContent?.slice(0, 30)?.trim()
          };
        }
        return null;
      });

      if (focusedElement) {
        // Determine which section this element belongs to
        let section = 'unknown';
        if (focusedElement.dataComponent === 'mode-toggle') {
          section = 'mode-toggle';
        } else if (focusedElement.tagName === 'a') {
          section = 'contact-links';
        } else if (focusedElement.className?.includes('project')) {
          section = 'project-cards';
        } else if (focusedElement.className?.includes('skill')) {
          section = 'skill-sections';
        }
        
        actualTabOrder.push(section);
      }

      // Move to next element
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
    }

    // Contract: Tab order should follow expectedTabOrder
    // This will fail initially since we haven't implemented proper tabindex
    const uniqueActualOrder = [...new Set(actualTabOrder)];
    expect(uniqueActualOrder, 
      `Tab order should follow logical flow: ${expectedTabOrder.join(' → ')}, but got: ${uniqueActualOrder.join(' → ')}`
    ).toEqual(expectedTabOrder);
  });

  test('All interactive elements are keyboard accessible', async ({ page }) => {
    // Find all interactive elements
    const interactiveSelectors = [
      'button',
      'a[href]',
      'input', 
      'select',
      'textarea',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]',
      '[role="link"]'
    ];

    const nonAccessibleElements = [];

    for (const selector of interactiveSelectors) {
      const elements = await page.locator(selector).all();
      
      for (const element of elements) {
        // Check if element is focusable
        await element.focus();
        const isFocused = await element.evaluate(el => el === document.activeElement);
        
        if (!isFocused) {
          const elementInfo = await element.evaluate(el => ({
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            textContent: el.textContent?.slice(0, 30)
          }));
          nonAccessibleElements.push(elementInfo);
        }
      }
    }

    // Contract: All interactive elements must be keyboard accessible
    // This will likely fail initially since we haven't properly configured tabindex
    expect(nonAccessibleElements, 
      `These interactive elements are not keyboard accessible: ${JSON.stringify(nonAccessibleElements, null, 2)}`
    ).toHaveLength(0);
  });

  test('Focus indicators are visible and meet contrast requirements', async ({ page }) => {
    const focusFailures = [];
    const interactiveElements = await page.locator('button, a, input, [tabindex]:not([tabindex="-1"])').all();
    
    for (const element of interactiveElements) {
      await element.focus();
      await page.waitForTimeout(100);
      
      const focusStyles = await element.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          outlineWidth: styles.outlineWidth,
          outlineStyle: styles.outlineStyle,
          outlineColor: styles.outlineColor,
          boxShadow: styles.boxShadow,
          backgroundColor: styles.backgroundColor,
          visibility: styles.visibility,
          opacity: styles.opacity
        };
      });
      
      const hasVisibleFocus = 
        (focusStyles.outlineWidth !== 'none' && focusStyles.outlineWidth !== '0px') ||
        (focusStyles.boxShadow !== 'none') ||
        (focusStyles.backgroundColor !== 'transparent');
      
      if (!hasVisibleFocus) {
        const elementInfo = await element.evaluate(el => ({
          tagName: el.tagName,
          className: el.className,
          textContent: el.textContent?.slice(0, 20)
        }));
        focusFailures.push(elementInfo);
      }
      
      // Check outline width meets minimum requirement
      const outlineWidth = parseFloat(focusStyles.outlineWidth) || 0;
      const minOutlineWidth = parseFloat(accessibilityConfig.keyboardNav.focusIndicators.minOutlineWidth);
      
      if (outlineWidth < minOutlineWidth) {
        const elementInfo = await element.evaluate(el => ({
          tagName: el.tagName,
          className: el.className,
          issue: `Outline width ${outlineWidth}px < required ${minOutlineWidth}px`
        }));
        focusFailures.push(elementInfo);
      }
    }
    
    // Contract: All focusable elements must have visible focus indicators
    // This will fail initially since we haven't implemented focus styles
    expect(focusFailures, 
      `These elements lack proper focus indicators: ${JSON.stringify(focusFailures, null, 2)}`
    ).toHaveLength(0);
  });

  test('Keyboard shortcuts work correctly', async ({ page }) => {
    const shortcuts = accessibilityConfig.keyboardNav.shortcuts;
    const shortcutFailures = [];
    
    // Test Escape key (should close any open modals/dropdowns)
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);
    
    // Check if any modals are still open after Escape
    const openModals = await page.locator('[role="dialog"], .modal, .dropdown-open').count();
    if (openModals > 0) {
      shortcutFailures.push({
        key: 'Escape',
        expected: 'close-modals',
        actual: `${openModals} modals still open`
      });
    }
    
    // Test Tab navigation
    await page.keyboard.press('Tab');
    const firstTabElement = await page.evaluate(() => document.activeElement?.tagName);
    
    await page.keyboard.press('Shift+Tab');
    const shiftTabElement = await page.evaluate(() => document.activeElement?.tagName);
    
    // Should return to previous element or body
    if (firstTabElement === shiftTabElement && firstTabElement !== 'BODY') {
      shortcutFailures.push({
        key: 'Shift+Tab',
        expected: 'previous-element',
        actual: 'stayed on same element'
      });
    }
    
    // Test Enter/Space activation on buttons
    const firstButton = page.locator('button').first();
    const buttonExists = await firstButton.count() > 0;
    
    if (buttonExists) {
      await firstButton.focus();
      
      // This test expects a button click handler to exist
      // It will likely fail initially since handlers may not be implemented
      const buttonClickable = await firstButton.evaluate(btn => {
        return typeof btn.onclick === 'function' || 
               btn.hasAttribute('onclick') ||
               btn.addEventListener !== undefined;
      });
      
      if (!buttonClickable) {
        shortcutFailures.push({
          key: 'Enter/Space',
          expected: 'activate-element',
          actual: 'button not clickable via keyboard'
        });
      }
    }
    
    // Contract: All keyboard shortcuts must work as expected
    // This will likely fail initially since keyboard handlers may not be implemented
    expect(shortcutFailures,
      `Keyboard shortcuts failed: ${JSON.stringify(shortcutFailures, null, 2)}`
    ).toHaveLength(0);
  });

  test('Skip links allow keyboard users to bypass navigation', async ({ page }) => {
    // Look for skip links (usually hidden until focused)
    await page.keyboard.press('Tab');
    
    const skipLink = await page.locator('a[href^="#"], [role="link"][href^="#"]').first();
    const skipLinkExists = await skipLink.count() > 0;
    
    let skipLinkVisible = false;
    let skipLinkText = '';
    
    if (skipLinkExists) {
      await skipLink.focus();
      const styles = await skipLink.evaluate(el => ({
        visibility: window.getComputedStyle(el).visibility,
        opacity: window.getComputedStyle(el).opacity,
        position: window.getComputedStyle(el).position,
        left: window.getComputedStyle(el).left,
        clip: window.getComputedStyle(el).clip
      }));
      
      skipLinkVisible = styles.visibility !== 'hidden' && 
                       styles.opacity !== '0' &&
                       !(styles.position === 'absolute' && styles.left === '-9999px');
      
      skipLinkText = await skipLink.textContent() || '';
    }
    
    // Contract: Skip links should exist and be visible when focused
    // This will fail initially since we haven't implemented skip links
    expect(skipLinkExists, 'Skip link should exist for keyboard navigation').toBeTruthy();
    expect(skipLinkVisible, 'Skip link should be visible when focused').toBeTruthy();
    expect(skipLinkText.toLowerCase(), 'Skip link should have descriptive text')
      .toMatch(/(skip|main|content)/i);
  });

  test('Keyboard trap works correctly in modal contexts', async ({ page }) => {
    // This test assumes there might be modal dialogs
    // Look for any modal triggers
    const modalTriggers = await page.locator('[data-modal], [aria-haspopup="dialog"], .modal-trigger').all();
    
    if (modalTriggers.length === 0) {
      // If no modals exist, this part of the test passes
      return;
    }
    
    // Open first modal if it exists
    await modalTriggers[0].click();
    await page.waitForTimeout(500);
    
    // Check if modal is open
    const modal = page.locator('[role="dialog"], .modal');
    const modalOpen = await modal.count() > 0;
    
    if (modalOpen) {
      // Test keyboard trap - focus should stay within modal
      const focusableInModal = await modal.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])').all();
      
      if (focusableInModal.length > 0) {
        // Focus first element in modal
        await focusableInModal[0].focus();
        
        // Tab through all focusable elements
        for (let i = 0; i < focusableInModal.length + 2; i++) {
          await page.keyboard.press('Tab');
          const currentFocus = await page.evaluate(() => document.activeElement);
          const isInsideModal = await modal.evaluate((modal, focused) => 
            modal.contains(focused), currentFocus);
          
          // Contract: Focus should stay within modal (keyboard trap)
          // This will likely fail initially since keyboard trap isn't implemented
          expect(isInsideModal, 
            `Focus escaped modal on Tab ${i + 1}. Keyboard trap not working.`
          ).toBeTruthy();
        }
      }
    }
  });

  test('Keyboard navigation works on mobile/touch devices', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip('This test only runs on mobile devices');
    }
    
    // On mobile, ensure keyboard navigation still works when external keyboard connected
    // Test basic tab functionality
    await page.keyboard.press('Tab');
    const firstFocused = await page.evaluate(() => document.activeElement !== document.body);
    
    await page.keyboard.press('Tab');
    const secondFocused = await page.evaluate(() => document.activeElement !== document.body);
    
    // Contract: Tab navigation should work on mobile
    // This might fail if mobile keyboard navigation isn't properly implemented
    expect(firstFocused || secondFocused, 
      'Keyboard navigation should work on mobile devices with external keyboards'
    ).toBeTruthy();
  });
});