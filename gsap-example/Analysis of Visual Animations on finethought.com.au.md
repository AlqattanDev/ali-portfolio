# Analysis of Visual Animations on finethought.com.au

## 1. Introduction

This document provides a comprehensive analysis of the visual animations and scroll-triggered effects on the website [finethought.com.au](https://finethought.com.au). The primary goal is to understand the underlying implementation techniques to provide guidance for recreating these effects using the GreenSock Animation Platform (GSAP). The analysis covers the website's architecture, animation patterns, and the specific methods used to achieve the observed visual effects.

## 2. Summary of Findings

The website employs a sophisticated, custom-built animation system that relies on a combination of CSS transitions and vanilla JavaScript. It does not use any third-party animation libraries like GSAP, Anime.js, or Three.js. The animations are tightly integrated with the site's React-based (Next.js) architecture and are triggered by user interactions such as scrolling and page load events.

The key findings of this analysis are:

*   **State-Driven Animation:** The animations are controlled by a state machine that adds and removes CSS classes to trigger transitions.
*   **Custom Scroll Handling:** The site uses a custom JavaScript solution to manage scroll-based animations, rather than relying on standard browser events or Intersection Observer.
*   **Character-Level Animation:** The typewriter and glitch effects are achieved by manipulating individual characters within the text.
*   **Responsive Design:** The animations are designed to be responsive and adapt to different screen sizes.

This report will now delve into the specific animation patterns and triggers, providing a detailed breakdown of how each effect is achieved.



## 3. Detailed Animation Patterns & Triggers

This section provides a detailed breakdown of the key animation patterns observed on the website, along with their corresponding triggers and implementation methods.

### 3.1. Page Load Animation

**Description:**
When the page first loads, a full-screen cover element fades out to reveal the main content. This creates a smooth and elegant entry experience.

**Trigger:**
- The animation is triggered automatically on page load.
- The `state-site-loaded` class is added to the `<html>` element by JavaScript after the initial assets have loaded.

**Implementation:**
- A `div` with the class `c-cover` acts as the loading screen. It is styled to cover the entire viewport with a solid background color.
- The CSS transition is defined as follows:

```css
.c-cover {
  position: fixed;
  z-index: 9999;
  background-color: #282828;
}

.state-site-loaded .c-cover {
  opacity: 0;
  left: -9999px;
  transition: opacity .5s, left 0s linear .5s;
}
```

- The `opacity` transition creates the fade-out effect, while the `left` property moves the cover off-screen after the transition is complete.

### 3.2. Background Grid Animation

**Description:**
The background of the website features a dynamic grid of animated dotted and dashed lines. This creates a sense of a code editor or a terminal interface.

**Trigger:**
- The animation is continuous and appears to be running in a loop.
- It is not directly triggered by user interaction, but it is part of the overall animated aesthetic of the site.

**Implementation:**
- The grid is created using a `div` with the class `c-guides`. This element is positioned absolutely behind the main content.
- The lines themselves are created using a series of `div` elements with classes like `c-guides__type--index-1`, `c-guides__type--index-2`, etc. Each class corresponds to a different line pattern (e.g., a different number of dashes).
- The animation is likely achieved by cycling through these classes using JavaScript, or by using CSS animations to change the content or appearance of these elements over time.

### 3.3. Typewriter & Glitch Text Effect

**Description:**
The main headline text ("Web engineer & creative coder" and "Fine Thought") appears with a typewriter-style animation, where characters are revealed one by one. This is combined with a glitch effect that randomly displaces characters.

**Trigger:**
- The animation starts automatically on page load.
- It is also influenced by the user's scroll position.

**Implementation:**
- The animation is controlled by a custom JavaScript system that manipulates the text content at the character level.
- The `doScroll` function in the JavaScript code is responsible for updating the animation state based on the scroll position.
- The `maxChar` state variable determines how many characters are visible at any given time.
- The glitch effect is created by randomly offsetting the position of individual characters using `Math.random()`.

### 3.4. Scroll-Triggered Animations

**Description:**
As the user scrolls down the page, new lines of text and code appear, continuing the typewriter effect. This creates an immersive experience where the content is revealed as the user explores the page.

**Trigger:**
- The animations are triggered by the user's scroll events.
- The `doScroll` function in the JavaScript code is the primary handler for these events.

**Implementation:**
- The JavaScript code calculates the scroll position and determines which lines of text should be visible.
- The `startAnimationOffset` array is used to control the timing of when each line starts animating.
- New lines are added to the DOM and animated as the user scrolls down the page.




## 4. Recreating the Animations with GSAP

This section provides a detailed guide on how to recreate the animations from finethought.com.au using the GreenSock Animation Platform (GSAP). GSAP is a powerful and professional-grade animation library that offers more control, flexibility, and performance than traditional CSS transitions.

### 4.1. Why Use GSAP?

While the original website uses a custom JavaScript and CSS solution, GSAP offers several advantages for recreating these effects:

*   **Simplified Animation Logic:** GSAP provides a more intuitive and declarative syntax for creating complex animations, reducing the amount of boilerplate code required.
*   **Advanced Sequencing:** GSAP's timeline feature makes it easy to create and manage complex animation sequences, which is ideal for the typewriter and glitch effects.
*   **Scroll-Based Animations:** GSAP's ScrollTrigger plugin is a powerful tool for creating scroll-triggered animations, offering more control and performance than custom scroll handlers.
*   **Cross-Browser Compatibility:** GSAP handles browser inconsistencies automatically, ensuring that your animations work smoothly across all modern browsers.
*   **Performance:** GSAP is highly optimized for performance, ensuring that your animations are smooth and efficient.

### 4.2. GSAP Implementation Examples

Here are some examples of how to recreate the key animation patterns using GSAP.

#### 4.2.1. Page Load Animation

```javascript
// Page load animation with GSAP
gsap.to(".loading-cover", {
  opacity: 0,
  duration: 0.5,
  delay: 1.5,
  onComplete: () => {
    document.querySelector(".loading-cover").style.display = "none";
  }
});
```

#### 4.2.2. Typewriter & Glitch Effect

```javascript
// Typewriter effect with GSAP
const chars = element.querySelectorAll(".char");
gsap.fromTo(chars, 
  {
    opacity: 0,
    y: 20
  },
  {
    opacity: 1,
    y: 0,
    duration: 0.05,
    stagger: 0.03,
    ease: "back.out(1.7)"
  }
);

// Glitch effect with GSAP
gsap.to([char + "::before", char + "::after"], {
  opacity: 0.8,
  duration: 0.1,
  repeat: 3,
  yoyo: true,
  delay: Math.random() * 2
});
```

#### 4.2.3. Scroll-Triggered Animations

```javascript
// Scroll-triggered animation with GSAP ScrollTrigger
gsap.fromTo(line, 
  {
    opacity: 0,
    x: -20
  },
  {
    opacity: 1,
    x: 0,
    duration: 0.6,
    scrollTrigger: {
      trigger: line,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    }
  }
);
```

### 4.3. Full Implementation Examples

For a complete and runnable implementation of these animations, please refer to the following files:

*   `gsap_examples.html`: A standalone HTML file with a complete GSAP implementation.
*   `gsap_scroll_animations.js`: A more advanced JavaScript file with detailed GSAP scroll animations and a class-based structure.
*   `FineThoughtReact.jsx`: A React component that demonstrates how to integrate these animations into a React application, similar to the original website.

These files provide a comprehensive guide to recreating the animations from finethought.com.au using GSAP. They can be used as a starting point for your own projects or as a reference for understanding the techniques involved.


