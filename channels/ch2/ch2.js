// channels/ch2/ch2.js

export async function init() {
  try {
    // Container validation
    const container = document.getElementById('section2');
    if (!container) {
      console.error("Channel 2 container not found");
      return;
    }
    
    // Prevent duplicate initialization
    if (container.querySelector('#infomercial-container')) {
      console.log("Infomercial already loaded; skipping initialization.");
      return;
    }
    
    // Load the HTML fragment for Channel 2 using async/await
    const response = await fetch('./channels/ch2/infomercial.html');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    const html = await response.text();
    container.innerHTML = html;
    
    // Add channel number overlay if it doesn't exist
    if (!container.querySelector('.channel-number-overlay')) {
      const channelOverlay = document.createElement('div');
      channelOverlay.className = 'channel-number-overlay';
      channelOverlay.textContent = 'CH 02';
      container.appendChild(channelOverlay);
    }
    
    // Dynamically load CSS
    if (!document.querySelector('link[href="./channels/ch2/styles.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = './channels/ch2/styles.css';
      document.head.appendChild(link);
    }
    
    // Setup event listeners and initialize the infomercial experience
    setupInfomercialEventListeners();
    
    console.log("Channel 2 infomercial initialized successfully");
  } catch (error) {
    console.error("Failed to load Channel 2 markup:", error);
    const container = document.getElementById('section2');
    if (container) {
      container.innerHTML = `<div class="error">Error loading infomercial content.</div>
                           <div class="channel-number-overlay">CH 02</div>`;
    }
  }
}

function setupInfomercialEventListeners() {
  // Initialize product showcase carousel
  initProductCarousel();
  
  // Setup "Buy Now" and CTA button interactions
  setupCTAButtons();
  
  // Add special infomercial effects
  addInfomercialEffects();
}

function initProductCarousel() {
  const carousel = document.querySelector('.product-carousel');
  if (!carousel) return;
  
  const products = carousel.querySelectorAll('.product-item');
  let currentProduct = 0;
  const productInterval = 8000; // Showcase each product for 8 seconds
  
  function showProduct(index) {
    // Normalize index within bounds
    index = Math.max(0, Math.min(index, products.length - 1));
    
    // Hide all products first
    products.forEach(product => {
      product.classList.remove('active');
      product.setAttribute('aria-hidden', 'true');
    });
    
    // Show current product with animation
    const currentItem = products[index];
    currentItem.classList.add('active');
    currentItem.setAttribute('aria-hidden', 'false');
    
    // Apply animation effects
    gsap.fromTo(
      currentItem.querySelector('.product-details'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );
    
    gsap.fromTo(
      currentItem.querySelector('.product-image'),
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.2)" }
    );
    
    // Update testimonial if exists
    const testimonial = document.querySelector('.testimonial');
    const testimonials = [
      "\"This completely changed my approach to business strategy!\"",
      "\"The innovation and attention to detail are remarkable.\"",
      "\"Nothing else compares to the quality and vision here.\"",
      "\"A revolutionary product that delivers real results.\""
    ];
    
    if (testimonial) {
      gsap.to(testimonial, { opacity: 0, duration: 0.3, onComplete: () => {
        testimonial.textContent = testimonials[index];
        gsap.to(testimonial, { opacity: 1, duration: 0.5 });
      }});
    }
    
    // Update price flash animation
    const priceFlash = document.querySelector('.price-flash');
    if (priceFlash) {
      gsap.fromTo(
        priceFlash,
        { scale: 1, rotation: 0 },
        { scale: 1.2, rotation: 10, duration: 0.3, yoyo: true, repeat: 1 }
      );
    }
    
    currentProduct = index;
  }
  
  // Initial display
  showProduct(0);
  
  // Setup automatic rotation
  setInterval(() => {
    currentProduct = (currentProduct + 1) % products.length;
    showProduct(currentProduct);
  }, productInterval);
  
  // Setup manual navigation with arrow buttons
  const prevButton = document.querySelector('.prev-button');
  const nextButton = document.querySelector('.next-button');
  
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      currentProduct = (currentProduct - 1 + products.length) % products.length;
      showProduct(currentProduct);
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      currentProduct = (currentProduct + 1) % products.length;
      showProduct(currentProduct);
    });
  }
}

function setupCTAButtons() {
  // Find all CTA buttons
  const ctaButtons = document.querySelectorAll('.cta-button, .buy-now-button');
  
  ctaButtons.forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      
      // Create vibrant "clicked" effect
      const buttonRect = button.getBoundingClientRect();
      const ripple = document.createElement('div');
      ripple.className = 'button-ripple';
      ripple.style.top = `${event.clientY - buttonRect.top}px`;
      ripple.style.left = `${event.clientX - buttonRect.left}px`;
      button.appendChild(ripple);
      
      // Add pulsating glow effect
      button.classList.add('pulsate');
      
      // Play "ka-ching" sound effect if available
      const kaChingSound = new Audio('./audio/ka-ching.mp3');
      kaChingSound.volume = 0.4;
      kaChingSound.play().catch(err => console.warn('Could not play sound:', err));
      
      // Show "Added to Cart" or "Thank You" message
      const productContainer = button.closest('.product-item');
      if (productContainer) {
        const confirmMessage = document.createElement('div');
        confirmMessage.className = 'confirm-message';
        confirmMessage.textContent = 'Added to Cart!';
        productContainer.appendChild(confirmMessage);
        
        gsap.fromTo(
          confirmMessage,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.4)" }
        );
        
        // Remove message and effects after delay
        setTimeout(() => {
          confirmMessage.remove();
          button.classList.remove('pulsate');
          ripple.remove();
        }, 2000);
      }
    });
  });
}

function addInfomercialEffects() {
  // Add special visual effects that mimic TV infomercials
  
  // Flashing "Limited Time Offer" element
  const limitedTimeOffer = document.querySelector('.limited-time');
  if (limitedTimeOffer) {
    // Create flashing animation using GSAP
    gsap.to(limitedTimeOffer, {
      opacity: 0.2,
      duration: 0.7,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true
    });
  }
  
  // Pulsating price element
  const priceElements = document.querySelectorAll('.price-tag');
  priceElements.forEach(price => {
    gsap.to(price, {
      scale: 1.05,
      duration: 1.5,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true
    });
  });
  
  // Add TV scan lines effect
  const infomercialContainer = document.getElementById('infomercial-container');
  if (infomercialContainer) {
    const scanLines = document.createElement('div');
    scanLines.className = 'tv-scan-lines';
    infomercialContainer.appendChild(scanLines);
  }
  
  // Add "As Seen On TV" badge
  const asSeenOnTV = document.createElement('div');
  asSeenOnTV.className = 'as-seen-on-tv';
  asSeenOnTV.innerHTML = `<span>AS SEEN ON TV</span>`;
  document.querySelector('#infomercial-container')?.appendChild(asSeenOnTV);
  
  // Rotate and pulse the badge
  gsap.to(asSeenOnTV, {
    rotation: 10,
    scale: 1.1,
    duration: 2,
    ease: "elastic.out(1, 0.3)",
    repeat: -1,
    yoyo: true
  });
}