// Channel 5: Under the Influence JavaScript

function createModals() {
  // Create the Warren Buffett modal
  const warrenModalHTML = `
    <div id="warrenModal" class="modal-overlay hidden" role="dialog" aria-modal="true" aria-hidden="true">
      <div class="modal-box" tabindex="-1">
        <button id="closeWarren" class="close-modal" aria-label="Close Warren Modal">&times;</button>
        <div class="modal-static" id="warrenStatic"></div>
        <div class="modal-content">
          <h2>Under The Influence</h2>
          <h3>Warren Buffett</h3>
          <div class="role-model-description">
            <p>I admire Warren Buffett not for his extraordinary wealth, but for his unwavering commitment to integrity and ethical principles. His philosophy transcends business, offering profound wisdom on continuous learning, long-term thinking, and living with purpose. He embodies what it means to succeed while remaining principled—a rare quality that inspires me to pursue both excellence and character in everything I do.</p>
          </div>
          <div class="role-model-quotes">
            <div class="role-model-quote">
              <p>"You can't make a good deal with a bad person."</p>
              <p class="quote-author">— Warren Buffett</p>
            </div>
            <div class="role-model-quote">
              <p>"It takes 20 years to build a reputation and five minutes to ruin it. If you think about that, you'll do things differently."</p>
              <p class="quote-author">— Warren Buffett</p>
            </div>
            <div class="role-model-quote">
              <p>"The most important investment you can make is in yourself."</p>
              <p class="quote-author">— Warren Buffett</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Create the Charlie Munger modal
  const charlieModalHTML = `
    <div id="charlieModal" class="modal-overlay hidden" role="dialog" aria-modal="true" aria-hidden="true">
      <div class="modal-box" tabindex="-1">
        <button id="closeCharlie" class="close-modal" aria-label="Close Charlie Modal">&times;</button>
        <div class="modal-static" id="charlieStatic"></div>
        <div class="modal-content">
          <h2>Under The Influence</h2>
          <h3>Charlie Munger</h3>
          <div class="role-model-description">
            <p>Charlie Munger's mental models approach to decision-making has profoundly influenced how I think about problems. His emphasis on multidisciplinary learning and avoiding cognitive biases serves as a north star for my own intellectual development. I strive to emulate his clarity of thought, rigorous rationality, and willingness to admit mistakes - qualities that made him not just a successful investor but a truly wise individual.</p>
          </div>
          <div class="role-model-quotes">
            <div class="role-model-quote">
              <p>"The best way to get what you want is to deserve what you want. How could it be otherwise?"</p>
              <p class="quote-author">— Charlie Munger</p>
            </div>
            <div class="role-model-quote">
              <p>"Someone will always be getting richer faster than you. This is not a tragedy."</p>
              <p class="quote-author">— Charlie Munger</p>
            </div>
            <div class="role-model-quote">
              <p>"Knowing what you don't know is more useful than being brilliant."</p>
              <p class="quote-author">— Charlie Munger</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Create the Annual Letter modal
  const annualLetterModalHTML = `
    <div id="annualLetterModal" class="modal-overlay hidden" role="dialog" aria-modal="true" aria-hidden="true">
      <div class="modal-box" tabindex="-1">
        <button id="closeAnnualLetter" class="close-modal" aria-label="Close Annual Letter Modal">&times;</button>
        <div class="modal-static" id="letterStatic"></div>
        <div class="modal-content">
          <h2>Berkshire Hathaway Annual Letter</h2>
          <div class="role-model-description">
            <p>Warren Buffett's annual letter to Berkshire Hathaway shareholders is a masterclass in clear communication, business principles, and investment wisdom. For over 50 years, these letters have provided invaluable insights not just for investors, but for anyone interested in business, leadership, and decision-making.</p>
            <p>The letters combine financial reports with Buffett's straightforward explanations of complex concepts, all delivered with his characteristic wit and wisdom.</p>
          </div>
          <div class="annual-letter-link">
            <p>Read the latest annual letter:</p>
            <a href="https://www.berkshirehathaway.com/letters/2024ltr.pdf" target="_blank" rel="noopener noreferrer" class="letter-button">2024 Annual Letter</a>
            <p>Or visit the <a href="https://www.berkshirehathaway.com/letters/letters.html" target="_blank" rel="noopener noreferrer">complete archive</a> of letters dating back to 1977.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Append all modals to the body
  const container = document.createElement('div');
  container.innerHTML = warrenModalHTML + charlieModalHTML + annualLetterModalHTML;
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
  setupModalButton('warrenButton', 'warrenModal', 'closeWarren');
  setupModalButton('charlieButton', 'charlieModal', 'closeCharlie');
  setupModalButton('annualLetterButton', 'annualLetterModal', 'closeAnnualLetter');
  
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
      const allModals = [warrenModal, charlieModal, annualLetterModal];
      const allButtons = [warrenButton, charlieButton, annualLetterButton];
      
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
  console.log('Channel 5 Under the Influence init started');
  
  // Prevent duplicate initialization
  const section5 = document.getElementById('section5');
  if (section5 && section5.querySelector('.channel5-buttons')) {
    console.log('Channel 5 already initialized, skipping...');
    return;
  }
  
  try {
    // Load the influence content
    console.log('Loading Channel 5 influence content...');
    const response = await fetch('./channels/ch5/index.html');
    if (!response.ok) {
      throw new Error(`Failed to fetch influence content: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();
    
    // Insert into the section
    if (section5) {
      // Preserve any existing channel overlay from main page
      const existingOverlay = section5.querySelector('.channel-number-overlay');
      const overlayHTML = existingOverlay ? existingOverlay.outerHTML : '';
      
      section5.innerHTML = html;
      
      // If there was an existing overlay and the new content doesn't have one, restore it
      if (overlayHTML && !section5.querySelector('.channel-number-overlay')) {
        section5.insertAdjacentHTML('beforeend', overlayHTML);
      }
      
      // Load influence styles
      const influenceStylesheet = document.createElement('link');
      influenceStylesheet.rel = 'stylesheet';
      influenceStylesheet.href = './channels/ch5/styles.css';
      document.head.appendChild(influenceStylesheet);
      
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
        
        // Delayed application of styles to YouTube iframe after it's loaded
        const applyYouTubeStyles = () => {
          setTimeout(() => {
            const youtubePlayer = document.getElementById('youtube-player-5');
            if (youtubePlayer) {
              console.log('YouTube iframe found, applying optimized styles for mobile');
              
              // More conservative styling for mobile to prevent freeze
              if (isMobileDevice()) {
                youtubePlayer.style.willChange = 'auto'; // Less aggressive on mobile
                youtubePlayer.style.transform = 'none'; // Avoid transforms that can cause issues
                youtubePlayer.style.backfaceVisibility = 'visible';
                youtubePlayer.style.webkitBackfaceVisibility = 'visible';
                youtubePlayer.style.maxWidth = '100%';
                youtubePlayer.style.height = 'auto';
                console.log('Applied mobile-optimized YouTube styles');
              } else {
                // Full hardware acceleration for desktop
                youtubePlayer.style.willChange = 'transform';
                youtubePlayer.style.transform = 'translateZ(0)';
                youtubePlayer.style.backfaceVisibility = 'hidden';
                youtubePlayer.style.perspective = '1000px';
                console.log('Applied desktop-optimized YouTube styles');
              }
            } else {
              // If no YouTube player yet, try again in 1 second (up to 5 attempts)
              if (window.youtubeStyleAttempts === undefined) {
                window.youtubeStyleAttempts = 0;
              }
              
              if (window.youtubeStyleAttempts < 5) {
                window.youtubeStyleAttempts++;
                console.log(`YouTube iframe not found, retry attempt ${window.youtubeStyleAttempts}`);
                applyYouTubeStyles(); // Try again
              }
            }
          }, 1000);
        };
        
        // Start style application process
        applyYouTubeStyles();
      }
      
      
      console.log('Channel 5 influence content loaded successfully');
      
      // Create and set up the modals
      createModals();
      setTimeout(() => {
        setupModalEventListeners();
        
        // Ensure TV Guide has correct positioning - USING GLOBAL STANDARD
        if (typeof window.ensureTVGuideStandardStyling === 'function') {
          window.ensureTVGuideStandardStyling();
          console.log('Channel 5: Applied standard TV Guide styling');
        } else {
          console.warn('Channel 5: Global TV Guide styling function not available');
        }
        
        // Apply Merova font to all CH5 buttons and handle mobile layout
        const ch5Buttons = document.querySelectorAll('.channel5-buttons .channel-button');
        const isMobileView = window.innerWidth <= 768;
        
        // Adjust the channel5-buttons container for mobile vertical layout
        const buttonContainer = document.querySelector('.channel5-buttons');
        if (buttonContainer && isMobileView) {
          buttonContainer.style.flexDirection = 'column';
          buttonContainer.style.gap = '25px';
          buttonContainer.style.width = '85%';
          buttonContainer.style.maxWidth = '300px';
        }
        
        ch5Buttons.forEach(button => {
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
        if (typeof YT !== 'undefined' && YT.Player && !window.channel5Player) {
          const isMobile = isMobileDevice();
          
          console.log("Creating Channel 5 YouTube player...");
          // Create the YouTube player for channel 5
          window.channel5Player = new YT.Player('youtube-player-5', {
            videoId: 'OFlnSoPm7x4', // Same video as channel 4 for consistency
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
                event.target.mute(); // Always mute for autoplay compliance
                
                // Try to play immediately for background video effect
                setTimeout(() => {
                  try {
                    event.target.playVideo();
                    console.log("Channel 5 YouTube Player ready, starting muted background video.");
                  } catch (error) {
                    console.warn("Channel 5 autoplay failed:", error);
                  }
                }, 100);
              },
              onStateChange: event => {
                const isMobile = isMobileDevice();
                
                if (event.data === YT.PlayerState.ENDED) {
                  console.log("Channel 5 video ended, restarting...");
                  // Restart for continuous background video, but with delay on mobile
                  setTimeout(() => {
                    try {
                      event.target.playVideo();
                    } catch (error) {
                      console.warn("Channel 5 restart failed:", error);
                    }
                  }, isMobile ? 200 : 50); // Longer delay on mobile to prevent freeze
                } else if (event.data === YT.PlayerState.PAUSED) {
                  console.log("Channel 5 video paused, resuming for background continuity");
                  // Resume after brief delay to maintain background video effect
                  setTimeout(() => {
                    try {
                      if (event.target && typeof event.target.playVideo === 'function') {
                        event.target.playVideo();
                      }
                    } catch (error) {
                      console.warn("Channel 5 resume failed:", error);
                    }
                  }, isMobile ? 300 : 100); // Longer delay on mobile
                }
              },
              onError: (event) => {
                console.error('Channel 5 YouTube player error:', event.data);
                const isMobile = isMobileDevice();
                
                // Recovery with longer delays on mobile to prevent freeze
                setTimeout(() => {
                  try {
                    if (window.channel5Player && typeof window.channel5Player.playVideo === 'function') {
                      window.channel5Player.playVideo();
                    }
                  } catch (error) {
                    console.warn("Channel 5 error recovery failed:", error);
                  }
                }, isMobile ? 2000 : 1000); // Much longer delay on mobile
              }
            }
          });
        } else if (window.channel5Player) {
          console.log("Channel 5 YouTube player already exists, reusing...");
        } else {
          console.error("YouTube API not available for Channel 5.");
        }
      }, 500);
      
    } else {
      console.error('Section 5 not found');
    }
  } catch (err) {
    console.error('Failed to load influence content:', err);
  }
}