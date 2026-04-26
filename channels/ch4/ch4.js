// Channel 4: Systems & Code JavaScript

function createModals() {
  // Create the UATP modal
  const uatpModalHTML = `
    <div id="uatpModal" class="modal-overlay hidden" role="dialog" aria-modal="true" aria-hidden="true">
      <div class="modal-box" tabindex="-1">
        <button id="closeUatp" class="close-modal" aria-label="Close UATP Modal">&times;</button>
        <div class="modal-static" id="uatpStatic"></div>
        <div class="modal-content">
          <h2>Systems & Code</h2>
          <h3>UATP</h3>
          <div class="role-model-description">
            <p>Unified Agent Trust Protocol — governance infrastructure making AI behavior inspectable, attributable, and accountable. Built as a deployable system, not a theoretical framework.</p>
            <p>Capsule-based evidence architecture with cryptographically signed records capturing reasoning, confidence, attribution, and ethical justification for AI decisions.</p>
          </div>
          <div class="annual-letter-link">
            <a href="https://github.com/KayronCalloway/uatp" target="_blank" rel="noopener noreferrer" class="letter-button">View on GitHub</a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Create the Residuals OS modal
  const residualsModalHTML = `
    <div id="residualsModal" class="modal-overlay hidden" role="dialog" aria-modal="true" aria-hidden="true">
      <div class="modal-box" tabindex="-1">
        <button id="closeResiduals" class="close-modal" aria-label="Close Residuals OS Modal">&times;</button>
        <div class="modal-static" id="residualsStatic"></div>
        <div class="modal-content">
          <h2>Systems & Code</h2>
          <h3>Residuals OS</h3>
          <div class="role-model-description">
            <p>Financial infrastructure for entertainment residuals. A multi-sided marketplace replacing manual SAG-AFTRA settlement workflows with deterministic calculation engines and intelligent document parsing.</p>
            <p>Settlement engine handling theatrical residuals with full math-chain traceability. Intelligent parsing pipeline using LlamaParse + Claude Vision + SheetJS for guild documents.</p>
          </div>
          <div class="annual-letter-link">
            <a href="https://github.com/KayronCalloway/resid.os" target="_blank" rel="noopener noreferrer" class="letter-button">View on GitHub</a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Create the GitHub modal
  const githubModalHTML = `
    <div id="githubModal" class="modal-overlay hidden" role="dialog" aria-modal="true" aria-hidden="true">
      <div class="modal-box" tabindex="-1">
        <button id="closeGithub" class="close-modal" aria-label="Close GitHub Modal">&times;</button>
        <div class="modal-static" id="githubStatic"></div>
        <div class="modal-content">
          <h2>Systems & Code</h2>
          <h3>GitHub</h3>
          <div class="role-model-description">
            <p>All systems, experiments, and infrastructure code are open for inspection. No black boxes.</p>
          </div>
          <div class="annual-letter-link">
            <a href="https://github.com/KayronCalloway" target="_blank" rel="noopener noreferrer" class="letter-button">github.com/KayronCalloway</a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Append all modals to the body
  const container = document.createElement('div');
  container.innerHTML = uatpModalHTML + residualsModalHTML + githubModalHTML;
  document.body.appendChild(container);
}

// Check if device is mobile
function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' || 
    navigator.userAgent.indexOf('Mobile') !== -1 ||
    navigator.userAgent.indexOf('Android') !== -1 ||
    navigator.userAgent.indexOf('iOS') !== -1 ||
    navigator.userAgent.indexOf('iPhone') !== -1 ||
    navigator.userAgent.indexOf('iPad') !== -1 ||
    window.innerWidth <= 768
  );
}

function setupModalEventListeners() {
  const isMobile = isMobileDevice();
  
  // GSAP Animation: "Coming Out of the Box"
  const animateModalIn = modal => {
    // Simpler animation for mobile to improve performance
    if (isMobile) {
      gsap.fromTo(
        modal,
        { 
          opacity: 0, 
          scale: 0.9
        },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.4, 
          ease: "power2.out" 
        }
      );
    } else {
      gsap.fromTo(
        modal,
        { 
          opacity: 0, 
          scale: 0.8, 
          y: 20, 
          rotationX: 5,
          transformOrigin: "top center" // makes it look like it's emerging from the top edge
        },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          rotationX: 0, 
          duration: 0.6, 
          ease: "power2.out" 
        }
      );
    }
  };

  const animateModalOut = modal => {
    // Simpler animation for mobile to improve performance
    if (isMobile) {
      gsap.to(modal, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          modal.classList.add('hidden');
        }
      });
    } else {
      gsap.to(modal, {
        opacity: 0,
        scale: 0.8,
        y: 20,
        rotationX: 5,
        duration: 0.5,
        ease: "power2.in",
        transformOrigin: "top center",
        onComplete: () => {
          modal.classList.add('hidden');
        }
      });
    }
  };

  // Enhanced event handler function for both click and touch events
  const setupModalButton = (buttonId, modalId, closeButtonId) => {
    const button = document.getElementById(buttonId);
    const modal = document.getElementById(modalId);
    const closeButton = document.getElementById(closeButtonId);
    
    if (!button || !modal || !closeButton) return;
    
    // Apply Merova font to the button
    button.style.fontFamily = "'Merova', sans-serif";
    
    // Add visual feedback for mobile
    if (isMobile) {
      button.classList.add('mobile-enhanced');
    }
    
    // Create open handler with touch support
    const openHandler = (e) => {
      // Prevent default for touch events to avoid double-firing
      if (e.type === 'touchstart') {
        e.preventDefault();
      }
      
      // Avoid multiple rapid taps
      if (button.dataset.processing === 'true') {
        return;
      }
      button.dataset.processing = 'true';
      
      // Apply visual feedback
      button.style.transform = 'scale(0.96)';
      
      // Short delay for visual feedback
      setTimeout(() => {
        button.style.transform = '';
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        animateModalIn(modal);
        
        // Prevent double-clicking during animation
        button.style.pointerEvents = 'none';
        
        // Reset processing flag
        setTimeout(() => {
          button.dataset.processing = 'false';
        }, 500);
      }, 50);
    };
    
    // Create close handler with touch support
    const closeHandler = (e) => {
      // Prevent default for touch events
      if (e.type === 'touchstart') {
        e.preventDefault();
      }
      
      // Visual feedback
      closeButton.style.transform = 'scale(0.9)';
      
      setTimeout(() => {
        closeButton.style.transform = '';
        animateModalOut(modal);
        
        // Make button re-clickable after animation completes
        setTimeout(() => {
          button.style.pointerEvents = 'auto';
        }, isMobile ? 400 : 600);
      }, 50);
    };
    
    // Setup click and touch events for the open button
    button.addEventListener('click', openHandler);
    if (isMobile) {
      button.addEventListener('touchstart', openHandler, { passive: false });
    }
    
    // Setup click and touch events for the close button
    closeButton.addEventListener('click', closeHandler);
    if (isMobile) {
      closeButton.addEventListener('touchstart', closeHandler, { passive: false });
    }
  };

  // Set up each modal with enhanced touch handling
  setupModalButton('uatpButton', 'uatpModal', 'closeUatp');
  setupModalButton('residualsButton', 'residualsModal', 'closeResiduals');
  setupModalButton('githubButton', 'githubModal', 'closeGithub');
  
  // Handle modal scroll behavior for iOS
  if (isMobile) {
    // Fix for iOS momentum scrolling
    const modalBoxes = document.querySelectorAll('.modal-box');
    modalBoxes.forEach(box => {
      box.style.WebkitOverflowScrolling = 'touch';
      
      // Prevent body scrolling when modal is scrolled
      box.addEventListener('touchmove', e => {
        e.stopPropagation();
      }, { passive: true });
    });
  }

  // Close all modals on Escape key press
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const allModals = ['uatpModal', 'residualsModal', 'githubModal']
        .map(id => document.getElementById(id));
      const allButtons = ['uatpButton', 'residualsButton', 'githubButton']
        .map(id => document.getElementById(id));
      
      allModals.forEach((modal, index) => {
        if (modal && !modal.classList.contains('hidden')) {
          animateModalOut(modal);
          // Make corresponding button re-clickable
          setTimeout(() => {
            if (allButtons[index]) {
              allButtons[index].style.pointerEvents = 'auto';
            }
          }, 600);
        }
      });
    }
  });
  
  // Add ability to close modals by clicking outside modal content
  const allModalOverlays = document.querySelectorAll('.modal-overlay');
  allModalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      // Only close if the click is directly on the overlay (not its children)
      if (e.target === overlay) {
        // Find the corresponding modal and button
        const modal = overlay;
        const modalId = modal.id;
        const buttonId = modalId.replace('Modal', 'Button');
        const button = document.getElementById(buttonId);
        
        // Animate the modal out
        animateModalOut(modal);
        
        // Make the button clickable again after animation completes
        if (button) {
          setTimeout(() => {
            button.style.pointerEvents = 'auto';
          }, isMobile ? 400 : 600);
        }
      }
    });
  });
}

export async function init() {

  // Prevent duplicate initialization
  const section4 = document.getElementById('section4');
  if (section4 && section4.querySelector('.channel4-buttons')) {
    return;
  }
  
  try {
    // Load the channel content
    const response = await fetch('./channels/ch4/index.html');
    if (!response.ok) {
      throw new Error(`Failed to fetch channel content: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();
    
    // Insert into the section
    if (section4) {
      // Preserve any existing channel overlay from main page
      const existingOverlay = section4.querySelector('.channel-number-overlay');
      const overlayHTML = existingOverlay ? existingOverlay.outerHTML : '';

      section4.innerHTML = html;

      // If there was an existing overlay and the new content doesn't have one, restore it
      if (overlayHTML && !section4.querySelector('.channel-number-overlay')) {
        section4.insertAdjacentHTML('beforeend', overlayHTML);
      }
      
      // Load channel styles
      const channelStylesheet = document.createElement('link');
      channelStylesheet.rel = 'stylesheet';
      channelStylesheet.href = './channels/ch4/styles.css';
      document.head.appendChild(channelStylesheet);
      
      // Add loading indicator style for mobile
      if (isMobileDevice()) {
        const loadingStyle = document.createElement('style');
        loadingStyle.textContent = `
          .video-background.loading::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 40px;
            height: 40px;
            margin: -20px 0 0 -20px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
            z-index: 5;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          .video-background {
            position: relative;
            overflow: hidden;
            background-color: rgba(0, 0, 0, 0.8);
          }
          
          /* Force hardware acceleration for smoother playback but only apply if elements exist */
          .video-background iframe {
            will-change: transform;
            transform: translateZ(0);
            backface-visibility: hidden;
            perspective: 1000px;
          }
        `;
        document.head.appendChild(loadingStyle);
      }
      
      
      
      // Create and set up the modals
      createModals();
      setTimeout(() => {
        setupModalEventListeners();
        
        // Ensure TV Guide has correct positioning - USING GLOBAL STANDARD
        if (typeof window.ensureTVGuideStandardStyling === 'function') {
          window.ensureTVGuideStandardStyling();
        }

        // Apply Merova font to all CH4 buttons and handle mobile layout
        const ch4Buttons = document.querySelectorAll('.channel4-buttons .channel-button');
        const isMobileView = window.innerWidth <= 768;

        // Adjust the channel4-buttons container for mobile vertical layout
        const buttonContainer = document.querySelector('.channel4-buttons');
        if (buttonContainer && isMobileView) {
          buttonContainer.style.flexDirection = 'column';
          buttonContainer.style.gap = '25px';
          buttonContainer.style.width = '85%';
          buttonContainer.style.maxWidth = '300px';
        }

        ch4Buttons.forEach(button => {
          button.style.fontFamily = "'Merova', sans-serif";
          button.style.letterSpacing = '0.05em';
          button.style.fontWeight = '500';
          button.style.fontSize = '1.3rem';
          button.style.borderColor = '#a9a9a9'; // Heather grey border
          
          if (isMobileView) {
            button.style.padding = '16px 30px';
            button.style.minHeight = '60px';
            button.style.margin = '5px 0';
            button.style.width = '100%'; // Full width on mobile
          } else {
            button.style.padding = '14px 25px';
            button.style.margin = '0 8px';
          }
        });
      }, 500);
      
      // Set up YouTube player only if it doesn't exist
      setTimeout(() => {
        if (typeof YT !== 'undefined' && YT.Player && !window.channel4Player) {
          const isMobile = isMobileDevice();

          // Create the YouTube player for channel 4
          window.channel4Player = new YT.Player('youtube-player-4', {
            videoId: 'OFlnSoPm7x4', // Background video for channel 4
            playerVars: {
              autoplay: 1, // Always autoplay for background video effect
              controls: 0, // No controls for background video
              loop: 1, // Loop for continuous background
              playlist: 'OFlnSoPm7x4', // Playlist for looping
              modestbranding: 1,
              rel: 0,
              playsinline: 1,
              fs: 0,
              showinfo: 0,
              enablejsapi: 1,
              origin: window.location.origin,
              vq: isMobile ? 'medium' : 'hd720', // Slightly higher quality on mobile but not too high
              mute: 1 // Always start muted to comply with autoplay policies
            },
            events: {
              onReady: event => {
                event.target.mute();
                event.target.playVideo();
              },
              onStateChange: event => {
                // Simple state handling for background video
                if (event.data === YT.PlayerState.ENDED) {
                  event.target.playVideo(); // Restart when ended
                }
              },
              onError: (event) => {
                // Simple recovery
                setTimeout(() => {
                  if (window.channel4Player) {
                    window.channel4Player.playVideo();
                  }
                }, 1000);
              }
            }
          });
        }
      }, 500);
      
    }
  } catch (err) {
    // Channel 4 section not ready
  }
}
