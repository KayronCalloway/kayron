import { dom, sound, setupEventListeners, animations, errorTracker } from './utils.js';
import channelManager from './channelManager.js';

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

/**
 * Initialize the application
 */
function initApp() {
  // Register channel modules
  registerChannels();
  
  // Initialize DOM elements cache
  cacheElements();
  
  // Application state
  const state = {
    landingSequenceComplete: false,
    autoScrollTimeout: null,
    currentChannel: null
  };
  
  // Set up event listeners
  setupAppEventListeners(state);
  
  // Initialize intersection observers for channel detection
  setupChannelObservers(state);
  
  // Preload assets
  preloadAssets();
  
  // Set up analytics
  setupAnalytics();
  
  console.log('TV Portfolio initialized successfully');
}

/**
 * Register all channel modules with the channel manager
 */
function registerChannels() {
  channelManager.registerAll({
    'home': { 
      path: './channels/ch1/home.js',
      sectionId: 'section1' 
    },
    'ch2': { 
      path: './channels/ch2/ch2.js',
      sectionId: 'section2' 
    },
    'skill games': { 
      path: './channels/ch3/ch3.js',
      sectionId: 'section3' 
    },
    'under the influence': { 
      path: './channels/ch4/ch4.js',
      sectionId: 'section4',
      preload: true
    }
  });
}

/**
 * Cache commonly used DOM elements
 */
function cacheElements() {
  // UI Elements
  dom.get('#powerButton');
  dom.get('#landing');
  dom.get('#landingName');
  dom.get('#landingSubtitle');
  dom.get('#mainContent');
  dom.get('#header');
  dom.get('#menuButton');
  dom.get('#tvGuide');
  dom.get('#closeGuide');
  dom.get('#staticOverlay');
  dom.get('#clickSound');
  dom.get('#backToTop');
  
  // Channel sections
  dom.get('#section1');
  dom.get('#section2');
  dom.get('#section3');
  dom.get('#section4');
  
  // Guide items
  dom.getAll('.tv-guide-list nav ul li');
}

/**
 * Setup event listeners for the application
 * @param {Object} state - Application state object
 */
function setupAppEventListeners(state) {
  const powerButton = dom.get('#powerButton');
  const landing = dom.get('#landing');
  const mainContent = dom.get('#mainContent');
  const menuButton = dom.get('#menuButton');
  const tvGuide = dom.get('#tvGuide');
  const closeGuide = dom.get('#closeGuide');
  const backToTop = dom.get('#backToTop');
  const guideItems = dom.getAll('.tv-guide-list nav ul li');
  
  // Power button click handler
  if (powerButton) {
    powerButton.addEventListener('click', () => {
      // Play click sound
      sound.play('./audio/click.mp3');
      
      // Start landing sequence
      startLandingSequence(state);
    });
    
    // Touch effects for power button
    powerButton.addEventListener('touchstart', () => powerButton.classList.add('touch-glow'));
    powerButton.addEventListener('touchend', () => 
      setTimeout(() => powerButton.classList.remove('touch-glow'), 200)
    );
  }
  
  // Menu button click handler
  if (menuButton && tvGuide) {
    menuButton.addEventListener('click', () => {
      const isCurrentlyVisible = tvGuide.style.display === 'flex' && 
                                parseFloat(tvGuide.style.opacity) === 1;
      toggleTVGuide(!isCurrentlyVisible);
    });
  }
  
  // Close guide button
  if (closeGuide) {
    closeGuide.addEventListener('click', () => toggleTVGuide(false));
  }
  
  // Guide item click handlers
  if (guideItems.length) {
    guideItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetSection = document.getElementById(item.getAttribute('data-target'));
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
          toggleTVGuide(false);
          
          // Get channel title from DOM
          const channelTitle = item.querySelector('.channel-title')?.textContent || 'channel';
          console.log(`Now viewing ${channelTitle}`);
          
          // Haptic feedback
          triggerHaptic();
        }
      });
    });
  }
  
  // Scroll handler for landing sequence
  window.addEventListener('scroll', () => {
    if (state.landingSequenceComplete && landing.style.display !== "none") {
      clearTimeout(state.autoScrollTimeout);
      revealMainContent();
    }
  }, { once: true, passive: true });
  
  // Back to top button
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    
    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', throttle(() => {
      backToTop.style.display = window.pageYOffset > 300 ? 'block' : 'none';
    }, 100));
  }
  
  // Swipe navigation
  setupSwipeNavigation();
}

/**
 * Start the landing sequence animation
 * @param {Object} state - Application state object
 */
function startLandingSequence(state) {
  const powerButton = dom.get('#powerButton');
  const landing = dom.get('#landing');
  const landingName = dom.get('#landingName');
  const landingSubtitle = dom.get('#landingSubtitle');
  const staticOverlay = dom.get('#staticOverlay');
  
  // Disable power button to prevent multiple clicks
  if (powerButton) {
    powerButton.style.pointerEvents = 'none';
    
    // Fade out power button
    gsap.to(powerButton, {
      duration: 0.3,
      opacity: 0,
      ease: "power2.out",
      onComplete: () => powerButton.style.display = "none"
    });
  }
  
  // Create animation timeline
  const tl = gsap.timeline({
    onComplete: () => {
      state.landingSequenceComplete = true;
      state.autoScrollTimeout = setTimeout(() => {
        if (landing.style.display !== "none") revealMainContent();
      }, 3000);
    }
  });
  
  // Animation sequence
  tl.to(landing, { duration: 0.15, backgroundColor: "#fff", ease: "power2.out" })
    .to(landing, { duration: 0.15, backgroundColor: "var(--bg-color)", ease: "power2.in" })
    .to(staticOverlay, { duration: 0.2, opacity: 0.3 })
    .to(staticOverlay, { duration: 0.2, opacity: 0 })
    .to(landingName, { duration: 1.2, width: "100%", opacity: 1, ease: "power2.out" })
    .to(landingSubtitle, { duration: 0.7, opacity: 1, ease: "power2.out" }, "-=0.3")
    .to("#landingSubtitle .subtitle-item", { duration: 1, opacity: 1, ease: "power2.out", stagger: 0.5 }, "+=0.3");
}

/**
 * Reveal the main content after landing sequence
 */
function revealMainContent() {
  const landing = dom.get('#landing');
  const mainContent = dom.get('#mainContent');
  const header = dom.get('#header');
  const menuButton = dom.get('#menuButton');
  
  // Scroll to main content
  window.scrollTo({ top: mainContent.offsetTop, behavior: "smooth" });
  
  // Fade out landing and show main content
  gsap.to(landing, {
    duration: 0.5,
    opacity: 0,
    onComplete: () => {
      landing.style.display = "none";
      mainContent.style.display = "block";
      document.body.style.overflow = "auto";
      
      // Reveal header and menu button
      gsap.to(header, { duration: 0.5, opacity: 1 });
      gsap.to(menuButton, { duration: 0.5, opacity: 1 });
      
      // Ensure menu button is visible
      ensureMenuButtonVisibility();
    }
  });
}

/**
 * Function to ensure menu button is always visible and interactive
 */
function ensureMenuButtonVisibility() {
  const menuButton = dom.get('#menuButton');
  
  if (menuButton) {
    menuButton.style.display = "block";
    menuButton.style.opacity = "1";
    menuButton.style.zIndex = "var(--z-index-menu)";
    menuButton.style.position = "fixed";
    menuButton.style.pointerEvents = "auto";
    
    // Re-attach event listener to ensure it works
    menuButton.onclick = () => {
      const tvGuide = dom.get('#tvGuide');
      const isCurrentlyVisible = tvGuide.style.display === 'flex' && 
                                parseFloat(tvGuide.style.opacity) === 1;
      toggleTVGuide(!isCurrentlyVisible);
    };
  }
}

/**
 * Toggle TV Guide visibility
 * @param {boolean} show - Whether to show or hide the guide
 */
function toggleTVGuide(show) {
  const tvGuide = dom.get('#tvGuide');
  const menuButton = dom.get('#menuButton');
  
  // Always ensure menu button is visible
  if (menuButton) {
    menuButton.style.display = 'block';
    menuButton.style.opacity = '1';
    menuButton.style.zIndex = 'var(--z-index-menu)';
  }
  
  if (show) {
    // Force display to flex
    tvGuide.style.display = 'flex';
    // Set z-index just below menu button
    tvGuide.style.zIndex = 'var(--z-index-guide)';
    
    // Delay opacity change to allow display change to take effect
    setTimeout(() => {
      tvGuide.style.opacity = 1;
      tvGuide.setAttribute('aria-hidden', 'false');
    }, 10);
  } else {
    tvGuide.style.opacity = 0;
    tvGuide.setAttribute('aria-hidden', 'true');
    setTimeout(() => { tvGuide.style.display = 'none'; }, 500);
  }
}

/**
 * Function to reset menu button styles
 */
function resetMenuStyles() {
  const menuButton = dom.get('#menuButton');
  
  if (menuButton) {
    menuButton.style.fontSize = ''; 
    menuButton.style.padding = 'var(--button-padding)';
    menuButton.style.border = 'var(--button-border)';
    menuButton.style.color = 'var(--primary-color)';
    menuButton.style.background = 'transparent';
    menuButton.style.display = 'block';
    menuButton.style.opacity = '1';
  }
}

/**
 * Haptic feedback function
 */
function triggerHaptic() {
  if (navigator.vibrate) {
    navigator.vibrate([50, 30, 50]);
  }
}

/**
 * Setup swipe navigation for mobile devices
 */
function setupSwipeNavigation() {
  let touchStartX = 0;
  
  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  document.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].screenX;
    const diffX = touchStartX - touchEndX;
    
    if (Math.abs(diffX) > 50) {
      const direction = diffX > 0 ? 'next' : 'prev';
      navigateChannels(direction);
    }
  }, { passive: true });
}

/**
 * Navigate between channels
 * @param {string} direction - 'next' or 'prev'
 */
function navigateChannels(direction) {
  const sections = Array.from(document.querySelectorAll('.channel-section'));
  const currentSectionId = channelManager.getActiveChannel();
  
  // Get the current section and index
  const currentIndex = sections.findIndex(sec => 
    sec.id === currentSectionId || 
    sec.id === `section${currentSectionId}`
  );
  
  // Calculate target index with bounds checking
  let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
  targetIndex = Math.max(0, Math.min(sections.length - 1, targetIndex));
  
  // Scroll to target section
  sections[targetIndex].scrollIntoView({ behavior: 'smooth' });
  console.log(`Now viewing channel ${targetIndex + 1}`);
  
  // Provide haptic feedback
  triggerHaptic();
  
  // Play channel change sound
  playRandomChannelSound();
}

/**
 * Play a random channel change sound
 */
function playRandomChannelSound() {
  const randomIndex = Math.floor(Math.random() * 11) + 1;
  sound.play(`./audio/channel-click${randomIndex}.aif`);
}

/**
 * Analytics setup using Web Vitals
 */
function setupAnalytics() {
  const sendToAnalytics = (metricName, metric) => {
    const body = { [metricName]: metric.value, path: window.location.pathname };
    
    try {
      navigator.sendBeacon('/analytics', JSON.stringify(body));
      console.log(`Tracked ${metricName}:`, metric.value);
    } catch (error) {
      errorTracker.track('Analytics', error);
    }
  };
  
  if (typeof webVitals !== 'undefined') {
    webVitals.getCLS(metric => sendToAnalytics('CLS', metric));
    webVitals.getFID(metric => sendToAnalytics('FID', metric));
    webVitals.getLCP(metric => sendToAnalytics('LCP', metric));
  }
}

/**
 * Setup channel observers to detect when a channel is in view
 * @param {Object} state - Application state object
 */
function setupChannelObservers(state) {
  const observerOptions = { root: null, threshold: 0.7 };
  
  const observerCallback = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const channelSection = entry.target;
        const newChannelId = channelSection.id;
        
        // If this is a different channel than the current one
        if (state.currentChannel !== newChannelId) {
          // Reset styles if leaving Channel 3
          if (state.currentChannel === 'section3') {
            resetMenuStyles();
          }
          
          // Hide all channel numbers first
          document.querySelectorAll('.channel-number-overlay').forEach(overlay => {
            overlay.style.display = 'none';
          });
          
          // Show current channel number
          const currentOverlay = channelSection.querySelector('.channel-number-overlay');
          if (currentOverlay) {
            currentOverlay.style.display = 'block';
          }
          
          // Always ensure menu button visibility
          ensureMenuButtonVisibility();
          
          // Update current channel
          state.currentChannel = newChannelId;
          
          // Play channel change sound
          playRandomChannelSound();
          
          // Add TV static effect
          triggerChannelStatic();
          
          // Animate channel number
          animateChannelNumber(newChannelId);
          
          // Log channel change
          console.log(`Now viewing channel ${newChannelId.slice(-1)}`);
          
          // Load channel content through channel manager
          const moduleName = channelSection.dataset.module;
          if (moduleName) {
            channelManager.initChannel(moduleName);
          }
          
          // Apply channel transition effect
          distortAndWarpContent();
          
          // Re-check menu button after slight delay
          setTimeout(ensureMenuButtonVisibility, 500);
        }
      }
    });
  };
  
  // Create observer and observe all channel sections
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  document.querySelectorAll('.channel-section').forEach(section => {
    observer.observe(section);
  });
  
  // Setup YouTube player audio control for Channel 1
  setupYouTubeAudioControl('section1', 'youtubePlayer');
  
  // Setup YouTube player audio control for Channel 4
  setupYouTubeAudioControl('section4', 'channel4Player');
}

/**
 * Setup YouTube player audio control based on visibility
 * @param {string} sectionId - Section ID to observe
 * @param {string} playerName - Name of the YouTube player global variable
 */
function setupYouTubeAudioControl(sectionId, playerName) {
  const section = dom.get(`#${sectionId}`);
  if (!section) return;
  
  const ytObserverOptions = { root: null, threshold: 0.7 };
  
  const ytObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.target.id === sectionId) {
        const player = window[playerName];
        
        if (entry.intersectionRatio >= 0.7) {
          if (player && typeof player.unMute === 'function') {
            player.unMute();
            console.log(`${sectionId} active: Unmuting video.`);
          }
        } else {
          if (player && typeof player.mute === 'function') {
            player.mute();
            console.log(`${sectionId} inactive: Muting video.`);
          }
        }
      }
    });
  }, ytObserverOptions);
  
  ytObserver.observe(section);
}

/**
 * Trigger the static overlay effect during channel changes
 */
function triggerChannelStatic() {
  const staticOverlay = dom.get('#staticOverlay');
  
  if (staticOverlay) {
    gsap.to(staticOverlay, {
      duration: 0.2,
      opacity: 0.3,
      onComplete: () => gsap.to(staticOverlay, { duration: 0.2, opacity: 0 })
    });
  }
}

/**
 * Animate the channel number overlay when changing channels
 * @param {string} channelId - Channel section ID
 */
function animateChannelNumber(channelId) {
  const channelOverlay = dom.get(`#${channelId} .channel-number-overlay`);
  
  if (channelOverlay) {
    gsap.fromTo(
      channelOverlay, 
      { scale: 1, filter: "brightness(1)" },
      { scale: 1.2, filter: "brightness(2)", duration: 0.2, yoyo: true, repeat: 1 }
    );
  }
}

/**
 * Apply a distort/warp effect to content during channel changes
 */
function distortAndWarpContent() {
  const mainContent = dom.get('#mainContent');
  
  if (mainContent) {
    gsap.fromTo(
      mainContent,
      { filter: "none", transform: "skewX(0deg)" },
      { 
        filter: "blur(2px) contrast(1.2)", 
        transform: "skewX(5deg)", 
        duration: 0.3, 
        ease: "power2.out", 
        yoyo: true, 
        repeat: 1 
      }
    );
  }
}

/**
 * Preload assets for faster loading
 */
function preloadAssets() {
  // Preload Channel 4 if configured for preloading
  const moduleInfo = channelManager._channels.get('under the influence');
  if (moduleInfo && moduleInfo.preload) {
    setTimeout(() => {
      channelManager.loadModule('under the influence');
    }, 2000);
  }
  
  // Preload channel click sounds
  for (let i = 1; i <= 12; i++) {
    sound.get(`./audio/channel-click${i}.aif`);
  }
}

/**
 * Throttle function to limit frequency of function calls
 * @param {Function} fn - Function to throttle
 * @param {number} wait - Milliseconds to wait between calls
 * @returns {Function} Throttled function
 */
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