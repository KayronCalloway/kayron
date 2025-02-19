// channels/ch2/script.js

(() => {
  // --- Configuration Constants ---
  const SLIDE_INTERVAL = 4500; // milliseconds
  const BUTTON_TEXT_INTERVAL = 4000;
  const COUNTDOWN_INTERVAL = 1000;
  const SPOTS_INTERVAL = 9000;

  const buttonMessages = [
    "Hire Kayron Now!",
    "LIMITED TIME OFFER!",
    "Kayron WILL CHANGE YOUR BUSINESS!",
    "BOOK A CALL NOW – SPOTS ARE LIMITED!",
    "LET’S BUILD SOMETHING GREAT TOGETHER!"
  ];

  // --- SLIDESHOW WITH RANDOM TRANSITION EFFECTS ---
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  const totalSlides = slides.length;
  const transitionEffects = ["fade", "zoom", "slide-left", "slide-right", "static-glitch"];

  const applyTransitionEffect = (slide) => {
    const effect = transitionEffects[Math.floor(Math.random() * transitionEffects.length)];
    const handleAnimationEnd = () => {
      slide.classList.remove(effect);
      slide.removeEventListener('animationend', handleAnimationEnd);
    };
    slide.addEventListener('animationend', handleAnimationEnd);
    slide.classList.add(effect);
  };

  const showSlide = (index) => {
    index = Math.max(0, Math.min(index, totalSlides - 1));
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
        applyTransitionEffect(slide);
      } else {
        slide.classList.remove('active');
      }
    });
    currentSlide = index;
  };

  setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }, SLIDE_INTERVAL);

  // --- KEYBOARD NAVIGATION FOR SLIDESHOW ---
  window.addEventListener('keyup', (e) => {
    if (e.key === "ArrowRight") {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    } else if (e.key === "ArrowLeft") {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      showSlide(currentSlide);
    }
  });

  // --- DYNAMIC CTA BUTTON TEXT ---
  const updateButtonText = () => {
    const button = document.querySelector('.cta-button');
    if (button) {
      button.innerText = buttonMessages[Math.floor(Math.random() * buttonMessages.length)];
    }
  };
  setInterval(updateButtonText, BUTTON_TEXT_INTERVAL);

  // --- COUNTDOWN TIMER ---
  let time = 30;
  setInterval(() => {
    time = (time - 1 < 0) ? 30 : time - 1;
    const timerEl = document.getElementById('timer');
    if (timerEl) timerEl.innerText = time;
  }, COUNTDOWN_INTERVAL);

  // --- LIMITED SPOTS COUNTER ---
  let spotsLeft = 10;
  setInterval(() => {
    if (spotsLeft > 0) {
      spotsLeft--;
      const spotsEl = document.getElementById("spots-counter");
      if (spotsEl) spotsEl.innerText = spotsLeft;
    }
  }, SPOTS_INTERVAL);

  // --- TICKER SPEED ADJUSTMENT (Debounced Resize) ---
  const tickerText = document.querySelector('.ticker-text');
  const updateTickerSpeed = () => {
    const textLength = tickerText.offsetWidth;
    const containerWidth = document.querySelector('.ticker').offsetWidth;
    const duration = Math.max(5, (textLength / containerWidth) * 8);
    tickerText.style.animationDuration = `${duration}s`;
  };

  // Debounce function
  const debounce = (func, delay) => {
    let timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(func, delay);
    };
  };

  updateTickerSpeed();
  window.addEventListener('resize', debounce(updateTickerSpeed, 250));

  // --- LIVE BADGE (Real-Time Clock) ---
  const updateLiveTime = () => {
    const liveTimeEl = document.getElementById('live-time');
    if (liveTimeEl) liveTimeEl.innerText = new Date().toLocaleTimeString();
  };
  setInterval(updateLiveTime, 1000);
  updateLiveTime();

  // --- TV GLITCH EFFECT ---
  const triggerTVGlitch = () => {
    const glitch = document.querySelector('.tv-glitch');
    if (glitch) {
      glitch.style.display = "block";
      setTimeout(() => { glitch.style.display = "none"; }, 250);
    }
  };
  setInterval(triggerTVGlitch, Math.floor(Math.random() * (30000 - 15000) + 15000));

  // --- TV GUIDE POPUP ---
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#infomercial-container')) {
      const guidePopup = document.getElementById('tv-guide-popup');
      if (guidePopup) guidePopup.style.display = 'block';
    }
  });
  const closeGuide = document.getElementById('close-tv-guide');
  if (closeGuide) {
    closeGuide.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('tv-guide-popup').style.display = 'none';
    });
  }
})();
