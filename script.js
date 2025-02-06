document.addEventListener('DOMContentLoaded', function() {
  const powerButton = document.getElementById('powerButton');
  const landing = document.getElementById('landing');
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
  let currentChannel = null;

  // --- Landing Sequence using GSAP Timeline ---
  powerButton.addEventListener('click', function() {
    powerButton.style.pointerEvents = 'none';
    gsap.to(powerButton, { duration: 0.3, opacity: 0, scale: 0, ease: "power2.in" });
    
    const tl = gsap.timeline({
      onComplete: () => {
        landingSequenceComplete = true;
        autoScrollTimeout = setTimeout(() => {
          if (landing.style.display !== "none") {
            autoScrollToContent();
          }
        }, 3000);
      }
    });
    
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
  
  // --- Rigid Scroll & Channel Change Blink Effect ---
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
          triggerChannelFlash();
        }
      }
    });
  };
  
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  document.querySelectorAll('.channel-section').forEach(section => {
    observer.observe(section);
  });
  
  function triggerChannelFlash() {
    channelFlash.style.opacity = 1;
    setTimeout(() => {
      channelFlash.style.opacity = 0;
    }, 200);
  }
  
  function throttle(func, delay) {
    let timeout = null;
    return function() {
      if (!timeout) {
        timeout = setTimeout(() => {
          func();
          timeout = null;
        }, delay);
      }
    }
  }
  
  window.addEventListener('scroll', throttle(() => {
    // Additional scroll logic if needed
  }, 200));
});
