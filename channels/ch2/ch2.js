// channels/ch2/ch2.js
import { loadHTML, loadCSS, dom, animations, sound, errorTracker } from '../../utils.js';

/**
 * Initialize Channel 2
 * @returns {Function} Cleanup function
 */
export async function init() {
  try {
    // Load HTML content
    await loadHTML('./channels/ch2/infomercial.html', document.getElementById('section2'));
    
    // Load CSS
    await loadCSS('./channels/ch2/styles.css');
    
    // Setup event listeners
    const cleanup = setupInfomercialEventListeners();
    
    // Log success
    console.log("Channel 2 infomercial initialized successfully");
    
    // Return cleanup function
    return cleanup;
  } catch (error) {
    errorTracker.track('Channel2.init', error);
    console.error('Failed to initialize Channel 2:', error);
    
    // Display error message
    const container = document.getElementById('section2');
    if (container) {
      container.innerHTML = `<div class="error">Error loading infomercial content.</div>
                         <div class="channel-number-overlay">CH 02</div>`;
    }
  }
}

/**
 * Setup infomercial event listeners
 * @returns {Function} Cleanup function
 */
function setupInfomercialEventListeners() {
  // Initialize all infomercial components
  const carouselCleanup = initProductCarousel();
  const buttonsCleanup = setupCTAButtons();
  const effectsCleanup = addInfomercialEffects();
  
  // Return combined cleanup function
  return () => {
    carouselCleanup();
    buttonsCleanup();
    effectsCleanup();
    console.log('Channel 2 cleanup complete');
  };
}

/**
 * Initialize product carousel
 * @returns {Function} Cleanup function
 */
function initProductCarousel() {
  const carousel = dom.get('.product-carousel');
  if (!carousel) return () => {};
  
  const products = dom.getAll('.product-carousel .product-item');
  let currentProduct = 0;
  const productInterval = 8000; // Showcase each product for 8 seconds
  
  // Testimonials content
  const testimonials = [
    "\"This completely changed my approach to business strategy!\"",
    "\"The innovation and attention to detail are remarkable.\"",
    "\"Nothing else compares to the quality and vision here.\"",
    "\"A revolutionary product that delivers real results.\""
  ];
  
  /**
   * Show a specific product
   * @param {number} index - Product index to display
   */
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
    const productDetails = currentItem.querySelector('.product-details');
    if (productDetails) {
      gsap.fromTo(
        productDetails,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
    
    const productImage = currentItem.querySelector('.product-image');
    if (productImage) {
      gsap.fromTo(
        productImage,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.2)" }
      );
    }
    
    // Update testimonial if exists
    const testimonial = dom.get('.testimonial');
    if (testimonial) {
      gsap.to(testimonial, { 
        opacity: 0, 
        duration: 0.3, 
        onComplete: () => {
          testimonial.textContent = testimonials[index];
          gsap.to(testimonial, { opacity: 1, duration: 0.5 });
        }
      });
    }
    
    // Update price flash animation
    const priceFlash = dom.get('.price-flash');
    if (priceFlash) {
      gsap.fromTo(
        priceFlash,
        { scale: 1, rotation: 0 },
        { scale: 1.2, rotation: 10, duration: 0.3, yoyo: true, repeat: 1 }
      );
    }
    
    currentProduct = index;
  }
  
  // Show initial product
  showProduct(0);
  
  // Setup rotation interval
  const rotationInterval = setInterval(() => {
    currentProduct = (currentProduct + 1) % products.length;
    showProduct(currentProduct);
  }, productInterval);
  
  // Setup navigation buttons
  const prevButton = dom.get('.prev-button');
  const nextButton = dom.get('.next-button');
  
  // Event handlers
  const prevHandler = () => {
    currentProduct = (currentProduct - 1 + products.length) % products.length;
    showProduct(currentProduct);
  };
  
  const nextHandler = () => {
    currentProduct = (currentProduct + 1) % products.length;
    showProduct(currentProduct);
  };
  
  // Attach event listeners
  if (prevButton) {
    prevButton.addEventListener('click', prevHandler);
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', nextHandler);
  }
  
  // Return cleanup function
  return () => {
    clearInterval(rotationInterval);
    
    if (prevButton) {
      prevButton.removeEventListener('click', prevHandler);
    }
    
    if (nextButton) {
      nextButton.removeEventListener('click', nextHandler);
    }
  };
}

/**
 * Setup CTA button event handlers
 * @returns {Function} Cleanup function
 */
function setupCTAButtons() {
  // Find all CTA buttons
  const ctaButtons = dom.getAll('.cta-button, .buy-now-button');
  if (!ctaButtons.length) return () => {};
  
  // List to store event listeners for cleanup
  const listeners = [];
  
  ctaButtons.forEach(button => {
    const clickHandler = event => {
      event.preventDefault();
      
      // Create vibrant "clicked" effect
      const buttonRect = button.getBoundingClientRect();
      const ripple = dom.create('div', {
        className: 'button-ripple',
        style: {
          top: `${event.clientY - buttonRect.top}px`,
          left: `${event.clientX - buttonRect.left}px`
        }
      });
      button.appendChild(ripple);
      
      // Add pulsating glow effect
      button.classList.add('pulsate');
      
      // Play "ka-ching" sound effect
      sound.play('./audio/ka-ching.mp3', { volume: 0.4 });
      
      // Show confirmation message
      const productContainer = button.closest('.product-item');
      if (productContainer) {
        const confirmMessage = dom.create('div', { 
          className: 'confirm-message',
          textContent: 'Added to Cart!'
        });
        productContainer.appendChild(confirmMessage);
        
        // Animate confirmation
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
    };
    
    // Attach the event
    button.addEventListener('click', clickHandler);
    
    // Save for cleanup
    listeners.push([button, 'click', clickHandler]);
  });
  
  // Return cleanup function
  return () => {
    listeners.forEach(([element, event, handler]) => {
      element.removeEventListener(event, handler);
    });
  };
}

/**
 * Add special visual effects for the infomercial
 * @returns {Function} Cleanup function
 */
function addInfomercialEffects() {
  const animations = [];
  
  // Flashing "Limited Time Offer" element
  const limitedTimeOffer = dom.get('.limited-time');
  if (limitedTimeOffer) {
    // Create flashing animation using GSAP
    const limitedAnim = gsap.to(limitedTimeOffer, {
      opacity: 0.2,
      duration: 0.7,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true
    });
    animations.push(limitedAnim);
  }
  
  // Pulsating price elements
  const priceElements = dom.getAll('.price-tag');
  const priceAnims = [];
  
  priceElements.forEach(price => {
    const priceAnim = gsap.to(price, {
      scale: 1.05,
      duration: 1.5,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true
    });
    priceAnims.push(priceAnim);
  });
  animations.push(...priceAnims);
  
  // Add TV scan lines effect
  const infomercialContainer = dom.get('#infomercial-container');
  let scanLines = null;
  
  if (infomercialContainer) {
    scanLines = dom.create('div', { className: 'tv-scan-lines' });
    infomercialContainer.appendChild(scanLines);
  }
  
  // Add "As Seen On TV" badge
  let asSeenOnTV = null;
  
  if (infomercialContainer) {
    asSeenOnTV = dom.create('div', { 
      className: 'as-seen-on-tv',
      innerHTML: '<span>AS SEEN ON TV</span>'
    });
    infomercialContainer.appendChild(asSeenOnTV);
    
    // Rotate and pulse the badge
    const badgeAnim = gsap.to(asSeenOnTV, {
      rotation: 10,
      scale: 1.1,
      duration: 2,
      ease: "elastic.out(1, 0.3)",
      repeat: -1,
      yoyo: true
    });
    animations.push(badgeAnim);
  }
  
  // Return cleanup function
  return () => {
    // Kill all animations
    animations.forEach(anim => anim.kill());
    
    // Remove DOM elements added dynamically
    if (scanLines && scanLines.parentNode) {
      scanLines.parentNode.removeChild(scanLines);
    }
    
    if (asSeenOnTV && asSeenOnTV.parentNode) {
      asSeenOnTV.parentNode.removeChild(asSeenOnTV);
    }
  };
}

/**
 * Cleanup function to be called when channel is unloaded
 */
export function cleanup() {
  // Additional cleanup if needed
  console.log('Channel 2 explicit cleanup called');
}