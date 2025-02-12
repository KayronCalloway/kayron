document.addEventListener('DOMContentLoaded', () => {
  // Cache DOM elements for TV Portfolio
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
  
  // State variables
  let soundMuted = false;
  let landingSequenceComplete = false;
  let autoScrollTimeout;
  let currentChannel = null;
  let sporadicGlitchStarted = false;
  
  // --- Preload Channel Click Sounds ---
  const channelSounds = Array.from({ length: 11 }, (_, i) => {
    const audio = new Audio(`channel-click${i + 1}.aif`);
    audio.preload = 'auto';
    audio.volume = 0.8;
    return audio;
  });
  
  const playRandomChannelSound = () => {
    if (soundMuted) return;
    const randomIndex = Math.floor(Math.random() * channelSounds.length);
    channelSounds[randomIndex].play().catch(error =>
      console.error('Audio playback failed:', error)
    );
  };
  
  // --- Glitch Effect using GSAP ---
  const distortAndWarpContent = () => {
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
  };
  
  // --- Recursively Schedule Sporadic Glitch ---
  const scheduleSporadicGlitch = () => {
    const delay = Math.random() * 10000 + 10000; // Delay between 10-20 seconds
    setTimeout(() => {
      distortAndWarpContent();
      scheduleSporadicGlitch();
    }, delay);
  };
  
  // --- Touch Events for Mobile (Power Button Glow) ---
  powerButton.addEventListener('touchstart', () => powerButton.classList.add('touch-glow'));
  powerButton.addEventListener('touchend', () =>
    setTimeout(() => powerButton.classList.remove('touch-glow'), 200)
  );
  
  // --- Helper: Reveal Main Content ---
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
  
  // --- Landing Sequence Animation ---
  powerButton.addEventListener('click', () => {
    powerButton.style.pointerEvents = 'none';
    if (clickSound) {
      clickSound.play().catch(error => console.error('Click sound failed:', error));
    }
    
    // Fade out the power button
    gsap.to(powerButton, {
      duration: 0.3,
      opacity: 0,
      ease: "power2.out",
      onComplete: () => powerButton.style.display = "none"
    });
    
    // Build GSAP timeline for landing sequence
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
  
  // --- Reveal Main Content on First Scroll (Cancel Auto-scroll) ---
  window.addEventListener('scroll', () => {
    if (landingSequenceComplete && landing.style.display !== "none") {
      clearTimeout(autoScrollTimeout);
      revealMainContent();
    }
  }, { once: true, passive: true });
  
  // --- TV Guide Menu Interactions ---
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
  
  // --- IntersectionObserver for Channel Change Effects ---
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
        }
      }
    });
  };
  
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  document.querySelectorAll('.channel-section').forEach(section => observer.observe(section));
  
  // --- Trigger Static Overlay Effect on Channel Change ---
  const triggerChannelStatic = () => {
    gsap.to(staticOverlay, {
      duration: 0.2,
      opacity: 0.3,
      onComplete: () => gsap.to(staticOverlay, { duration: 0.2, opacity: 0 })
    });
  };
  
  // --- Animate the Active Channel Number Overlay ---
  const animateChannelNumber = channelId => {
    const channelOverlay = document.querySelector(`#${channelId} .channel-number-overlay`);
    if (channelOverlay) {
      gsap.fromTo(
        channelOverlay,
        { scale: 1, filter: "brightness(1)" },
        { scale: 1.2, filter: "brightness(2)", duration: 0.2, yoyo: true, repeat: 1 }
      );
    }
  };
  
  // --- Mute Button Interaction ---
  muteButton.addEventListener('click', () => {
    soundMuted = !soundMuted;
    muteButton.textContent = soundMuted ? "Unmute" : "Mute";
  });
  
  // --- Optional: Throttle Function for Additional Scroll Handling ---
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
  
  /* === Modal Functionality for Channel 1 Buttons === */
  // Resume Modal (already implemented)
  const resumeButton = document.getElementById('resumeButton');
  const resumeModal = document.getElementById('resumeModal');
  const closeResume = document.getElementById('closeResume');
  
  const openResumeModal = () => {
    resumeModal.style.display = 'block';
    gsap.fromTo(
      resumeModal,
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" }
    );
    gsap.fromTo(
      document.getElementById('resumeStatic'),
      { opacity: 0.2 },
      { opacity: 0, duration: 0.4, ease: "power2.inOut", repeat: 3, yoyo: true }
    );
  };
  
  const closeResumeModal = () => {
    gsap.to(resumeModal, {
      opacity: 0,
      y: 50,
      scale: 0.9,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        resumeModal.style.display = 'none';
      }
    });
  };
  
  resumeButton.addEventListener('click', openResumeModal);
  closeResume.addEventListener('click', closeResumeModal);
  
  // About Me Modal
  const aboutButton = document.getElementById('aboutButton');
  const aboutModal = document.getElementById('aboutModal');
  const closeAbout = document.getElementById('closeAbout');
  
  const openAboutModal = () => {
    aboutModal.style.display = 'block';
    gsap.fromTo(
      aboutModal,
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" }
    );
    gsap.fromTo(
      document.getElementById('aboutStatic'),
      { opacity: 0.2 },
      { opacity: 0, duration: 0.4, ease: "power2.inOut", repeat: 3, yoyo: true }
    );
  };
  
  const closeAboutModal = () => {
    gsap.to(aboutModal, {
      opacity: 0,
      y: 50,
      scale: 0.9,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        aboutModal.style.display = 'none';
      }
    });
  };
  
  aboutButton.addEventListener('click', openAboutModal);
  closeAbout.addEventListener('click', closeAboutModal);
  
  // Contact Modal
  const contactButton = document.getElementById('contactButton');
  const contactModal = document.getElementById('contactModal');
  const closeContact = document.getElementById('closeContact');
  
  const openContactModal = () => {
    contactModal.style.display = 'block';
    gsap.fromTo(
      contactModal,
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" }
    );
    gsap.fromTo(
      document.getElementById('contactStatic'),
      { opacity: 0.2 },
      { opacity: 0, duration: 0.4, ease: "power2.inOut", repeat: 3, yoyo: true }
    );
  };
  
  const closeContactModal = () => {
    gsap.to(contactModal, {
      opacity: 0,
      y: 50,
      scale: 0.9,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        contactModal.style.display = 'none';
      }
    });
  };
  
  contactButton.addEventListener('click', openContactModal);
  closeContact.addEventListener('click', closeContactModal);
  
  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
      if (resumeModal.style.display === 'block') closeResumeModal();
      if (aboutModal.style.display === 'block') closeAboutModal();
      if (contactModal.style.display === 'block') closeContactModal();
    }
  });
  
  // Close modal when clicking outside the modal content
  [resumeModal, aboutModal, contactModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (modal === resumeModal) closeResumeModal();
        if (modal === aboutModal) closeAboutModal();
        if (modal === contactModal) closeContactModal();
      }
    });
  });
});
