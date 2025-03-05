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
   * Show the menu button only if header is visible
   */
  show() {
    if (!this.menuButton || !this.header) return;
    
    // Get header visibility
    const headerStyle = window.getComputedStyle(this.header);
    const isHeaderVisible = headerStyle.display !== 'none' && parseFloat(headerStyle.opacity) > 0.5;
    
    if (isHeaderVisible) {
      // Only show menu if header is visible
      this.menuButton.style.display = 'block';
      this.menuButton.style.opacity = '1';
      this.menuButton.style.visibility = 'visible';
      this.menuButton.style.pointerEvents = 'auto';
      console.log('Menu button visibility synced with visible header');
    } else {
      // Hide menu if header is not visible
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
  }
};

// Create a custom event for channel changes
export const notifyChannelChanged = () => {
  const event = new CustomEvent('channelChanged');
  document.dispatchEvent(event);
  console.log('Channel changed event dispatched');
};
