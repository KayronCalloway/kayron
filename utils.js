// utils.js - Shared utility functions for the TV Portfolio

/**
 * Loads HTML content from a URL and appends it to a container
 * @param {string} url - The URL to fetch HTML from
 * @param {Element|null} container - Optional container to append to (creates a new div if null)
 * @returns {Promise<Element>} - Promise resolving to the container with HTML content
 */
export async function loadHTML(url, container = null) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    const html = await response.text();
    const targetContainer = container || document.createElement('div');
    targetContainer.innerHTML = html;
    
    if (!container) {
      document.body.appendChild(targetContainer);
    }
    
    return targetContainer;
  } catch (error) {
    console.error(`Failed to load HTML from ${url}:`, error);
    throw error;
  }
}

/**
 * Loads a CSS stylesheet if it's not already loaded
 * @param {string} href - The stylesheet URL
 * @param {boolean} cacheBust - Whether to add a cache-busting parameter
 * @returns {Promise<HTMLLinkElement>} - Promise resolving to the link element
 */
export function loadCSS(href, cacheBust = false) {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (document.querySelector(`link[href^="${href}"]`)) {
      resolve(document.querySelector(`link[href^="${href}"]`));
      return;
    }
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cacheBust ? `${href}?v=${Date.now()}` : href;
    
    link.onload = () => resolve(link);
    link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
    
    document.head.appendChild(link);
  });
}

/**
 * Creates and manages event listeners with automatic cleanup
 * @param {Object.<string, Object.<string, Function>>} eventMappings - Object mapping selectors to event types and handlers
 * @returns {Function} - Function to remove all attached listeners
 */
export function setupEventListeners(eventMappings) {
  const listeners = [];
  
  for (const [selector, events] of Object.entries(eventMappings)) {
    const element = typeof selector === 'string' 
      ? document.querySelector(selector) 
      : selector;
    
    if (!element) {
      console.warn(`Element not found for selector: ${selector}`);
      continue;
    }
    
    for (const [eventType, handler] of Object.entries(events)) {
      element.addEventListener(eventType, handler);
      listeners.push([element, eventType, handler]);
    }
  }
  
  // Return cleanup function
  return function cleanup() {
    listeners.forEach(([element, eventType, handler]) => {
      element.removeEventListener(eventType, handler);
    });
    
    // Clear the array
    listeners.length = 0;
  };
}

/**
 * Simple DOM caching to avoid repeated querySelector calls
 */
export const dom = {
  _cache: new Map(),
  
  /**
   * Get an element by selector (cached)
   * @param {string} selector - CSS selector
   * @returns {Element|null} - The DOM element or null
   */
  get(selector) {
    if (!this._cache.has(selector)) {
      this._cache.set(selector, document.querySelector(selector));
    }
    return this._cache.get(selector);
  },
  
  /**
   * Get all elements matching a selector (cached)
   * @param {string} selector - CSS selector
   * @returns {Element[]} - Array of DOM elements
   */
  getAll(selector) {
    if (!this._cache.has(`all:${selector}`)) {
      this._cache.set(`all:${selector}`, [...document.querySelectorAll(selector)]);
    }
    return this._cache.get(`all:${selector}`);
  },
  
  /**
   * Create a DOM element with attributes and properties
   * @param {string} tag - The tag name
   * @param {Object} attrs - Attributes to set
   * @param {string|Element|Array} children - Child content (string, element, or array of elements)
   * @returns {Element} The created element
   */
  create(tag, attrs = {}, children = null) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        const eventName = key.slice(2).toLowerCase();
        element.addEventListener(eventName, value);
      } else {
        element.setAttribute(key, value);
      }
    });
    
    // Add children
    if (children) {
      if (Array.isArray(children)) {
        children.forEach(child => {
          if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
          } else if (child instanceof Element) {
            element.appendChild(child);
          }
        });
      } else if (typeof children === 'string') {
        element.textContent = children;
      } else if (children instanceof Element) {
        element.appendChild(children);
      }
    }
    
    return element;
  },
  
  /**
   * Clear the DOM cache
   */
  clearCache() {
    this._cache.clear();
  }
};

/**
 * Animation utilities using GSAP
 */
export const animations = {
  /**
   * Animate a modal opening
   * @param {Element} modal - The modal element
   * @param {Object} options - Animation options
   */
  modalIn(modal, options = {}) {
    const defaults = {
      duration: 0.6,
      ease: "power2.out"
    };
    
    const config = { ...defaults, ...options };
    
    gsap.fromTo(
      modal,
      { 
        opacity: 0, 
        scale: 0.8, 
        y: 20, 
        rotationX: 5,
        transformOrigin: "top center"
      },
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        rotationX: 0, 
        duration: config.duration, 
        ease: config.ease,
        onStart: () => {
          modal.style.display = 'flex';
        }
      }
    );
  },
  
  /**
   * Animate a modal closing
   * @param {Element} modal - The modal element
   * @param {Object} options - Animation options
   */
  modalOut(modal, options = {}) {
    const defaults = {
      duration: 0.5,
      ease: "power2.in"
    };
    
    const config = { ...defaults, ...options };
    
    gsap.to(modal, {
      opacity: 0,
      scale: 0.8,
      y: 20,
      rotationX: 5,
      duration: config.duration,
      ease: config.ease,
      transformOrigin: "top center",
      onComplete: () => {
        modal.style.display = 'none';
      }
    });
  }
};

/**
 * Sound management utilities
 */
export const sound = {
  _cache: new Map(),
  
  /**
   * Get or create an audio element
   * @param {string} src - Audio source URL
   * @returns {HTMLAudioElement} - The audio element
   */
  get(src) {
    if (!this._cache.has(src)) {
      const audio = new Audio(src);
      audio.preload = 'auto';
      this._cache.set(src, audio);
    }
    return this._cache.get(src);
  },
  
  /**
   * Play a sound with error handling
   * @param {string} src - Audio source URL
   * @param {Object} options - Playback options (volume, loop)
   * @returns {Promise} - Promise resolving when sound is played
   */
  play(src, options = {}) {
    const audio = this.get(src);
    
    // Apply options
    if (options.volume !== undefined) audio.volume = options.volume;
    if (options.loop !== undefined) audio.loop = options.loop;
    
    // Reset playback position if already played
    audio.currentTime = 0;
    
    // Play with error handling
    return audio.play().catch(err => {
      console.warn(`Sound playback failed: ${err.message}`);
      return Promise.resolve(); // Continue execution despite error
    });
  },
  
  /**
   * Stop a sound
   * @param {string} src - Audio source URL
   */
  stop(src) {
    if (this._cache.has(src)) {
      const audio = this._cache.get(src);
      audio.pause();
      audio.currentTime = 0;
    }
  }
};

/**
 * Simple error tracking utility
 */
export const errorTracker = {
  _errors: [],
  
  /**
   * Log and track an error
   * @param {string} context - Where the error happened
   * @param {Error} error - The error object
   */
  track(context, error) {
    const errorInfo = {
      context,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
    
    this._errors.push(errorInfo);
    console.error(`[${context}] ${error.message}`, error);
    
    // In production, you might send this to a server
    if (typeof navigator.sendBeacon === 'function') {
      try {
        navigator.sendBeacon('/error-log', JSON.stringify(errorInfo));
      } catch (e) {
        // Silently fail if beacon sending fails
      }
    }
    
    return errorInfo;
  },
  
  /**
   * Get all tracked errors
   * @returns {Array} - Array of error objects
   */
  getAll() {
    return [...this._errors];
  },
  
  /**
   * Clear error history
   */
  clear() {
    this._errors = [];
  }
};