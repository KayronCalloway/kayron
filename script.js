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
      
      // Always ensure menu button visibility and functionality after loading any channel
      setTimeout(ensureMenuButtonVisibility, 300);
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
    menuButton.style.display = 'block'; // Ensure it's visible
    menuButton.style.opacity = '1';     // Ensure it's fully opaque
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
    window.scrollTo({ top: mainContent.offsetTop, behavior: "smooth" });
    gsap.to(landing, {
      duration: 0.5,
      opacity: 0,
      onComplete: () => {
        landing.style.display = "none";
        mainContent.style.display = "block";
        document.body.style.overflow = "auto";
        
        // Reveal the header after landing completes
        gsap.to(header, { 
          duration: 0.5, 
          opacity: 1,
          onComplete: () => {
            // Only after header is fully visible, check if we should show menu button
            console.log("Header reveal complete");
            // Check if we're on Channel 1 and only then show menu button
            if (currentChannel === 'section1') {
              setTimeout(() => {
                ensureMenuButtonVisibility();
              }, 200); // Small delay to ensure everything is rendered
            }
          }
        });
      }
    });
  };
  
  // Function to ensure menu button is always visible and interactive
  const ensureMenuButtonVisibility = () => {
    // Only make the menu button visible if the header is visible (showing Kayron Calloway in top left)
    if (menuButton && header && window.getComputedStyle(header).opacity > 0.9) {
      console.log("Header is fully visible, showing menu button");
      menuButton.style.display = "block";
      menuButton.style.opacity = "1";
      menuButton.style.zIndex = "999999"; // Keep extremely high z-index
      menuButton.style.position = "fixed";
      menuButton.style.pointerEvents = "auto";
      
      // Ensure tap target size is at least 44x44px for iOS Safari
      menuButton.style.minHeight = "44px";
      menuButton.style.minWidth = "44px";
      
      // Re-attach event listener to ensure it works with proper iOS handling
      if (menuButton.onclick) {
        menuButton.removeEventListener('click', menuButton.onclick);
      }
      
      const menuClickHandler = () => {
        const isCurrentlyVisible = tvGuide.style.display === 'flex' && parseFloat(tvGuide.style.opacity) === 1;
        toggleTVGuide(!isCurrentlyVisible);
      };
      
      menuButton.onclick = menuClickHandler;
      menuButton.addEventListener('touchend', (e) => {
        e.preventDefault(); // Prevent double-tap issues on iOS
        menuClickHandler();
      }, { passive: false });
    } else if (menuButton) {
      // If header is not visible yet, keep menu button hidden
      console.log("Header not fully visible yet, keeping menu button hidden");
      menuButton.style.display = "none";
    }
    
    // Ensure TV Guide has the correct styles
    if (tvGuide) {
      // Make the TV Guide appear on top of everything (higher z-index than header)
      tvGuide.style.position = 'fixed';
      tvGuide.style.top = '0';
      tvGuide.style.left = '0';
      tvGuide.style.width = '100%';
      tvGuide.style.height = '100%';
      tvGuide.style.zIndex = '100000'; // Higher than both header and menu button
      
      // Add -webkit prefixed properties for iOS Safari
      tvGuide.style.webkitOverflowScrolling = 'touch';
    }
  };

  powerButton.addEventListener('click', () => {
    powerButton.style.pointerEvents = 'none';
    if (clickSound) {
      clickSound.play().catch(error => console.error('Click sound failed:', error));
    }
    gsap.to(powerButton, {
      duration: 0.3,
      opacity: 0,
      ease: "power2.out",
      onComplete: () => powerButton.style.display = "none"
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

  // --- TV Guide Menu Toggle ---
  const toggleTVGuide = show => {
    // Check if header is visible before showing menu button
    const isHeaderVisible = header && window.getComputedStyle(header).opacity > 0.9;
    
    // Only show menu button if header is visible (Kayron Calloway name is showing)
    if (menuButton && isHeaderVisible) {
      menuButton.style.display = 'block';
      menuButton.style.opacity = '1';
      menuButton.style.zIndex = '999999';
    } else if (menuButton) {
      menuButton.style.display = 'none';
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
          
          // Show menu button only when Channel 1 (section1) is visible
          if (newChannel === 'section1') {
            menuButton.style.display = 'block';
            // ALWAYS ensure menu button and TV guide have the correct visibility and z-index
            ensureMenuButtonVisibility();
          } else {
            menuButton.style.display = 'none';
          }
          
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
          
          // Re-check menu button visibility after channel content has loaded
          setTimeout(() => {
            if (newChannel === 'section1') {
              ensureMenuButtonVisibility();
              
              // Extra check for button functionality
              if (menuButton) {
                menuButton.style.pointerEvents = 'auto';
                menuButton.style.cursor = 'pointer';
              }
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

// Preload Channel 4 ("under the influence") so its video is already playing when scrolled into view.
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
});
