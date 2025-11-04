// Accessibility utilities and helpers

export interface A11yConfig {
  announcePageChanges?: boolean
  focusManagement?: boolean
  keyboardNavigation?: boolean
  screenReaderSupport?: boolean
}

class AccessibilityManager {
  private config: A11yConfig
  private announcer: HTMLElement | null = null

  constructor(config: A11yConfig = {}) {
    this.config = {
      announcePageChanges: true,
      focusManagement: true,
      keyboardNavigation: true,
      screenReaderSupport: true,
      ...config
    }

    if (typeof window !== 'undefined') {
      this.initialize()
    }
  }

  private initialize() {
    if (this.config.screenReaderSupport) {
      this.createScreenReaderAnnouncer()
    }

    if (this.config.keyboardNavigation) {
      this.setupKeyboardNavigation()
    }

    if (this.config.focusManagement) {
      this.setupFocusManagement()
    }
  }

  private createScreenReaderAnnouncer() {
    this.announcer = document.createElement('div')
    this.announcer.setAttribute('aria-live', 'polite')
    this.announcer.setAttribute('aria-atomic', 'true')
    this.announcer.className = 'sr-only'
    this.announcer.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `
    document.body.appendChild(this.announcer)
  }

  private setupKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
      // Skip links with Tab key
      if (event.key === 'Tab' && !event.shiftKey) {
        const skipLink = document.querySelector('[data-skip-link]') as HTMLElement
        if (skipLink && document.activeElement === document.body) {
          skipLink.focus()
          event.preventDefault()
        }
      }

      // Escape key to close modals/dropdowns
      if (event.key === 'Escape') {
        const activeModal = document.querySelector('[role="dialog"][aria-hidden="false"]')
        if (activeModal) {
          const closeButton = activeModal.querySelector('[data-close]') as HTMLElement
          if (closeButton) {
            closeButton.click()
          }
        }
      }
    })
  }

  private setupFocusManagement() {
    // Focus visible indicator
    document.addEventListener('keydown', () => {
      document.body.classList.add('keyboard-navigation')
    })

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation')
    })

    // Focus trap for modals
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        const modal = document.querySelector('[role="dialog"][aria-hidden="false"]')
        if (modal) {
          this.trapFocus(event, modal as HTMLElement)
        }
      }
    })
  }

  private trapFocus(event: KeyboardEvent, container: HTMLElement) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus()
        event.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus()
        event.preventDefault()
      }
    }
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (!this.announcer) return

    this.announcer.setAttribute('aria-live', priority)
    this.announcer.textContent = message

    // Clear after announcement
    setTimeout(() => {
      if (this.announcer) {
        this.announcer.textContent = ''
      }
    }, 1000)
  }

  announcePageChange(title: string) {
    if (this.config.announcePageChanges) {
      this.announce(`Navigated to ${title}`)
    }
  }

  focusElement(selector: string | HTMLElement) {
    const element = typeof selector === 'string' 
      ? document.querySelector(selector) as HTMLElement
      : selector

    if (element) {
      element.focus()
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  addSkipLink(target: string, text: string = 'Skip to main content') {
    const skipLink = document.createElement('a')
    skipLink.href = target
    skipLink.textContent = text
    skipLink.className = 'skip-link'
    skipLink.setAttribute('data-skip-link', 'true')
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 9999;
      border-radius: 4px;
    `

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px'
    })

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px'
    })

    skipLink.addEventListener('click', (event) => {
      event.preventDefault()
      const targetElement = document.querySelector(target) as HTMLElement
      if (targetElement) {
        targetElement.focus()
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
    })

    document.body.insertBefore(skipLink, document.body.firstChild)
  }

  checkColorContrast(foreground: string, background: string): number {
    // Simple contrast ratio calculation
    const getLuminance = (color: string) => {
      const rgb = parseInt(color.slice(1), 16)
      const r = (rgb >> 16) & 0xff
      const g = (rgb >> 8) & 0xff
      const b = (rgb >> 0) & 0xff
      
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }

    const l1 = getLuminance(foreground)
    const l2 = getLuminance(background)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    
    return (lighter + 0.05) / (darker + 0.05)
  }

  validateForm(form: HTMLFormElement): string[] {
    const errors: string[] = []
    const requiredFields = form.querySelectorAll('[required]') as NodeListOf<HTMLInputElement>

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        const label = form.querySelector(`label[for="${field.id}"]`)?.textContent || field.name
        errors.push(`${label} is required`)
        
        // Add aria-invalid
        field.setAttribute('aria-invalid', 'true')
        
        // Add error message
        let errorElement = document.getElementById(`${field.id}-error`)
        if (!errorElement) {
          errorElement = document.createElement('div')
          errorElement.id = `${field.id}-error`
          errorElement.className = 'error-message'
          errorElement.setAttribute('role', 'alert')
          field.parentNode?.insertBefore(errorElement, field.nextSibling)
        }
        errorElement.textContent = `${label} is required`
        field.setAttribute('aria-describedby', errorElement.id)
      } else {
        field.removeAttribute('aria-invalid')
        const errorElement = document.getElementById(`${field.id}-error`)
        if (errorElement) {
          errorElement.remove()
        }
      }
    })

    return errors
  }

  destroy() {
    if (this.announcer) {
      this.announcer.remove()
      this.announcer = null
    }
  }
}

// Singleton instance
let accessibilityManager: AccessibilityManager | null = null

export function getAccessibilityManager(config?: A11yConfig): AccessibilityManager {
  if (!accessibilityManager) {
    accessibilityManager = new AccessibilityManager(config)
  }
  return accessibilityManager
}

// Utility functions
export function addAriaLabel(element: HTMLElement, label: string) {
  element.setAttribute('aria-label', label)
}

export function addAriaDescribedBy(element: HTMLElement, describedById: string) {
  const existing = element.getAttribute('aria-describedby')
  const newValue = existing ? `${existing} ${describedById}` : describedById
  element.setAttribute('aria-describedby', newValue)
}

export function setAriaExpanded(element: HTMLElement, expanded: boolean) {
  element.setAttribute('aria-expanded', expanded.toString())
}

export function setAriaHidden(element: HTMLElement, hidden: boolean) {
  element.setAttribute('aria-hidden', hidden.toString())
}

export function makeElementFocusable(element: HTMLElement) {
  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '0')
  }
}

export function removeFromTabOrder(element: HTMLElement) {
  element.setAttribute('tabindex', '-1')
}

// React hook for accessibility
export function useAccessibility(config?: A11yConfig) {
  if (typeof window === 'undefined') return null
  
  return getAccessibilityManager(config)
}