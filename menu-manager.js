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
   * Show the menu button on all channels after initial loading
   */
  show() {
    if (!this.menuButton) return;
    
    // Get the current channel section that's visible
    const sections = Array.from(document.querySelectorAll('.channel-section'));
    const currentSection = sections.find(section => {
      const rect = section.getBoundingClientRect();
      return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
    });
    
    // If any channel section is visible, show the menu
    if (currentSection || document.body.classList.contains('tv-on')) {
      this.menuButton.style.display = 'block';
      this.menuButton.style.opacity = '1';
      this.menuButton.style.visibility = 'visible';
      this.menuButton.style.pointerEvents = 'auto';
      
      // Ensure proper position
      this.menuButton.style.position = "fixed";
      this.menuButton.style.top = "10px";
      this.menuButton.style.right = "20px";
      this.menuButton.style.zIndex = "999999";
      
      // Ensure tap target size is at least 44x44px for iOS Safari
      this.menuButton.style.minHeight = "44px";
      this.menuButton.style.minWidth = "44px";
      
      console.log('Menu button visible for all channels');
    } else {
      // Only hide during initial load
      this.menuButton.style.display = 'none';
      this.menuButton.style.opacity = '0';
      this.menuButton.style.visibility = 'hidden';
      console.log('Menu button hidden during initial load');
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
