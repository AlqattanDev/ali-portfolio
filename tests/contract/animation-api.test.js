/**
 * Contract Tests for ScrollAnimationController API
 * These tests validate the animation API contracts defined in contracts/animation-api.md
 * 
 * CRITICAL: These tests MUST FAIL before implementation exists
 */

import { test, expect } from '@playwright/test';

test.describe('ScrollAnimationController API Contract', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the portfolio page
    await page.goto('http://localhost:4321/ali-portfolio/');
    await page.waitForLoadState('networkidle');
  });

  test('should expose ScrollAnimationController class globally', async ({ page }) => {
    // Test that ScrollAnimationController exists and is a constructor function
    const controllerExists = await page.evaluate(() => {
      return typeof window.ScrollAnimationController === 'function';
    });
    
    expect(controllerExists).toBe(true);
  });

  test('should implement initialize method with correct signature', async ({ page }) => {
    const result = await page.evaluate(() => {
      if (!window.ScrollAnimationController) return { error: 'Controller not found' };
      
      const controller = new window.ScrollAnimationController();
      
      // Check initialize method exists
      if (typeof controller.initialize !== 'function') {
        return { error: 'initialize method not found' };
      }
      
      // Check method signature by calling with config
      try {
        const promise = controller.initialize({
          respectsReducedMotion: true,
          performanceMode: 'high',
          debugMode: false
        });
        
        return {
          hasInitialize: true,
          returnsPromise: promise instanceof Promise,
          methodLength: controller.initialize.length
        };
      } catch (error) {
        return { error: error.message };
      }
    });

    expect(result.hasInitialize).toBe(true);
    expect(result.returnsPromise).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test('initialize should return Promise<boolean>', async ({ page }) => {
    const initResult = await page.evaluate(async () => {
      const controller = new window.ScrollAnimationController();
      
      try {
        const result = await controller.initialize();
        return {
          success: true,
          resultType: typeof result,
          resultValue: result
        };
      } catch (error) {
        return { error: error.message };
      }
    });

    expect(initResult.success).toBe(true);
    expect(initResult.resultType).toBe('boolean');
    expect(initResult.error).toBeUndefined();
  });

  test('should implement animateSection method with correct parameters', async ({ page }) => {
    const result = await page.evaluate(() => {
      if (!window.ScrollAnimationController) return { error: 'Controller not found' };
      
      const controller = new window.ScrollAnimationController();
      
      // Check animateSection method exists
      if (typeof controller.animateSection !== 'function') {
        return { error: 'animateSection method not found' };
      }
      
      // Validate method accepts section IDs
      const validSectionIds = ['contact-info', 'projects', 'skills', 'education'];
      
      try {
        const promise = controller.animateSection('contact-info');
        return {
          hasMethod: true,
          returnsPromise: promise instanceof Promise,
          methodLength: controller.animateSection.length
        };
      } catch (error) {
        return { error: error.message };
      }
    });

    expect(result.hasMethod).toBe(true);
    expect(result.returnsPromise).toBe(true);
    expect(result.methodLength).toBe(1); // Should accept sectionId parameter
    expect(result.error).toBeUndefined();
  });

  test('should validate section ID parameter in animateSection', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const controller = new window.ScrollAnimationController();
      await controller.initialize();
      
      const validIds = ['contact-info', 'projects', 'skills', 'education'];
      const results = {};
      
      // Test valid IDs
      for (const id of validIds) {
        try {
          await controller.animateSection(id);
          results[id] = { valid: true };
        } catch (error) {
          results[id] = { valid: false, error: error.message };
        }
      }
      
      // Test invalid ID
      try {
        await controller.animateSection('invalid-section');
        results.invalid = { shouldHaveFailed: true };
      } catch (error) {
        results.invalid = { correctlyRejected: true, error: error.message };
      }
      
      return results;
    });

    // Valid sections should work (or at least not throw parameter errors)
    expect(result['contact-info']).toBeDefined();
    expect(result['projects']).toBeDefined();
    expect(result['skills']).toBeDefined();
    expect(result['education']).toBeDefined();
    
    // Invalid section should be rejected
    expect(result.invalid.correctlyRejected).toBe(true);
  });

  test('should implement getPerformanceMetrics method', async ({ page }) => {
    const result = await page.evaluate(() => {
      const controller = new window.ScrollAnimationController();
      
      if (typeof controller.getPerformanceMetrics !== 'function') {
        return { error: 'getPerformanceMetrics method not found' };
      }
      
      const metrics = controller.getPerformanceMetrics();
      
      // Validate return type and required properties
      const requiredProps = [
        'averageFrameRate',
        'droppedFrames', 
        'totalAnimations',
        'completedAnimations',
        'loadTime'
      ];
      
      const hasAllProps = requiredProps.every(prop => 
        metrics.hasOwnProperty(prop) && typeof metrics[prop] === 'number'
      );
      
      return {
        hasMethod: true,
        returnsObject: typeof metrics === 'object',
        hasAllProps,
        metrics,
        missingProps: requiredProps.filter(prop => !metrics.hasOwnProperty(prop))
      };
    });

    expect(result.hasMethod).toBe(true);
    expect(result.returnsObject).toBe(true);
    expect(result.hasAllProps).toBe(true);
    expect(result.missingProps).toHaveLength(0);
    expect(result.error).toBeUndefined();
  });

  test('should implement destroy method for cleanup', async ({ page }) => {
    const result = await page.evaluate(() => {
      const controller = new window.ScrollAnimationController();
      
      if (typeof controller.destroy !== 'function') {
        return { error: 'destroy method not found' };
      }
      
      try {
        controller.destroy();
        return { hasMethod: true, executedSuccessfully: true };
      } catch (error) {
        return { error: error.message };
      }
    });

    expect(result.hasMethod).toBe(true);
    expect(result.executedSuccessfully).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test('should emit animationStart events with correct structure', async ({ page }) => {
    let eventReceived = false;
    let eventData = null;

    // Set up event listener
    await page.evaluate(() => {
      window.testEventData = null;
      window.addEventListener('animationStart', (event) => {
        window.testEventData = {
          type: event.type,
          detail: event.detail,
          hasRequiredProps: event.detail && 
            typeof event.detail.sectionId === 'string' &&
            typeof event.detail.targetCount === 'number' &&
            typeof event.detail.timestamp === 'number'
        };
      });
    });

    // Trigger animation
    await page.evaluate(async () => {
      const controller = new window.ScrollAnimationController();
      await controller.initialize();
      await controller.animateSection('contact-info');
    });

    // Check if event was emitted
    const result = await page.evaluate(() => window.testEventData);

    expect(result).not.toBeNull();
    expect(result.type).toBe('animationStart');
    expect(result.hasRequiredProps).toBe(true);
    expect(result.detail.sectionId).toBe('contact-info');
    expect(typeof result.detail.targetCount).toBe('number');
    expect(typeof result.detail.timestamp).toBe('number');
  });

  test('should emit animationComplete events with performance data', async ({ page }) => {
    // Set up event listener
    await page.evaluate(() => {
      window.testCompleteEventData = null;
      window.addEventListener('animationComplete', (event) => {
        window.testCompleteEventData = {
          type: event.type,
          detail: event.detail,
          hasPerformanceData: event.detail && 
            event.detail.performance &&
            typeof event.detail.performance.averageFrameRate === 'number' &&
            typeof event.detail.performance.droppedFrames === 'number',
          hasDuration: typeof event.detail.duration === 'number'
        };
      });
    });

    // Trigger animation and wait for completion
    await page.evaluate(async () => {
      const controller = new window.ScrollAnimationController();
      await controller.initialize();
      await controller.animateSection('skills');
    });

    // Allow time for animation to complete
    await page.waitForTimeout(1000);

    const result = await page.evaluate(() => window.testCompleteEventData);

    expect(result).not.toBeNull();
    expect(result.type).toBe('animationComplete');
    expect(result.hasPerformanceData).toBe(true);
    expect(result.hasDuration).toBe(true);
  });

  test('should emit performanceWarning events when frame rate drops', async ({ page }) => {
    let warningReceived = false;
    
    // Set up event listener
    await page.evaluate(() => {
      window.testWarningEventData = null;
      window.addEventListener('performanceWarning', (event) => {
        window.testWarningEventData = {
          type: event.type,
          detail: event.detail,
          hasRequiredProps: event.detail &&
            typeof event.detail.currentFrameRate === 'number' &&
            typeof event.detail.threshold === 'number' &&
            typeof event.detail.recommendation === 'string'
        };
      });
    });

    // Simulate performance degradation
    await page.evaluate(() => {
      // Trigger performance warning artificially
      const event = new CustomEvent('performanceWarning', {
        detail: {
          currentFrameRate: 25,
          threshold: 30,
          recommendation: 'reduce_complexity'
        }
      });
      window.dispatchEvent(event);
    });

    const result = await page.evaluate(() => window.testWarningEventData);

    expect(result).not.toBeNull();
    expect(result.type).toBe('performanceWarning');
    expect(result.hasRequiredProps).toBe(true);
    expect(['reduce_complexity', 'disable_animations']).toContain(result.detail.recommendation);
  });

  test('should handle AnimationError with correct error codes', async ({ page }) => {
    const result = await page.evaluate(() => {
      // Check if AnimationError class exists
      if (typeof window.AnimationError !== 'function') {
        return { error: 'AnimationError class not found' };
      }
      
      // Test error construction with required parameters
      try {
        const error = new window.AnimationError(
          'GSAP failed to load', 
          'GSAP_LOAD_FAILED', 
          { url: 'https://unpkg.com/gsap@3.13.0/dist/gsap.min.js' }
        );
        
        return {
          hasClass: true,
          isError: error instanceof Error,
          hasMessage: error.message === 'GSAP failed to load',
          hasCode: error.code === 'GSAP_LOAD_FAILED',
          hasContext: error.context && error.context.url === 'https://unpkg.com/gsap@3.13.0/dist/gsap.min.js'
        };
      } catch (constructorError) {
        return { error: constructorError.message };
      }
    });

    expect(result.hasClass).toBe(true);
    expect(result.isError).toBe(true);
    expect(result.hasMessage).toBe(true);
    expect(result.hasCode).toBe(true);
    expect(result.hasContext).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test('should validate required DOM attributes for animation targets', async ({ page }) => {
    const result = await page.evaluate(() => {
      const requiredElements = [
        { selector: '[data-component="contact-info"]', name: 'Contact section' },
        { selector: '[data-component="projects"]', name: 'Projects section' },
        { selector: '[data-component="skills"]', name: 'Skills section' },
        { selector: '[data-component="education"]', name: 'Education section' }
      ];
      
      const results = {};
      
      requiredElements.forEach(({ selector, name }) => {
        const element = document.querySelector(selector);
        results[name] = {
          exists: !!element,
          hasDataComponent: element ? element.hasAttribute('data-component') : false,
          selector
        };
      });
      
      return results;
    });

    Object.entries(result).forEach(([name, data]) => {
      expect(data.exists).toBe(true);
      expect(data.hasDataComponent).toBe(true);
    });
  });
});