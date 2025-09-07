/**
 * Accessibility Utilities for Animation Control
 * Handles reduced motion preferences and accessibility compliance
 */

export class AccessibilityManager {
  constructor() {
    this.reducedMotionQuery = null;
    this.prefersReducedMotion = false;
    this.highContrastQuery = null;
    this.prefersHighContrast = false;
    this.callbacks = new Set();
    this.animationsEnabled = true;
    
    this.init();
  }

  init() {
    // Set up media queries
    this.setupReducedMotionDetection();
    this.setupHighContrastDetection();
    
    // Initial state
    this.updateAnimationState();
    
    console.log('♿ Accessibility manager initialized');
    console.log(`🎭 Reduced motion: ${this.prefersReducedMotion}`);
    console.log(`🔆 High contrast: ${this.prefersHighContrast}`);
    console.log(`🎬 Animations enabled: ${this.animationsEnabled}`);
  }

  setupReducedMotionDetection() {
    // Check if media queries are supported
    if (!window.matchMedia) {
      console.warn('matchMedia not supported - assuming no reduced motion preference');
      return;
    }

    try {
      this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.prefersReducedMotion = this.reducedMotionQuery.matches;
      
      // Listen for changes
      const handleReducedMotionChange = (e) => {
        const wasReduced = this.prefersReducedMotion;
        this.prefersReducedMotion = e.matches;
        
        if (wasReduced !== this.prefersReducedMotion) {
          console.log(`🎭 Reduced motion preference changed: ${this.prefersReducedMotion}`);
          this.updateAnimationState();
          this.notifyCallbacks('reduced-motion', this.prefersReducedMotion);
        }
      };

      // Modern browsers
      if (this.reducedMotionQuery.addEventListener) {
        this.reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
      }
      // Legacy browsers
      else if (this.reducedMotionQuery.addListener) {
        this.reducedMotionQuery.addListener(handleReducedMotionChange);
      }
    } catch (error) {
      console.error('Error setting up reduced motion detection:', error);
    }
  }

  setupHighContrastDetection() {
    if (!window.matchMedia) return;

    try {
      this.highContrastQuery = window.matchMedia('(prefers-contrast: high)');
      this.prefersHighContrast = this.highContrastQuery.matches;
      
      const handleHighContrastChange = (e) => {
        const wasHighContrast = this.prefersHighContrast;
        this.prefersHighContrast = e.matches;
        
        if (wasHighContrast !== this.prefersHighContrast) {
          console.log(`🔆 High contrast preference changed: ${this.prefersHighContrast}`);
          this.notifyCallbacks('high-contrast', this.prefersHighContrast);
        }
      };

      if (this.highContrastQuery.addEventListener) {
        this.highContrastQuery.addEventListener('change', handleHighContrastChange);
      } else if (this.highContrastQuery.addListener) {
        this.highContrastQuery.addListener(handleHighContrastChange);
      }
    } catch (error) {
      console.error('Error setting up high contrast detection:', error);
    }
  }

  updateAnimationState() {
    // Animations are disabled if user prefers reduced motion
    this.animationsEnabled = !this.prefersReducedMotion;
    
    // Update body class for CSS targeting
    document.body.classList.toggle('reduce-motion', this.prefersReducedMotion);
    document.body.classList.toggle('animations-enabled', this.animationsEnabled);
    
    // Emit custom event
    window.dispatchEvent(new CustomEvent('accessibility-state-change', {
      detail: {
        animationsEnabled: this.animationsEnabled,
        reducedMotion: this.prefersReducedMotion,
        highContrast: this.prefersHighContrast
      }
    }));
  }

  // Register callback for accessibility changes
  onAccessibilityChange(callback) {
    this.callbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
    };
  }

  notifyCallbacks(type, value) {
    this.callbacks.forEach(callback => {
      try {
        callback(type, value, this.getState());
      } catch (error) {
        console.error('Error in accessibility callback:', error);
      }
    });
  }

  getState() {
    return {
      animationsEnabled: this.animationsEnabled,
      reducedMotion: this.prefersReducedMotion,
      highContrast: this.prefersHighContrast,
      motionQuery: this.reducedMotionQuery?.media || null,
      contrastQuery: this.highContrastQuery?.media || null
    };
  }

  // Check if animations should be disabled
  shouldDisableAnimations() {
    return this.prefersReducedMotion || !this.animationsEnabled;
  }

  // Check if user prefers high contrast
  shouldUseHighContrast() {
    return this.prefersHighContrast;
  }

  // Force disable animations (for performance reasons)
  forceDisableAnimations(reason = 'performance') {
    console.log(`🚫 Animations force-disabled: ${reason}`);
    this.animationsEnabled = false;
    this.updateAnimationState();
    this.notifyCallbacks('force-disable', reason);
  }

  // Re-enable animations (if user preferences allow)
  enableAnimations() {
    if (!this.prefersReducedMotion) {
      console.log('✅ Animations re-enabled');
      this.animationsEnabled = true;
      this.updateAnimationState();
      this.notifyCallbacks('enable', true);
    } else {
      console.log('❌ Cannot enable animations - user prefers reduced motion');
    }
  }

  // Static method to create global instance
  static createGlobal() {
    if (!window.portfolioAccessibilityManager) {
      window.portfolioAccessibilityManager = new AccessibilityManager();
    }
    return window.portfolioAccessibilityManager;
  }
}

// Focus Management Utilities
export class FocusManager {
  constructor() {
    this.focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex^="-"])'
    ].join(',');
    
    this.focusHistory = [];
  }

  // Get all focusable elements in a container
  getFocusableElements(container = document) {
    return Array.from(container.querySelectorAll(this.focusableSelectors))
      .filter(el => this.isVisible(el) && !this.isDisabled(el));
  }

  // Check if element is visible
  isVisible(element) {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           element.offsetWidth > 0 && 
           element.offsetHeight > 0;
  }

  // Check if element is disabled
  isDisabled(element) {
    return element.disabled || 
           element.getAttribute('aria-disabled') === 'true' ||
           element.getAttribute('tabindex') === '-1';
  }

  // Trap focus within a container
  trapFocus(container, firstFocusElement = null) {
    const focusableElements = this.getFocusableElements(container);
    
    if (focusableElements.length === 0) {
      console.warn('No focusable elements found in focus trap');
      return null;
    }

    const firstElement = firstFocusElement || focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Store current focus
    const previouslyFocused = document.activeElement;
    this.focusHistory.push(previouslyFocused);

    // Focus the first element
    firstElement.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
      
      if (e.key === 'Escape') {
        this.releaseFocusTrap();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    container.classList.add('focus-trap-active');

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      container.classList.remove('focus-trap-active');
      
      // Restore previous focus
      if (previouslyFocused && this.isVisible(previouslyFocused)) {
        previouslyFocused.focus();
      }
      
      this.focusHistory.pop();
    };
  }

  // Release focus trap and restore previous focus
  releaseFocusTrap() {
    const container = document.querySelector('.focus-trap-active');
    if (container) {
      container.classList.remove('focus-trap-active');
      
      const previouslyFocused = this.focusHistory.pop();
      if (previouslyFocused && this.isVisible(previouslyFocused)) {
        previouslyFocused.focus();
      }
    }
  }

  // Announce to screen readers
  announce(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      if (announcement.parentNode) {
        announcement.parentNode.removeChild(announcement);
      }
    }, 1000);
  }

  // Manage focus during animations
  preserveFocusDuringAnimation(element, callback) {
    const activeElement = document.activeElement;
    const wasElementFocused = element.contains(activeElement);
    
    if (wasElementFocused) {
      // Store focus position
      const focusableElements = this.getFocusableElements(element);
      const focusIndex = focusableElements.indexOf(activeElement);
      
      // Execute animation
      callback();
      
      // Restore focus after animation
      setTimeout(() => {
        const updatedFocusableElements = this.getFocusableElements(element);
        const targetElement = updatedFocusableElements[focusIndex] || updatedFocusableElements[0];
        
        if (targetElement && this.isVisible(targetElement)) {
          targetElement.focus();
        }
      }, 100);
    } else {
      callback();
    }
  }
}

// Screen Reader Utilities
export class ScreenReaderUtils {
  static createLiveRegion(id = 'live-region', priority = 'polite') {
    let region = document.getElementById(id);
    
    if (!region) {
      region = document.createElement('div');
      region.id = id;
      region.setAttribute('aria-live', priority);
      region.setAttribute('aria-atomic', 'true');
      region.className = 'live-region sr-only';
      document.body.appendChild(region);
    }
    
    return region;
  }

  static announce(message, priority = 'polite') {
    const region = this.createLiveRegion('announcement-region', priority);
    region.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      region.textContent = '';
    }, 1000);
  }

  static announceAnimationStart(sectionName) {
    this.announce(`${sectionName} section is now animating into view`);
  }

  static announceAnimationComplete(sectionName) {
    this.announce(`${sectionName} section animation complete`);
  }
}

// Export for global access
window.AccessibilityManager = AccessibilityManager;
window.FocusManager = FocusManager;
window.ScreenReaderUtils = ScreenReaderUtils;