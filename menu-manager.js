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
    this.bindEvents();
    console.log('MenuManager initialized');
    this.show(); // Ensure visibility on initialization
  },
  
  /**
   * Bind event listeners for channel changes and menu interactions
   */
  bindEvents() {
    // Listen for channel change events
    document.addEventListener('channelChanged', () => {
      console.log('Channel changed event detected, ensuring menu visibility');
      this.show();
    });
    
    // Create a mutation observer to detect style changes that might hide the menu
    this.createVisibilityObserver();
    
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
   * Show the menu button
   */
  show() {
    if (this.menuButton) {
      this.menuButton.style.display = 'block';
      this.menuButton.style.opacity = '1';
      this.menuButton.style.visibility = 'visible';
      this.menuButton.style.pointerEvents = 'auto';
      console.log('Menu button visibility enforced');
    } else {
      console.warn('Menu button element not found');
    }
  },
  
  /**
   * Check and enforce menu visibility
   */
  ensureVisibility() {
    const menuButton = document.getElementById('menuButton'); // Refresh reference
    if (menuButton) {
      const computedStyle = window.getComputedStyle(menuButton);
      if (computedStyle.display === 'none' || parseFloat(computedStyle.opacity) < 0.5) {
        console.log('Periodic check: Menu hidden, restoring visibility');
        this.show();
      }
    }
  }
};

// Create a custom event for channel changes
export const notifyChannelChanged = () => {
  const event = new CustomEvent('channelChanged');
  document.dispatchEvent(event);
  console.log('Channel changed event dispatched');
};
