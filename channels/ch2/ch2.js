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
    
    // Dynamically load CSS first to prevent FOUC (Flash of Unstyled Content)
    await loadStyles();
    
    // First, load the intro slideshow
    const slideResponse = await fetch('./channels/ch2/index.html');
    if (!slideResponse.ok) throw new Error(`HTTP error! Status: ${slideResponse.status}`);
    
    const slideHtml = await slideResponse.text();
    container.innerHTML = slideHtml;
    
    // Force header to be visible by notifying MenuManager
    setTimeout(() => {
      import('../../menu-manager.js').then(({ notifyChannelChanged }) => {
        notifyChannelChanged();
        console.log("Notified MenuManager to ensure header and guide button visibility");
      }).catch(err => console.error("Error importing MenuManager:", err));
    }, 300);
    
    // Add channel number overlay if it doesn't exist
    if (!container.querySelector('.channel-number-overlay')) {
      const channelOverlay = document.createElement('div');
      channelOverlay.className = 'channel-number-overlay';
      channelOverlay.textContent = 'CH 02';
      container.appendChild(channelOverlay);
    }
    
    // Load the slideshow script
    await loadScript('./channels/ch2/script.js');
    
    // Initialize slideshow if needed
    setTimeout(() => {
      // Verify slides exist and initialize them
      const slides = document.querySelectorAll('.slide');
      if (slides.length > 0) {
        // Ensure first slide is active
        slides.forEach((slide, i) => {
          slide.classList.toggle('active', i === 0);
        });
        console.log(`Initialized slideshow with ${slides.length} slides`);
      } else {
        console.error("No slides found in the slideshow");
      }
    }, 500);
    
    // Add an interactive "Enter Showcase" button
    const enterButton = document.createElement('button');
    enterButton.id = 'enter-showcase-button';
    enterButton.textContent = 'Enter Showcase';
    enterButton.className = 'enter-button';
    container.appendChild(enterButton);
    
    // Event listener for the enter button
    enterButton.addEventListener('click', async () => {
      // Play transition sound
      const whoosh = new Audio('./audio/whoosh.mp3');
      whoosh.volume = 0.5;
      whoosh.play().catch(err => console.warn('Could not play sound:', err));
      
      // Add transition effect
      const transition = document.createElement('div');
      transition.className = 'slideshow-transition';
      container.appendChild(transition);
      
      // Animate transition
      gsap.to(transition, {
        opacity: 1,
        duration: 0.5,
        onComplete: async () => {
          // Load the infomercial content
          const response = await fetch('./channels/ch2/infomercial.html');
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          
          const html = await response.text();
          container.innerHTML = html;
          
          // Re-add channel number overlay
          const channelOverlay = document.createElement('div');
          channelOverlay.className = 'channel-number-overlay';
          channelOverlay.textContent = 'CH 02';
          container.appendChild(channelOverlay);
          
          // Setup event listeners and initialize the infomercial experience
          setupInfomercialEventListeners();
          
          // Fade out transition
          const newTransition = document.createElement('div');
          newTransition.className = 'slideshow-transition';
          newTransition.style.opacity = 1;
          container.appendChild(newTransition);
          
          gsap.to(newTransition, {
            opacity: 0,
            duration: 0.5,
            delay: 0.2,
            onComplete: () => {
              newTransition.remove();
            }
          });
        }
      });
    });
    
    // Let MenuManager handle button visibility
    
    // Ensure TV Guide has correct positioning
    const tvGuide = document.getElementById('tvGuide');
    if (tvGuide) {
      tvGuide.style.position = 'fixed';
      tvGuide.style.top = '0';
      tvGuide.style.left = '0';
      tvGuide.style.width = '100%';
      tvGuide.style.height = '100%';
      tvGuide.style.zIndex = '10000000';
    }
    
    // Preload audio for better performance
    preloadAudio('./audio/ka-ching.mp3');
    preloadAudio('./audio/whoosh.mp3');
    preloadAudio('./audio/ticker-hum.mp3');
    
    console.log("Channel 2 initialized successfully with slideshow intro");
  } catch (error) {
    console.error("Failed to load Channel 2 markup:", error);
    const container = document.getElementById('section2');
    if (container) {
      container.innerHTML = `<div class="error">Error loading infomercial content.</div>
                           <div class="channel-number-overlay">CH 02</div>`;
    }
  }
}

// Helper function to load styles asynchronously
function loadStyles() {
  return new Promise((resolve) => {
    if (!document.querySelector('link[href="./channels/ch2/styles.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = './channels/ch2/styles.css';
      link.onload = () => resolve();
      document.head.appendChild(link);
    } else {
      resolve();
    }
  });
}

// Helper function to load scripts asynchronously
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}

// Preload audio files
function preloadAudio(src) {
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = src;
  // Don't need to add to DOM, just create the object to cache it
}

// Clean up resources when leaving channel
function cleanup() {
  // Stop any animations
  const animations = document.querySelectorAll('.limited-time, .price-tag, .as-seen-on-tv');
  animations.forEach(el => {
    if (window.gsap && gsap.isTweening(el)) {
      gsap.killTweensOf(el);
    }
  });
  
  // Stop any timers
  if (window.ch2CarouselTimer) {
    clearInterval(window.ch2CarouselTimer);
    window.ch2CarouselTimer = null;
  }
  
  // Stop any audio
  if (window.ch2TickerSound) {
    window.ch2TickerSound.pause();
    window.ch2TickerSound.currentTime = 0;
  }
}

// Listen for channel change events
document.addEventListener('channelChange', cleanup);

function setupInfomercialEventListeners() {
  // Initialize product showcase carousel
  initProductCarousel();
  
  // Setup "Buy Now" and CTA button interactions
  setupCTAButtons();
  
  // Add special infomercial effects (with optimized animations)
  addInfomercialEffects();
  
  // Add lazy loading for images
  setupLazyLoading();
  
  // Play ticker hum sound subtly in the background
  playTickerSound();
  
  // Setup back to showcase button
  setupBackButton();
}

function initProductCarousel() {
  const carousel = document.querySelector('.product-carousel');
  if (!carousel) return;
  
  const products = carousel.querySelectorAll('.product-item');
  let currentProduct = 0;
  const productInterval = 8000; // Showcase each product for 8 seconds
  
  // Create a reusable animation timeline for better performance
  const productTimeline = gsap.timeline({paused: true});
  
  function showProduct(index, skipAnimation = false) {
    // Normalize index within bounds
    index = Math.max(0, Math.min(index, products.length - 1));
    
    // Hide all products first
    products.forEach(product => {
      product.classList.remove('active');
      product.setAttribute('aria-hidden', 'true');
      product.style.display = 'none'; // Fully hide inactive products for better performance
    });
    
    // Show current product
    const currentItem = products[index];
    currentItem.classList.add('active');
    currentItem.setAttribute('aria-hidden', 'false');
    currentItem.style.display = 'flex';
    
    if (!skipAnimation) {
      // Reset and reuse animation timeline for better performance
      productTimeline.clear();
      
      // Add animations to timeline
      productTimeline.fromTo(
        currentItem.querySelector('.product-details'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        0
      );
      
      productTimeline.fromTo(
        currentItem.querySelector('.product-image'),
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.2)" },
        0.1
      );
      
      // Play the timeline
      productTimeline.restart();
    } else {
      // Set final state without animation
      gsap.set(currentItem.querySelector('.product-details'), { opacity: 1, y: 0 });
      gsap.set(currentItem.querySelector('.product-image'), { opacity: 1, scale: 1 });
    }
    
    // Update testimonial if exists
    updateTestimonial(index);
    
    // Flash the price tag with reduced animation
    flashPriceTag();
    
    currentProduct = index;
  }
  
  function updateTestimonial(index) {
    const testimonial = document.querySelector('.testimonial');
    const testimonials = [
      "\"This completely changed my approach to business strategy!\"",
      "\"The innovation and attention to detail are remarkable.\"",
      "\"Nothing else compares to the quality and vision here.\"",
      "\"A revolutionary product that delivers real results.\""
    ];
    
    if (testimonial) {
      gsap.to(testimonial, { opacity: 0, duration: 0.2, onComplete: () => {
        testimonial.textContent = testimonials[index];
        gsap.to(testimonial, { opacity: 1, duration: 0.3 });
      }});
    }
  }
  
  function flashPriceTag() {
    const priceFlash = document.querySelector('.product-item.active .price-flash');
    if (priceFlash) {
      gsap.fromTo(
        priceFlash,
        { scale: 1, rotation: 0 },
        { scale: 1.1, rotation: 5, duration: 0.2, yoyo: true, repeat: 1 }
      );
    }
  }
  
  // Initial display (skip animation for first load)
  showProduct(0, true);
  
  // Setup automatic rotation with a referenceable timer
  window.ch2CarouselTimer = setInterval(() => {
    currentProduct = (currentProduct + 1) % products.length;
    showProduct(currentProduct);
  }, productInterval);
  
  // Setup manual navigation with arrow buttons using event delegation
  document.addEventListener('click', (e) => {
    if (e.target.matches('.prev-button')) {
      currentProduct = (currentProduct - 1 + products.length) % products.length;
      showProduct(currentProduct);
    } else if (e.target.matches('.next-button')) {
      currentProduct = (currentProduct + 1) % products.length;
      showProduct(currentProduct);
    }
  });
}

function setupCTAButtons() {
  // Use event delegation for better performance
  document.addEventListener('click', (e) => {
    if (e.target.matches('.cta-button, .buy-now-button')) {
      const button = e.target;
      
      // Create vibrant "clicked" effect
      createRippleEffect(button, e);
      
      // Add pulsating glow effect
      button.classList.add('pulsate');
      
      // Play "ka-ching" sound effect if available
      playButtonSound();
      
      // Show "Added to Cart" or "Thank You" message
      showConfirmationMessage(button);
    }
  });
}

function createRippleEffect(button, event) {
  const buttonRect = button.getBoundingClientRect();
  const ripple = document.createElement('div');
  ripple.className = 'button-ripple';
  ripple.style.top = `${event.clientY - buttonRect.top}px`;
  ripple.style.left = `${event.clientX - buttonRect.left}px`;
  button.appendChild(ripple);
  
  // Auto-remove after animation completes
  setTimeout(() => ripple.remove(), 600);
}

function playButtonSound() {
  // Reuse audio object for better performance
  const kaChingSound = new Audio('./audio/ka-ching.mp3');
  kaChingSound.volume = 0.4;
  kaChingSound.play().catch(err => console.warn('Could not play sound:', err));
}

function showConfirmationMessage(button) {
  const productContainer = button.closest('.product-item') || button.closest('.cta-section');
  if (productContainer) {
    const confirmMessage = document.createElement('div');
    confirmMessage.className = 'confirm-message';
    confirmMessage.textContent = button.classList.contains('buy-now-button') ? 'Added to Cart!' : 'Thank You!';
    productContainer.appendChild(confirmMessage);
    
    gsap.fromTo(
      confirmMessage,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
    );
    
    // Remove message and effects after delay
    setTimeout(() => {
      gsap.to(confirmMessage, {
        opacity: 0, 
        y: -10, 
        duration: 0.3, 
        onComplete: () => {
          confirmMessage.remove();
          button.classList.remove('pulsate');
        }
      });
    }, 1800);
  }
}

function addInfomercialEffects() {
  // Add special visual effects that mimic TV infomercials
  // Create a single timeline for all animations
  const effectsTimeline = gsap.timeline();
  
  // Add TV scan lines effect (via CSS only - no JS animation needed)
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
  
  // Batch animations together for better performance
  // Flashing "Limited Time Offer" element
  const limitedTimeOffer = document.querySelector('.limited-time');
  if (limitedTimeOffer) {
    effectsTimeline.to(limitedTimeOffer, {
      opacity: 0.3,
      duration: 1,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true
    }, 0);
  }
  
  // Pulsating price elements - reduce number of animations
  const priceElements = document.querySelectorAll('.price-tag');
  if (priceElements.length > 0) {
    effectsTimeline.to(priceElements, {
      scale: 1.03,
      duration: 2,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.2 // Stagger animations for better performance
    }, 0);
  }
  
  // Rotate and pulse the badge with lighter animation
  effectsTimeline.to(asSeenOnTV, {
    rotation: 8,
    scale: 1.05,
    duration: 2.5,
    ease: "power1.inOut",
    repeat: -1,
    yoyo: true
  }, 0);
}

// Setup lazy loading for images
function setupLazyLoading() {
  // Use native lazy loading for images that support it
  const productImages = document.querySelectorAll('.product-image img');
  
  productImages.forEach(img => {
    // Ensure loading="lazy" attribute is set
    img.setAttribute('loading', 'lazy');
    
    // Add error handling
    img.addEventListener('error', () => {
      console.warn('Image failed to load:', img.src);
      img.src = 'visuals/static.png'; // Fallback image
    });
  });
}

// Play ticker hum sound in the background
function playTickerSound() {
  const tickerSound = new Audio('./audio/ticker-hum.mp3');
  tickerSound.volume = 0.2;
  tickerSound.loop = true;
  
  // Store reference for cleanup
  window.ch2TickerSound = tickerSound;
  
  // Only play if user has interacted with the page
  if (document.documentElement.classList.contains('user-interacted')) {
    tickerSound.play().catch(err => console.warn('Could not play ticker sound:', err));
  } else {
    // Add event listener for first interaction
    const playOnInteraction = () => {
      tickerSound.play().catch(err => console.warn('Could not play ticker sound:', err));
      document.documentElement.classList.add('user-interacted');
      document.removeEventListener('click', playOnInteraction);
    };
    document.addEventListener('click', playOnInteraction);
  }
}

// Setup back button to return to slideshow
function setupBackButton() {
  const backButton = document.getElementById('back-to-showcase');
  const container = document.getElementById('section2');
  
  if (backButton && container) {
    backButton.addEventListener('click', async () => {
      // Play transition sound
      const whoosh = new Audio('./audio/whoosh.mp3');
      whoosh.volume = 0.5;
      whoosh.play().catch(err => console.warn('Could not play sound:', err));
      
      // Stop ticker sound if playing
      if (window.ch2TickerSound) {
        window.ch2TickerSound.pause();
        window.ch2TickerSound.currentTime = 0;
      }
      
      // Add transition effect
      const transition = document.createElement('div');
      transition.className = 'slideshow-transition';
      container.appendChild(transition);
      
      // Animate transition
      gsap.to(transition, {
        opacity: 1,
        duration: 0.5,
        onComplete: async () => {
          // Clean up any running animations or timers
          cleanup();
          
          // Load the slideshow content again
          const slideResponse = await fetch('./channels/ch2/index.html');
          if (!slideResponse.ok) throw new Error(`HTTP error! Status: ${slideResponse.status}`);
          
          const slideHtml = await slideResponse.text();
          container.innerHTML = slideHtml;
          
          // Re-add channel number overlay
          const channelOverlay = document.createElement('div');
          channelOverlay.className = 'channel-number-overlay';
          channelOverlay.textContent = 'CH 02';
          container.appendChild(channelOverlay);
          
          // Load the slideshow script again
          await loadScript('./channels/ch2/script.js');
          
          // Add Enter Showcase button again
          const enterButton = document.createElement('button');
          enterButton.id = 'enter-showcase-button';
          enterButton.textContent = 'Enter Showcase';
          enterButton.className = 'enter-button';
          container.appendChild(enterButton);
          
          // Add the same event listener as before
          enterButton.addEventListener('click', async () => {
            const whoosh = new Audio('./audio/whoosh.mp3');
            whoosh.volume = 0.5;
            whoosh.play().catch(err => console.warn('Could not play sound:', err));
            
            const transition = document.createElement('div');
            transition.className = 'slideshow-transition';
            container.appendChild(transition);
            
            gsap.to(transition, {
              opacity: 1,
              duration: 0.5,
              onComplete: async () => {
                const response = await fetch('./channels/ch2/infomercial.html');
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                
                const html = await response.text();
                container.innerHTML = html;
                
                const channelOverlay = document.createElement('div');
                channelOverlay.className = 'channel-number-overlay';
                channelOverlay.textContent = 'CH 02';
                container.appendChild(channelOverlay);
                
                setupInfomercialEventListeners();
                
                const newTransition = document.createElement('div');
                newTransition.className = 'slideshow-transition';
                newTransition.style.opacity = 1;
                container.appendChild(newTransition);
                
                gsap.to(newTransition, {
                  opacity: 0,
                  duration: 0.5,
                  delay: 0.2,
                  onComplete: () => {
                    newTransition.remove();
                  }
                });
              }
            });
          });
          
          // Fade out transition
          const newTransition = document.createElement('div');
          newTransition.className = 'slideshow-transition';
          newTransition.style.opacity = 1;
          container.appendChild(newTransition);
          
          gsap.to(newTransition, {
            opacity: 0,
            duration: 0.5,
            delay: 0.2,
            onComplete: () => {
              newTransition.remove();
            }
          });
        }
      });
    });
  }
}