// Import the MenuManager for centralized menu control
import { MenuManager, notifyChannelChanged } from './menu-manager.js';

// Global flag: after any user interaction, browsers allow unmuted playback
window.soundAllowed = false;
const enableSound = () => {
  if (!window.soundAllowed) {
    window.soundAllowed = true;
    console.log("User interaction detected – sound now allowed. Channel observers will handle unmuting if channels are visible.");
    // No direct unmute attempt here. Rely on observers to pick up the soundAllowed flag.
  }
};

['pointerdown', 'touchstart', 'mousedown'].forEach(evt => {
  window.addEventListener(evt, enableSound, { once: true });
});

document.addEventListener('DOMContentLoaded', () => {
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
    const body = {};
    body[metricName] = metric.value;
    body.path = window.location.pathname;
    navigator.sendBeacon('/analytics', JSON.stringify(body));
    console.log(`Tracked ${metricName}:`, metric.value);
  };
  
  // Check if webVitals is available before using it
  if (typeof window.webVitals !== 'undefined') {
    window.webVitals.getCLS(metric => sendToAnalytics('CLS', metric));
    window.webVitals.getFID(metric => sendToAnalytics('FID', metric));
    window.webVitals.getLCP(metric => sendToAnalytics('LCP', metric));
  } else {
    console.log("Web Vitals not loaded, skipping performance tracking");
  }

  // --- Haptic Feedback ---
  const triggerHaptic = () => {
    try {
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
      }
    } catch (e) {
      console.log('Vibration API not supported');
    }
  };

  // --- Swipe Navigation ---
  let touchStartX = 0;
  let touchStartY = 0; // Track vertical position to detect diagonal swipes
  let touchStartTime = 0; // Track time for velocity-based gestures
  
  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    touchStartTime = Date.now();
  }, { passive: true }); // Add passive flag for better performance on iOS
  
  document.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const touchEndTime = Date.now();
    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(touchStartY - touchEndY);
    const elapsedTime = touchEndTime - touchStartTime;
    
    // Calculate velocity (pixels per millisecond)
    const velocity = Math.abs(diffX) / elapsedTime;
    
    // Only trigger horizontal swipe if:
    // 1. Horizontal movement is significant (>50px) 
    // 2. Vertical movement is minimal (prevent accidental swipes)
    // 3. Fast enough swipe (velocity threshold) OR large enough movement
    if ((Math.abs(diffX) > 50 && diffY < 100) && 
        (velocity > 0.5 || Math.abs(diffX) > 100)) {
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
    console.log(`🔄 Loading module for "${moduleName}"...`);
    let module;
    
    // Get target section for debugging
    let targetSection = null;
    if (moduleName === 'skill games') {
      targetSection = document.getElementById('section4');
    } else if (moduleName === 'under the influence') {
      targetSection = document.getElementById('section5');
    }
    
    if (targetSection) {
      console.log(`🎯 Target section found: ${targetSection.id}, current content length: ${targetSection.innerHTML.length}`);
    }
    
    if (moduleName === 'home') {
      // Preload Channel 1 with higher priority
      console.log('Loading home module for Channel 1');
      module = await import(`./channels/ch1/home.js`);
    } else if (moduleName === 'ch2') {
      module = await import(`./channels/ch2/ch2.js`);
    } else if (moduleName === 'music channel') {
      // Load the new music channel
      module = await import(`./channels/ch3/ch3.js`);
    } else if (moduleName === 'skill games') {
      // Reset any global styles that might have been set by the game
      resetMenuStyles();
      console.log('📂 Importing CH4 module...');
      module = await import(`./channels/ch4/ch4.js`);
    } else if (moduleName === 'under the influence') {
      console.log('📂 Importing CH5 module...');
      module = await import(`./channels/ch5/ch5.js`);
    }
    
    if (module) {
      console.log(`✅ Module for "${moduleName}" loaded successfully, calling init...`);
      await module.init();
      console.log(`🎉 Module for "${moduleName}" initialized successfully`);
      
      // Verify content was actually inserted
      if (targetSection) {
        console.log(`📏 Target section after init, content length: ${targetSection.innerHTML.length}`);
        if (targetSection.innerHTML.length < 100) {
          console.warn(`⚠️ Warning: ${targetSection.id} has very little content after init`);
        }
      }
      
      // Don't force menu button visibility - let MenuManager sync with header
      
      // Notify that channel has changed to trigger any observers
      notifyChannelChanged();
    } else {
      console.warn(`⚠️ No module definition found for "${moduleName}"`);
    }
  } catch (err) {
    console.error(`❌ Module for "${moduleName}" failed to load or initialize:`, err);
    console.error(`📝 Full error stack:`, err.stack);
    
    // Try to provide more debugging info
    if (err.message.includes('Failed to fetch')) {
      console.error(`🌐 Network error - check if files exist and server is running`);
    }
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
    
    // Let MenuManager handle visibility based on header
    notifyChannelChanged();
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
  
  // Initialize MenuManager for cross-channel menu control
  // Only initialize after DOM is loaded
  MenuManager.init();
  
  // Ensure TV Guide styling is applied on initial load
  setTimeout(() => {
    ensureTVGuideStandardStyling();
  }, 100);

  // --- Power Button Touch Glow ---
  powerButton.addEventListener('touchstart', () => powerButton.classList.add('touch-glow'));
  powerButton.addEventListener('touchend', () =>
    setTimeout(() => powerButton.classList.remove('touch-glow'), 200)
  );

  // --- Reveal Main Content & Reveal Header ---
  const revealMainContent = () => {
    window.scrollTo({ top: mainContent.offsetTop, behavior: "smooth" });
    gsap.to(landing, {
      duration: 0.5,
      opacity: 0,
      onComplete: () => {
        // Important: Make sure the power button is completely hidden
        powerButton.style.display = "none";
        powerButton.style.opacity = 0;
        powerButton.style.visibility = "hidden";
        
        landing.style.display = "none";
        mainContent.style.display = "block";
        document.body.style.overflow = "auto";
        
        // Mark TV as fully turned on
        document.body.classList.add('tv-on');
        
        // Reveal the header after landing completes
        gsap.to(header, { 
          duration: 0.5, 
          opacity: 1,
          onComplete: () => {
            // After header is fully visible, let MenuManager handle menu button
            console.log("Header reveal complete");
            
            // Don't directly modify menu button - let MenuManager sync with header
            
            // Notify channel changed to sync other components
            notifyChannelChanged();
          }
        });
      }
    });
  };
  
  // Simplified menu visibility - let MenuManager handle everything
  const ensureMenuButtonVisibility = () => {
    // Don't manually control menu button - let MenuManager handle it
    console.log("Menu button visibility delegated to MenuManager");
    
    // Apply standard TV Guide styling
    ensureTVGuideStandardStyling();
  };

  powerButton.addEventListener('click', () => {
    powerButton.style.pointerEvents = 'none';
    if (clickSound) {
      clickSound.play().catch(error => console.error('Click sound failed:', error));
    }
    // Mark TV as turned on
    document.body.classList.add('tv-on');
    
    // Force immediate style changes to ensure power button is hidden
    setTimeout(() => {
      powerButton.style.display = "none";
      powerButton.style.visibility = "hidden";
      powerButton.style.opacity = 0;
      powerButton.style.zIndex = "-1";
      console.log("Power button force hidden");
    }, 100);
    
    gsap.to(powerButton, {
      duration: 0.3,
      opacity: 0,
      ease: "power2.out",
      onComplete: () => {
        powerButton.style.display = "none";
        powerButton.style.visibility = "hidden";
        powerButton.style.zIndex = "-1";
      }
    });
    const tl = gsap.timeline({
      onComplete: () => {
        landingSequenceComplete = true;
        autoScrollTimeout = setTimeout(() => {
          if (landing.style.display !== "none") revealMainContent();
        }, 3000);
      }
    });
    tl.to(landing, { duration: 0.15, backgroundColor: "#fff", ease: "power2.out" })
      .to(landing, { duration: 0.15, backgroundColor: "var(--bg-color)", ease: "power2.in" })
      .to(staticOverlay, { duration: 0.2, opacity: 0.3 })
      .to(staticOverlay, { duration: 0.2, opacity: 0 })
      .to(landingName, { duration: 1.2, width: "100%", opacity: 1, ease: "power2.out" })
      .to(landingSubtitle, { duration: 0.7, opacity: 1, ease: "power2.out" }, "-=0.3")
      .to("#landingSubtitle .subtitle-item", { duration: 1, opacity: 1, ease: "power2.out", stagger: 0.5 }, "+=0.3");
  });

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

  // --- TV Guide Simple Styling Function ---
  // Simple, effective TV Guide styling without over-engineering
  const ensureTVGuideStandardStyling = () => {
    const tvGuide = document.getElementById('tvGuide');
    
    if (tvGuide) {
      tvGuide.style.position = 'fixed';
      tvGuide.style.top = '0';
      tvGuide.style.left = '0';
      tvGuide.style.width = '100%';
      tvGuide.style.height = '100%';
      tvGuide.style.zIndex = '999999';
      tvGuide.style.pointerEvents = 'auto';
      tvGuide.style.webkitOverflowScrolling = 'touch';
      
      console.log('TV Guide styling applied');
      return true;
    }
    
    console.error('TV Guide element not found');
    return false;
  };

  // Make function globally available for all channels
  window.ensureTVGuideStandardStyling = ensureTVGuideStandardStyling;

  // --- TV Guide Menu Toggle ---
  // Keep track of TV Guide state to prevent conflicting operations
  let tvGuideToggleInProgress = false;
  let tvGuideIsVisible = false;

  const toggleTVGuide = (show) => {
    // If no explicit instruction, toggle based on current state
    if (typeof show === 'undefined') {
      show = !tvGuideIsVisible;
    }
    
    if (!tvGuide) {
      console.error("TV Guide element not found");
      return;
    }
    
    // Ensure standard styling before any toggle operation
    ensureTVGuideStandardStyling();
    
    if (tvGuideToggleInProgress) {
      return;
    }
    
    if (show === tvGuideIsVisible) {
      return;
    }
    
    tvGuideToggleInProgress = true;
    
    if (show) {
      // Store current scroll position 
      window.savedScrollPosition = window.scrollY;
      
      // Highlight current channel
      if (currentChannel) {
        document.querySelectorAll('.tv-guide-channel').forEach(item => {
          item.style.backgroundColor = '';
          item.style.boxShadow = '';
        });
        
        const currentGuideItem = document.querySelector(`.tv-guide-channel[data-target="${currentChannel}"]`);
        if (currentGuideItem) {
          currentGuideItem.style.backgroundColor = 'rgba(62, 146, 204, 0.3)';
          currentGuideItem.style.boxShadow = '0 0 15px rgba(62, 146, 204, 0.4)';
        }
      }
      
      // Simple overlay positioning
      tvGuide.style.display = 'flex';
      tvGuide.style.position = 'absolute';
      tvGuide.style.top = `${window.scrollY}px`;
      tvGuide.style.left = '0';
      tvGuide.style.width = '100vw';
      tvGuide.style.height = '100vh';
      tvGuide.style.zIndex = '999999';
      tvGuide.style.opacity = '1';
      
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';

      // Auto-scroll guide to current channel for better context
      if (currentChannel) {
        const currentGuideItem = document.querySelector(`.tv-guide-channel[data-target="${currentChannel}"]`);
        if (currentGuideItem && typeof currentGuideItem.scrollIntoView === 'function') {
          currentGuideItem.scrollIntoView({ block: 'center', behavior: 'instant' });
        }
      }

      tvGuideIsVisible = true;
      tvGuideToggleInProgress = false;
    } else {
      tvGuide.style.opacity = '0';
      
      // Restore scrolling
      document.body.style.overflow = 'auto';
      
      setTimeout(() => { 
        tvGuide.style.display = 'none';
        tvGuideIsVisible = false;
        tvGuideToggleInProgress = false;
      }, 300);
    }
  };
  
  // Expose globally for MenuManager delegation
  window.toggleTVGuide = toggleTVGuide;
  
  // MenuManager handles all menu button events - no duplicate setup needed
  console.log("Menu button events delegated to MenuManager");
  
  // Simplified backup: Just ensure TV Guide styling every 3 seconds
  setInterval(() => {
    if (document.body.classList.contains('tv-on')) {
      ensureTVGuideStandardStyling();
      // Let MenuManager handle menu button visibility
    }
  }, 3000);
  
  // Close guide handler moved to MenuManager
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
  const observerOptions = { root: null, threshold: 0.5 }; // Reduced from 0.7 to 0.5 for better triggering
  const observerCallback = entries => {
    entries.forEach(entry => {
      const sectionId = entry.target.id;
      const visibilityPercent = Math.round(entry.intersectionRatio * 100);
      
      console.log(`👁️ Intersection: ${sectionId} - ${visibilityPercent}% visible, intersecting: ${entry.isIntersecting}`);
      
      if (entry.isIntersecting) {
        const newChannel = entry.target.id;
        const moduleName = entry.target.dataset.module;
        
        console.log(`🎯 Section ${newChannel} became visible, module: "${moduleName}"`);
        
        if (currentChannel !== newChannel) {
          // Dispatch channel change event to stop any running audio (only if not entering Channel 3)
          if (newChannel !== 'section3') {
            const channelChangeEvent = new Event('channelChange');
            document.dispatchEvent(channelChangeEvent);
          }
          
          console.log(`📺 Channel change: from ${currentChannel} to ${newChannel}`);
          
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
          
          // Don't force menu button visibility - let MenuManager sync with header
          // Notify system about channel change for any observers
          notifyChannelChanged();
          
          // Ensure TV Guide styling is consistent on channel change - GLOBAL STANDARD
          ensureTVGuideStandardStyling();
          
          currentChannel = newChannel;
          playRandomChannelSound();
          triggerChannelStatic();
          animateChannelNumber(newChannel);
          console.log(`📺 Now viewing channel ${newChannel.slice(-1)}`);
          
          // Load module content
          if (moduleName) {
            console.log(`🚀 Triggering loadChannelContent for "${moduleName}"`);
            loadChannelContent(moduleName);
          } else {
            console.warn(`⚠️ No data-module attribute found for ${newChannel}`);
          }
          
          distortAndWarpContent();
          
          // Let MenuManager handle menu button visibility based on header status
          setTimeout(() => {
            // Don't force menu button visibility - let it sync with header
            notifyChannelChanged();
              
            // Extra check for button functionality if visible
            if (menuButton) {
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
          
          // Mobile optimization: If on mobile device, check battery level
          if (window.navigator.getBattery) {
            window.navigator.getBattery().then(battery => {
              // If battery is below 20%, use static image instead of video
              if (battery.level < 0.2 && !battery.charging) {
                const videoBackground = document.querySelector('.video-background');
                if (videoBackground && window.innerWidth < 768) {
                  console.log("Low battery detected on mobile. Using static background.");
                  // Only apply if not already applied
                  if (!videoBackground.classList.contains('battery-saving')) {
                    // Hide YouTube iframe
                    const ytFrame = videoBackground.querySelector('iframe');
                    if (ytFrame) ytFrame.style.display = 'none';
                    
                    // Add battery saving mode class and background
                    videoBackground.classList.add('battery-saving');
                    videoBackground.style.backgroundImage = 'url("visuals/static.gif")';
                    videoBackground.style.backgroundSize = 'cover';
                  }
                }
              }
            }).catch(err => console.log("Battery API not available", err));
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

  // --- Intersection Observer for Channel 4 Gameshow Audio Control ---
  const channel4 = document.getElementById("section4");
  const channel4ObserverOptions = { root: null, threshold: 0.7 };
  const channel4Observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target.id === "section4") {
        if (entry.intersectionRatio >= 0.7) {
          console.log("Channel 4 active: Starting gameshow audio.");
          // Control gameshow audio instead of YouTube player
          if (window.controlGameshowAudio) {
            window.controlGameshowAudio(true);
          }
        } else {
          console.log("Channel 4 inactive: Stopping gameshow audio.");
          // Stop gameshow audio when leaving channel
          if (window.controlGameshowAudio) {
            window.controlGameshowAudio(false);
          }
        }
      }
    });
  }, channel4ObserverOptions);
  if (channel4) {
    channel4Observer.observe(channel4);
  }
  
  // --- Intersection Observer for Channel 5 YouTube Video Control ---
  const channel5 = document.getElementById("section5");
  const channel5ObserverOptions = { root: null, threshold: 0.7 };
  const channel5Observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target.id === "section5") {
        // As soon as Channel 5 is at all visible, ensure Channel 4 audio is stopped
        if (window.controlGameshowAudio) {
          window.controlGameshowAudio(false);
        }
        
        if (entry.intersectionRatio >= 0.7) {
          // Ensure gameshow audio (Channel 4) is stopped
          if (window.controlGameshowAudio) {
            window.controlGameshowAudio(false);
          }

          // Ensure video is playing; if paused or not started, play it muted
          if (window.channel5Player && typeof window.channel5Player.playVideo === "function") {
            const state = window.channel5Player.getPlayerState ? window.channel5Player.getPlayerState() : null;
            // 1 = playing, 2 = paused, -1 = unstarted
            if (state !== 1) {
              window.channel5Player.playVideo();
            }
          }

          // Unmute once player confirms it is playing (robust against slow loads)
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
          const unmuteWhenPlaying = () => {
            if (!window.channel5Player || typeof window.channel5Player.getPlayerState !== 'function') {
              // Player not fully initialized, retry shortly
              console.log("Channel 5: Player not ready, will retry unmuteWhenPlaying.");
              setTimeout(unmuteWhenPlaying, 250);
              return;
            }

            const st = window.channel5Player.getPlayerState();

            if (st === 1) { // Player is PLAYING
              if (!isMobile || window.soundAllowed) {
                if (typeof window.channel5Player.unMute === 'function') {
                  window.channel5Player.unMute();
                  console.log("Channel 5 active: Unmuted (state: PLAYING, permission granted).");
                }
              } else {
                // Mobile, sound not yet allowed: keep polling
                console.log("Channel 5 active: Player PLAYING, but sound not yet allowed on mobile. Retrying unmute.");
                setTimeout(unmuteWhenPlaying, 250);
              }
            } else { // Player is NOT PLAYING (e.g., -1 unstarted, 0 ended, 2 paused, 3 buffering, 5 cued)
              console.log(`Channel 5 active: Player not in PLAYING state (current state: ${st}). Attempting to play and will retry unmute.`);
              if (typeof window.channel5Player.playVideo === 'function') {
                window.channel5Player.playVideo(); // Ensure it's trying to play
              }
              setTimeout(unmuteWhenPlaying, 250); // Retry until player is playing and conditions met
            }
          };
          unmuteWhenPlaying(); // Initial call
        } else {
          console.log("Channel 5 inactive: Muting video (continues playing for TV realism).");
          if (window.channel5Player && typeof window.channel5Player.mute === "function") {
            window.channel5Player.mute();
          }
        }
      }
    });
  }, channel5ObserverOptions);
  if (channel5) {
    channel5Observer.observe(channel5);
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
            console.log("Header is visible, notifying for menu sync");
            notifyChannelChanged();
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

// Preload both Channel 4 and Channel 5 so their content is ready
console.log('🔄 Starting channel preloading...');
setTimeout(() => {
  console.log('🚀 Preloading Channel 4 (Skill Games)...');
  loadChannelContent('skill games');
}, 2000);

setTimeout(() => {
  console.log('🚀 Preloading Channel 5 (Under the Influence)...');
  loadChannelContent('under the influence');
}, 3000);

// Add manual testing functions to window for debugging
window.debugChannels = {
  loadCh4: () => loadChannelContent('skill games'),
  loadCh5: () => loadChannelContent('under the influence'),
  testIntersection: () => {
    console.log('🔍 Current intersection state:');
    document.querySelectorAll('.channel-section').forEach(section => {
      const rect = section.getBoundingClientRect();
      const visible = rect.top < window.innerHeight && rect.bottom > 0;
      const visPercent = visible ? Math.max(0, Math.min(1, (window.innerHeight - rect.top) / rect.height)) * 100 : 0;
      console.log(`📊 ${section.id}: ${Math.round(visPercent)}% visible, module: "${section.dataset.module}"`);
    });
  },
  checkContent: () => {
    console.log('📏 Content check:');
    const s4 = document.getElementById('section4');
    const s5 = document.getElementById('section5');
    console.log(`Section 4 content length: ${s4?.innerHTML.length || 0}`);
    console.log(`Section 5 content length: ${s5?.innerHTML.length || 0}`);
  }
};
  
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
}); // End of DOMContentLoaded
