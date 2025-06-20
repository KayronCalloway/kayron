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
    if (container.querySelector('#portfolio-browse')) {
      console.log("Portfolio browser already loaded; skipping initialization.");
      return;
    }
    
    // Ensure we have full viewport height and no scrolling
    document.body.style.overflow = "hidden";
    container.style.height = "100vh";
    container.style.overflow = "hidden";
    
    // Dynamically load CSS first to prevent FOUC (Flash of Unstyled Content)
    await loadStyles();
    
    // Load the Netflix-style portfolio browser
    const portfolioResponse = await fetch('./channels/ch2/index.html');
    if (!portfolioResponse.ok) throw new Error(`HTTP error! Status: ${portfolioResponse.status}`);
    
    const portfolioHtml = await portfolioResponse.text();
    container.innerHTML = portfolioHtml;
    
    // Force header to be visible by notifying MenuManager
    setTimeout(() => {
      import('../../menu-manager.js').then(({ notifyChannelChanged }) => {
        notifyChannelChanged();
        console.log("Notified MenuManager to ensure header and guide button visibility");
      }).catch(err => console.error("Error importing MenuManager:", err));
      
      // BULLETPROOF: Ensure Channel 2's event system doesn't interfere with TV Guide
      const menuButton = document.getElementById('menuButton');
      if (menuButton) {
        // Add event listener that fires in capture phase BEFORE Channel 2's handlers
        menuButton.addEventListener('click', (e) => {
          console.log("Channel 2: Menu button click intercepted for TV Guide");
          // Don't stop propagation here - let it reach the main handler
          // Just ensure the button is properly styled
          if (typeof window.ensureTVGuideStandardStyling === 'function') {
            window.ensureTVGuideStandardStyling();
          }
        }, true); // Capture phase - fires first
      }
    }, 300);
    
    // Add channel number overlay if it doesn't exist
    if (!container.querySelector('.channel-number-overlay')) {
      const channelOverlay = document.createElement('div');
      channelOverlay.className = 'channel-number-overlay';
      channelOverlay.textContent = 'CH 02';
      container.appendChild(channelOverlay);
    }
    
    // Load the portfolio browse script
    await loadScript('./channels/ch2/script.js');
    
    // Initialize portfolio browse controls
    setTimeout(() => {
      // Verify portfolio browse elements exist
      const portfolioBrowse = document.getElementById('portfolio-browse');
      if (portfolioBrowse) {
        console.log("Portfolio browser initialized successfully");
        
        // Verify cards have click handlers
        const cards = document.querySelectorAll('.project-card');
        if (cards.length > 0) {
          console.log(`Found ${cards.length} project cards`);
          
          // Ensure cards have proper CSS for clicking
          cards.forEach(card => {
            // Ensure cards can be clicked
            card.style.pointerEvents = 'auto';
            card.style.cursor = 'pointer';
            card.style.position = 'relative';
            card.style.zIndex = '1';
            
            // Log when cards are clicked
            card.addEventListener('click', () => {
              const projectId = card.getAttribute('data-project');
              console.log(`Card clicked: ${projectId}`);
            });
          });
          
          // Also ensure featured CTA is clickable
          const featuredCta = document.querySelector('.featured-cta');
          if (featuredCta) {
            featuredCta.style.pointerEvents = 'auto';
            featuredCta.style.cursor = 'pointer';
            featuredCta.style.position = 'relative';
            featuredCta.style.zIndex = '3';
          }
        } else {
          console.error("No project cards found in portfolio browser");
        }
      } else {
        console.error("Portfolio browser container not found");
      }
    }, 500);
    
    // Ensure TV Guide has correct positioning - USING GLOBAL STANDARD
    if (typeof window.ensureTVGuideStandardStyling === 'function') {
      window.ensureTVGuideStandardStyling();
      console.log('Channel 2: Applied standard TV Guide styling');
    } else {
      console.warn('Channel 2: Global TV Guide styling function not available');
    }
    
    console.log("Channel 2 initialized successfully with portfolio studio");
  } catch (error) {
    console.error("Failed to load Channel 2 markup:", error);
    const container = document.getElementById('section2');
    if (container) {
      container.innerHTML = `<div class="error">Error loading portfolio studio content.</div>
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

// Clean up resources when leaving channel
function cleanup() {
  // Stop any animations
  if (window.gsap) {
    gsap.killTweensOf('.project-item');
    gsap.killTweensOf('.studio-environment');
  }
  
  // Remove data attributes to prevent any leaks
  document.body.removeAttribute('data-active-channel');
  
  const container = document.getElementById('section2');
  if (container) {
    container.removeAttribute('data-channel');
  }
  
  // Remove any event listeners (handled by removing elements)
}

// Listen for channel change events
document.addEventListener('channelChange', cleanup);