/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Global type declarations
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    portfolioAnimations: any;
  }

  // GSAP types
  var gsap: any;
  var ScrollTrigger: any;
}

// DOM event types for better TypeScript support
interface KeyboardEvent {
  key: string;
}

interface HTMLElement {
  style: CSSStyleDeclaration;
  click(): void;
}