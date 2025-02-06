document.addEventListener('DOMContentLoaded', function() {
  const powerButton = document.getElementById('powerButton');
  const landing = document.getElementById('landing');
  const flash = document.getElementById('flash');
  const landingName = document.getElementById('landingName');
  const mainContent = document.getElementById('mainContent');
  const header = document.getElementById('header');
  const menuButton = document.getElementById('menuButton');
  const tvGuide = document.getElementById('tvGuide');
  const closeGuide = document.getElementById('closeGuide');
  const guideItems = document.querySelectorAll('.tv-guide nav ul li');
  const channelFlash = document.getElementById('channelFlash');

  let landingSequenceComplete = false;
  let autoScrollTimeout;
  let currentChannel = null;  // To track which channel is currently active

  // --- Landing Sequence using GSAP Timeline ---
  powerButton.addEventListener('click', function() {
    powerButton.style.pointerEvents = 'none';
    gsap.to(powerButton, { duration: 0.3, opacity: 0, scale: 0, ease: "power2.in" });
    
    const tl = gsap.timeline({
      onComplete: () => {
        landingSequenceComplete = true;
        // Start auto-scroll timer (set to 3 seconds)
        autoScrollTimeout = setTimeout(() => {
          if (landing.style.display !== "none") {
            autoScrollToContent();
          }
        }, 3000);
      }
    });
    
    tl.to(flash, { duration: 0.3, opacity: 1 })
      .to(flash, { duration: 0.5, opacity: 0 });
    
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

  // On first scroll after landing sequence, cancel auto-scroll and transition out landing overlay
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

  // --- Rigid Scroll with Snap & Channel Change Blink Effect ---
  // (CSS scroll-snap properties are set on #mainContent and .channel-section)
  
  // Use IntersectionObserver to detect when a new channel becomes active
  const observerOptions = {
    root: mainContent,
    threshold: 0.7  // Adjust threshold as needed
  };
  
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const newChannel = entry.target.id;
        if (currentChannel !== newChannel) {
          currentChannel = newChannel;
          triggerChannelFlash();
        }
      }
    });
  };
  
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  document.querySelectorAll('.channel-section').forEach(section => {
    observer.observe(section);
  });
  
  // Function to trigger full-page blink (channel flash)
  function triggerChannelFlash() {
    channelFlash.style.opacity = 1;
    setTimeout(() => {
      channelFlash.style.opacity = 0;
    }, 200); // 200ms blink
  }
  
  // Additionally, a throttled scroll event to catch manual scrolls (if needed)
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
    // (This additional scroll event is optional since IntersectionObserver handles channel changes.)
  }, 200));
});
