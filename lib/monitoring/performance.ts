// Performance monitoring utilities

export interface PerformanceMetrics {
  name: string
  duration: number
  timestamp: number
  url?: string
  userAgent?: string
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private observers: PerformanceObserver[] = []

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers()
    }
  }

  private initializeObservers() {
    // Core Web Vitals
    this.observeWebVitals()
    
    // Navigation timing
    this.observeNavigation()
    
    // Resource timing
    this.observeResources()
  }

  private observeWebVitals() {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        
        this.recordMetric({
          name: 'LCP',
          duration: lastEntry.startTime,
          timestamp: Date.now(),
          url: window.location.href
        })
      })
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(lcpObserver)

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.recordMetric({
            name: 'FID',
            duration: entry.processingStart - entry.startTime,
            timestamp: Date.now(),
            url: window.location.href
          })
        })
      })
      
      fidObserver.observe({ entryTypes: ['first-input'] })
      this.observers.push(fidObserver)

      // Cumulative Layout Shift (CLS)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        
        this.recordMetric({
          name: 'CLS',
          duration: clsValue,
          timestamp: Date.now(),
          url: window.location.href
        })
      })
      
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(clsObserver)
    }
  }

  private observeNavigation() {
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.recordMetric({
            name: 'Navigation',
            duration: entry.loadEventEnd - entry.fetchStart,
            timestamp: Date.now(),
            url: window.location.href
          })
        })
      })
      
      navObserver.observe({ entryTypes: ['navigation'] })
      this.observers.push(navObserver)
    }
  }

  private observeResources() {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          // Only track slow resources (>1s)
          if (entry.duration > 1000) {
            this.recordMetric({
              name: `Resource: ${entry.name}`,
              duration: entry.duration,
              timestamp: Date.now(),
              url: window.location.href
            })
          }
        })
      })
      
      resourceObserver.observe({ entryTypes: ['resource'] })
      this.observers.push(resourceObserver)
    }
  }

  recordMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric)
    
    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(metric)
    }
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metric:', metric)
    }
  }

  private async sendToAnalytics(metric: PerformanceMetrics) {
    try {
      // Send to your analytics service
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metric)
      })
    } catch (error) {
      console.error('Failed to send performance metric:', error)
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics]
  }

  clearMetrics() {
    this.metrics = []
  }

  disconnect() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor()
  }
  return performanceMonitor
}

// Utility functions
export function measureFunction<T>(
  name: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  const start = performance.now()
  
  const result = fn()
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const duration = performance.now() - start
      getPerformanceMonitor().recordMetric({
        name,
        duration,
        timestamp: Date.now()
      })
    })
  } else {
    const duration = performance.now() - start
    getPerformanceMonitor().recordMetric({
      name,
      duration,
      timestamp: Date.now()
    })
    return result
  }
}

export function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now()
  
  return fn().finally(() => {
    const duration = performance.now() - start
    getPerformanceMonitor().recordMetric({
      name,
      duration,
      timestamp: Date.now()
    })
  })
}