import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const FineThoughtAnimation = () => {
  const containerRef = useRef(null);
  const loadingCoverRef = useRef(null);
  const backgroundGridRef = useRef(null);
  const heroTextRefs = useRef([]);
  const codeLineRefs = useRef([]);
  const lineNumberRefs = useRef([]);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [animationState, setAnimationState] = useState({
    maxChar: 0,
    scrollPos: 0,
    maxScrollPos: 0,
    linesUsed: 0
  });

  // Animation configuration
  const config = {
    typewriterSpeed: 0.03,
    glitchIntensity: 0.7,
    gridLineCount: 80,
    loadingDelay: 1.5
  };

  /**
   * Initialize all animations on component mount
   */
  useEffect(() => {
    const initAnimations = async () => {
      await createBackgroundGrid();
      setupLoadingAnimation();
      setupScrollTriggers();
      setupResponsiveAnimations();
    };

    initAnimations();

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  /**
   * Handle theme changes
   */
  useEffect(() => {
    gsap.to(containerRef.current, {
      backgroundColor: isDarkMode ? '#282828' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
      duration: 0.25,
      ease: "power2.inOut"
    });

    gsap.to('.grid-line', {
      color: isDarkMode ? '#5e5e5e' : '#d6e2fb',
      duration: 0.25
    });
  }, [isDarkMode]);

  /**
   * Create animated background grid
   */
  const createBackgroundGrid = useCallback(async () => {
    const gridContainer = backgroundGridRef.current;
    if (!gridContainer) return;

    const patterns = ['-', '--', '---', '----', '-----', '------', '-------'];
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < config.gridLineCount; i++) {
      const line = document.createElement('div');
      line.className = 'grid-line';
      line.textContent = patterns[i % patterns.length];
      
      // Set initial position
      gsap.set(line, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 3,
        opacity: Math.random() * 0.5 + 0.1
      });
      
      fragment.appendChild(line);
      
      // Animate each line
      animateGridLine(line, i);
    }
    
    gridContainer.appendChild(fragment);
  }, []);

  /**
   * Animate individual grid line
   */
  const animateGridLine = useCallback((line, index) => {
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

    // Opacity animation
    gsap.to(line, {
      opacity: gsap.utils.random(0.1, 0.6),
      duration: gsap.utils.random(2, 4),
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Scroll parallax
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
  }, []);

  /**
   * Setup loading animation
   */
  const setupLoadingAnimation = useCallback(() => {
    const tl = gsap.timeline();
    
    tl.set(loadingCoverRef.current, { 
      opacity: 1, 
      zIndex: 9999 
    })
    .to(loadingCoverRef.current, {
      opacity: 0,
      duration: 0.5,
      delay: config.loadingDelay,
      ease: "power2.inOut"
    })
    .set(loadingCoverRef.current, { 
      display: 'none',
      onComplete: () => {
        setIsLoaded(true);
        startMainAnimations();
      }
    });
  }, []);

  /**
   * Create typewriter effect for text elements
   */
  const createTypewriterEffect = useCallback((element, delay = 0) => {
    if (!element) return;
    
    const text = element.textContent;
    element.innerHTML = '';
    
    // Split text into characters
    const chars = text.split('').map(char => {
      const span = document.createElement('span');
      span.className = 'char glitch-char';
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
    
    // Animate characters
    const tl = gsap.timeline({ delay });
    
    tl.to(chars, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.05,
      stagger: config.typewriterSpeed,
      ease: "back.out(1.7)",
      onComplete: () => {
        addGlitchEffect(chars);
      }
    });
    
    return tl;
  }, []);

  /**
   * Add glitch effect to characters
   */
  const addGlitchEffect = useCallback((chars) => {
    chars.forEach((char, index) => {
      if (Math.random() > config.glitchIntensity) {
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
        
        // Color glitch
        addColorGlitch(char);
      }
    });
  }, []);

  /**
   * Add color glitch effect
   */
  const addColorGlitch = useCallback((char) => {
    const colors = ['#ff0000', '#00ffff', '#ffff00', '#ff00ff'];
    
    gsap.to(char, {
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 0.05,
      repeat: 3,
      yoyo: true,
      delay: gsap.utils.random(0, 2),
      onComplete: () => {
        gsap.set(char, { color: '' });
      }
    });
  }, []);

  /**
   * Setup scroll-triggered animations
   */
  const setupScrollTriggers = useCallback(() => {
    // Animate code lines
    codeLineRefs.current.forEach((line, index) => {
      if (!line) return;
      
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
              typeCodeLine(line);
            }
          }
        }
      );
    });

    // Animate line numbers
    lineNumberRefs.current.forEach((number, index) => {
      if (!number) return;
      
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

    // Hero text parallax
    heroTextRefs.current.forEach(text => {
      if (!text) return;
      
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
  }, []);

  /**
   * Type code line animation
   */
  const typeCodeLine = useCallback((line) => {
    const text = line.textContent;
    line.textContent = '';
    
    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < text.length) {
        line.textContent += text[currentIndex];
        currentIndex++;
        
        if (currentIndex === text.length) {
          addCursorBlink(line);
        }
      } else {
        clearInterval(typeInterval);
      }
    }, 30);
  }, []);

  /**
   * Add cursor blink effect
   */
  const addCursorBlink = useCallback((line) => {
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
  }, []);

  /**
   * Setup responsive animations
   */
  const setupResponsiveAnimations = useCallback(() => {
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 768px)", () => {
      gsap.set('.hero-text', {
        fontSize: 'clamp(3rem, 8vw, 8rem)'
      });
    });
    
    mm.add("(max-width: 767px)", () => {
      gsap.set('.hero-text', {
        fontSize: 'clamp(2rem, 12vw, 4rem)'
      });
      
      gsap.set('.grid-line:nth-child(n+30)', {
        display: 'none'
      });
    });
  }, []);

  /**
   * Start main animations after loading
   */
  const startMainAnimations = useCallback(() => {
    // Create typewriter effects for hero text
    heroTextRefs.current.forEach((ref, index) => {
      if (ref) {
        createTypewriterEffect(ref, 2 + (index * 0.8));
      }
    });
    
    ScrollTrigger.refresh();
  }, [createTypewriterEffect]);

  /**
   * Toggle theme
   */
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  // Component JSX
  return (
    <div 
      ref={containerRef}
      className={`fine-thought-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
      style={{
        minHeight: '300vh',
        backgroundColor: isDarkMode ? '#282828' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        fontFamily: "'Courier New', monospace",
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Loading Cover */}
      <div 
        ref={loadingCoverRef}
        className="loading-cover"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: isDarkMode ? '#282828' : '#ffffff',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="typewriter-text">Loading...</div>
      </div>

      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          background: 'none',
          border: `1px solid ${isDarkMode ? '#5e5e5e' : '#d6e2fb'}`,
          color: isDarkMode ? '#ffffff' : '#000000',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        Switch Theme
      </button>

      {/* Line Numbers */}
      <div 
        className="line-numbers"
        style={{
          position: 'fixed',
          left: '1rem',
          top: 0,
          height: '100%',
          width: '3rem',
          zIndex: 2,
          paddingTop: '2rem'
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num, index) => (
          <span 
            key={num}
            ref={el => lineNumberRefs.current[index] = el}
            className="line-number"
            style={{
              display: 'block',
              color: isDarkMode ? '#5e5e5e' : '#d6e2fb',
              fontSize: '12px',
              lineHeight: '1.5',
              textAlign: 'right',
              opacity: 0
            }}
          >
            {num}
          </span>
        ))}
      </div>

      {/* Background Grid */}
      <div 
        ref={backgroundGridRef}
        className="background-grid"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          opacity: 0.3
        }}
      />

      {/* Main Content */}
      <div 
        className="main-content"
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '10vh 2rem 2rem 4rem'
        }}
      >
        {/* Hero Text */}
        <div className="hero-text" style={{ marginBottom: '2rem' }}>
          <div 
            ref={el => heroTextRefs.current[0] = el}
            className="typewriter-text"
            style={{ 
              fontSize: 'clamp(2rem, 8vw, 6rem)',
              fontWeight: 'bold',
              lineHeight: 1.1,
              marginBottom: '1rem'
            }}
          >
            Web engineer
          </div>
          <div 
            ref={el => heroTextRefs.current[1] = el}
            className="typewriter-text"
            style={{ 
              fontSize: 'clamp(2rem, 8vw, 6rem)',
              fontWeight: 'bold',
              lineHeight: 1.1
            }}
          >
            & creative coder
          </div>
        </div>

        <div className="hero-text" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
          <div 
            ref={el => heroTextRefs.current[2] = el}
            className="typewriter-text"
            style={{ 
              fontSize: 'clamp(2rem, 8vw, 6rem)',
              fontWeight: 'bold',
              lineHeight: 1.1
            }}
          >
            Fine Thought
          </div>
        </div>

        {/* Code Section */}
        <div className="code-section">
          {[
            'const developer = {',
            '  name: "Fine Thought",',
            '  skills: ["JavaScript", "React", "GSAP"],',
            '  passion: "Creative Coding"',
            '};',
            '',
            'function createMagic() {',
            '  return developer.skills.map(skill => {',
            '    return `${skill} + creativity = innovation`;',
            '  });',
            '}'
          ].map((line, index) => (
            <div 
              key={index}
              ref={el => codeLineRefs.current[index] = el}
              className="code-line"
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '14px',
                lineHeight: '1.5',
                marginBottom: '0.5rem',
                opacity: 0
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FineThoughtAnimation;

