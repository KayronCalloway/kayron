// We'll define onYouTubeIframeAPIReady on window so the YouTube API can find it
window.onYouTubeIframeAPIReady = function() {
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
      rel: 0
      // Notice: NO "origin" parameter here, so YouTube auto-detects the domain
    },
    events: {
      onReady: onPlayerReady,
      onError: onPlayerError
    }
  });
};

function onPlayerReady(event) {
  event.target.unMute(); // Always unmute
  event.target.playVideo(); // Force playback, might need user gesture
  if (navigator.connection) {
    const qualityMap = { '4g': 'hd1080', '3g': 'large', '2g': 'small' };
    event.target.setPlaybackQuality(qualityMap[navigator.connection.effectiveType] || 'default');
  }
}

function onPlayerError(event) {
  console.error("Video Player Error:", event.data);
  document.getElementById('videoFallbackContainer').style.display = 'block';
}

// Distort warp effect
function distortAndWarpContent() {
  gsap.fromTo(
    document.getElementById('mainContent'),
    { filter: "none", transform: "skewX(0deg)" },
    { filter: "blur(2px) contrast(1.2)", transform: "skewX(5deg)", duration: 0.3, ease: "power2.out", yoyo: true, repeat: 1 }
  );
}

document.addEventListener('DOMContentLoaded', () => {
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

  // Original channel-click sounds
  const channelSounds = Array.from({ length: 11 }, (_, i) => {
    const audio = new Audio(`channel-click${i + 1}.aif`);
    audio.preload = 'auto';
    return audio;
  });
  const playRandomChannelSound = () => {
    const randomIndex = Math.floor(Math.random() * channelSounds.length);
    channelSounds[randomIndex].play().catch(error => console.error('Audio playback failed:', error));
  };

  function announce(message) {
    console.log(message);
  }

  // Web Vitals
  webVitals.getCLS(metric => sendToAnalytics('CLS', metric));
  webVitals.getFID(metric => sendToAnalytics('FID', metric));
  webVitals.getLCP(metric => sendToAnalytics('LCP', metric));
  function sendToAnalytics(metricName, metric) {
    const body = { [metricName]: metric.value, path: window.location.pathname };
    navigator.sendBeacon('/analytics', JSON.stringify(body));
    console.log(`Tracked ${metricName}:`, metric.value);
  }

  // Haptic feedback
  function triggerHaptic() {
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
  }

  // Swipe navigation
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

  // Dynamic module loading (stub)
  async function loadChannelContent(channelId) {
    try {
      const module = await import(`./channels/${channelId}.js`);
      module.init();
    } catch (err) {
      console.warn(`Module for ${channelId} failed to load.`, err);
    }
  }

  // Service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker registered:', reg))
        .catch(err => console.error('Service Worker registration failed:', err));
    });
  }

  // Touch glow on power button
  powerButton.addEventListener('touchstart', () => powerButton.classList.add('touch-glow'));
  powerButton.addEventListener('touchend', () =>
    setTimeout(() => powerButton.classList.remove('touch-glow'), 200)
  );

  // Reveal main content
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

  // Landing sequence
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

  // Parallax on channel 1
  window.addEventListener('scroll', () => {
    if (currentChannel === 'section1') {
      const scrolled = window.pageYOffset;
      videoBackground.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
  });

  // Back to top
  window.addEventListener('scroll', () => {
    backToTop.style.display = window.pageYOffset > 300 ? 'block' : 'none';
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Menu toggle
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

  // TV guide navigation
  guideItems.forEach(item => {
    item.addEventListener('click', () => {
      currentChannel = item.dataset.channel;
      playRandomChannelSound();
      loadChannelContent(currentChannel);
      announce(`Loading channel ${currentChannel}`);
      menuButton.click();
    });
  });

  // Accessibility improvements
  document.body.addEventListener('keydown', (event) => {
    if (event.code === 'Escape' && tvGuide.style.display === 'flex') {
      closeGuide.click();
    }
  });

  // Page transitions
  const pageLinks = document.querySelectorAll('a');
  pageLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const target = event.target.href;
      gsap.to(landing, {
        duration: 0.3,
        opacity: 0,
        onComplete: () => {
          window.location.href = target;
        }
      });
    });
  });

  // Initialize YouTube API
  const script = document.createElement('script');
  script.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(script);
});
