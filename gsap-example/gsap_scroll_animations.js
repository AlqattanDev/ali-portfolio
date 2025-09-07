/**
 * Advanced GSAP ScrollTrigger Implementation
 * Recreating Fine Thought Website Animations
 */

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

class FineThoughtAnimations {
    constructor() {
        this.isLoaded = false;
        this.currentTheme = 'dark';
        this.typewriterSpeed = 0.03;
        this.glitchIntensity = 0.7;
        
        this.init();
    }

    init() {
        this.setupLoadingAnimation();
        this.createBackgroundGrid();
        this.setupTypewriterSystem();
        this.setupScrollTriggers();
        this.setupThemeToggle();
        this.setupResponsiveAnimations();
    }

    /**
     * Loading Animation System
     * Recreates the cover fade-out effect
     */
    setupLoadingAnimation() {
        const tl = gsap.timeline();
        
        tl.set('.loading-cover', { 
            opacity: 1, 
            zIndex: 9999 
        })
        .to('.loading-cover', {
            opacity: 0,
            duration: 0.5,
            delay: 1.5,
            ease: "power2.inOut"
        })
        .set('.loading-cover', { 
            display: 'none',
            onComplete: () => {
                this.isLoaded = true;
                document.body.classList.add('state-site-loaded');
                this.startMainAnimations();
            }
        });
    }

    /**
     * Background Grid Animation System
     * Recreates the animated dotted line background
     */
    createBackgroundGrid() {
        const gridContainer = document.querySelector('.background-grid');
        const patterns = [
            '-', '--', '---', '----', '-----', 
            '------', '-------', '--------', '---------'
        ];
        
        // Create grid lines
        for (let i = 0; i < 100; i++) {
            const line = document.createElement('div');
            line.className = 'grid-line';
            line.textContent = patterns[i % patterns.length];
            
            // Random positioning
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight * 3; // Extended height for scrolling
            
            gsap.set(line, {
                x: x,
                y: y,
                opacity: Math.random() * 0.5 + 0.1
            });
            
            gridContainer.appendChild(line);
            
            // Animate grid lines with different patterns
            this.animateGridLine(line, i);
        }
    }

    animateGridLine(line, index) {
        const duration = gsap.utils.random(8, 15);
        const delay = gsap.utils.random(0, 5);
        
        // Floating animation
        gsap.to(line, {
            x: `+=${gsap.utils.random(-100, 100)}`,
            y: `+=${gsap.utils.random(-50, 50)}`,
            duration: duration,
            delay: delay,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Opacity pulsing
        gsap.to(line, {
            opacity: gsap.utils.random(0.1, 0.6),
            duration: gsap.utils.random(2, 4),
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        });

        // Scroll-based parallax
        gsap.to(line, {
            yPercent: -30,
            ease: "none",
            scrollTrigger: {
                trigger: line,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
    }

    /**
     * Typewriter Animation System
     * Recreates character-by-character text reveal
     */
    setupTypewriterSystem() {
        const typewriterElements = document.querySelectorAll('.typewriter-text');
        
        typewriterElements.forEach((element, index) => {
            this.createTypewriterEffect(element, index);
        });
    }

    createTypewriterEffect(element, index) {
        const text = element.textContent;
        element.innerHTML = '';
        
        // Split text into individual characters
        const chars = text.split('').map(char => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.setAttribute('data-char', span.textContent);
            return span;
        });
        
        chars.forEach(char => element.appendChild(char));
        
        // Set initial state
        gsap.set(chars, {
            opacity: 0,
            y: 20,
            rotationX: -90
        });
        
        // Create typewriter timeline
        const tl = gsap.timeline({ delay: 2 + (index * 0.8) });
        
        tl.to(chars, {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.05,
            stagger: this.typewriterSpeed,
            ease: "back.out(1.7)",
            onComplete: () => {
                this.addGlitchEffect(chars);
            }
        });
        
        return tl;
    }

    /**
     * Glitch Effect System
     * Recreates the character displacement effect
     */
    addGlitchEffect(chars) {
        chars.forEach((char, index) => {
            if (Math.random() > this.glitchIntensity) {
                const glitchTl = gsap.timeline({ 
                    delay: gsap.utils.random(0, 3),
                    repeat: -1,
                    repeatDelay: gsap.utils.random(5, 15)
                });
                
                glitchTl.to(char, {
                    x: gsap.utils.random(-3, 3),
                    y: gsap.utils.random(-2, 2),
                    duration: 0.1,
                    ease: "power2.inOut"
                })
                .to(char, {
                    x: 0,
                    y: 0,
                    duration: 0.1,
                    ease: "power2.inOut"
                });
                
                // Add color glitch effect
                this.addColorGlitch(char);
            }
        });
    }

    addColorGlitch(char) {
        const colors = ['#ff0000', '#00ffff', '#ffff00', '#ff00ff'];
        
        gsap.to(char, {
            color: colors[Math.floor(Math.random() * colors.length)],
            duration: 0.05,
            repeat: 3,
            yoyo: true,
            delay: gsap.utils.random(0, 2),
            onComplete: () => {
                gsap.set(char, { color: '' }); // Reset to original color
            }
        });
    }

    /**
     * Scroll-Triggered Animation System
     * Recreates scroll-based content reveal
     */
    setupScrollTriggers() {
        // Animate code lines on scroll
        gsap.utils.toArray('.code-line').forEach((line, index) => {
            gsap.fromTo(line, 
                {
                    opacity: 0,
                    x: -30,
                    rotationY: -15
                },
                {
                    opacity: 1,
                    x: 0,
                    rotationY: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: line,
                        start: "top 85%",
                        end: "bottom 15%",
                        toggleActions: "play none none reverse",
                        onEnter: () => {
                            this.typeCodeLine(line);
                        }
                    }
                }
            );
        });

        // Line numbers animation
        gsap.utils.toArray('.line-number').forEach((number, index) => {
            gsap.fromTo(number,
                {
                    opacity: 0,
                    scale: 0.8
                },
                {
                    opacity: 0.6,
                    scale: 1,
                    duration: 0.4,
                    delay: index * 0.05,
                    scrollTrigger: {
                        trigger: number,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Hero text scroll effects
        gsap.utils.toArray('.hero-text').forEach(text => {
            gsap.to(text, {
                yPercent: -20,
                ease: "none",
                scrollTrigger: {
                    trigger: text,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            });
        });
    }

    /**
     * Code Line Typing Effect
     * Recreates the code typing animation
     */
    typeCodeLine(line) {
        const text = line.textContent;
        line.textContent = '';
        
        let currentIndex = 0;
        const typeInterval = setInterval(() => {
            if (currentIndex < text.length) {
                line.textContent += text[currentIndex];
                currentIndex++;
                
                // Add cursor effect
                if (currentIndex === text.length) {
                    this.addCursorBlink(line);
                }
            } else {
                clearInterval(typeInterval);
            }
        }, 30);
    }

    addCursorBlink(line) {
        const cursor = document.createElement('span');
        cursor.textContent = '|';
        cursor.className = 'cursor';
        line.appendChild(cursor);
        
        gsap.to(cursor, {
            opacity: 0,
            duration: 0.5,
            repeat: 5,
            yoyo: true,
            onComplete: () => {
                cursor.remove();
            }
        });
    }

    /**
     * Theme Toggle System
     * Recreates the light/dark mode switching
     */
    setupThemeToggle() {
        const toggleButton = document.querySelector('.theme-toggle');
        
        toggleButton.addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            
            gsap.to('body', {
                backgroundColor: this.currentTheme === 'dark' ? '#282828' : '#ffffff',
                color: this.currentTheme === 'dark' ? '#ffffff' : '#000000',
                duration: 0.25,
                ease: "power2.inOut"
            });
            
            // Update grid line colors
            gsap.to('.grid-line', {
                color: this.currentTheme === 'dark' ? '#5e5e5e' : '#d6e2fb',
                duration: 0.25
            });
            
            document.body.classList.toggle('light-mode');
        });
    }

    /**
     * Responsive Animation System
     * Adapts animations to different screen sizes
     */
    setupResponsiveAnimations() {
        const mm = gsap.matchMedia();
        
        // Desktop animations
        mm.add("(min-width: 768px)", () => {
            gsap.set('.hero-text', {
                fontSize: 'clamp(3rem, 8vw, 8rem)'
            });
            
            this.typewriterSpeed = 0.02;
        });
        
        // Mobile animations
        mm.add("(max-width: 767px)", () => {
            gsap.set('.hero-text', {
                fontSize: 'clamp(2rem, 12vw, 4rem)'
            });
            
            this.typewriterSpeed = 0.05;
            
            // Reduce grid complexity on mobile
            gsap.set('.grid-line:nth-child(n+30)', {
                display: 'none'
            });
        });
    }

    /**
     * Start main animations after loading
     */
    startMainAnimations() {
        // Refresh ScrollTrigger after content is loaded
        ScrollTrigger.refresh();
        
        // Add any additional post-load animations here
        this.setupInteractiveElements();
    }

    /**
     * Interactive Elements
     * Add hover and click effects
     */
    setupInteractiveElements() {
        // Button hover effects
        gsap.utils.toArray('button').forEach(button => {
            button.addEventListener('mouseenter', () => {
                gsap.to(button, {
                    scale: 1.05,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });
            
            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    scale: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });
        });
        
        // Text hover effects
        gsap.utils.toArray('.char').forEach(char => {
            char.addEventListener('mouseenter', () => {
                gsap.to(char, {
                    scale: 1.2,
                    color: '#00ffff',
                    duration: 0.2,
                    ease: "back.out(1.7)"
                });
            });
            
            char.addEventListener('mouseleave', () => {
                gsap.to(char, {
                    scale: 1,
                    color: '',
                    duration: 0.2,
                    ease: "power2.out"
                });
            });
        });
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FineThoughtAnimations();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FineThoughtAnimations;
}

