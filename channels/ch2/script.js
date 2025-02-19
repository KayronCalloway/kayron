// channels/ch2/script.js
(() => {
  // --- Configuration Constants ---
  const SLIDE_INTERVAL = 5000; // 5 seconds per slide
  const BUTTON_TEXT_INTERVAL = 4000; // (Not used now since no CTA)
  const COUNTDOWN_INTERVAL = 1000; // 1 second
  const SPOTS_INTERVAL = 9000; // 9 seconds

  // --- Uniform Slideshow ---
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  
  // Simple uniform fade transition for all slides
  const showSlide = (index) => {
    index = Math.max(0, Math.min(index, slides.length - 1));
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    currentSlide = index;
  };

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, SLIDE_INTERVAL);
  
  // --- Countdown Timer ---
  let time = 30;
  setInterval(() => {
    time = time - 1 < 0 ? 30 : time - 1;
    const timerEl = document.getElementById('timer');
    if (timerEl) timerEl.innerText = time;
  }, COUNTDOWN_INTERVAL);
  
  // --- Limited Spots Counter ---
  let spotsLeft = 10;
  setInterval(() => {
    if (spotsLeft > 0) spotsLeft--;
    const spotsEl = document.getElementById("spots-counter");
    if (spotsEl) spotsEl.innerText = spotsLeft;
  }, SPOTS_INTERVAL);
  
  // --- LIVE Badge (Real-Time Clock) ---
  const updateLiveTime = () => {
    const liveTimeEl = document.getElementById('live-time');
    if (liveTimeEl) liveTimeEl.innerText = new Date().toLocaleTimeString();
  };
  setInterval(updateLiveTime, 1000);
  updateLiveTime();

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
