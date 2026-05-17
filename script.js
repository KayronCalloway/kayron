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
  if (tvGuide && tvGuide.parentElement !== document.body) {
    document.body.appendChild(tvGuide);
  }
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
      // Haptic not supported
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
  const getChannelTop = section => section.offsetTop - mainContent.offsetTop;

  let snapReleaseTimer = null;
  let isProgrammaticSnap = false;

  const scrollToChannel = (section, behavior = 'smooth') => {
    if (!section) return;
    isProgrammaticSnap = true;
    mainContent.scrollTo({ top: getChannelTop(section), behavior });
    window.clearTimeout(snapReleaseTimer);
    snapReleaseTimer = window.setTimeout(() => {
      isProgrammaticSnap = false;
    }, behavior === 'instant' ? 80 : 760);
  };

  const navigateChannels = direction => {
    const sections = Array.from(document.querySelectorAll('.channel-section'));
    const currentIndex = sections.findIndex(sec => sec.id === currentChannel);
    let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    targetIndex = Math.max(0, Math.min(sections.length - 1, targetIndex));
    scrollToChannel(sections[targetIndex]);
    triggerHaptic();
  };

  // --- Dynamic Module Loading ---
  const loadChannelContent = async moduleName => {
  try {
    let module;

    // Get target section for debugging
    let targetSection = null;
    // Dead code removed - module names are 'home', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6'

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
    } else if (moduleName === 'ch6') {
      // Sensibility
      module = await import(`./channels/ch6/ch6.js`);
    }

    if (module) {
      await module.init();
      notifyChannelChanged();
    }
  } catch (err) {
    // Channel module load failed — deferred
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
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.set(landingName, prefersReducedMotion
      ? { opacity: 1, width: '100%', filter: 'none' }
      : { opacity: 0, width: 0, filter: 'blur(1px)' }
    );

    const tl = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        landingSequenceComplete = true;
        if (landing.style.display !== "none") revealMainContent();
      }
    });
    tl.to(landing, { duration: 0.12, backgroundColor: "#fff", ease: "power2.out" })
      .to(landing, { duration: 0.16, backgroundColor: "var(--bg-color)", ease: "power2.in" })
      .to(staticOverlay, { duration: 0.16, opacity: 0.28 })
      .to(staticOverlay, { duration: 0.18, opacity: 0 })
      .to(landingName, {
        duration: prefersReducedMotion ? 0.01 : 3.5,
        width: '100%',
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.out'
      });

    if (landingSubtitle) {
      tl.to(landingSubtitle, { duration: 0.4, opacity: 1, ease: "power2.out" }, "-=0.2");
      const subtitleItems = landingSubtitle.querySelectorAll('.subtitle-item');
      if (subtitleItems.length) {
        tl.to(subtitleItems, { duration: 0.6, opacity: 1, ease: "power2.out", stagger: 0.15 }, "+=0.05");
      }
    }
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

      // Update TV Guide date display dynamically
      const dateDisplay = document.querySelector('.date-display');
      if (dateDisplay) {
        const now = new Date();
        const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        dateDisplay.textContent = monthNames[now.getMonth()] + ' ' + now.getFullYear();
      }

      return true;
    }

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
      // Highlight current channel
      if (currentChannel) {
        document.querySelectorAll('.tv-guide-channel').forEach(item => {
          item.classList.remove('is-current');
        });

        const currentGuideItem = document.querySelector(`.tv-guide-channel[data-target="${currentChannel}"]`);
        if (currentGuideItem) {
          currentGuideItem.classList.add('is-current');
        }
      }

      // Show guide overlay
      tvGuide.style.display = 'flex';
      tvGuide.style.opacity = '1';

      // Auto-scroll guide to current channel
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

  // Close guide handler moved to MenuManager
  // Channel descriptions for TV Guide
  const channelDescriptions = {
    'section1': 'Entry point: resume, background, contact, and the basic working frame.',
    'section2': 'Selected work: creative direction, campaign systems, brand worlds, and project proof.',
    'section3': 'Sound: music videos and the image/sound layer of the practice.',
    'section4': 'Influences: judgment, restraint, reference material, and the thinking behind the taste.',
    'section5': 'Sensibility: active inputs across images, film, listening, and cultural reference.',
    'section6': 'Archive: UATP, provenance, AI accountability, and systems-level authorship.'
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

      item.classList.add('is-previewed');
    });

    item.addEventListener('mouseleave', () => {
      item.classList.remove('is-previewed');
    });

    // Channel selection handling
    const selectChannel = () => {
      const targetId = item.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);

      document.querySelectorAll('.tv-guide-channel')
        .forEach((ch) => ch.classList.remove('is-current'));
      item.classList.add('is-current');

      if (targetSection) {
        toggleTVGuide(false);
        requestAnimationFrame(() => {
          scrollToChannel(targetSection, 'instant');
        });
        triggerHaptic();
      }
    };

    item.addEventListener('click', selectChannel);
    item.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectChannel();
      }
    });
  });

  // --- Intersection Observer for Channel Transitions ---
  const observerOptions = { root: null, threshold: 0.18 }; // Low enough for long channels like CH 06 to become active on entry
  const observerCallback = entries => {
    entries.forEach(entry => {
      const sectionId = entry.target.id;
      if (entry.isIntersecting) {
        const newChannel = entry.target.id;
        const moduleName = entry.target.dataset.module;

        if (currentChannel !== newChannel) {
          // Audio isolation: channels with media should use IntersectionObserver
          // to pause/resume based on visibility rather than global events

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

  const setupChannelSnap = () => {
    const sections = Array.from(document.querySelectorAll('.channel-section'));
    if (!sections.length || !mainContent) return;

    let settleTimer = null;
    const slack = 96;

    mainContent.addEventListener('scroll', () => {
      if (isProgrammaticSnap || tvGuideIsVisible) return;

      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        if (isProgrammaticSnap || tvGuideIsVisible) return;

        const y = mainContent.scrollTop;
        const viewport = mainContent.clientHeight;
        const viewportMid = y + viewport * 0.5;

        const current = sections.find(section => {
          const top = getChannelTop(section);
          const bottom = top + section.offsetHeight;
          return viewportMid >= top && viewportMid < bottom;
        });

        if (current) {
          const top = getChannelTop(current);
          const bottom = top + current.offsetHeight;
          const isLong = current.offsetHeight > viewport + slack * 2;
          const insideLongContent = isLong && y > top + slack && y < bottom - viewport - slack;

          if (insideLongContent) return;

          if (!isLong || Math.abs(y - top) <= viewport * 0.42) {
            scrollToChannel(current);
            return;
          }
        }

        const nearest = sections.reduce((best, section) => {
          const distance = Math.abs(y - getChannelTop(section));
          return !best || distance < best.distance ? { section, distance } : best;
        }, null);

        if (nearest && nearest.distance <= viewport * 0.48) {
          scrollToChannel(nearest.section);
        }
      }, 150);
    }, { passive: true });
  };

  setupChannelSnap();

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
            }).catch(() => {});
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

  // --- Intersection Observer for Channel 4 YouTube Video Control ---
  const channel4 = document.getElementById("section4");
  const channel4ObserverOptions = { root: null, threshold: 0.7 };
  const channel4Observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target.id === "section4") {
        if (entry.intersectionRatio >= 0.7) {
          // Ensure video is playing
          if (window.channel4Player && typeof window.channel4Player.playVideo === "function") {
            const state = window.channel4Player.getPlayerState ? window.channel4Player.getPlayerState() : null;
            if (state !== 1) {
              window.channel4Player.playVideo();
            }
          }

          // Unmute once player confirms it is playing
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
          const unmuteWhenPlaying = () => {
            if (!window.channel4Player || typeof window.channel4Player.getPlayerState !== 'function') {
              setTimeout(unmuteWhenPlaying, 250);
              return;
            }

            const st = window.channel4Player.getPlayerState();

            if (st === 1) { // Player is PLAYING
              if (!isMobile || window.soundAllowed) {
                if (typeof window.channel4Player.unMute === 'function') {
                  window.channel4Player.unMute();
                }
              } else {
                setTimeout(unmuteWhenPlaying, 250);
              }
            } else {
              if (typeof window.channel4Player.playVideo === 'function') {
                window.channel4Player.playVideo();
              }
              setTimeout(unmuteWhenPlaying, 250);
            }
          };
          unmuteWhenPlaying();
        } else {
          if (window.channel4Player && typeof window.channel4Player.mute === "function") {
            window.channel4Player.mute();
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

// Preload channels so their content is ready
setTimeout(() => {
  loadChannelContent('ch4');
}, 2000);

setTimeout(() => {
  loadChannelContent('ch3');
}, 2400);

setTimeout(() => {
  loadChannelContent('ch6');
}, 3000);

setTimeout(() => {
  loadChannelContent('ch5');
}, 3600);

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
