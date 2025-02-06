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

  let landingSequenceComplete = false;
  let autoScrollTimeout;

  // --- Landing Sequence using GSAP Timeline ---
  powerButton.addEventListener('click', function() {
    // Disable further clicks
    powerButton.style.pointerEvents = 'none';
    
    // Animate power button out (fade & scale down)
    gsap.to(powerButton, { duration: 0.3, opacity: 0, scale: 0, ease: "power2.in" });
    
    // Create a GSAP timeline for the landing sequence
    const tl = gsap.timeline({
      onComplete: () => {
        landingSequenceComplete = true;
        // Start an auto-scroll timer (e.g., 5 seconds) if the user doesn't scroll manually
        autoScrollTimeout = setTimeout(() => {
          if (landing.style.display !== "none") {
            autoScrollToContent();
          }
        }, 5000);
      }
    });
    
    // Flash effect: simulate TV turning on
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

  // Function to auto scroll to the main content
  function autoScrollToContent() {
    // Trigger a smooth scroll to the main content
    window.scrollTo({ top: mainContent.offsetTop, behavior: "smooth" });
    // Also, remove the landing overlay
    gsap.to(landing, { duration: 0.5, opacity: 0, onComplete: () => {
      landing.style.display = "none";
      mainContent.style.display = "block";
      document.body.style.overflow = "auto";
      gsap.to(header, { duration: 0.5, opacity: 1 });
    }});
  }

  // On first scroll after landing sequence, cancel auto-scroll and fade out landing overlay
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

  // --- Channel Blink Effect on Scroll ---
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
    document.querySelectorAll('.channel-section').forEach(section => {
      section.classList.add('glitch');
      setTimeout(() => {
        section.classList.remove('glitch');
      }, 300);
    });
  }, 200));
});
