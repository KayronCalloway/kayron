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

  // --- Landing Sequence using GSAP Timeline ---
  powerButton.addEventListener('click', function() {
    // Disable further clicks
    powerButton.style.pointerEvents = 'none';
    
    // Animate power button out (fade and scale down)
    gsap.to(powerButton, { duration: 0.3, opacity: 0, scale: 0, ease: "power2.in" });
    
    // Create a GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // When complete, hide the landing overlay, show main content, and enable scrolling.
        landing.style.display = 'none';
        mainContent.style.display = 'block';
        document.body.style.overflow = 'auto';
        // Fade in header (which remains centered at the top)
        gsap.to(header, { duration: 0.5, opacity: 1 });
      }
    });
    
    // Flash effect: simulate TV turning on
    tl.to(flash, { duration: 0.3, opacity: 1 })
      .to(flash, { duration: 0.5, opacity: 0 });
    
    // Animate the landing name:
    // Step 1: Expand the name's width from 0 to 100% with a fade-in (left-to-right wipe)
    tl.to(landingName, {
      duration: 1,
      width: "100%",
      opacity: 1,
      ease: "power2.out"
    });
    // (Note: We no longer animate upward—the landing overlay simply disappears
    // and the fixed header takes over, ensuring the name stays centered.)
  });

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

  // --- Channel Glitch Effect on Scroll ---
  // Throttle function to improve performance
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
      }, 500);
    });
  }, 200));
});
