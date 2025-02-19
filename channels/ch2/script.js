// channels/ch2/script.js
(() => {
  // --- Slideshow Logic ---
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  const slideInterval = 5000; // Rotate slides every 5 seconds
  
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }
  
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, slideInterval);
  
  // --- Countdown Timer ---
  let time = 30;
  setInterval(() => {
    time = time - 1 < 0 ? 30 : time - 1;
    const timerEl = document.getElementById('timer');
    if (timerEl) timerEl.innerText = time;
  }, 1000);
  
  // --- Limited Spots Counter ---
  let spotsLeft = 10;
  setInterval(() => {
    if (spotsLeft > 0) spotsLeft--;
    const spotsEl = document.getElementById("spots-counter");
    if (spotsEl) spotsEl.innerText = spotsLeft;
  }, 9000);
  
  // --- Ticker Speed Adjustment (Debounced) ---
  const tickerText = document.querySelector('.ticker-text');
  function updateTickerSpeed() {
    const textLength = tickerText.offsetWidth;
    const containerWidth = document.querySelector('.ticker').offsetWidth;
    // Calculate animation duration so the ticker scrolls smoothly
    const duration = Math.max(5, (textLength / containerWidth) * 8);
    tickerText.style.animationDuration = `${duration}s`;
  }
  // Simple debounce implementation
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateTickerSpeed, 250);
  });
  updateTickerSpeed();
})();
