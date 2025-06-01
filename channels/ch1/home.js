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
        // Apply Merova font to all buttons
        button.style.fontFamily = "'Merova', sans-serif";
        button.style.letterSpacing = '0.05em';
        button.style.fontWeight = '500';
        button.style.fontSize = '1.3rem';
        button.style.borderColor = '#a9a9a9'; // Heather grey border
        
        if (window.innerWidth <= 600) {
          button.style.padding = '16px 30px'; // Larger touch target on mobile
          button.style.width = '100%';        // Full width of container
          button.style.minHeight = '60px';    // Taller for better tapping
          button.style.margin = '5px 0';      // Add spacing between buttons
        } else {
          button.style.padding = '14px 25px'; // Slightly more padding on desktop
          button.style.margin = '0 8px';      // Add some horizontal spacing
        }
      });
      
      console.log('Channel buttons styles applied with mobile optimization');
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

function setupModalEventListeners() {
  console.log('Setting up modal event listeners');
  
  // Check if it's a mobile device
  const isMobile = window.innerWidth <= 600 || 
                  typeof window.orientation !== 'undefined' ||
                  navigator.userAgent.indexOf('Mobile') !== -1;
  
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
          modal.style.display = 'none';
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
          modal.style.display = 'none';
          modal.classList.add('hidden');
        }
      });
    }
  };

  // Helper function to set up modal trigger and close events.
  const setupModal = (buttonId, modalId, closeButtonId) => {
    const button = document.getElementById(buttonId);
    const modal = document.getElementById(modalId);
    const closeButton = document.getElementById(closeButtonId);
    
    console.log(`Setting up ${modalId}: Button=${!!button}, Modal=${!!modal}, CloseButton=${!!closeButton}`);
    
    if (!button || !modal || !closeButton) {
      console.error(`Missing elements for ${modalId}. Cannot setup modal.`);
      return;
    }
    
    // Add visual feedback for mobile
    if (isMobile) {
      button.classList.add('mobile-enhanced');
    }
    
    // Create open handler with touch support
    const openHandler = (e) => {
      console.log(`${buttonId} clicked/touched`);
      
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
        
        // Force remove hidden class and set display to flex
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        
        console.log(`Opening modal ${modalId}, current display: ${modal.style.display}`);
        
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
    
    // Clear existing listeners to prevent duplicates
    button.removeEventListener('click', openHandler);
    closeButton.removeEventListener('click', closeHandler);
    
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

  // Setup individual modals using the helper.
  setupModal('resumeButton', 'resumeModal', 'closeResume');
  setupModal('aboutButton', 'aboutModal', 'closeAbout');
  setupModal('contactButton', 'contactModal', 'closeContact');

  // Setup PDF download functionality
  setupPDFDownload();

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
  
  // Add ability to close modals by clicking outside modal content for all devices
  const allModalOverlays = document.querySelectorAll('.modal-overlay');
  allModalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      // Only close if the click is directly on the overlay (not its children)
      if (e.target === overlay) {
        // Find the corresponding modal box and button
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

  // Get references to the modals and buttons
  const resumeModal = document.getElementById('resumeModal');
  const aboutModal = document.getElementById('aboutModal');
  const contactModal = document.getElementById('contactModal');
  const resumeButton = document.getElementById('resumeButton');
  const aboutButton = document.getElementById('aboutButton');
  const contactButton = document.getElementById('contactButton');

  // Close any open modal on Escape key press.
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const allModals = [resumeModal, aboutModal, contactModal];
      const allButtons = [resumeButton, aboutButton, contactButton];
      
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
}

function setupPDFDownload() {
  const downloadButton = document.getElementById('downloadPDF');
  if (!downloadButton) {
    console.error('Download PDF button not found');
    return;
  }

  downloadButton.addEventListener('click', async function() {
    try {
      // Show loading state
      const originalText = downloadButton.innerHTML;
      downloadButton.innerHTML = '( generating... )';
      downloadButton.disabled = true;

      // Check if html2pdf is available
      if (typeof html2pdf === 'undefined') {
        throw new Error('html2pdf library not loaded');
      }

      // Create a simple test element first
      const testElement = document.createElement('div');
      testElement.innerHTML = '<h1>TEST</h1><p>This is a test document</p>';
      testElement.style.padding = '20px';
      testElement.style.fontFamily = 'Arial';
      testElement.style.fontSize = '14px';
      testElement.style.width = '600px';
      testElement.style.height = '400px';
      testElement.style.backgroundColor = 'white';
      testElement.style.color = 'black';
      
      document.body.appendChild(testElement);
      
      console.log('Test element created and added to DOM');
      console.log('Element content:', testElement.innerHTML);
      console.log('Element computed styles:', window.getComputedStyle(testElement));

      await new Promise(resolve => setTimeout(resolve, 500));

      // Try the simplest possible PDF generation
      const simpleOpt = {
        margin: 1,
        filename: 'Test_Resume.pdf',
        image: { type: 'jpeg', quality: 0.8 },
        html2canvas: { 
          scale: 1,
          useCORS: false,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: true,
          height: 400,
          width: 600
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait' 
        }
      };

      console.log('Starting simple PDF generation test...');
      
      // Test basic functionality first
      const result = await html2pdf().set(simpleOpt).from(testElement).outputPdf();
      
      console.log('PDF generated successfully, result length:', result.length);
      
      if (result && result.length > 100) {
        // Start with minimal content and build up
        testElement.innerHTML = `
          <div style="padding: 20px; font-family: Arial; font-size: 12px; color: #000;">
            <h1 style="text-align: center;">KAYRON CALLOWAY</h1>
            <div style="text-align: center; margin-bottom: 20px;">
              Creative Director<br>
              Los Angeles, CA | 310.498.8059 | KayronCalloway@gmail.com<br>
              Portfolio: kayroncalloway.github.io/kayron
            </div>
            
            <h2>EXPERIENCE</h2>
            
            <h3>Founder & Creative Director</h3>
            <div>Coloring With Gray | 2024 - Present</div>
            <p>Building philosophy-driven creative house</p>
            <p>Leading team of 7 specialists</p>
            <p>Managing $50k development budget</p>
            
            <h3>Financial Analyst</h3>
            <div>Cast & Crew | Apr 2019 - Present</div>
            <p>Manage reporting for Netflix, HBO, Amazon, Apple</p>
            <p>Built automated workflows</p>
            <p>Track over $50M annually</p>
            
            <h3>Creative Strategist</h3>
            <div>Independent Practice | 2018 - Present</div>
            <p>Led Cest Bon Paris Fashion Week with Vogue coverage</p>
            <p>Developed campaigns for Bulletproof Coffee, GOAT Group</p>
            
            <h3>Creative Director & Co-Founder</h3>
            <div>Modern Tea Room | Mar 2015 - 2018</div>
            <p>Launched community tea house</p>
            <p>600+ Yelp reviews, 4.5+ rating</p>
            
            <h2>SKILLS</h2>
            <p>Brand Strategy, Creative Direction, Budget Management, Financial Analysis</p>
            
            <h2>EDUCATION</h2>
            <p>Bachelor of Arts in Philosophy<br>California State University, Fullerton</p>
            
            <h2>RECOGNITION</h2>
            <p>Vogue Feature - Cest Bon Paris Fashion Week Campaign</p>
            <p>Modern Tea Room - 600+ Reviews, 4.5+ Rating</p>
          </div>
        `;
        
        // Update filename for the real resume
        simpleOpt.filename = 'Kayron_Calloway_Resume.pdf';
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Generate final PDF
        await html2pdf().set(simpleOpt).from(testElement).save();
        console.log('Final PDF generation completed');
      } else {
        throw new Error('PDF generation test failed - empty or invalid result');
      }

      // Clean up
      document.body.removeChild(testElement);
      
      // Reset button state
      downloadButton.innerHTML = originalText;
      downloadButton.disabled = false;

    } catch (error) {
      console.error('PDF generation failed:', error);
      console.error('Error details:', error.message, error.stack);
      
      // Try to clean up any test elements
      const testElements = document.querySelectorAll('div[style*="TEST"]');
      testElements.forEach(el => el.remove());
      
      alert(`PDF generation failed: ${error.message}. Check console for details.`);
      
      // Reset button state
      downloadButton.innerHTML = originalText;
      downloadButton.disabled = false;
    }
  });
}
