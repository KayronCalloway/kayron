// Declare global variable(s) needed by the YouTube API
var soundMuted = false; // global variable for video mute state

// Global variable for YouTube Player
let videoPlayer;
function onYouTubeIframeAPIReady() {
  videoPlayer = new YT.Player('videoIframe', {
    videoId: 'KISNE4qOIBM',
    playerVars: {
      autoplay: 1,
      controls: 0,
      loop: 1,
      playlist: 'KISNE4qOIBM',
      modestbranding: 1,
      showinfo: 0,
      rel: 0
    },
    events: {
      'onReady': onPlayerReady,
      'onError': onPlayerError
    }
  });
}
function onPlayerReady(event) {
  // Use the global soundMuted variable
  if (soundMuted) {
    event.target.mute();
  } else {
    event.target.unMute();
  }
}
function onPlayerError(event) {
  console.error("Video Player Error:", event.data);
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
  const muteButton = document.getElementById('muteButton');
  const backToTop = document.getElementById('backToTop');
  const videoBackground = document.getElementById('videoBackground');
  
  let lastFocusedElement;
  // Note: soundMuted is global now.
  let landingSequenceComplete = false;
  let autoScrollTimeout;
  let currentChannel = null;
  let sporadicGlitchStarted = false;
  
  // Preload channel click sounds
  const channelSounds = Array.from({ length: 11 }, (_, i) => {
    const audio = new Audio(`channel-click${i + 1}.aif`);
    audio.preload = 'auto';
    audio.volume = 0.8;
    return audio;
  });
  const playRandomChannelSound = () => {
    if (soundMuted) return;
    const randomIndex = Math.floor(Math.random() * channelSounds.length);
    channelSounds[randomIndex].play().catch(error => console.error('Audio playback failed:', error));
  };
  
  // Glitch effect using GSAP for main content
  const distortAndWarpContent = () => {
    gsap.fromTo(mainContent, { filter: "none", transform: "skewX(0deg)" }, {
      filter: "blur(2px) contrast(1.2)",
      transform: "skewX(5deg)",
      duration: 0.3,
      ease: "power2.out",
      yoyo: true,
      repeat: 1
    });
  };
  const scheduleSporadicGlitch = () => {
    const delay = Math.random() * 10000 + 10000;
    setTimeout(() => {
      distortAndWarpContent();
      scheduleSporadicGlitch();
    }, delay);
  };
  
  // Touch events for power button glow
  powerButton.addEventListener('touchstart', () => powerButton.classList.add('touch-glow'));
  powerButton.addEventListener('touchend', () =>
    setTimeout(() => powerButton.classList.remove('touch-glow'), 200)
  );
  
  // Helper: Reveal Main Content after power button pressed
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
  
  // Landing sequence animation
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
        muteButton.style.display = 'block';
        gsap.to(muteButton, { duration: 0.5, opacity: 1 });
        autoScrollTimeout = setTimeout(() => {
          if (landing.style.display !== "none") revealMainContent();
        }, 3000);
        if (!sporadicGlitchStarted) {
          sporadicGlitchStarted = true;
          scheduleSporadicGlitch();
        }
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
  
  // Cancel auto-scroll if user scrolls manually before timeout
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
  
  // Back-to-Top Button functionality
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTop.style.display = 'block';
    } else {
      backToTop.style.display = 'none';
    }
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  
  // TV Guide interactions
  menuButton.addEventListener('click', () => {
    tvGuide.style.display = 'flex';
    setTimeout(() => {
      tvGuide.style.opacity = 1;
      tvGuide.setAttribute('aria-hidden', 'false');
    }, 10);
  });
  closeGuide.addEventListener('click', () => {
    tvGuide.style.opacity = 0;
    tvGuide.setAttribute('aria-hidden', 'true');
    setTimeout(() => tvGuide.style.display = 'none', 500);
  });
  guideItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetSection = document.getElementById(item.getAttribute('data-target'));
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
        tvGuide.style.opacity = 0;
        tvGuide.setAttribute('aria-hidden', 'true');
        setTimeout(() => tvGuide.style.display = 'none', 500);
      }
    });
  });
  
  // IntersectionObserver for channel animations & video background visibility
  const observerOptions = { root: mainContent, threshold: 0.7 };
  const observerCallback = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const newChannel = entry.target.id;
        if (currentChannel !== newChannel) {
          currentChannel = newChannel;
          playRandomChannelSound();
          triggerChannelStatic();
          animateChannelNumber(newChannel);
          // Show video background only on Channel 1; hide on others
          if (currentChannel === 'section1') {
            videoBackground.style.display = 'block';
          } else {
            videoBackground.style.display = 'none';
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
      gsap.fromTo(channelOverlay, { scale: 1, filter: "brightness(1)" }, { scale: 1.2, filter: "brightness(2)", duration: 0.2, yoyo: true, repeat: 1 });
    }
  };
  
  // Mute Button: Toggle both channel sounds and video
  muteButton.addEventListener('click', () => {
    soundMuted = !soundMuted;
    muteButton.textContent = soundMuted ? "Unmute" : "Mute";
    if (videoPlayer) {
      if (soundMuted) {
        videoPlayer.mute();
      } else {
        videoPlayer.unMute();
      }
    }
  });
  
  const throttle = (func, delay) => {
    let timeout = null;
    return (...args) => {
      if (!timeout) {
        timeout = setTimeout(() => {
          func(...args);
          timeout = null;
        }, delay);
      }
    };
  };
  window.addEventListener('scroll', throttle(() => {
    // Additional scroll handling logic if needed.
  }, 200), { passive: true });
  
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
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };
  
  // Animate modal-box entrance with a gentle flow-out from the top
  const animateModalIn = (modalOverlay, modalStaticId) => {
    const modalBox = modalOverlay.querySelector('.modal-box');
    gsap.fromTo(modalBox, { opacity: 0, y: -100, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" });
    gsap.fromTo(document.getElementById(modalStaticId), { x: -2, y: -2 }, { x: 2, y: 2, duration: 0.4, ease: "power2.inOut", yoyo: true, repeat: 1 });
    trapFocus(modalOverlay);
  };
  
  const closeModal = (modalOverlay) => {
    const modalBox = modalOverlay.querySelector('.modal-box');
    releaseFocusTrap(modalOverlay);
    gsap.to(modalBox, {
      opacity: 0,
      y: -100,
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
    lastFocusedElement = document.activeElement;
    resumeModal.style.display = 'flex';
    animateModalIn(resumeModal, 'resumeStatic');
  });
  closeResume.addEventListener('click', () => closeModal(resumeModal));
  
  // About Me Modal
  const aboutButton = document.getElementById('aboutButton');
  const aboutModal = document.getElementById('aboutModal');
  const closeAbout = document.getElementById('closeAbout');
  
  aboutButton.addEventListener('click', () => {
    lastFocusedElement = document.activeElement;
    aboutModal.style.display = 'flex';
    animateModalIn(aboutModal, 'aboutStatic');
  });
  closeAbout.addEventListener('click', () => closeModal(aboutModal));
  
  // Contact Modal
  const contactButton = document.getElementById('contactButton');
  const contactModal = document.getElementById('contactModal');
  const closeContact = document.getElementById('closeContact');
  
  contactButton.addEventListener('click', () => {
    lastFocusedElement = document.activeElement;
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
  
  // Close modal when clicking outside the modal box
  [resumeModal, aboutModal, contactModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });
});
