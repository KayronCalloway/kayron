// Global variable for YouTube Player
let videoPlayer;

function onYouTubeIframeAPIReady() {
  console.log("Origin:", window.location.origin);
  videoPlayer = new YT.Player('videoIframe', {
    videoId: 'KISNE4qOIBM', // Your video ID
    playerVars: {
      autoplay: 1,
      controls: 0,
      loop: 1,
      playlist: 'KISNE4qOIBM', // Required for looping
      modestbranding: 1,
      showinfo: 0,
      rel: 0,
      origin: "https://kayroncalloway.github.io/",
      host: "https://www.youtube.com"
    },
    events: {
      onReady: onPlayerReady,
      onError: onPlayerError
    }
  });
}

function onPlayerReady(event) {
  // Always unmute video (user controls device volume)
  event.target.unMute();
  // Force video play to overcome autoplay restrictions
  event.target.playVideo();
  // Adaptive quality based on network conditions
  if (navigator.connection) {
    const qualityMap = {
      '4g': 'hd1080',
      '3g': 'large',
      '2g': 'small'
    };
    event.target.setPlaybackQuality(qualityMap[navigator.connection.effectiveType] || 'default');
  }
}

function onPlayerError(event) {
  console.error("Video Player Error:", event.data);
  document.getElementById('videoFallbackContainer').style.display = 'block';
}

function distortAndWarpContent() {
  gsap.fromTo(
    document.getElementById('mainContent'),
    { filter: "none", transform: "skewX(0deg)" },
    { filter: "blur(2px) contrast(1.2)", transform: "skewX(5deg)", duration: 0.3, ease: "power2.out", yoyo: true, repeat: 1 }
  );
}

document.addEventListener('DOMContentLoaded', () => {
  // Cache DOM elements
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
  const videoBackground = document.getElementById('videoBackground');

  let landingSequenceComplete = false;
  let autoScrollTimeout;
  let currentChannel = null;

  // Original channel sound structure: using an array of channel-click*.aif
  const channelSounds = Array.from({ length: 11 }, (_, i) => {
    const audio = new Audio(`channel-click${i + 1}.aif`);
    audio.preload = 'auto';
    return audio;
  });
  const playRandomChannelSound = () => {
    const randomIndex = Math.floor(Math.random() * channelSounds.length);
    channelSounds[randomIndex].play().catch(error => console.error('Audio playback failed:', error));
  };

  // Accessibility: Announce channel changes (for debugging, logged to console)
  function announce(message) {
    console.log(message);
  }

  // Performance Monitoring: Web Vitals tracking
  webVitals.getCLS(metric => sendToAnalytics('CLS', metric));
  webVitals.getFID(metric => sendToAnalytics('FID', metric));
  webVitals.getLCP(metric => sendToAnalytics('LCP', metric));

  function sendToAnalytics(metricName, metric) {
    const body = { [metricName]: metric.value, path: window.location.pathname };
    navigator.sendBeacon('/analytics', JSON.stringify(body));
    console.log(`Tracked ${metricName}:`, metric.value);
  }

  // Haptic Feedback
  function triggerHaptic() {
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
  }

  // Enhanced Touch: Swipe Navigation
  let touchStartX = 0;
  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });
  document.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].screenX;
    const diffX = touchStartX - touchEndX;
    if (Math.abs(diffX) > 50) {
      const direction = diffX > 0 ? 'next' : 'prev';
      navigateChannels(direction);
    }
  });

  function navigateChannels(direction) {
    const sections = Array.from(document.querySelectorAll('.channel-section'));
    const currentIndex = sections.findIndex(sec => sec.id === currentChannel);
    let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    targetIndex = Math.max(0, Math.min(sections.length - 1, targetIndex));
    sections[targetIndex].scrollIntoView({ behavior: 'smooth' });
    announce(`Now viewing channel ${targetIndex + 1}`);
    triggerHaptic();
  }

  // Code Splitting: Dynamic module loading (stub)
  async function loadChannelContent(channelId) {
    try {
      const module = await import(`./channels/${channelId}.js`);
      module.init();
    } catch (err) {
      console.warn(`Module for ${channelId} failed to load.`, err);
    }
  }

  // Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker registered:', reg))
        .catch(err => console.error('Service Worker registration failed:', err));
    });
  }

  // Power Button: Glow effect on touch
  powerButton.addEventListener('touchstart', () => powerButton.classList.add('touch-glow'));
  powerButton.addEventListener('touchend', () =>
    setTimeout(() => powerButton.classList.remove('touch-glow'), 200)
  );

  // Reveal Main Content after power button press
  const revealMainContent = () => {
    window.scrollTo({ top: mainContent.offsetTop, behavior: "smooth" });
    gsap.to(landing, {
      duration: 0.5,
      opacity: 0,
      onComplete: () => {
        landing.style.display = "none";
        mainContent.style.display = "block";
        document.body.style.overflow = "auto";
        gsap.to(header, { duration: 0.5, opacity: 1 });
      }
    });
  };

  // Landing Sequence Animation
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

  // Cancel auto-scroll on manual scroll
  window.addEventListener('scroll', () => {
    if (landingSequenceComplete && landing.style.display !== "none") {
      clearTimeout(autoScrollTimeout);
      revealMainContent();
    }
  }, { once: true, passive: true });

  // Parallax effect for video background (only on Channel 1)
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (currentChannel === 'section1') {
      videoBackground.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
  });

  // Back-to-Top Button
  window.addEventListener('scroll', () => {
    backToTop.style.display = window.pageYOffset > 300 ? 'block' : 'none';
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Menu Toggle for TV Guide
  menuButton.addEventListener('click', () => {
    if (tvGuide.style.display === 'flex') {
      tvGuide.style.opacity = 0;
      tvGuide.setAttribute('aria-hidden', 'true');
      setTimeout(() => { tvGuide.style.display = 'none'; }, 500);
    } else {
      tvGuide.style.display = 'flex';
      setTimeout(() => {
        tvGuide.style.opacity = 1;
        tvGuide.setAttribute('aria-hidden', 'false');
      }, 10);
    }
  });
  closeGuide.addEventListener('click', () => {
    tvGuide.style.opacity = 0;
    tvGuide.setAttribute('aria-hidden', 'true');
    setTimeout(() => { tvGuide.style.display = 'none'; }, 500);
  });
  guideItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetSection = document.getElementById(item.getAttribute('data-target'));
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
        tvGuide.style.opacity = 0;
        tvGuide.setAttribute('aria-hidden', 'true');
        setTimeout(() => { tvGuide.style.display = 'none'; }, 500);
        announce(`Now viewing ${item.querySelector('.channel-title').textContent}`);
        triggerHaptic();
      }
    });
  });

  // IntersectionObserver for channel transitions & dynamic module loading
  const observerOptions = { root: null, threshold: 0.7 };
  const observerCallback = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const newChannel = entry.target.id;
        if (currentChannel !== newChannel) {
          currentChannel = newChannel;
          playRandomChannelSound();
          triggerChannelStatic();
          animateChannelNumber(newChannel);
          announce(`Now viewing channel ${newChannel.slice(-1)}`);
          // Dynamic module loading (stub)
          const moduleName = entry.target.dataset.module;
          if (moduleName) {
            loadChannelContent(moduleName);
          }
          // Apply warp effect on transition
          distortAndWarpContent();
          // Fade video background based on channel (show video only on section1)
          if (currentChannel === 'section1') {
            gsap.to(videoBackground, { duration: 0.5, opacity: 1 });
          } else {
            gsap.to(videoBackground, { duration: 0.5, opacity: 0 });
          }
        }
      }
    });
  };
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  document.querySelectorAll('.channel-section').forEach(section => observer.observe(section));

  const triggerChannelStatic = () => {
    gsap.to(staticOverlay, {
      duration: 0.2,
      opacity: 0.3,
      onComplete: () => gsap.to(staticOverlay, { duration: 0.2, opacity: 0 })
    });
  };

  const animateChannelNumber = channelId => {
    const channelOverlay = document.querySelector(`#${channelId} .channel-number-overlay`);
    if (channelOverlay) {
      gsap.fromTo(channelOverlay, { scale: 1, filter: "brightness(1)" },
        { scale: 1.2, filter: "brightness(2)", duration: 0.2, yoyo: true, repeat: 1 });
    }
  };

  /* --- Modal Functionality with Focus Trap --- */
  const trapFocus = (modal) => {
    const focusableSelectors = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
    const focusableElements = modal.querySelectorAll(focusableSelectors);
    if (focusableElements.length === 0) return;
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleFocusTrap = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    };

    modal.addEventListener('keydown', handleFocusTrap);
    modal._handleFocusTrap = handleFocusTrap;
    firstFocusable.focus();
  };

  const releaseFocusTrap = (modal) => {
    if (modal._handleFocusTrap) {
      modal.removeEventListener('keydown', modal._handleFocusTrap);
      delete modal._handleFocusTrap;
    }
  };

  const animateModalIn = (modalOverlay, modalStaticId) => {
    const modalBox = modalOverlay.querySelector('.modal-box');
    gsap.fromTo(modalBox, { opacity: 0, y: -50, scale: 0.95, rotationX: 15, transformPerspective: 1000 },
      { opacity: 1, y: 0, scale: 1, rotationX: 0, duration: 0.8, ease: "power2.out" });
    gsap.fromTo(document.getElementById(modalStaticId), { x: -2, y: -2 },
      { x: 2, y: 2, duration: 0.4, ease: "power2.inOut", yoyo: true, repeat: 1 });
    trapFocus(modalOverlay);
  };

  const closeModal = (modalOverlay) => {
    const modalBox = modalOverlay.querySelector('.modal-box');
    releaseFocusTrap(modalOverlay);
    gsap.to(modalBox, {
      opacity: 0,
      y: -50,
      scale: 0.95,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        modalOverlay.style.display = 'none';
      }
    });
  };

  // Resume Modal
  const resumeButton = document.getElementById('resumeButton');
  const resumeModal = document.getElementById('resumeModal');
  const closeResume = document.getElementById('closeResume');

  resumeButton.addEventListener('click', () => {
    resumeModal.style.display = 'flex';
    animateModalIn(resumeModal, 'resumeStatic');
  });
  closeResume.addEventListener('click', () => closeModal(resumeModal));

  // About Modal
  const aboutButton = document.getElementById('aboutButton');
  const aboutModal = document.getElementById('aboutModal');
  const closeAbout = document.getElementById('closeAbout');

  aboutButton.addEventListener('click', () => {
    aboutModal.style.display = 'flex';
    animateModalIn(aboutModal, 'aboutStatic');
  });
  closeAbout.addEventListener('click', () => closeModal(aboutModal));

  // Contact Modal
  const contactButton = document.getElementById('contactButton');
  const contactModal = document.getElementById('contactModal');
  const closeContact = document.getElementById('closeContact');

  contactButton.addEventListener('click', () => {
    contactModal.style.display = 'flex';
    animateModalIn(contactModal, 'contactStatic');
  });
  closeContact.addEventListener('click', () => closeModal(contactModal));

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
      if (resumeModal.style.display === 'flex') closeModal(resumeModal);
      if (aboutModal.style.display === 'flex') closeModal(aboutModal);
      if (contactModal.style.display === 'flex') closeModal(contactModal);
    }
  });

  // Close modal when clicking outside modal box
  [resumeModal, aboutModal, contactModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });
});
