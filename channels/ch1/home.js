// channels/ch1/home.js

export async function init() {
  console.log('Channel 1 init started');
  
  // Fix for Channel 1 content with mobile optimization
  const section1 = document.getElementById('section1');
  if (section1) {
    // Ensure the video background is properly visible
    const videoBackground = section1.querySelector('.video-background');
    if (videoBackground) {
      videoBackground.style.zIndex = '-1';
      videoBackground.style.position = 'absolute';
      videoBackground.style.width = '100%';
      videoBackground.style.height = '100%';
      videoBackground.style.overflow = 'hidden';
      videoBackground.style.background = "#000000 url('../visuals/static.gif') center center repeat";
      console.log('Video background styles applied');
      
      // Mobile optimization for video background
      if (window.innerWidth <= 600 || isMobileDevice() || isLowBandwidth()) {
        console.log('Mobile device or low bandwidth detected - optimizing video');
        
        // Apply battery-saving mode for mobile
        videoBackground.classList.add('battery-saving');
        videoBackground.style.backgroundSize = 'cover';
        videoBackground.style.opacity = '0.7';
        
        // Signal to the YouTube setup script to use lower quality
        window.useLowQualityVideo = true;
        
        // Add a data attribute that can be read by the YouTube setup script
        videoBackground.setAttribute('data-optimized', 'true');
      }
      
      // Check if YouTube player is working, if not create a static background
      setTimeout(() => {
        const iframe = section1.querySelector('#youtube-player iframe');
        if (!iframe) {
          console.log('No YouTube iframe found, applying static background as fallback');
          videoBackground.style.backgroundSize = 'cover';
          videoBackground.style.opacity = '0.7';
        }
      }, 3000);
    }
  }
  
  // Helper function to detect mobile devices
  function isMobileDevice() {
    return (
      typeof window.orientation !== 'undefined' || 
      navigator.userAgent.indexOf('Mobile') !== -1 ||
      navigator.userAgent.indexOf('Android') !== -1 ||
      navigator.userAgent.indexOf('iOS') !== -1 ||
      navigator.userAgent.indexOf('iPhone') !== -1 ||
      navigator.userAgent.indexOf('iPad') !== -1
    );
  }
  
  // Helper function to detect potential low bandwidth conditions
  function isLowBandwidth() {
    // Check if the browser supports the Network Information API
    if (navigator.connection) {
      // Check for slow connections
      if (navigator.connection.saveData ||
          navigator.connection.effectiveType === 'slow-2g' ||
          navigator.connection.effectiveType === '2g' ||
          navigator.connection.effectiveType === '3g') {
        return true;
      }
    }
    return false;
  }
    }
    
    // Ensure buttons are visible and positioned correctly with mobile optimization
    const channelButtons = section1.querySelector('.channel-buttons');
    if (channelButtons) {
      channelButtons.style.position = 'absolute';
      channelButtons.style.top = '50%';
      channelButtons.style.left = '50%';
      channelButtons.style.transform = 'translate(-50%, -50%)';
      channelButtons.style.zIndex = '10';
      channelButtons.style.display = 'flex';
      
      // Responsive layout - column on mobile, row on desktop
      if (window.innerWidth <= 600) {
        channelButtons.style.flexDirection = 'column';
        channelButtons.style.gap = '25px'; // More space between buttons on mobile
        channelButtons.style.width = '100%';
        channelButtons.style.maxWidth = '250px';
      } else {
        channelButtons.style.flexDirection = 'row';
        channelButtons.style.gap = '20px';
      }
      
      // Apply styles to each button for better mobile touch targets
      const buttons = channelButtons.querySelectorAll('.channel-button');
      buttons.forEach(button => {
        if (window.innerWidth <= 600) {
          button.style.padding = '16px 30px'; // Larger touch target on mobile
          button.style.fontSize = '1.2rem';   // Slightly larger text
          button.style.width = '100%';        // Full width of container
          button.style.minHeight = '55px';    // Minimum height for better tapping
        }
      });
      
      console.log('Channel buttons styles applied with mobile optimization');
    }
  }
  
  try {
    console.log('Loading Channel 1 modals...');
    const response = await fetch('./channels/ch1/modals.html');
    if (!response.ok) {
      throw new Error(`Failed to fetch modals: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    console.log('Channel 1 modals loaded successfully');
    setupModalEventListeners();
    
    // Apply mobile-specific modal optimizations
    applyMobileOptimizations();
  } catch (err) {
    console.error('Failed to load modals:', err);
  }
}

function applyMobileOptimizations() {
  // Check if it's a mobile device
  const isMobile = window.innerWidth <= 600;
  if (!isMobile) return;

  console.log('Applying mobile optimizations to modals');
  
  // Improve modal scrolling on mobile devices
  const modalBoxes = document.querySelectorAll('.modal-box');
  modalBoxes.forEach(box => {
    // Adjust modal size for mobile
    box.style.maxWidth = '95%';
    box.style.maxHeight = '85vh';
    box.style.padding = '20px 15px';
    
    // Improve scrolling on iOS
    box.style.webkitOverflowScrolling = 'touch';
    
    // Add slight border radius for better aesthetics on mobile
    box.style.borderRadius = '10px';
  });
  
  // Enhance close buttons for easier tapping
  const closeButtons = document.querySelectorAll('.close-modal');
  closeButtons.forEach(button => {
    button.style.padding = '8px 12px';
    button.style.fontSize = '2.5rem';
    button.style.top = '5px';
    button.style.right = '5px';
    button.style.lineHeight = '1';
    // Add touch feedback
    button.style.webkitTapHighlightColor = 'rgba(62, 146, 204, 0.3)';
  });
  
  // Optimize resume modal for mobile
  const resumeModal = document.getElementById('resumeModal');
  if (resumeModal) {
    // Make resume header more compact
    const resumeHeader = resumeModal.querySelector('.resume-header');
    if (resumeHeader) {
      resumeHeader.style.flexDirection = 'column';
      resumeHeader.style.alignItems = 'flex-start';
      resumeHeader.style.gap = '15px';
    }
    
    // Make download button more prominent
    const downloadButton = resumeModal.querySelector('.download-button');
    if (downloadButton) {
      downloadButton.style.padding = '12px 20px';
      downloadButton.style.width = '100%';
      downloadButton.style.textAlign = 'center';
      downloadButton.style.marginTop = '10px';
    }
    
    // Convert dual expertise section to single column on mobile
    const dualExpertiseGrid = resumeModal.querySelector('.modal-content > section:nth-child(4) > div');
    if (dualExpertiseGrid) {
      dualExpertiseGrid.style.gridTemplateColumns = '1fr';
      dualExpertiseGrid.style.gap = '15px';
    }
  }
}
}

function setupModalEventListeners() {
  console.log('Setting up modal event listeners');
  // GSAP Animation: "Coming Out of the Box"
  const animateModalIn = modal => {
    gsap.fromTo(
      modal,
      { 
        opacity: 0, 
        scale: 0.8, 
        y: 20, 
        rotationX: 5,
        transformOrigin: "top center"
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
  };

  const animateModalOut = modal => {
    gsap.to(modal, {
      opacity: 0,
      scale: 0.8,
      y: 20,
      rotationX: 5,
      duration: 0.5,
      ease: "power2.in",
      transformOrigin: "top center",
      onComplete: () => {
        modal.style.display = 'none';
        modal.classList.add('hidden'); // Ensure both display:none and hidden class are applied
      }
    });
  };

  // Helper function to set up modal trigger and close events.
  const setupModal = (buttonId, modalId, closeButtonId) => {
    const triggerButton = document.getElementById(buttonId);
    const modal = document.getElementById(modalId);
    const closeButton = document.getElementById(closeButtonId);
    
    console.log(`Setting up ${modalId}: Button=${!!triggerButton}, Modal=${!!modal}, CloseButton=${!!closeButton}`);
    
    if (triggerButton && modal && closeButton) {
      // Check if it's a mobile device
      const isMobile = window.innerWidth <= 600 || 
                       typeof window.orientation !== 'undefined' ||
                       navigator.userAgent.indexOf('Mobile') !== -1;
      
      // Function to handle opening modal
      const openModal = (e) => {
        // Prevent default behavior for touch events to avoid double firing
        if (e.type === 'touchstart') {
          e.preventDefault();
        }
        
        // Provide visual feedback for touch
        if (isMobile) {
          triggerButton.style.transform = 'scale(0.96)';
        }
        
        // Delay showing the modal slightly to allow for visual feedback
        setTimeout(() => {
          // Reset transformation
          if (isMobile) {
            triggerButton.style.transform = '';
          }
          
          console.log(`Opening modal ${modalId}`);
          modal.style.display = 'flex';
          modal.classList.remove('hidden');
          animateModalIn(modal);
        }, isMobile ? 50 : 0);
      };
      
      // Function to handle closing modal
      const closeModal = (e) => {
        // Prevent default behavior for touch events
        if (e.type === 'touchstart') {
          e.preventDefault();
        }
        
        // Provide visual feedback for touch
        if (isMobile) {
          closeButton.style.transform = 'scale(0.9)';
        }
        
        // Delay closing slightly to allow for visual feedback
        setTimeout(() => {
          // Reset transformation
          if (isMobile) {
            closeButton.style.transform = '';
          }
          
          console.log(`Closing modal ${modalId}`);
          animateModalOut(modal);
        }, isMobile ? 50 : 0);
      };
      
      // Set up event listeners
      triggerButton.addEventListener('click', openModal);
      closeButton.addEventListener('click', closeModal);
      
      // Add touch events for mobile
      if (isMobile) {
        triggerButton.addEventListener('touchstart', openModal, { passive: false });
        closeButton.addEventListener('touchstart', closeModal, { passive: false });
      }
    }
  };

  // Setup individual modals using the helper.
  setupModal('resumeButton', 'resumeModal', 'closeResume');
  setupModal('aboutButton', 'aboutModal', 'closeAbout');
  setupModal('contactButton', 'contactModal', 'closeContact');

  // Close any open modal on Escape key press.
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      ['resumeModal', 'aboutModal', 'contactModal'].forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && (modal.style.display === 'flex' || !modal.classList.contains('hidden'))) {
          animateModalOut(modal);
        }
      });
    }
  });
}
