/**
 * Performance Monitoring Utilities for GSAP Animations
 * Tracks animation performance metrics and provides degradation handling
 */

export class PerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.startTime = performance.now();
    this.frameRates = [];
    this.droppedFrames = 0;
    this.totalAnimations = 0;
    this.completedAnimations = 0;
    this.loadTime = 0;
    this.scrollEventCount = 0;
    this.isMonitoring = false;
    this.performanceMode = 'high';
    
    // Thresholds for performance degradation
    this.thresholds = {
      goodFrameRate: 58,
      acceptableFrameRate: 45,
      poorFrameRate: 30,
      maxDroppedFrames: 10
    };

    this.init();
  }

  init() {
    // Detect device performance capabilities
    this.detectPerformanceMode();
    
    // Set up performance monitoring
    if ('PerformanceObserver' in window) {
      this.setupPerformanceObserver();
    }
    
    // Monitor frame rate during animations
    this.setupFrameRateMonitoring();
    
    console.log('📊 Performance monitoring initialized');
    console.log(`🎯 Performance mode: ${this.performanceMode}`);
  }

  detectPerformanceMode() {
    const navigator = window.navigator;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    // Check device memory (Chrome only)
    const deviceMemory = navigator.deviceMemory || 4;
    
    // Check CPU cores
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    
    // Check connection type
    const connectionType = connection?.effectiveType || '4g';
    
    // Determine performance mode
    if (deviceMemory >= 8 && hardwareConcurrency >= 8 && connectionType === '4g') {
      this.performanceMode = 'high';
    } else if (deviceMemory >= 4 && hardwareConcurrency >= 4) {
      this.performanceMode = 'medium';
    } else {
      this.performanceMode = 'low';
    }
    
    // Override for mobile devices
    if (this.isMobile()) {
      this.performanceMode = this.performanceMode === 'high' ? 'medium' : 'low';
    }
  }

  isMobile() {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth < 768;
  }

  setupPerformanceObserver() {
    // Observe long tasks that might affect animation performance
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) { // Tasks longer than 50ms
          console.warn(`⚠️ Long task detected: ${entry.duration}ms`);
          this.handlePerformanceDegradation('long-task', entry.duration);
        }
      }
    });

    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // longtask not supported in all browsers
      console.log('Long task monitoring not supported');
    }

    // Observe layout shifts
    const layoutShiftObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.value > 0.1) { // Significant layout shift
          console.warn(`⚠️ Layout shift detected: ${entry.value}`);
        }
      }
    });

    try {
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // layout-shift not supported in all browsers
      console.log('Layout shift monitoring not supported');
    }
  }

  setupFrameRateMonitoring() {
    let lastTime = performance.now();
    let frameId;

    const measureFrame = (currentTime) => {
      if (this.isMonitoring) {
        this.frameCount++;
        const delta = currentTime - lastTime;
        const fps = 1000 / delta;
        
        this.frameRates.push(fps);
        
        // Keep only recent frame rates (last 60 frames)
        if (this.frameRates.length > 60) {
          this.frameRates.shift();
        }
        
        // Detect dropped frames (< 30fps)
        if (fps < this.thresholds.poorFrameRate) {
          this.droppedFrames++;
        }
        
        // Check for performance degradation
        if (this.frameRates.length >= 30) {
          const avgFps = this.getAverageFrameRate();
          
          if (avgFps < this.thresholds.acceptableFrameRate) {
            this.handlePerformanceDegradation('low-fps', avgFps);
          }
        }
        
        lastTime = currentTime;
      }
      
      frameId = requestAnimationFrame(measureFrame);
    };

    frameId = requestAnimationFrame(measureFrame);
    
    // Stop monitoring when page becomes hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(frameId);
      } else {
        frameId = requestAnimationFrame(measureFrame);
      }
    });
  }

  startMonitoring() {
    this.isMonitoring = true;
    this.startTime = performance.now();
    this.frameCount = 0;
    this.frameRates = [];
    this.droppedFrames = 0;
    
    console.log('📊 Performance monitoring started');
  }

  stopMonitoring() {
    this.isMonitoring = false;
    console.log('📊 Performance monitoring stopped');
  }

  recordAnimationStart() {
    this.totalAnimations++;
  }

  recordAnimationComplete(duration) {
    this.completedAnimations++;
    
    // Log slow animations
    if (duration > 1000) {
      console.warn(`⚠️ Slow animation detected: ${duration}ms`);
    }
  }

  recordScrollEvent() {
    this.scrollEventCount++;
  }

  recordLoadTime(loadTime) {
    this.loadTime = loadTime;
    console.log(`⏱️ GSAP load time: ${loadTime}ms`);
  }

  getMetrics() {
    const currentTime = performance.now();
    const elapsedTime = currentTime - this.startTime;
    
    return {
      averageFrameRate: this.getAverageFrameRate(),
      droppedFrames: this.droppedFrames,
      totalAnimations: this.totalAnimations,
      completedAnimations: this.completedAnimations,
      loadTime: this.loadTime,
      scrollEventCount: this.scrollEventCount,
      elapsedTime: Math.round(elapsedTime),
      performanceMode: this.performanceMode,
      frameCount: this.frameCount,
      isMonitoring: this.isMonitoring
    };
  }

  getAverageFrameRate() {
    if (this.frameRates.length === 0) return 0;
    
    const sum = this.frameRates.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.frameRates.length);
  }

  handlePerformanceDegradation(reason, value) {
    console.warn(`⚠️ Performance degradation detected: ${reason} (${value})`);
    
    // Emit custom event for animation system to handle
    const event = new CustomEvent('performance-degradation', {
      detail: {
        reason,
        value,
        currentMode: this.performanceMode,
        metrics: this.getMetrics()
      }
    });
    
    window.dispatchEvent(event);
    
    // Automatically adjust performance mode if needed
    if (this.performanceMode === 'high' && reason === 'low-fps') {
      this.performanceMode = 'medium';
      console.log('📊 Performance mode reduced to: medium');
    } else if (this.performanceMode === 'medium' && reason === 'low-fps') {
      this.performanceMode = 'low';
      console.log('📊 Performance mode reduced to: low');
    }
  }

  logPerformanceReport() {
    const metrics = this.getMetrics();
    
    console.group('📊 Performance Report');
    console.log(`Average FPS: ${metrics.averageFrameRate}`);
    console.log(`Dropped Frames: ${metrics.droppedFrames}`);
    console.log(`Total Animations: ${metrics.totalAnimations}`);
    console.log(`Completed Animations: ${metrics.completedAnimations}`);
    console.log(`Success Rate: ${Math.round((metrics.completedAnimations / metrics.totalAnimations) * 100)}%`);
    console.log(`Load Time: ${metrics.loadTime}ms`);
    console.log(`Scroll Events: ${metrics.scrollEventCount}`);
    console.log(`Performance Mode: ${metrics.performanceMode}`);
    console.log(`Monitoring Time: ${metrics.elapsedTime}ms`);
    console.groupEnd();
    
    return metrics;
  }

  // Static method to create global instance
  static createGlobal() {
    if (!window.portfolioPerformanceMonitor) {
      window.portfolioPerformanceMonitor = new PerformanceMonitor();
    }
    return window.portfolioPerformanceMonitor;
  }
}

// Memory usage monitoring utility
export class MemoryMonitor {
  constructor() {
    this.initialMemory = this.getMemoryUsage();
    this.peakMemory = this.initialMemory;
    this.checkInterval = null;
  }

  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  startMonitoring(intervalMs = 5000) {
    if (!performance.memory) {
      console.log('Memory monitoring not supported');
      return;
    }

    this.checkInterval = setInterval(() => {
      const current = this.getMemoryUsage();
      
      if (current.used > this.peakMemory.used) {
        this.peakMemory = current;
      }

      // Check for memory leaks (increase > 50MB)
      const memoryIncrease = current.used - this.initialMemory.used;
      if (memoryIncrease > 50 * 1024 * 1024) { // 50MB
        console.warn(`⚠️ Memory usage increased by ${Math.round(memoryIncrease / 1024 / 1024)}MB`);
        
        // Emit memory warning event
        window.dispatchEvent(new CustomEvent('memory-warning', {
          detail: { current, initial: this.initialMemory, increase: memoryIncrease }
        }));
      }
    }, intervalMs);
  }

  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  getReport() {
    const current = this.getMemoryUsage();
    if (!current) return null;

    return {
      current,
      initial: this.initialMemory,
      peak: this.peakMemory,
      increase: current.used - this.initialMemory.used
    };
  }
}

// Export for global access
window.PerformanceMonitor = PerformanceMonitor;
window.MemoryMonitor = MemoryMonitor;