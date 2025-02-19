// channels/ch2/script.js

// Since the markup is already injected, run immediately
(function() {
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  const totalSlides = slides.length;
  const slideInterval = 5000; // 5 seconds per slide

  function showSlide(index) {
    // Ensure index is within bounds
    index = Math.max(0, Math.min(index, totalSlides - 1));
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }

  // Auto-rotate slides
  setInterval(nextSlide, slideInterval);

  // (Optional) Add click listeners to the CTA button if desired
  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      // For example, navigate to a "contact" page or open a modal
      window.open('mailto:KayronCalloway@gmail.com', '_blank');
    });
  }
})();
