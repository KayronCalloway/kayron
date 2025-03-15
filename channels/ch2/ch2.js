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
    if (container.querySelector('#studio-container')) {
      console.log("Studio already loaded; skipping initialization.");
      return;
    }
    
    // Dynamically load CSS first to prevent FOUC (Flash of Unstyled Content)
    await loadStyles();
    
    // Load the portfolio studio
    const studioResponse = await fetch('./channels/ch2/index.html');
    if (!studioResponse.ok) throw new Error(`HTTP error! Status: ${studioResponse.status}`);
    
    const studioHtml = await studioResponse.text();
    container.innerHTML = studioHtml;
    
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
    
    // Load the studio script
    await loadScript('./channels/ch2/script.js');
    
    // Initialize studio controls
    setTimeout(() => {
      // Verify studio elements exist
      const studioContainer = document.getElementById('studio-container');
      if (studioContainer) {
        console.log("Portfolio studio initialized successfully");
      } else {
        console.error("Studio container not found");
      }
    }, 500);
    
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
  
  // Remove any event listeners (handled by removing elements)
}

// Listen for channel change events
document.addEventListener('channelChange', cleanup);