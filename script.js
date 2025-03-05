// Import the MenuManager for centralized menu control - v1.3
console.log('script.js loading - v1.3 (power sequence optimization)');
import { MenuManager } from './menu-manager.js';
console.log('MenuManager imported, checking state:', MenuManager);

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired - v1.3 - initializing components');
  
  // --- DOM Elements ---
  const powerButton = document.getElementById('powerButton');
  const landing = document.getElementById('landing');
  const landingName = document.getElementById('landingName');
  const landingSubtitle = document.getElementById('landingSubtitle');
  const mainContent = document.getElementById('mainContent');
  const header = document.getElementById('header');
  const menuButton = document.getElementById('menuButton');
  const tvGuide = document.getElementById('tvGuide');
  const closeGuide = document.getElementById('closeGuide');
  const guideItems = document.querySelectorAll('.tv-guide-list nav ul li');
  const staticOverlay = document.getElementById('staticOverlay');
  const clickSound = document.getElementById('clickSound');
  const backToTop = document.getElementById('backToTop');
  
  // Initialize MenuManager after all DOM elements are available
  try {
    console.log('About to initialize MenuManager');
    
    // Validate all required elements
    const requiredElements = {
      menuButton,
      landing,
      mainContent,
      header,
      powerButton,
      staticOverlay,
      landingName,
      landingSubtitle
    };
    
    // Check each element and log its status
    const missingElements = Object.entries(requiredElements)
      .filter(([name, element]) => !element)
      .map(([name]) => name);
    
    if (missingElements.length > 0) {
      throw new Error(`Required DOM elements missing: ${missingElements.join(', ')}`);
    }
    
    // Initialize MenuManager with menu hidden initially
    MenuManager.init();
    MenuManager.hide(); // Ensure menu starts hidden
    console.log('MenuManager initialized successfully');
    
    // Track power sequence state
    let powerSequenceStarted = false;
    let powerSequenceComplete = false;
    
    // Watch for landing visibility changes
    const landingObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          const isHidden = landing.style.display === 'none' || getComputedStyle(landing).display === 'none';
          if (isHidden && powerSequenceStarted && !powerSequenceComplete) {
            console.log('Landing hidden during power sequence');
            // Ensure menu stays hidden during transition
            MenuManager.hide();
            landingObserver.disconnect();
          }
        }
      });
    });
    
    // Watch for power button state
    const powerObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isPowerOn = powerButton.classList.contains('power-on');
          if (isPowerOn && !powerSequenceStarted) {
            console.log('Power button state changed to ON');
            powerSequenceStarted = true;
            // Ensure menu is hidden at start of power sequence
            MenuManager.hide();
          }
        }
      });
    });
    
    // Watch for main content visibility
    const mainContentObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          const isVisible = mainContent.style.display === 'block' && 
                           parseFloat(getComputedStyle(mainContent).opacity) > 0;
          if (isVisible && powerSequenceStarted && !powerSequenceComplete) {
            console.log('Main content visible, completing power sequence');
            powerSequenceComplete = true;
            mainContentObserver.disconnect();
          }
        }
      });
    });
    
    // Start all observers
    landingObserver.observe(landing, { attributes: true });
    powerObserver.observe(powerButton, { attributes: true });
    mainContentObserver.observe(mainContent, { attributes: true });
    
    console.log('All observers initialized');
  } catch (error) {
    console.error('Error initializing MenuManager:', error);
  }

  let landingSequenceComplete = false;
  let autoScrollTimeout;
  let currentChannel = null;

  // --- Channel-Click Sounds ---
  const channelSounds = Array.from({ length: 11 }, (_, i) => {
    const audio = new Audio(`audio/channel-click${i + 1}.aif`);
    audio.preload = 'auto';
    return audio;
  });
  const playRandomChannelSound = () => {
    const randomIndex = Math.floor(Math.random() * channelSounds.length);
    channelSounds[randomIndex].play().catch(error => console.error('Audio playback failed:', error));
  };
  
  // Volume control functionality removed

  // --- Analytics Reporting using Web Vitals ---
  const sendToAnalytics = (metricName, metric) => {
    const body = { [metricName]: metric.value, path: window.location.pathname };
    navigator.sendBeacon('/analytics', JSON.stringify(body));
    console.log(`Tracked ${metricName}:`, metric.value);
  };
  webVitals.getCLS(metric => sendToAnalytics('CLS', metric));
  webVitals.getFID(metric => sendToAnalytics('FID', metric));
  webVitals.getLCP(metric => sendToAnalytics('LCP', metric));

  // --- Haptic Feedback ---
  const triggerHaptic = () => {
    try {
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
      }
    } catch (e) {
      console.log("Vibration API not supported");
    }
  };

  // --- Swipe Navigation ---
  let touchStartX = 0;
  let touchStartY = 0; // Track vertical position to detect diagonal swipes
  
  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true }); // Add passive flag for better performance on iOS
  
  document.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(touchStartY - touchEndY);
    
    // Only trigger horizontal swipe if vertical movement is minimal (prevent accidental swipes)
    if (Math.abs(diffX) > 70 && diffY < 50) {
      const direction = diffX > 0 ? 'next' : 'prev';
      navigateChannels(direction);
    }
  }, { passive: true });
  const navigateChannels = direction => {
    const sections = Array.from(document.querySelectorAll('.channel-section'));
    const currentIndex = sections.findIndex(sec => sec.id === currentChannel);
    let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    targetIndex = Math.max(0, Math.min(sections.length - 1, targetIndex));
    sections[targetIndex].scrollIntoView({ behavior: 'smooth' });
    console.log(`Now viewing channel ${targetIndex + 1}`);
    triggerHaptic();
  };

  // --- Dynamic Module Loading ---
  const loadChannelContent = async moduleName => {
  try {
    console.log(`Loading module for ${moduleName}...`);
    let module;
    if (moduleName === 'home') {
      // Preload Channel 1 with higher priority
      console.log('Loading home module for Channel 1');
      module = await import(`./channels/ch1/home.js`);
    } else if (moduleName === 'ch2') {
      module = await import(`./channels/ch2/ch2.js`);
    } else if (moduleName === 'skill games') {
      // Reset any global styles that might have been set by the game
      resetMenuStyles();
      module = await import(`./channels/ch3/ch3.js`);
    } else if (moduleName === 'under the influence') {
      module = await import(`./channels/ch4/ch4.js`);
    }
    
    if (module) {
      console.log(`Module for ${moduleName} loaded successfully, initializing...`);
      await module.init();
      console.log(`Module for ${moduleName} initialized`);
      
      // Ensure menu button visibility after loading any channel
      // Use MenuManager instead of the old function
      MenuManager.show();
      
      // Notify that channel has changed to trigger any observers
      // Notify that channel has changed
      MenuManager.notifyChannelChanged();
    } else {
      console.warn(`No module definition found for ${moduleName}`);
    }
  } catch (err) {
    console.error(`Module for ${moduleName} failed to load or initialize:`, err);
  }
};

// Function to reset menu button styles and ensure its visibility
const resetMenuStyles = () => {
  if (menuButton) {
    menuButton.style.fontSize = ''; 
    menuButton.style.padding = '10px 15px';
    menuButton.style.border = '2px solid var(--primary-color)';
    menuButton.style.color = 'var(--primary-color)';
    menuButton.style.background = 'transparent';
    
    // Let MenuManager handle visibility
    MenuManager.show();
  }
};


  // --- Service Worker Registration ---
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then(reg => console.log('Service Worker registered:', reg))
        .catch(err => console.error('Service Worker registration failed:', err));
    });
  }
  
  // --- Power Button Touch Glow ---
  powerButton.addEventListener('touchstart', () => powerButton.classList.add('touch-glow'));
  powerButton.addEventListener('touchend', () =>
    setTimeout(() => powerButton.classList.remove('touch-glow'), 200)
  );

  // --- Reveal Main Content & Reveal Header ---
  const revealMainContent = () => {
    console.log('Revealing main content...');
    
    // Validate required elements
    if (!mainContent || !header) {
      console.error('Critical: Required elements missing for reveal');
      return;
    }
    
    // Function to show main content
    const showMainContent = () => {
      console.log('Showing main content');
      mainContent.style.display = "block";
      document.body.style.overflow = "auto";
      mainContent.style.opacity = 1;
      
      // Show header with animation
      gsap.to(header, { 
        duration: 0.5, 
        opacity: 1,
        onComplete: () => {
          console.log('Header reveal complete');
          // MenuManager will handle menu visibility separately
        }
      });
    };
    
    // Check if landing is already hidden
    if (!landing || landing.style.display === "none" || getComputedStyle(landing).display === "none") {
      console.log('Landing already hidden, showing content directly');
      showMainContent();
      return;
    }
    
    // Normal animation sequence when landing is visible
    console.log('Starting landing transition');
    window.scrollTo({ top: mainContent.offsetTop, behavior: "smooth" });
    
    gsap.to(landing, {
      duration: 0.5,
      opacity: 0,
      onComplete: () => {
        if (landing) landing.style.display = "none";
        showMainContent();
      }
    });
  };
  
  // Function to make menu button follow header visibility
  const ensureMenuButtonVisibility = () => {
    // Let MenuManager handle initial visibility
    if (MenuManager) {
      console.log('Deferring to MenuManager for visibility control');
      return;
    }
    
    // Fallback visibility control if MenuManager is not available
    if (menuButton) {
      console.log('Using fallback visibility control');
      menuButton.style.display = "none";
      menuButton.style.opacity = "0";
      
      // Set up menu button styles
      menuButton.style.position = "fixed";
      menuButton.style.top = "10px";
      menuButton.style.right = "20px";
      menuButton.style.zIndex = "999999";
      
      // Ensure tap target size is at least 44x44px for iOS Safari
      menuButton.style.minHeight = "44px";
      menuButton.style.minWidth = "44px";
      
      // Set up click handler
      const menuClickHandler = () => {
        const isCurrentlyVisible = tvGuide.style.display === 'flex' && parseFloat(tvGuide.style.opacity || 0) === 1;
        toggleTVGuide(!isCurrentlyVisible);
      };
      
      menuButton.onclick = menuClickHandler;
      menuButton.addEventListener('touchend', (e) => {
        e.preventDefault(); // Prevent double-tap issues on iOS
        menuClickHandler();
      }, { passive: false });
    }
    
    // Ensure TV Guide has the correct styles
    if (tvGuide) {
      tvGuide.style.position = 'fixed';
      tvGuide.style.top = '0';
      tvGuide.style.left = '0';
      tvGuide.style.width = '100%';
      tvGuide.style.height = '100%';
      tvGuide.style.zIndex = '100000';
      tvGuide.style.webkitOverflowScrolling = 'touch';
    }
  };

  // ---------------------------------------------
  // POWER BUTTON CLICK HANDLING - ES Module Safe Implementation
  // ---------------------------------------------
  
  // Global click handler for diagnostics (defined before use)
  const handleGlobalClick = function(e) {
    console.log('Document received click on:', e.target.tagName, e.target.id || '(no id)');
  };
  
  // Set up power button handlers immediately
  console.log('Setting up power button handlers');
  setupPowerButtonHandlers();
  
  // Add diagnostic click handler only in debug mode
  if (window.location.search.includes('debug')) {
    document.addEventListener('click', handleGlobalClick, true);
  }
  
  function setupPowerButtonHandlers() {
    console.log('Setting up power button handlers...');
    
    // Ensure power button exists
    if (!powerButton) {
      console.error('Critical: Power button not found!');
      return;
    }
    
    // Clear any existing click handlers
    const clearHandler = (element) => {
      if (element) {
        element.onclick = null;
        const clone = element.cloneNode(true);
        element.parentNode.replaceChild(clone, element);
        return clone;
      }
      return null;
    };
    
    // Get fresh references after clearing handlers
    const elements = {
      powerButton: clearHandler(powerButton),
      powerClickHelper: clearHandler(document.getElementById('powerClickHelper')),
      powerPath: clearHandler(document.getElementById('powerPath')),
      powerLine: clearHandler(document.getElementById('powerLine')),
      powerSvg: clearHandler(document.getElementById('powerSvg'))
    };
    
    console.log('Power elements refreshed:', {
      powerButton: !!elements.powerButton,
      powerClickHelper: !!elements.powerClickHelper,
      powerPath: !!elements.powerPath,
      powerLine: !!elements.powerLine,
      powerSvg: !!elements.powerSvg
    });
    
    // Update global reference
    if (elements.powerButton) powerButton = elements.powerButton;
    
    // Set up click handler function
    const handlePowerClick = (e) => {
      console.log('Power click detected on:', e.target.id || e.target.tagName);
      e.preventDefault();
      e.stopPropagation();
      
      // Prevent multiple triggers
      if (powerButton.classList.contains('power-on')) {
        console.log('Power already on, ignoring click');
        return false;
      }
      
      triggerPowerSequence();
      return false;
    };
    
    // Apply handlers to all power elements
    Object.values(elements).forEach(element => {
      if (element) {
        element.style.cursor = 'pointer';
        element.addEventListener('click', handlePowerClick, { capture: true });
      }
    });
    
    // Additional setup for main power button
    if (elements.powerButton) {
      elements.powerButton.style.position = 'relative';
      elements.powerButton.style.overflow = 'visible';
      elements.powerButton.style.zIndex = '10';
    }
    
    // Additional setup for click helper
    if (elements.powerClickHelper) {
      elements.powerClickHelper.style.zIndex = '20';
      elements.powerClickHelper.style.width = '100%';
      elements.powerClickHelper.style.height = '100%';
      
      if (window.location.search.includes('debug')) {
        elements.powerClickHelper.style.backgroundColor = 'rgba(255,0,0,0.2)';
      }
    }
    
    console.log('Power button handlers setup complete');
  }
  
  // Main unified power sequence function that all click handlers point to
  function triggerPowerSequence() {
    console.log('🔥 Power sequence triggered!');
    
    // Validate all required elements
    const requiredElements = {
      powerButton,
      landing,
      mainContent,
      header,
      staticOverlay,
      landingName,
      landingSubtitle,
      menuButton
    };
    
    // Check each element
    const missingElements = Object.entries(requiredElements)
      .filter(([name, element]) => !element)
      .map(([name]) => name);
    
    if (missingElements.length > 0) {
      console.error('Critical elements missing:', missingElements.join(', '));
      return;
    }
    
    // Prevent multiple triggers
    if (powerButton.classList.contains('power-on')) {
      console.log('Power already on, ignoring trigger');
      return;
    }
    
    // Ensure menu is hidden before power sequence
    if (MenuManager) {
      MenuManager.hide();
    }
    
    // Mark power as on
    powerButton.classList.add('power-on');
    
    // Play click sound if available
    if (clickSound) {
      clickSound.play().catch(error => console.error('Click sound failed:', error));
    }
    
    // Disable all power-related click handlers
    const powerElements = [
      powerButton,
      document.getElementById('powerClickHelper'),
      document.getElementById('powerPath'),
      document.getElementById('powerLine'),
      document.getElementById('powerSvg')
    ];
    
    powerElements.forEach(element => {
      if (element) {
        element.style.pointerEvents = 'none';
        element.onclick = null;
      }
    });
    
    console.log('Starting power animation sequence');
    startPowerAnimations();
  }
  
  // This duplicate declaration removed - now using the one declared at the top
  
  // Separate animation sequence function
  function startPowerAnimations() {
    console.log('Power animations starting...');
    
    // Ensure required elements exist
    if (!powerButton || !landing || !mainContent || !staticOverlay || !landingName || !landingSubtitle) {
      console.error('Required elements missing for power animation');
      return;
    }
    
    // Create a single timeline for all animations
    const tl = gsap.timeline({
      onComplete: () => {
        console.log('Power animation sequence complete');
        landingSequenceComplete = true;
        
        // Initialize menu visibility after power on
        if (MenuManager) {
          console.log('Initializing menu visibility after power on');
          try {
            // Notify MenuManager of power on state
            MenuManager.powerOn();
            console.log('MenuManager power on complete');
          } catch (error) {
            console.error('Error in power sequence:', error);
          }
        } else {
          console.error('MenuManager not available for initialization');
        }
      }
    });
    
    // Initial power button fade out
    tl.to(powerButton, {
      duration: 0.3,
      opacity: 0,
      ease: "power2.out",
      onComplete: () => {
        powerButton.style.display = "none";
        landing.style.display = "none";
        
        // Reveal main content
        revealMainContent();
      }
    });
    
    // Flash sequence
    tl.to(landing, { duration: 0.15, backgroundColor: "#fff", ease: "power2.out" })
      .to(landing, { duration: 0.15, backgroundColor: "var(--bg-color)", ease: "power2.in" })
      .to(staticOverlay, { 
        duration: 0.2, 
        opacity: 0.3,
        onComplete: () => {
          console.log('Static overlay effect started');
          // Ensure menu is hidden during static effect
          if (MenuManager) MenuManager.hide();
        }
      })
      .to(staticOverlay, { 
        duration: 0.2, 
        opacity: 0,
        onComplete: () => console.log('Static overlay effect complete')
      })
      // Landing sequence
      .to(landingName, { 
        duration: 1.2, 
        width: "100%", 
        opacity: 1, 
        ease: "power2.out",
        onStart: () => console.log('Landing name animation started')
      })
      .to(landingSubtitle, { 
        duration: 0.7, 
        opacity: 1, 
        ease: "power2.out",
        onComplete: () => {
          console.log('Landing subtitle revealed');
          // Show menu after subtitle animation
          if (MenuManager) MenuManager.show();
        }
      }, "-=0.3")
      .to("#landingSubtitle .subtitle-item", { 
        duration: 1, 
        opacity: 1, 
        ease: "power2.out", 
        stagger: 0.5,
        onComplete: () => console.log('Landing sequence complete')
      }, "+=0.3");
  };
  
  // Power button is already initialized in setupPowerButtonHandlers
  
  // Handle scroll events for revealing content
  window.addEventListener('scroll', () => {
    if (landingSequenceComplete && landing.style.display !== "none") {
      clearTimeout(autoScrollTimeout);
      revealMainContent();
    }
  }, { once: true, passive: true });

  // --- Back to Top Button ---
  const toggleBackToTop = () => {
    backToTop.style.display = window.pageYOffset > 300 ? 'block' : 'none';
  };
  window.addEventListener('scroll', throttle(toggleBackToTop, 100));
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // --- TV Guide Menu Toggle ---
  const toggleTVGuide = show => {
    // Force the menu button to remain hidden until explicitly shown
    // by the ensureMenuButtonVisibility function under the right conditions
    if (menuButton) {
      // Don't automatically show the menu button here
      console.log("Menu button visibility check in toggleTVGuide");
    }
    
    // Make sure TV Guide exists
    if (!tvGuide) {
      console.error("TV Guide element not found");
      return;
    }
    
    if (show) {
      // Force display to flex regardless of current state
      tvGuide.style.display = 'flex';
      // Make the TV guide appear on top of EVERYTHING
      tvGuide.style.zIndex = '100000'; // Higher than both header and menu button
      // Ensure TV Guide is fixed at top
      tvGuide.style.position = 'fixed';
      // Ensure it covers the entire viewport
      tvGuide.style.top = '0';
      tvGuide.style.left = '0';
      tvGuide.style.width = '100%';
      tvGuide.style.height = '100%';
      
      // iOS Safari scroll fix
      tvGuide.style.webkitOverflowScrolling = 'touch';
      tvGuide.style.overflowY = 'auto';
      
      // Prevent page scrolling when TV guide is open
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      // Log visibility state for debugging
      console.log("Opening TV Guide");
      
      // Delay opacity change to allow display change to take effect
      setTimeout(() => {
        tvGuide.style.opacity = 1;
        tvGuide.setAttribute('aria-hidden', 'false');
      }, 10);
    } else {
      tvGuide.style.opacity = 0;
      tvGuide.setAttribute('aria-hidden', 'true');
      
      // Re-enable page scrolling when TV guide is closed
      document.body.style.overflow = 'auto';
      document.body.style.position = '';
      document.body.style.width = '';
      
      // Log visibility state for debugging
      console.log("Closing TV Guide");
      
      setTimeout(() => { tvGuide.style.display = 'none'; }, 500);
    }
  };
  
  // Remove initial event listeners to prevent early triggering
  menuButton.removeEventListener('click', () => {});
  menuButton.removeEventListener('touchend', () => {});
  
  // Register event listeners only after proper setup
  const setupMenuButtonEvents = () => {
    if (!menuButton) return;
    
    // Toggle guide when menu button is clicked
    menuButton.addEventListener('click', () => {
      console.log("Menu button clicked");
      // Check if TV Guide exists first
      if (!tvGuide) {
        console.error("TV Guide element not found when clicking menu button");
        return;
      }
      const isCurrentlyVisible = tvGuide.style.display === 'flex' && parseFloat(tvGuide.style.opacity || 0) === 1;
      console.log("TV Guide current visibility state:", isCurrentlyVisible);
      toggleTVGuide(!isCurrentlyVisible);
    });
    
    // Add touchend handler for iOS Safari
    menuButton.addEventListener('touchend', (e) => {
      console.log("Menu button touch event");
      e.preventDefault(); // Prevent double events on iOS
      if (!tvGuide) {
        console.error("TV Guide element not found when touching menu button");
        return;
      }
      const isCurrentlyVisible = tvGuide.style.display === 'flex' && parseFloat(tvGuide.style.opacity || 0) === 1;
      toggleTVGuide(!isCurrentlyVisible);
    }, { passive: false });
    
    console.log("Menu button event listeners properly set up");
  };
  
  // Delay setting up menu button events until after initial DOM operations
  setTimeout(setupMenuButtonEvents, 1000);
  
  closeGuide.addEventListener('click', () => toggleTVGuide(false));
  // Channel descriptions for TV Guide
  const channelDescriptions = {
    'section1': 'Explore Kayron\'s portfolio home, featuring skills and professional background.',
    'section2': 'Discover creative works and brand strategies in a showcase format.',
    'section3': 'Interactive games testing your creative problem-solving skills and approach.',
    'section4': 'Examine influences and inspirations that shape creative direction.'
  };
  
  // Make TV Guide channels clickable
  document.querySelectorAll('.tv-guide-channel').forEach(item => {
    // Highlight effect on hover to show current selection
    item.addEventListener('mouseenter', () => {
      const targetId = item.getAttribute('data-target');
      const currentInfoText = document.getElementById('current-channel-info');
      if (currentInfoText) {
        currentInfoText.textContent = channelDescriptions[targetId] || 'Channel information unavailable';
      }
      
      // Enhance selection effect
      item.style.backgroundColor = 'rgba(62, 146, 204, 0.15)';
      item.style.transition = 'background-color 0.2s ease-out';
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.backgroundColor = '';
    });
    
    // Channel selection handling
    item.addEventListener('click', () => {
      // Get the target section before triggering audio cleanup
      const targetId = item.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);
      
      // Add selection effect
      gsap.to(item, {
        backgroundColor: 'rgba(62, 146, 204, 0.3)',
        boxShadow: '0 0 15px rgba(62, 146, 204, 0.4)',
        duration: 0.3
      });
      
      // Get the channel title for logging
      const channelTitle = item.querySelector('.channel-title') ? 
                          item.querySelector('.channel-title').textContent : 
                          `Channel ${targetId.slice(-1)}`;
      
      // Check if we're leaving channel 3 (section3)
      if (currentChannel === 'section3' && targetId !== 'section3') {
        console.log("Leaving Channel 3 from TV guide, doing additional audio cleanup");
        // Explicitly stop any gameshow audio that might be playing
        document.querySelectorAll('audio').forEach(audio => {
          if (audio.src && (audio.src.includes('gameshow.aif') || 
                           audio.src.includes('ka-ching.mp3') || 
                           audio.src.includes('click.mp3'))) {
            console.log("Force stopping audio:", audio.src);
            audio.pause();
            audio.currentTime = 0;
            audio.loop = false;
          }
        });
        // Call global cleanup event
        resetMenuStyles();
      }
      
      // Dispatch channel change event to stop any running audio (unless navigating to Ch3)
      if (targetId !== 'section3') {
        const channelChangeEvent = new Event('channelChange');
        document.dispatchEvent(channelChangeEvent);
      }
      
      if (targetSection) {
        // Create delayed closing effect for more TV-like experience
        setTimeout(() => {
          targetSection.scrollIntoView({ behavior: 'smooth' });
          
          // Close TV Guide with a slight delay for a more authentic TV experience
          setTimeout(() => {
            toggleTVGuide(false);
          }, 200);
          
          console.log(`Now viewing ${channelTitle}`);
          triggerHaptic();
        }, 500);
      }
    });
  });

  // --- Intersection Observer for Channel Transitions ---
  const observerOptions = { root: null, threshold: 0.7 };
  const observerCallback = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const newChannel = entry.target.id;
        if (currentChannel !== newChannel) {
          // Dispatch channel change event to stop any running audio (only if not entering Channel 3)
          if (newChannel !== 'section3') {
            const channelChangeEvent = new Event('channelChange');
            document.dispatchEvent(channelChangeEvent);
          }
          
          console.log(`Channel change: from ${currentChannel} to ${newChannel}`);
          
          // Extra cleanup for channel 3 audio - only do this when leaving Channel 3
          if (currentChannel === 'section3' && newChannel !== 'section3') {
            console.log("Leaving Channel 3, doing additional audio cleanup");
            // Explicitly stop any gameshow audio that might be playing
            document.querySelectorAll('audio').forEach(audio => {
              if (audio.src && (audio.src.includes('gameshow.aif') || 
                               audio.src.includes('ka-ching.mp3') || 
                               audio.src.includes('click.mp3'))) {
                console.log("Force stopping audio:", audio.src);
                audio.pause();
                audio.currentTime = 0;
                audio.loop = false;
              }
            });
            
            // Reset menu button styles
            resetMenuStyles();
          }
          
          // Hide all channel numbers first
          document.querySelectorAll('.channel-number-overlay').forEach(overlay => {
            overlay.style.display = 'none';
          });
          
          // Only show the current channel number
          const currentOverlay = document.querySelector(`#${newChannel} .channel-number-overlay`);
          if (currentOverlay) {
            currentOverlay.style.display = 'block';
          }
          
          // Always ensure menu button visibility using MenuManager
          MenuManager.show();
          
          // Notify system about channel change for any observers
          // Notify system about channel change
          MenuManager.notifyChannelChanged();
          
          // Make sure the TV Guide has the right styles even if not visible
          if (tvGuide) {
            tvGuide.style.position = 'fixed';
            tvGuide.style.top = '0';
            tvGuide.style.left = '0';
            tvGuide.style.width = '100%';
            tvGuide.style.height = '100%';
            tvGuide.style.zIndex = '999998';
          }
          
          currentChannel = newChannel;
          playRandomChannelSound();
          triggerChannelStatic();
          animateChannelNumber(newChannel);
          console.log(`Now viewing channel ${newChannel.slice(-1)}`);
          const moduleName = entry.target.dataset.module;
          if (moduleName) {
            loadChannelContent(moduleName);
          }
          distortAndWarpContent();
          
          // Ensure menu button visibility after channel content has loaded
          setTimeout(() => {
            // Use MenuManager for consistent visibility across all channels
            MenuManager.show();
              
            // Extra check for button functionality
            if (menuButton) {
              menuButton.style.pointerEvents = 'auto';
              menuButton.style.cursor = 'pointer';
            }
          }, 800);
        }
      }
    });
  };
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  document.querySelectorAll('.channel-section').forEach(section => observer.observe(section));

  // --- Trigger Static Overlay Effect ---
  const triggerChannelStatic = () => {
    // Randomize static effect intensity for more TV-like behavior
    const staticIntensity = 0.3 + (Math.random() * 0.2);
    
    // First flash of static
    gsap.to(staticOverlay, {
      duration: 0.15,
      opacity: staticIntensity,
      onComplete: () => {
        // Brief pause
        gsap.to(staticOverlay, { 
          duration: 0.05, 
          opacity: 0.1,
          onComplete: () => {
            // Second flash of static - more TV-like effect
            gsap.to(staticOverlay, {
              duration: 0.15,
              opacity: staticIntensity * 0.8,
              onComplete: () => gsap.to(staticOverlay, { 
                duration: 0.2, 
                opacity: 0 
              })
            });
          }
        });
      }
    });
    
  };

  // --- Animate Channel Number Overlay ---
  const animateChannelNumber = channelId => {
    const channelOverlay = document.querySelector(`#${channelId} .channel-number-overlay`);
    if (channelOverlay) {
      // Make sure channel number is visible
      channelOverlay.style.display = 'block';
      
      // More TV-like animation sequence
      const tl = gsap.timeline();
      tl.fromTo(channelOverlay, 
        { scale: 0.8, opacity: 0, filter: "brightness(1)" },
        { scale: 1, opacity: 1, filter: "brightness(2)", duration: 0.3, ease: "back.out(1.2)" })
        .to(channelOverlay, { scale: 1.2, duration: 0.2, ease: "power1.inOut" })
        .to(channelOverlay, { scale: 1, duration: 0.2, ease: "power1.out" })
        .to(channelOverlay, { filter: "brightness(1)", duration: 0.3 });
    }
  };

  // --- Distort/Warp Content on Channel Change ---
  const distortAndWarpContent = () => {
    // Create more authentic TV channel change distortion effect
    const tl = gsap.timeline();
    
    // First stage: blur and vertical distortion
    tl.fromTo(
      mainContent,
      { filter: "none", transform: "skewX(0deg)" },
      { filter: "blur(4px) contrast(1.3)", transform: "skewY(-2deg) skewX(3deg)", duration: 0.15, ease: "power1.in" }
    )
    // Second stage: horizontal noise
    .to(
      mainContent,
      { filter: "blur(2px) contrast(1.2) hue-rotate(5deg)", transform: "skewX(7deg)", duration: 0.12 }
    )
    // Third stage: color shift and normalize
    .to(
      mainContent,
      { filter: "blur(0px) contrast(1.1) hue-rotate(0deg)", transform: "skewX(0deg)", duration: 0.2, ease: "power2.out" }
    )
    // Final stage: back to normal
    .to(
      mainContent,
      { filter: "none", transform: "skewX(0deg)", duration: 0.25, ease: "power2.out" }
    );
  };

  // --- Intersection Observer for YouTube Video Audio Control ---
  const channel1 = document.getElementById("section1");
  const ytObserverOptions = {
    root: null,
    threshold: 0.7
  };
  const ytObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target.id === "section1") {
        if (entry.intersectionRatio >= 0.7) {
          if (youtubePlayer && typeof youtubePlayer.unMute === "function") {
            youtubePlayer.unMute();
            console.log("Channel 1 active: Unmuting video.");
          }
        } else {
          if (youtubePlayer && typeof youtubePlayer.mute === "function") {
            youtubePlayer.mute();
            console.log("Channel 1 inactive: Muting video.");
          }
        }
      }
    });
  }, ytObserverOptions);
  if (channel1) {
    ytObserver.observe(channel1);
  }

  // --- Intersection Observer for Channel 4 YouTube Video Audio Control ---
  const channel4 = document.getElementById("section4");
  const channel4ObserverOptions = { root: null, threshold: 0.7 };
  const channel4Observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target.id === "section4") {
        if (entry.intersectionRatio >= 0.7) {
          if (window.channel4Player && typeof window.channel4Player.unMute === "function") {
            window.channel4Player.unMute();
            console.log("Channel 4 active: Unmuting video.");
          }
        } else {
          if (window.channel4Player && typeof window.channel4Player.mute === "function") {
            window.channel4Player.mute();
            console.log("Channel 4 inactive: Muting video.");
          }
        }
      }
    });
  }, channel4ObserverOptions);
  if (channel4) {
    channel4Observer.observe(channel4);
  }
  
  // Initialize menu as hidden before TV powers on
  const initMenuHidden = () => {
    if (menuButton) {
      menuButton.style.display = "none";
      menuButton.style.visibility = "hidden";
      menuButton.style.opacity = "0";
    }
  };
  // Only hide initially - MenuManager will take over after power on
  initMenuHidden();
  
  // After TV powers on, MenuManager will control all menu visibility
  
  // Set initial intersection observer to detect when we first see Channel 1
  setTimeout(() => {
    // Only run observer after the landing sequence
    if (landingSequenceComplete) {
      const initialObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target.id === 'section1') {
            console.log("Channel 1 initially visible, checking header visibility");
            // If header is visible, show menu button
            if (window.getComputedStyle(header).opacity > 0.9) {
              console.log("Header is visible, showing menu button");
              ensureMenuButtonVisibility();
            }
          }
        });
      }, { threshold: 0.7 });
      
      const section1 = document.getElementById('section1');
      if (section1) {
        initialObserver.observe(section1);
      }
    }
  }, 2500);
  
  // Preload Channel 4 ("under the influence") so its video is ready
  setTimeout(() => {
    loadChannelContent('under the influence');
  }, 2000);
  
  // --- Throttle Utility Function ---
  function throttle(fn, wait) {
    let lastTime = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn.apply(this, args);
      }
    };
  }
}); // End of DOMContentLoaded event listener
