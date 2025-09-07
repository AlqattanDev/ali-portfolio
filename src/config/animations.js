/**
 * Animation Configuration Constants
 * Centralized configuration for all GSAP animations in the portfolio
 */

// Base animation durations (in seconds)
export const DURATIONS = {
  fast: 0.3,
  normal: 0.6,
  slow: 0.8,
  slower: 1.0,
  slowest: 1.2,
  
  // Section-specific durations
  contact: 0.6,
  projects: 0.8,
  skills: 0.7,
  education: 0.6,
  header: 1.2,
  
  // Interaction durations
  hover: 0.2,
  focus: 0.15,
  click: 0.1
};

// Animation easing functions
export const EASINGS = {
  // Standard easings
  linear: 'none',
  ease: 'power2.out',
  easeIn: 'power2.in',
  easeOut: 'power2.out',
  easeInOut: 'power2.inOut',
  
  // Bouncy animations
  bounce: 'back.out(1.7)',
  bounceIn: 'back.in(1.7)',
  bounceOut: 'back.out(1.7)',
  
  // Elastic animations
  elastic: 'elastic.out(1, 0.5)',
  elasticIn: 'elastic.in(1, 0.5)',
  elasticOut: 'elastic.out(1, 0.5)',
  
  // Smooth animations
  smooth: 'power3.out',
  smoothIn: 'power3.in',
  smoothInOut: 'power3.inOut',
  
  // Section-specific easings
  contact: 'power3.out',
  projects: 'back.out(1.7)',
  skills: 'power2.out',
  education: 'power3.out',
  header: 'back.out(1.7)'
};

// Stagger timing for multiple elements
export const STAGGER = {
  // Base stagger amounts
  tight: 0.05,
  normal: 0.1,
  loose: 0.15,
  extraLoose: 0.2,
  
  // Section-specific stagger
  contact: 0.1,
  projects: 0.15,
  skills: 0.08,
  education: 0.2,
  
  // Direction options
  directions: {
    start: 'start',
    center: 'center',
    end: 'end',
    edges: 'edges',
    random: 'random'
  }
};

// Scroll trigger thresholds
export const SCROLL_TRIGGERS = {
  // Default trigger points (percentage of viewport)
  early: 'top 90%',
  normal: 'top 80%',
  late: 'top 70%',
  veryLate: 'top 60%',
  
  // Section-specific triggers
  contact: 'top 80%',
  projects: 'top 85%',
  skills: 'top 80%',
  education: 'top 85%',
  footer: 'top 90%',
  
  // End triggers (for scroll-based animations)
  endNormal: 'bottom 20%',
  endLate: 'bottom 10%'
};

// Transform values for entrance animations
export const TRANSFORMS = {
  // Y-axis movements
  slideUp: { y: 30 },
  slideUpBig: { y: 60 },
  slideDown: { y: -30 },
  slideDownBig: { y: -60 },
  
  // X-axis movements
  slideLeft: { x: -30 },
  slideLeftBig: { x: -60 },
  slideRight: { x: 30 },
  slideRightBig: { x: 60 },
  
  // Scale animations
  scaleIn: { scale: 0.9 },
  scaleInBig: { scale: 0.8 },
  scaleOut: { scale: 1.1 },
  
  // Combined transforms
  slideUpScale: { y: 40, scale: 0.95 },
  slideUpFade: { y: 30, opacity: 0 },
  slideLeftFade: { x: -30, opacity: 0 },
  
  // Section-specific initial states
  contactInitial: { y: 20, opacity: 0 },
  projectsInitial: { y: 60, scale: 0.9, opacity: 0 },
  skillsInitial: { y: 40, scale: 0.95, opacity: 0 },
  educationInitial: { y: 30, x: 20, opacity: 0 },
  headerInitial: { y: -30, scale: 0.95, opacity: 0 }
};

// Performance-based configuration
export const PERFORMANCE_CONFIG = {
  high: {
    enableParallax: true,
    enableComplexEasing: true,
    enableStagger: true,
    maxConcurrentAnimations: 10,
    durations: DURATIONS,
    easings: EASINGS
  },
  
  medium: {
    enableParallax: false,
    enableComplexEasing: true,
    enableStagger: true,
    maxConcurrentAnimations: 6,
    durations: {
      ...DURATIONS,
      // Reduce durations by 25%
      normal: DURATIONS.normal * 0.75,
      slow: DURATIONS.slow * 0.75,
      slower: DURATIONS.slower * 0.75
    },
    easings: {
      ...EASINGS,
      // Use simpler easings
      bounce: EASINGS.smooth,
      elastic: EASINGS.smooth
    }
  },
  
  low: {
    enableParallax: false,
    enableComplexEasing: false,
    enableStagger: false,
    maxConcurrentAnimations: 3,
    durations: {
      ...DURATIONS,
      // Reduce durations by 50%
      normal: DURATIONS.normal * 0.5,
      slow: DURATIONS.slow * 0.5,
      slower: DURATIONS.slower * 0.5
    },
    easings: {
      // Use only simple easings
      linear: 'none',
      ease: 'power1.out',
      easeIn: 'power1.in',
      easeOut: 'power1.out',
      easeInOut: 'power1.inOut'
    }
  }
};

// Mobile-specific overrides
export const MOBILE_CONFIG = {
  durations: {
    ...DURATIONS,
    // Faster animations on mobile
    normal: DURATIONS.normal * 0.8,
    slow: DURATIONS.slow * 0.8,
    slower: DURATIONS.slower * 0.8
  },
  
  stagger: {
    ...STAGGER,
    // Tighter stagger on mobile
    normal: STAGGER.normal * 0.6,
    loose: STAGGER.loose * 0.6,
    extraLoose: STAGGER.extraLoose * 0.6
  },
  
  // Simplified transforms for mobile
  transforms: {
    slideUp: { y: 20 },
    slideUpBig: { y: 30 },
    slideLeft: { x: -20 },
    slideRight: { x: 20 },
    scaleIn: { scale: 0.95 }
  }
};

// Animation presets for common patterns
export const ANIMATION_PRESETS = {
  // Entrance animations
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1, duration: DURATIONS.normal, ease: EASINGS.smooth }
  },
  
  slideUpFadeIn: {
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0, duration: DURATIONS.normal, ease: EASINGS.smooth }
  },
  
  scaleIn: {
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1, duration: DURATIONS.normal, ease: EASINGS.bounce }
  },
  
  // Hover animations
  hoverScale: {
    from: { scale: 1 },
    to: { scale: 1.05, duration: DURATIONS.hover, ease: EASINGS.ease }
  },
  
  hoverLift: {
    from: { y: 0 },
    to: { y: -5, duration: DURATIONS.hover, ease: EASINGS.ease }
  },
  
  // Section-specific presets
  contactEntrance: {
    from: TRANSFORMS.contactInitial,
    to: { 
      opacity: 1, 
      y: 0, 
      duration: DURATIONS.contact, 
      ease: EASINGS.contact 
    }
  },
  
  projectsStagger: {
    from: TRANSFORMS.projectsInitial,
    to: {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: DURATIONS.projects,
      ease: EASINGS.projects,
      stagger: STAGGER.projects
    }
  },
  
  skillsReveal: {
    from: TRANSFORMS.skillsInitial,
    to: {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: DURATIONS.skills,
      ease: EASINGS.skills,
      stagger: STAGGER.skills
    }
  },
  
  educationSlideIn: {
    from: TRANSFORMS.educationInitial,
    to: {
      opacity: 1,
      y: 0,
      x: 0,
      duration: DURATIONS.education,
      ease: EASINGS.education,
      stagger: STAGGER.education
    }
  }
};

// Selector configurations for animation targets
export const SELECTORS = {
  // Main sections
  contact: '[data-component="contact-info"]',
  projects: '[data-component="projects"]',
  skills: '[data-component="skills"]',
  education: '[data-component="education"]',
  
  // Individual elements
  projectEntries: '.project-entry',
  skillCategories: '.skill-category',
  skillItems: '.skill-item',
  educationEntries: '.education-entry',
  sectionTitles: '.section-title',
  
  // Header elements
  asciiName: '.ascii-name',
  systemInfo: '.system-info span',
  modeSwitcher: '.mode-switcher',
  
  // Interactive elements
  links: 'a',
  buttons: 'button',
  techTags: '.tech-tag'
};

// GSAP configuration settings
export const GSAP_CONFIG = {
  // Global defaults
  defaults: {
    duration: DURATIONS.normal,
    ease: EASINGS.smooth
  },
  
  // ScrollTrigger settings
  scrollTrigger: {
    toggleActions: 'play none none reverse',
    once: true, // Most animations should only play once
    refreshPriority: -1, // Lower priority for performance
    anticipatePin: 1 // Smooth pinning
  },
  
  // Performance optimizations
  performance: {
    force3D: true,
    autoCSS: false, // Manual CSS for better control
    lazy: false // Eager evaluation for smoother animations
  }
};

// Export configuration getter based on performance mode
export function getAnimationConfig(performanceMode = 'high', isMobile = false) {
  let config = PERFORMANCE_CONFIG[performanceMode] || PERFORMANCE_CONFIG.high;
  
  // Apply mobile overrides if needed
  if (isMobile) {
    config = {
      ...config,
      durations: {
        ...config.durations,
        ...MOBILE_CONFIG.durations
      },
      stagger: {
        ...STAGGER,
        ...MOBILE_CONFIG.stagger
      }
    };
  }
  
  return config;
}

// Export all configurations
export default {
  DURATIONS,
  EASINGS,
  STAGGER,
  SCROLL_TRIGGERS,
  TRANSFORMS,
  PERFORMANCE_CONFIG,
  MOBILE_CONFIG,
  ANIMATION_PRESETS,
  SELECTORS,
  GSAP_CONFIG,
  getAnimationConfig
};