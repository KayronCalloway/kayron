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

  // --- Landing Sequence with GSAP Timeline ---
  powerButton.addEventListener('click', function() {
    // Disable further clicks on the power button
    powerButton.style.pointerEvents = 'none';
    
    // Create a GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Hide landing and show main content
        landing.style.display = 'none';
        mainContent.style.display = 'block';
        document.body.style.overflow = 'auto'; // Enable scrolling
        // Fade in header (persistent small name & menu button)
        gsap.to(header, { duration: 0.5, opacity: 1 });
      }
    });

    // Flash overlay: quickly flash the screen (simulate TV turning on)
    tl.to(flash, { duration: 0.3, opacity: 1 })
      .to(flash, { duration: 0.5, opacity: 0 });

    // Animate the landing name (flash across the screen)
    tl.to(landingName, {
      duration: 1.5,
      opacity: 1,
      scale: 1.2,
      ease: "power2.out"
    })
    .to(landingName, {
      duration: 1,
      scale: 1,
      ease: "power2.out",
      onComplete: () => {
        // (Optional) You can add an extra pause here if desired.
      }
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
