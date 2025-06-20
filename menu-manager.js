// menu-manager.js - Centralized menu visibility controller

/**
 * MenuManager - Controls menu button visibility across all channels
 * Ensures the menu button remains accessible regardless of active channel
 */
export const MenuManager = {
  /**
   * Initialize the menu manager
   */
  init() {
    this.menuButton = document.getElementById('menuButton');
    this.tvGuide = document.getElementById('tvGuide');
    this.header = document.getElementById('header');
    this.closeGuide = document.getElementById('closeGuide');
    this.bindEvents();
    console.log('MenuManager initialized');
    // Don't show on initialization - will show based on header visibility
  },
  
  /**
   * Bind event listeners for channel changes and menu interactions
   */
  bindEvents() {
    // Listen for channel change events
    document.addEventListener('channelChanged', () => {
      console.log('Channel changed event detected, syncing menu visibility with header');
      this.show();
    });
    
    // Set up menu button click handler
    if (this.menuButton) {
      this.menuButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('MenuManager: Menu button clicked');
        this.toggleTVGuide();
      });
    }
    
    // Set up close guide button handler
    if (this.closeGuide) {
      this.closeGuide.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('MenuManager: Close guide clicked');
        this.hideTVGuide();
      });
    }
    
    // Create a mutation observer to detect style changes that might hide the menu
    this.createVisibilityObserver();
    
    // Create a mutation observer to detect header visibility changes
    this.createHeaderObserver();
    
    // Periodically check visibility as a fallback
    setInterval(() => this.ensureVisibility(), 2000);
  },
  
  /**
   * Set up an observer to detect changes that might hide the menu
   */
  createVisibilityObserver() {
    if (!this.menuButton) return;
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          // If style changes and menu is hidden, show it
          const computedStyle = window.getComputedStyle(this.menuButton);
          if (computedStyle.display === 'none' || parseFloat(computedStyle.opacity) < 0.5) {
            console.log('Menu visibility changed by mutation, restoring');
            this.show();
          }
        }
      });
    });
    
    observer.observe(this.menuButton, { attributes: true });
    console.log('Menu visibility observer started');
  },
  
  /**
   * Show the menu button only when header is visible - exact header behavior
   */
  show() {
    if (!this.menuButton || !this.header) return;
    
    // Get header computed style
    const headerStyle = window.getComputedStyle(this.header);
    const isHeaderVisible = headerStyle.display !== 'none' && parseFloat(headerStyle.opacity) > 0.5;
    
    // ONLY show menu button if header is visible (exact header behavior)
    if (isHeaderVisible) {
      // EXACTLY match header visibility
      this.menuButton.style.display = headerStyle.display;
      this.menuButton.style.opacity = headerStyle.opacity;
      this.menuButton.style.visibility = headerStyle.visibility;
      this.menuButton.style.pointerEvents = 'auto';
      
      // Ensure proper position
      this.menuButton.style.position = "fixed";
      this.menuButton.style.top = "10px";
      this.menuButton.style.right = "20px";
      this.menuButton.style.zIndex = "999999";
      
      // Ensure tap target size is at least 44x44px for iOS Safari
      this.menuButton.style.minHeight = "44px";
      this.menuButton.style.minWidth = "44px";
      
      console.log('Menu button EXACTLY matching header visibility');
    } else {
      // Hide menu when header is hidden
      this.menuButton.style.display = 'none';
      this.menuButton.style.opacity = '0';
      this.menuButton.style.visibility = 'hidden';
      console.log('Menu button hidden because header is not visible');
    }
  },
  
  /**
   * Check and enforce menu visibility
   */
  ensureVisibility() {
    // Refresh references
    this.menuButton = document.getElementById('menuButton');
    this.header = document.getElementById('header');
    
    // Sync with header visibility
    this.show();
  },
  
  /**
   * Add header visibility observer
   */
  createHeaderObserver() {
    if (!this.header) return;
    
    const observer = new MutationObserver(() => {
      // When header style changes, sync menu button visibility
      this.show();
    });
    
    observer.observe(this.header, { attributes: true });
    console.log('Header visibility observer started');
  },
  
  /**
   * Toggle TV Guide visibility - delegate to global implementation in script.js
   */
  toggleTVGuide() {
    if (typeof window.toggleTVGuide === 'function') {
      window.toggleTVGuide();
    } else {
      console.error('Global toggleTVGuide function not found');
    }
  },
  
  /**
   * Hide TV Guide (for close button) - delegate
   */
  hideTVGuide() {
    if (typeof window.toggleTVGuide === 'function') {
      window.toggleTVGuide(false);
    }
  }
};

// Create a custom event for channel changes
export const notifyChannelChanged = () => {
  const event = new CustomEvent('channelChanged');
  document.dispatchEvent(event);
  console.log('Channel changed event dispatched');
};
