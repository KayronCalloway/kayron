// Import the MenuManager for centralized menu control
import { MenuManager, notifyChannelChanged } from './menu-manager.js';

// Global flag: after any user interaction, browsers allow unmuted playback
window.soundAllowed = false;
const enableSound = () => {
  if (!window.soundAllowed) {
    window.soundAllowed = true;
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
  const staticOverlay = document.getElementById('staticOverlay');
  const clickSound = document.getElementById('clickSound');
  const backToTop = document.getElementById('backToTop');

  let landingSequenceComplete = false;
  let autoScrollTimeout;
  let currentChannel = null;

  // --- Channel-Click Sounds ---
  const channelSounds = Array.from({ length: 11 }, (_, i) => {
    const audio = new Audio(`audio/channel-click${i + 1}.mp3`);
    audio.preload = 'auto';
    return audio;
  });
  const playRandomChannelSound = () => {
    const randomIndex = Math.floor(Math.random() * channelSounds.length);
    channelSounds[randomIndex].play().catch(() => {});
  };

  // Volume control functionality removed

  // --- Haptic Feedback ---
  const triggerHaptic = () => {
    try {
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
      }
    } catch (e) {
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
    // Don't interfere with project cards or interactive elements in Channel 2
    if (e.target.closest('.project-card') ||
        e.target.closest('.project-scroller') ||
        e.target.closest('#portfolio-browse')) {
      return; // Let the element's own handlers deal with it
    }

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
    triggerHaptic();
  };

  // --- Dynamic Module Loading ---
  const loadChannelContent = async moduleName => {
  try {
    let module;
    
    // Get target section for debugging
    let targetSection = null;
    // Dead code removed - module names are 'home', 'ch2', 'ch3', 'ch4', 'ch5'
    

    if (moduleName === 'home') {
      // Preload Channel 1 with higher priority
      module = await import(`./channels/ch1/home.js`);
    } else if (moduleName === 'ch2') {
      module = await import(`./channels/ch2/ch2.js`);
    } else if (moduleName === 'ch3') {
      // Music Channel
      module = await import(`./channels/ch3/ch3.js`);
    } else if (moduleName === 'ch4') {
      // Under the Influence
      module = await import(`./channels/ch4/ch4.js`);
    } else if (moduleName === 'ch5') {
      // UATP Archive
      module = await import(`./channels/ch5/ch5.js`);
    }
    
    if (module) {
      await module.init();
      notifyChannelChanged();
    }
  } catch (err) {
    // silent
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
      navigator.serviceWorker.register('./service-worker.js');
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
    mainContent.scrollTo({ top: 0, behavior: 'smooth' });
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
    
    // Apply standard TV Guide styling
    ensureTVGuideStandardStyling();
  };

  powerButton.addEventListener('click', () => {
    powerButton.style.pointerEvents = 'none';
    if (clickSound) {
      clickSound.play().catch(() => {});
    }
    // Mark TV as turned on
    document.body.classList.add('tv-on');
    
    // Force immediate style changes to ensure power button is hidden
    setTimeout(() => {
      powerButton.style.display = "none";
      powerButton.style.visibility = "hidden";
      powerButton.style.opacity = 0;
      powerButton.style.zIndex = "-1";
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
    backToTop.style.display = mainContent.scrollTop > 300 ? 'block' : 'none';
  };
  window.addEventListener('scroll', throttle(toggleBackToTop, 100));
  backToTop.addEventListener('click', () => {
    mainContent.scrollTo({ top: 0, behavior: 'smooth' });
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
      
      return true;
    }
    
    return false;
  };

  // Make function globally available for all channels
      const dateDisplay = document.querySelector('.date-display');
      if (dateDisplay) {
        const now = new Date();
        const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        dateDisplay.textContent = monthNames[now.getMonth()] + ' ' + now.getFullYear();
      }
    };
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
      window.savedScrollPosition = mainContent.scrollTop;
      
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
      
      // Show guide overlay
      tvGuide.style.display = 'flex';
      tvGuide.style.opacity = '1';
      
      // Prevent background scrolling
      mainContent.style.overflow = 'hidden';

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
      mainContent.style.overflow = 'auto';
      
      setTimeout(() => {
        tvGuide.style.display = 'none';
        tvGuideIsVisible = false;
        tvGuideToggleInProgress = false;
        mainContent.scrollTop = window.savedScrollPosition || 0;
      }, 300);
    }
  };
  
  // Expose globally for MenuManager delegation
  window.toggleTVGuide = toggleTVGuide;
  
  // MenuManager handles all menu button events - no duplicate setup needed
  
  
  // Close guide handler moved to MenuManager
  // Channel descriptions for TV Guide
  const channelDescriptions = {
    'section1': 'Explore Kayron\'s portfolio home, featuring skills and professional background.',
    'section2': 'Discover creative works and brand strategies in a showcase format.',
    'section3': 'Audio archives and creative process documentation.',
    'section4': 'Examine influences and inspirations that shape creative direction.',
    'section5': 'Universal Agent Trust Protocol - AI accountability infrastructure documentation.'
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
      
      // Dispatch channel change event to stop any running audio
      const channelChangeEvent = new Event('channelChange');
      document.dispatchEvent(channelChangeEvent);
      
      if (targetSection) {
        // Create delayed closing effect for more TV-like experience
        setTimeout(() => {
          targetSection.scrollIntoView({ behavior: 'smooth' });
          
          // Close TV Guide with a slight delay for a more authentic TV experience
          setTimeout(() => {
            toggleTVGuide(false);
          }, 200);
          
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
      if (entry.isIntersecting) {
        const newChannel = entry.target.id;
        const moduleName = entry.target.dataset.module;
        
        
        if (currentChannel !== newChannel) {
          // Dispatch channel change event to stop any running audio (only if not entering Channel 3)
          if (newChannel !== 'section3') {
            const channelChangeEvent = new Event('channelChange');
            document.dispatchEvent(channelChangeEvent);
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
          
          // Load module content
          if (moduleName) {
            loadChannelContent(moduleName);
          } else {
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
          }
          
          // Mobile optimization: If on mobile device, check battery level
          if (window.navigator.getBattery) {
            window.navigator.getBattery().then(battery => {
              // If battery is below 20%, use static image instead of video
              if (battery.level < 0.2 && !battery.charging) {
                const videoBackground = document.querySelector('.video-background');
                if (videoBackground && window.innerWidth < 768) {
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
            }));
          }
        } else {
          if (youtubePlayer && typeof youtubePlayer.mute === "function") {
            youtubePlayer.mute();
          }
        }
      }
    });
  }, ytObserverOptions);
  if (channel1) {
    ytObserver.observe(channel1);
  }

  // --- Intersection Observer for Channel 4 (UATP Archive) ---
  const channel4 = document.getElementById("section4");
  const channel4ObserverOptions = { root: null, threshold: 0.7 };
  const channel4Observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target.id === "section4") {
        /* no-op */
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
        if (entry.intersectionRatio >= 0.7) {

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
              setTimeout(unmuteWhenPlaying, 250);
              return;
            }

            const st = window.channel5Player.getPlayerState();

            if (st === 1) { // Player is PLAYING
              if (!isMobile || window.soundAllowed) {
                if (typeof window.channel5Player.unMute === 'function') {
                  window.channel5Player.unMute();
                }
              } else {
                // Mobile, sound not yet allowed: keep polling
                setTimeout(unmuteWhenPlaying, 250);
              }
            } else { // Player is NOT PLAYING (e.g., -1 unstarted, 0 ended, 2 paused, 3 buffering, 5 cued)
              if (typeof window.channel5Player.playVideo === 'function') {
                window.channel5Player.playVideo(); // Ensure it's trying to play
              }
              setTimeout(unmuteWhenPlaying, 250); // Retry until player is playing and conditions met
            }
          };
          unmuteWhenPlaying(); // Initial call
        } else {
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
  

// Preload channels so their content is ready
setTimeout(() => {
  loadChannelContent('ch4');
}, 2000);

setTimeout(() => {
  loadChannelContent('ch5');
}, 3000);

  
  // Escape key closes TV Guide
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && tvGuideIsVisible) {
      toggleTVGuide(false);
    }
  });
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
