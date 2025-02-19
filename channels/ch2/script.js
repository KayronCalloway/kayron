// channels/ch2/script.js

(function() {
  // ---------- SLIDESHOW WITH RANDOM TRANSITION EFFECTS ----------
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  const totalSlides = slides.length;
  const slideInterval = 5000; // 5 seconds per slide
  const transitionEffects = ["fade", "zoom", "slide-left", "slide-right", "static-glitch"];

  function applyTransitionEffect(slide) {
    const effect = transitionEffects[Math.floor(Math.random() * transitionEffects.length)];
    slide.classList.add(effect);
    setTimeout(() => {
      slide.classList.remove(effect);
    }, 800);
  }

  function showSlide(index) {
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
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
    // Play slide change sound effect
    if (slideChangeSound) {
      slideChangeSound.play();
    }
  }

  setInterval(nextSlide, slideInterval);

  // ---------- DYNAMIC CTA BUTTON TEXT ----------
  const buttonMessages = [
    "Hire Kayron Now!",
    "LIMITED TIME OFFER!",
    "Kayron WILL CHANGE YOUR BUSINESS!",
    "BOOK A CALL NOW – SPOTS ARE LIMITED!",
    "LET’S BUILD SOMETHING GREAT TOGETHER!"
  ];

  function updateButtonText() {
    const button = document.querySelector('.cta-button');
    if (button) {
      const newText = buttonMessages[Math.floor(Math.random() * buttonMessages.length)];
      button.innerText = newText;
    }
  }

  setInterval(updateButtonText, 4000);

  // ---------- COUNTDOWN TIMER ----------
  let time = 30;
  setInterval(() => {
    time--;
    if (time < 0) time = 30;
    const timerEl = document.getElementById('timer');
    if (timerEl) timerEl.innerText = time;
  }, 1000);

  // ---------- LIMITED SPOTS COUNTER ----------
  let spotsLeft = 10;
  setInterval(() => {
    if (spotsLeft > 1) {
      spotsLeft--;
      const spotsEl = document.getElementById("spots-counter");
      if (spotsEl) spotsEl.innerText = spotsLeft;
    }
  }, 8000);

  // ---------- TESTIMONIAL TICKER UPDATE ----------
  const testimonials = [
    '"Kayron’s strategies changed my business overnight!" - CEO of Amazing Corp',
    '"Hiring Kayron was the best decision I made for my company!" - Startup Founder',
    '"The results were unbelievable. Thank you, Kayron!" - Marketing Director',
    '"I went from struggling to thriving. I highly recommend working with Kayron!" - Business Owner'
  ];

  function updateTestimonial() {
    const testimonialEl = document.getElementById('testimonial-text');
    if (testimonialEl) {
      testimonialEl.innerText = testimonials[Math.floor(Math.random() * testimonials.length)];
    }
  }

  setInterval(updateTestimonial, 10000);

  // ---------- TICKER MOTION BLUR EFFECT ----------
  const ticker = document.querySelector('.ticker-text');
  setInterval(() => {
    if (ticker) {
      ticker.classList.add("fast");
      setTimeout(() => ticker.classList.remove("fast"), 200);
    }
  }, 3000);

  // ---------- SOUND EFFECTS ----------
  const slideChangeSound = new Audio('audio/whoosh.mp3');
  const buttonHoverSound = new Audio('audio/ka-ching.mp3');
  const tickerStartSound = new Audio('audio/ticker-hum.mp3');

  // Play button hover sound on CTA hover
  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('mouseenter', () => {
      buttonHoverSound.play();
    });
  }
  // Play ticker sound once after 1 second
  setTimeout(() => {
    tickerStartSound.play();
  }, 1000);

  // ---------- TV GLITCH EFFECT ----------
  function triggerTVGlitch() {
    const glitch = document.querySelector('.tv-glitch');
    if (glitch) {
      glitch.style.display = "block";
      setTimeout(() => {
        glitch.style.display = "none";
      }, 250);
    }
  }
  setInterval(triggerTVGlitch, Math.floor(Math.random() * (30000 - 15000) + 15000));

  // ---------- TV GUIDE POPUP ----------
  // Show TV guide popup when clicking outside the infomercial container
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#infomercial-container')) {
      const guidePopup = document.getElementById('tv-guide-popup');
      if (guidePopup) {
        guidePopup.style.display = 'block';
      }
    }
  });
  // Close TV guide popup
  const closeGuide = document.getElementById('close-tv-guide');
  if (closeGuide) {
    closeGuide.addEventListener('click', (e) => {
      e.stopPropagation();
      const guidePopup = document.getElementById('tv-guide-popup');
      guidePopup.style.display = 'none';
    });
  }
})();
