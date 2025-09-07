/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Global type declarations
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    portfolioAnimations: any;
    ANIMATION_CONFIG: any;
    AnimationError: any;
    ScrollAnimationController: any;
    webkitRequestAnimationFrame?: (callback: FrameRequestCallback) => number;
  }

  // GSAP types
  var gsap: any;
  var ScrollTrigger: any;
}

// Extended DOM types for better TypeScript support
interface KeyboardEvent extends Event {
  key: string;
}

interface HTMLElement extends Element {
  style: CSSStyleDeclaration;
  click(): void;
}

interface Element {
  click(): void;
  style: CSSStyleDeclaration;
}

interface Document {
  domain: string;
}