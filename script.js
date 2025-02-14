document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
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
  
  // Channel-click sounds
  const channelSounds = Array.from({ length: 11 }, (_, i) => {
    const audio = new Audio(`audio/channel-click${i + 1}.aif`);
    audio.preload = 'auto';
    return audio;
  });
  const playRandomChannelSound = () => {
    const randomIndex = Math.floor(Math.random() * channelSounds.length);
    channelSounds[randomIndex].play().catch(error => console.error('Audio playback failed:', error));
  };
  
  // Simple announce function (for debugging)
  function announce(message) {
    console.log(message);
  }
  
  // (Optional) Web Vitals reporting – remove if not needed
  // webVitals.getCLS(metric => sendToAnalytics('CLS', metric));
  // webVitals.getFID(metric => sendToAnalytics('FID', metric));
  // webVitals.getLCP(metric => sendToAnalytics('LCP', metric));
  // function sendToAnalytics(metricName, metric) {
  //   const body = { [metricName]: metric.value, path: window.location.pathname };
  //   navigator.sendBeacon('/analytics', JSON.stringify(body));
  //   console.log(`Tracked ${metricName}:`, metric.value);
  // }
  
  // Haptic Feedback
  function triggerHaptic() {
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
  }
  
  // Swipe Navigation
  let touchStartX = 0;
  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });
  document.addEventListener('touchend', e => {
    const diffX = touchStartX - e.changedTouches[0].screenX;
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
    playRandomChannelSound();
  }
  
  // Dynamic Module Loading
  async function loadChannelContent(moduleName) {
    try {
      let module;
      if (moduleName === 'home') {
        module = await import(`./channels/ch1/home.js`);
      } else {
        module = await import(`./channels/${moduleName}.js`);
      }
      module.init();
    } catch (err) {
      console.warn(`Module for ${moduleName} failed to load.`, err);
    }
  }
  
  // Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then(reg => console.log('Service Worker registered:', reg))
        .catch(err => console.error('Service Worker registration failed:', err));
    });
  }
  
  // Touch Glow on Power Button
  powerButton.addEventListener('touchstart', () => powerButton.classList.add('touch-glow'));
  powerButton.addEventListener('touchend', () =>
    setTimeout(() => powerButton.classList.remove('touch-glow'), 200)
  );
  
  // Reveal Main Content (Landing Animation)
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
  
  // Landing Sequence on Power Button click
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
  
    window.addEventListener('scroll', () => {
      if (landingSequenceComplete && landing.style.display !== "none") {
        clearTimeout(autoScrollTimeout);
        revealMainContent();
      }
    }, { once: true, passive: true });
  });
  
  // Back to Top Button
  window.addEventListener('scroll', () => {
    backToTop.style.display = window.pageYOffset > 300 ? 'block' : 'none';
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  
  // TV Guide Menu Toggle
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
  
  // Combined Intersection Observer for channel transitions and YouTube audio control
  const observerOptions = { root: null, threshold: 0.7 };
  const channelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const channelId = entry.target.id;
      if (entry.isIntersecting) {
        // General channel transition effects (if channel changes)
        if (currentChannel !== channelId) {
          currentChannel = channelId;
          playRandomChannelSound();
          triggerChannelStatic();
          animateChannelNumber(channelId);
          announce(`Now viewing channel ${channelId.slice(-1)}`);
          const moduleName = entry.target.dataset.module;
          if (moduleName) {
            loadChannelContent(moduleName);
          }
          distortAndWarpContent();
        }
        // YouTube audio control: Unmute if Channel 1 is visible.
        if (channelId === "section1" && youtubePlayer && typeof youtubePlayer.unMute === "function") {
          youtubePlayer.unMute();
          console.log("Channel 1 in view: Unmuting video.");
        }
      } else {
        // If Channel 1 is not visible, mute the video.
        if (channelId === "section1" && youtubePlayer && typeof youtubePlayer.mute === "function") {
          youtubePlayer.mute();
          console.log("Channel 1 not in view: Muting video.");
        }
      }
    });
  }, observerOptions);
  
  // Start observing all channel sections
  document.querySelectorAll('.channel-section').forEach(section => channelObserver.observe(section));
  
  // Additional Effects Functions
  function triggerChannelStatic() {
    gsap.to(staticOverlay, {
      duration: 0.2,
      opacity: 0.3,
      onComplete: () => gsap.to(staticOverlay, { duration: 0.2, opacity: 0 })
    });
  }
  
  function animateChannelNumber(channelId) {
    const channelOverlay = document.querySelector(`#${channelId} .channel-number-overlay`);
    if (channelOverlay) {
      gsap.fromTo(channelOverlay, { scale: 1, filter: "brightness(1)" },
        { scale: 1.2, filter: "brightness(2)", duration: 0.2, yoyo: true, repeat: 1 });
    }
  }
  
  function distortAndWarpContent() {
    gsap.fromTo(
      mainContent,
      { filter: "none", transform: "skewX(0deg)" },
      { filter: "blur(2px) contrast(1.2)", transform: "skewX(5deg)", duration: 0.3, ease: "power2.out", yoyo: true, repeat: 1 }
    );
  }
});
