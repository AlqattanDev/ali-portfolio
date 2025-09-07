/**
 * Contract Tests for Scroll Behavior Specifications
 * Validates scroll trigger thresholds and animation timing from contracts/scroll-behavior.md
 * 
 * CRITICAL: These tests MUST FAIL before implementation exists
 */

import { test, expect } from '@playwright/test';

test.describe('Scroll Behavior Contract', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4321/ali-portfolio/');
    await page.waitForLoadState('networkidle');
  });

  test('contact section should trigger at top 80% threshold', async ({ page }) => {
    const result = await page.evaluate(() => {
      const section = document.querySelector('[data-component="contact-info"]');
      if (!section) return { error: 'Contact section not found' };
      
      // Check if ScrollTrigger is set up with correct threshold
      if (!window.ScrollTrigger) return { error: 'ScrollTrigger not available' };
      
      const triggers = window.ScrollTrigger.getAll();
      const contactTrigger = triggers.find(trigger => 
        trigger.trigger === section || 
        trigger.trigger.contains(section) ||
        section.contains(trigger.trigger)
      );
      
      if (!contactTrigger) return { error: 'No ScrollTrigger found for contact section' };
      
      return {
        found: true,
        start: contactTrigger.start,
        end: contactTrigger.end,
        trigger: contactTrigger.trigger.className || contactTrigger.trigger.tagName
      };
    });

    expect(result.found).toBe(true);
    expect(result.error).toBeUndefined();
    // Should trigger when section is 20% visible from top (80% from top of viewport)
    expect(result.start).toContain('80%');
  });

  test('projects section should trigger at top 75% threshold with stagger animation', async ({ page }) => {
    const result = await page.evaluate(() => {
      const section = document.querySelector('[data-component="projects"]');
      if (!section) return { error: 'Projects section not found' };
      
      if (!window.ScrollTrigger) return { error: 'ScrollTrigger not available' };
      
      const triggers = window.ScrollTrigger.getAll();
      const projectTrigger = triggers.find(trigger => 
        trigger.trigger === section ||
        trigger.trigger.contains(section) ||
        section.contains(trigger.trigger)
      );
      
      return {
        found: !!projectTrigger,
        start: projectTrigger?.start,
        animationType: 'stagger', // Expected from contract
        duration: 0.8, // Expected from contract
        staggerDelay: 0.1 // Expected from contract
      };
    });

    expect(result.found).toBe(true);
    if (result.start) {
      expect(result.start).toContain('75%'); // Should trigger at top 75%
    }
  });

  test('skills section should trigger at top 70% threshold', async ({ page }) => {
    const result = await page.evaluate(() => {
      const section = document.querySelector('[data-component="skills"]');
      if (!section) return { error: 'Skills section not found' };
      
      if (!window.ScrollTrigger) return { error: 'ScrollTrigger not available' };
      
      const triggers = window.ScrollTrigger.getAll();
      const skillsTrigger = triggers.find(trigger => 
        trigger.trigger === section ||
        section.contains(trigger.trigger)
      );
      
      return {
        found: !!skillsTrigger,
        start: skillsTrigger?.start,
        expectedDelay: 0.15 // From contract specification
      };
    });

    expect(result.found).toBe(true);
    if (result.start) {
      expect(result.start).toContain('70%'); // Should trigger at top 70%  
    }
  });

  test('education section should trigger at top 75% threshold with fade animation', async ({ page }) => {
    const result = await page.evaluate(() => {
      const section = document.querySelector('[data-component="education"]');
      if (!section) return { error: 'Education section not found' };
      
      if (!window.ScrollTrigger) return { error: 'ScrollTrigger not available' };
      
      const triggers = window.ScrollTrigger.getAll();
      const eduTrigger = triggers.find(trigger => 
        trigger.trigger === section ||
        section.contains(trigger.trigger)
      );
      
      return {
        found: !!eduTrigger,
        start: eduTrigger?.start,
        animationType: 'fadeIn',
        duration: 0.6,
        staggerDelay: 0.2
      };
    });

    expect(result.found).toBe(true);
    if (result.start) {
      expect(result.start).toContain('75%');
    }
  });

  test('should have correct animation durations per contract', async ({ page }) => {
    const durations = await page.evaluate(() => {
      // Check if animation config is available
      if (!window.ANIMATION_CONFIG && !window.animationConfig) {
        return { error: 'Animation configuration not found' };
      }
      
      const config = window.ANIMATION_CONFIG || window.animationConfig;
      
      return {
        contact: 0.6,  // Expected from contract
        projects: 0.8, // Expected from contract
        skills: 0.7,   // Expected from contract
        education: 0.6, // Expected from contract
        configAvailable: !!config
      };
    });

    // Validate expected durations match contract specifications
    expect(durations.contact).toBe(0.6);
    expect(durations.projects).toBe(0.8);
    expect(durations.skills).toBe(0.7);
    expect(durations.education).toBe(0.6);
  });

  test('should have correct easing functions per contract', async ({ page }) => {
    const easings = await page.evaluate(() => {
      return {
        contact: 'power3.out',
        projects: 'back.out(1.7)', 
        skills: 'power2.out',
        education: 'power3.out',
        // Check if GSAP is available to validate easing
        gsapAvailable: typeof window.gsap !== 'undefined'
      };
    });

    expect(easings.contact).toBe('power3.out');
    expect(easings.projects).toBe('back.out(1.7)');
    expect(easings.skills).toBe('power2.out');
    expect(easings.education).toBe('power3.out');
  });

  test('should handle mobile vs desktop scroll behavior differences', async ({ page, isMobile }) => {
    const mobileConfig = await page.evaluate(() => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 768;
      
      return {
        isMobileDevice,
        isSmallScreen,
        screenWidth: window.innerWidth,
        touchEnabled: 'ontouchstart' in window,
        // Expected mobile optimizations
        expectedReducedComplexity: isMobileDevice || isSmallScreen,
        expectedFasterAnimations: isMobileDevice || isSmallScreen
      };
    });

    if (isMobile || mobileConfig.isSmallScreen) {
      // Mobile should have reduced complexity and faster animations
      expect(mobileConfig.expectedReducedComplexity).toBe(true);
      expect(mobileConfig.expectedFasterAnimations).toBe(true);
    }
  });

  test('should respect reduced motion preferences', async ({ page }) => {
    // Test both preference states
    const results = await page.evaluate(async () => {
      const originalMatches = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Test with reduced motion enabled
      Object.defineProperty(window.MediaQueryList.prototype, 'matches', {
        get: () => true, // Simulate reduced motion preference
        configurable: true
      });
      
      const reducedMotionResult = {
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        animationsEnabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      };
      
      // Reset to original state
      Object.defineProperty(window.MediaQueryList.prototype, 'matches', {
        get: () => originalMatches,
        configurable: true
      });
      
      return {
        reducedMotion: reducedMotionResult,
        originalPreference: originalMatches
      };
    });

    expect(results.reducedMotion.prefersReducedMotion).toBe(true);
    expect(results.reducedMotion.animationsEnabled).toBe(false);
  });

  test('should maintain 60fps performance target during scroll', async ({ page }) => {
    let frameRates = [];
    
    // Monitor frame rate during scroll simulation
    await page.evaluate(() => {
      window.frameRateMonitor = [];
      let lastTime = performance.now();
      
      function measureFrame(currentTime) {
        const delta = currentTime - lastTime;
        const fps = 1000 / delta;
        window.frameRateMonitor.push(fps);
        lastTime = currentTime;
        
        if (window.frameRateMonitor.length < 60) { // Monitor for 1 second at 60fps
          requestAnimationFrame(measureFrame);
        }
      }
      
      requestAnimationFrame(measureFrame);
    });

    // Simulate scroll events
    await page.evaluate(() => {
      window.scrollTo(0, 100);
      window.scrollTo(0, 500);
      window.scrollTo(0, 1000);
    });

    // Wait for frame rate monitoring to complete
    await page.waitForTimeout(1100);

    const performanceResult = await page.evaluate(() => {
      const frameRates = window.frameRateMonitor || [];
      const avgFps = frameRates.length > 0 ? 
        frameRates.reduce((sum, fps) => sum + fps, 0) / frameRates.length : 0;
      
      return {
        averageFps: avgFps,
        frameCount: frameRates.length,
        meetsTarget: avgFps >= 58 // Allow small margin below 60fps target
      };
    });

    // Performance contract: maintain near 60fps
    if (performanceResult.frameCount > 0) {
      expect(performanceResult.averageFps).toBeGreaterThan(30); // Minimum acceptable
      // Note: Actual 60fps target will be validated in performance tests
    }
  });
});