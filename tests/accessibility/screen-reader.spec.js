// T007 - Accessibility contract test for screen reader compatibility
// This test MUST FAIL initially to ensure proper TDD implementation
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { setupAccessibilityTesting, testScreenReaderCompatibility } from './setup.js';
import { accessibilityConfig } from './config.js';

const BASE_URL = 'http://localhost:4321/ali-portfolio';

test.describe('Screen Reader Compatibility Contract Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupAccessibilityTesting(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('Page has proper landmark regions', async ({ page }) => {
    const landmarks = accessibilityConfig.screenReader.landmarks;
    const missingLandmarks = [];

    for (const landmark of landmarks) {
      const elements = await page.locator(landmark).count();
      
      if (elements === 0) {
        missingLandmarks.push(landmark);
      }
    }

    // Contract: All required landmarks must exist
    // This will fail initially since semantic HTML structure isn't implemented
    expect(missingLandmarks, 
      `Missing required landmarks: ${missingLandmarks.join(', ')}. Screen readers need these for navigation.`
    ).toHaveLength(0);

    // Additional check: landmarks should have appropriate roles
    const landmarkRoles = await page.evaluate(() => {
      const landmarks = document.querySelectorAll('header, main, nav, aside, footer');
      return Array.from(landmarks).map(el => ({
        tagName: el.tagName.toLowerCase(),
        role: el.getAttribute('role') || 'implicit',
        hasAriaLabel: !!el.getAttribute('aria-label')
      }));
    });

    // Contract: Each landmark should have proper role or implicit semantics
    const improperlyCodedLandmarks = landmarkRoles.filter(l => 
      l.tagName === 'div' && l.role === 'implicit'
    );

    expect(improperlyCodedLandmarks,
      `These landmarks lack proper semantic markup: ${JSON.stringify(improperlyCodedLandmarks)}`
    ).toHaveLength(0);
  });

  test('Heading hierarchy is sequential and logical', async ({ page }) => {
    const headings = await page.evaluate(() => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return Array.from(headingElements).map(h => ({
        level: parseInt(h.tagName.charAt(1)),
        text: h.textContent?.slice(0, 50),
        hasId: !!h.id,
        isEmpty: !h.textContent?.trim()
      }));
    });

    const hierarchyIssues = [];

    // Check for exactly one h1
    const h1Count = headings.filter(h => h.level === 1).length;
    if (h1Count !== 1) {
      hierarchyIssues.push(`Found ${h1Count} h1 elements, should be exactly 1`);
    }

    // Check for empty headings
    const emptyHeadings = headings.filter(h => h.isEmpty);
    if (emptyHeadings.length > 0) {
      hierarchyIssues.push(`Found ${emptyHeadings.length} empty headings`);
    }

    // Check for skipped levels
    for (let i = 1; i < headings.length; i++) {
      const current = headings[i].level;
      const previous = headings[i - 1].level;
      
      if (current > previous + 1) {
        hierarchyIssues.push(`Heading level skipped: h${previous} followed by h${current}`);
      }
    }

    // Contract: Heading hierarchy must be sequential (WCAG 2.1 AA)
    // This will likely fail initially since proper heading structure isn't implemented
    expect(hierarchyIssues,
      `Heading hierarchy violations: ${hierarchyIssues.join('; ')}`
    ).toHaveLength(0);
  });

  test('Required ARIA labels are present', async ({ page }) => {
    const requiredAriaLabels = accessibilityConfig.screenReader.ariaLabels.required;
    const missingAriaLabels = [];

    for (const component of requiredAriaLabels) {
      // Look for elements with data-component attribute
      const elements = await page.locator(`[data-component="${component}"]`).all();
      
      for (const element of elements) {
        const ariaInfo = await element.evaluate(el => ({
          hasAriaLabel: !!el.getAttribute('aria-label'),
          hasAriaLabelledBy: !!el.getAttribute('aria-labelledby'),
          hasAriaDescribedBy: !!el.getAttribute('aria-describedby'),
          tagName: el.tagName.toLowerCase(),
          role: el.getAttribute('role'),
          textContent: el.textContent?.slice(0, 30)
        }));

        // Check if element has any form of accessible name
        const hasAccessibleName = ariaInfo.hasAriaLabel || 
                                 ariaInfo.hasAriaLabelledBy || 
                                 (ariaInfo.textContent && ariaInfo.textContent.trim().length > 0);

        if (!hasAccessibleName) {
          missingAriaLabels.push({
            component,
            element: ariaInfo
          });
        }
      }
    }

    // Contract: All specified components must have accessible names
    // This will fail initially since ARIA labels haven't been added
    expect(missingAriaLabels,
      `Components missing accessible names: ${JSON.stringify(missingAriaLabels, null, 2)}`
    ).toHaveLength(0);
  });

  test('Images have appropriate alternative text', async ({ page }) => {
    const images = await page.locator('img').all();
    const altTextIssues = [];

    for (const img of images) {
      const imageInfo = await img.evaluate(image => ({
        src: image.src,
        alt: image.alt,
        hasAlt: image.hasAttribute('alt'),
        isDecorative: image.getAttribute('role') === 'presentation' || 
                     image.getAttribute('alt') === '',
        ariaHidden: image.getAttribute('aria-hidden') === 'true'
      }));

      // Check for missing alt attributes
      if (!imageInfo.hasAlt && !imageInfo.ariaHidden) {
        altTextIssues.push({
          src: imageInfo.src,
          issue: 'Missing alt attribute'
        });
      }

      // Check for generic/poor alt text
      if (imageInfo.alt && (
        imageInfo.alt.toLowerCase().includes('image') ||
        imageInfo.alt.toLowerCase().includes('picture') ||
        imageInfo.alt.toLowerCase().includes('photo') ||
        imageInfo.alt === 'logo'
      )) {
        altTextIssues.push({
          src: imageInfo.src,
          alt: imageInfo.alt,
          issue: 'Generic or unhelpful alt text'
        });
      }
    }

    // Contract: All images must have appropriate alt text
    // This will likely fail initially since proper alt text hasn't been added
    expect(altTextIssues,
      `Image alt text issues: ${JSON.stringify(altTextIssues, null, 2)}`
    ).toHaveLength(0);
  });

  test('Form elements have proper labels and descriptions', async ({ page }) => {
    const formElements = await page.locator('input, select, textarea').all();
    const formIssues = [];

    for (const element of formElements) {
      const formInfo = await element.evaluate(el => ({
        type: el.type || el.tagName.toLowerCase(),
        id: el.id,
        name: el.name,
        hasLabel: !!document.querySelector(`label[for="${el.id}"]`),
        hasAriaLabel: !!el.getAttribute('aria-label'),
        hasAriaLabelledBy: !!el.getAttribute('aria-labelledby'),
        hasAriaDescribedBy: !!el.getAttribute('aria-describedby'),
        placeholder: el.placeholder,
        required: el.required
      }));

      // Check for accessible name
      const hasAccessibleName = formInfo.hasLabel || 
                               formInfo.hasAriaLabel || 
                               formInfo.hasAriaLabelledBy;

      if (!hasAccessibleName) {
        formIssues.push({
          type: formInfo.type,
          id: formInfo.id,
          issue: 'Missing accessible name (label, aria-label, or aria-labelledby)'
        });
      }

      // Check required fields have proper indication
      if (formInfo.required && !formInfo.hasAriaDescribedBy) {
        formIssues.push({
          type: formInfo.type,
          id: formInfo.id,
          issue: 'Required field should have aria-describedby for screen reader announcement'
        });
      }
    }

    // Contract: All form elements must have proper labels
    // This will likely fail initially or be empty if no forms exist
    if (formElements.length > 0) {
      expect(formIssues,
        `Form accessibility issues: ${JSON.stringify(formIssues, null, 2)}`
      ).toHaveLength(0);
    }
  });

  test('Interactive elements have proper roles and states', async ({ page }) => {
    const interactiveElements = await page.locator('button, a, [tabindex]:not([tabindex="-1"]), [role="button"], [role="link"]').all();
    const roleIssues = [];

    for (const element of interactiveElements) {
      const roleInfo = await element.evaluate(el => ({
        tagName: el.tagName.toLowerCase(),
        role: el.getAttribute('role'),
        type: el.type,
        href: el.href,
        tabindex: el.tabIndex,
        ariaPressed: el.getAttribute('aria-pressed'),
        ariaExpanded: el.getAttribute('aria-expanded'),
        ariaHasPopup: el.getAttribute('aria-haspopup'),
        disabled: el.disabled,
        ariaDisabled: el.getAttribute('aria-disabled'),
        textContent: el.textContent?.slice(0, 30)
      }));

      // Check buttons have proper roles
      if (roleInfo.tagName === 'div' && roleInfo.role === 'button' && roleInfo.tabindex < 0) {
        roleIssues.push({
          element: 'div[role="button"]',
          issue: 'Button role elements must be focusable (tabindex="0" or positive)'
        });
      }

      // Check links have href or proper role
      if (roleInfo.tagName === 'a' && !roleInfo.href && roleInfo.role !== 'button') {
        roleIssues.push({
          element: 'a',
          text: roleInfo.textContent,
          issue: 'Links without href should have role="button" if they perform actions'
        });
      }

      // Check toggle buttons have aria-pressed
      if ((roleInfo.tagName === 'button' || roleInfo.role === 'button') && 
          roleInfo.textContent?.toLowerCase().includes('toggle') && 
          !roleInfo.ariaPressed) {
        roleIssues.push({
          element: roleInfo.tagName,
          text: roleInfo.textContent,
          issue: 'Toggle buttons should have aria-pressed attribute'
        });
      }
    }

    // Contract: Interactive elements must have proper roles and states
    // This will likely fail initially since ARIA states haven't been implemented
    expect(roleIssues,
      `Interactive element role/state issues: ${JSON.stringify(roleIssues, null, 2)}`
    ).toHaveLength(0);
  });

  test('Page passes axe-core accessibility scan', async ({ page }) => {
    const axeResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    // Contract: No accessibility violations should be found
    // This will definitely fail initially since the page hasn't been made accessible
    expect(axeResults.violations, 
      `Axe-core found ${axeResults.violations.length} accessibility violations: ${
        axeResults.violations.map(v => `${v.id}: ${v.description}`).join('; ')
      }`
    ).toHaveLength(0);
  });

  test('Page content is readable by screen reader simulation', async ({ page }) => {
    // Simulate screen reader navigation by walking through all text content
    const textContent = await page.evaluate(() => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: function(node) {
            // Accept text nodes and elements that screen readers interact with
            if (node.nodeType === Node.TEXT_NODE) {
              return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            }
            
            const tagName = node.tagName?.toLowerCase();
            const role = node.getAttribute('role');
            
            // Accept semantic elements and ARIA elements
            if (['h1','h2','h3','h4','h5','h6','p','a','button','input','label','img'].includes(tagName) ||
                ['button','link','heading','textbox'].includes(role)) {
              return NodeFilter.FILTER_ACCEPT;
            }
            
            return NodeFilter.FILTER_SKIP;
          }
        }
      );

      const content = [];
      let node;
      while (node = walker.nextNode()) {
        if (node.nodeType === Node.TEXT_NODE) {
          content.push({
            type: 'text',
            content: node.textContent.trim()
          });
        } else {
          const element = node;
          content.push({
            type: 'element',
            tagName: element.tagName?.toLowerCase(),
            role: element.getAttribute('role'),
            ariaLabel: element.getAttribute('aria-label'),
            alt: element.alt,
            textContent: element.textContent?.slice(0, 50)
          });
        }
      }
      
      return content.filter(item => item.content || item.textContent || item.alt || item.ariaLabel);
    });

    const readabilityIssues = [];

    // Check for sufficient text content
    const textItems = textContent.filter(item => 
      item.type === 'text' || item.textContent || item.alt || item.ariaLabel
    );

    if (textItems.length < 5) {
      readabilityIssues.push('Insufficient text content for screen reader users');
    }

    // Check for heading structure
    const headings = textContent.filter(item => 
      item.tagName && item.tagName.match(/^h[1-6]$/)
    );

    if (headings.length < 2) {
      readabilityIssues.push('Insufficient heading structure for screen reader navigation');
    }

    // Contract: Page must be readable and navigable by screen readers
    // This may fail initially depending on current content structure
    expect(readabilityIssues,
      `Screen reader readability issues: ${readabilityIssues.join('; ')}`
    ).toHaveLength(0);

    // Additional check: ensure meaningful content exists
    const meaningfulContent = textContent.filter(item => {
      const text = item.content || item.textContent || item.alt || item.ariaLabel || '';
      return text.length > 10 && !text.match(/^(click|button|link|image)$/i);
    });

    expect(meaningfulContent.length,
      'Page should contain meaningful content for screen reader users'
    ).toBeGreaterThan(3);
  });
});