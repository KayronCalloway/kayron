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
    // Fade out and shrink the power button immediately
    gsap.to(powerButton, { duration: 0.3, opacity: 0, scale: 0, ease: "power2.in" });

    // Create a GSAP timeline for the landing sequence
    const tl = gsap.timeline({
      onComplete: () => {
        // Hide landing overlay, show main content, enable scrolling, fade in header
        landing.style.display = 'none';
        mainContent.style.display = 'block';
        document.body.style.overflow = 'auto';
        gsap.to(header, { duration: 0.5, opacity: 1 });
      }
    });

    // Flash effect: simulate TV turning on
    tl.to(flash, { duration: 0.3, opacity: 1 })
      .to(flash, { duration: 0.5, opacity: 0 });
    
    // Animate the landing name:
    // Step 1: Expand the name from 0 width to full width (end-to-end) with fade-in
    tl.to(landingName, {
      duration: 1,
      opacity: 1,
      width: "100%",
      ease: "power2.out"
    });
    
    // Step 2: Scroll the name upward to center (vertically centered)
    tl.to(landingName, {
      duration: 1,
      y: "-50vh",
      ease: "power2.inOut"
    });
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
  // Throttle function for better performance
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
