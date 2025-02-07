document.addEventListener('DOMContentLoaded', function() {
  const powerButton = document.getElementById('powerButton');
  const landing = document.getElementById('landing');
  const landingName = document.getElementById('landingName');
  const mainContent = document.getElementById('mainContent');
  const header = document.getElementById('header');
  const menuButton = document.getElementById('menuButton');
  const tvGuide = document.getElementById('tvGuide');
  const closeGuide = document.getElementById('closeGuide');
  const guideItems = document.querySelectorAll('.tv-guide-list nav ul li');
  const staticOverlay = document.getElementById('staticOverlay');
  const clickSound = document.getElementById('clickSound');
  const muteButton = document.getElementById('muteButton');
  
  let soundMuted = false;
  let landingSequenceComplete = false;
  let autoScrollTimeout;
  let currentChannel = null;
  
  // --- Preload Channel Click Sounds ---
  const channelSoundFiles = [];
  for (let i = 1; i <= 11; i++) {
    channelSoundFiles.push(`channel-click${i}.aif`);
  }
  const channelSounds = channelSoundFiles.map(src => {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = 0.8;
    return audio;
  });
  
  function playRandomChannelSound() {
    if (soundMuted) return;
    const randomIndex = Math.floor(Math.random() * channelSounds.length);
    channelSounds[randomIndex].play();
  }
  
  // --- Function to combine distortion and warping (CRT effect) ---
  function distortAndWarpContent() {
    gsap.fromTo(
      mainContent,
      { filter: "none", transform: "skewX(0deg)" },
      { filter: "blur(2px) contrast(1.2)", transform: "skewX(5deg)", duration: 0.3, ease: "power2.out", yoyo: true, repeat: 1 }
    );
  }
  
  // --- Landing Sequence using GSAP Timeline ---
  powerButton.addEventListener('click', function() {
    powerButton.style.pointerEvents = 'none';
    clickSound.play();
    gsap.to(powerButton, { duration: 0.3, opacity: 0, scale: 0, ease: "power2.in" });
    
    const tl = gsap.timeline({
      onComplete: () => {
        landingSequenceComplete = true;
        // Show mute button after power-on
        muteButton.style.display = 'block';
        gsap.to(muteButton, { duration: 0.5, opacity: 1 });
        autoScrollTimeout = setTimeout(() => {
          if (landing.style.display !== "none") {
            autoScrollToContent();
          }
        }, 3000);
      }
    });
    
    // Use static overlay for TV turn-on effect
    tl.to(staticOverlay, { duration: 0.2, opacity: 0.3 })
      .to(staticOverlay, { duration: 0.2, opacity: 0 });
    
    // Animate landing name: expand width from 0 to 100% and fade in
    tl.to(landingName, {
      duration: 1,
      width: "100%",
      opacity: 1,
      ease: "power2.out"
    });
  });
  
  // Function to auto-scroll to main content
  function autoScrollToContent() {
    window.scrollTo({ top: mainContent.offsetTop, behavior: "smooth" });
    gsap.to(landing, { duration: 0.5, opacity: 0, onComplete: () => {
      landing.style.display = "none";
      mainContent.style.display = "block";
      document.body.style.overflow = "auto";
      gsap.to(header, { duration: 0.5, opacity: 1 });
    }});
  }
  
  // On first scroll after landing, cancel auto-scroll and remove landing overlay
  window.addEventListener('scroll', function() {
    if (landingSequenceComplete && landing.style.display !== "none") {
      clearTimeout(autoScrollTimeout);
      gsap.to(landing, { duration: 0.5, opacity: 0, onComplete: () => {
        landing.style.display = "none";
        mainContent.style.display = "block";
        document.body.style.overflow = "auto";
        gsap.to(header, { duration: 0.5, opacity: 1 });
      }});
    }
  }, { once: true });
  
  // --- TV Guide Menu Interactions ---
  menuButton.addEventListener('click', function() {
    tvGuide.style.display = 'flex';
    setTimeout(() => {
      tvGuide.style.opacity = 1;
      tvGuide.setAttribute('aria-hidden', 'false');
    }, 10);
  });
  
  closeGuide.addEventListener('click', function() {
    tvGuide.style.opacity = 0;
    tvGuide.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      tvGuide.style.display = 'none';
    }, 500);
  });
  
  guideItems.forEach(item => {
    item.addEventListener('click', function() {
      const targetId = item.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
        tvGuide.style.opacity = 0;
        tvGuide.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
          tvGuide.style.display = 'none';
        }, 500);
      }
    });
  });
  
  // --- Rigid Scroll & Channel Change Effects ---
  const observerOptions = {
    root: mainContent,
    threshold: 0.7
  };
  
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const newChannel = entry.target.id;
        if (currentChannel !== newChannel) {
          currentChannel = newChannel;
          playRandomChannelSound();
          triggerChannelStatic();
          distortAndWarpContent();
          animateChannelNumber(newChannel);
        }
      }
    });
  };
  
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  document.querySelectorAll('.channel-section').forEach(section => {
    observer.observe(section);
  });
  
  // Function to trigger static overlay for channel change effect
  function triggerChannelStatic() {
    staticOverlay.style.opacity = 0.3;
    setTimeout(() => {
      staticOverlay.style.opacity = 0;
    }, 200);
  }
  
  // Function to animate the channel number overlay for the active channel
  function animateChannelNumber(channelId) {
    const channelOverlay = document.querySelector(`#${channelId} .channel-number-overlay`);
    if (channelOverlay) {
      gsap.fromTo(channelOverlay,
        { scale: 1, filter: "brightness(1)" },
        { scale: 1.2, filter: "brightness(2)", duration: 0.2, yoyo: true, repeat: 1 }
      );
    }
  }
  
  // --- Mute Button Interactions ---
  muteButton.addEventListener('click', function() {
    soundMuted = !soundMuted;
    muteButton.textContent = soundMuted ? "Unmute" : "Mute";
  });
  
  // Optional: Throttled scroll event (if additional handling is needed)
  function throttle(func, delay) {
    let timeout = null;
    return function() {
      if (!timeout) {
        timeout = setTimeout(() => {
          func();
          timeout = null;
        }, delay);
      }
    };
  }
  
  window.addEventListener('scroll', throttle(() => {
    // Additional scroll handling if needed.
  }, 200));
});
