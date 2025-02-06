document.addEventListener('DOMContentLoaded', function() {
  const powerButton = document.getElementById('powerButton');
  const landing = document.getElementById('landing');
  const flash = document.getElementById('flash');
  const mainContent = document.getElementById('mainContent');
  const header = document.getElementById('header');
  const menuButton = document.getElementById('menuButton');
  const tvGuide = document.getElementById('tvGuide');
  const closeGuide = document.getElementById('closeGuide');
  const guideItems = document.querySelectorAll('.tv-guide nav ul li');
  
  // Power Button: Trigger TV turn-on sequence
  powerButton.addEventListener('click', function() {
    // 1. Trigger the flash effect
    flash.style.opacity = 1;
    setTimeout(() => {
      flash.style.transition = 'opacity 0.5s ease-out';
      flash.style.opacity = 0;
    }, 50);
    
    // 2. Allow landing name animation to play, then transition
    setTimeout(() => {
      landing.style.display = 'none';
      mainContent.style.display = 'block';
      document.body.style.overflow = 'auto'; // Enable scrolling
      
      // Show header with persistent name and menu button
      header.style.opacity = 1;
    }, 3500); // Adjust timing to match your landing animation
  });
  
  // Menu Button: Show TV guide overlay with fade-in
  menuButton.addEventListener('click', function() {
    tvGuide.style.display = 'flex';
    setTimeout(() => {
      tvGuide.style.opacity = 1;
      tvGuide.setAttribute('aria-hidden', 'false');
    }, 10);
  });
  
  // Close TV guide overlay with fade-out
  closeGuide.addEventListener('click', function() {
    tvGuide.style.opacity = 0;
    tvGuide.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      tvGuide.style.display = 'none';
    }, 500);
  });
  
  // TV Guide Navigation: Scroll to section when an item is clicked
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
  
  // Throttle function for performance
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
  
  // Channel Changing Effect on Scroll (apply glitch effect briefly)
  window.addEventListener('scroll', throttle(() => {
    document.querySelectorAll('.channel-section').forEach(section => {
      section.classList.add('glitch');
      setTimeout(() => {
        section.classList.remove('glitch');
      }, 500);
    });
  }, 200));
});
