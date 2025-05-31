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

      // Create PDF-optimized resume content directly in JavaScript
      const resumeHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              font-size: 11px;
              line-height: 1.4;
              color: #1a1a1a;
              background: #ffffff;
              margin: 0;
              padding: 20px;
              max-width: 8.5in;
            }
            
            h1 {
              font-size: 24px;
              font-weight: 600;
              margin: 0 0 8px 0;
              letter-spacing: -0.02em;
            }
            
            .title {
              font-size: 16px;
              color: #4a4a4a;
              margin-bottom: 16px;
            }
            
            .contact-info {
              font-size: 12px;
              color: #6a6a6a;
              margin-bottom: 24px;
            }
            
            .contact-info span {
              margin-right: 16px;
            }
            
            .main-content {
              display: grid;
              grid-template-columns: 2fr 1fr;
              gap: 32px;
            }
            
            h2 {
              font-size: 14px;
              font-weight: 600;
              margin: 0 0 12px 0;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              border-bottom: 1px solid #e5e5e5;
              padding-bottom: 4px;
            }
            
            h3 {
              font-size: 13px;
              font-weight: 500;
              margin: 0 0 4px 0;
            }
            
            .company {
              color: #4a4a4a;
              font-size: 11px;
              font-weight: 400;
            }
            
            .dates {
              color: #6a6a6a;
              font-size: 11px;
              margin-top: 2px;
            }
            
            .experience-item {
              margin-bottom: 20px;
              page-break-inside: avoid;
            }
            
            ul {
              list-style: none;
              margin: 8px 0 0 0;
              padding: 0;
            }
            
            li {
              margin-bottom: 6px;
              padding-left: 12px;
              position: relative;
              font-size: 10px;
              line-height: 1.4;
            }
            
            li::before {
              content: "•";
              position: absolute;
              left: 0;
              color: #2563eb;
            }
            
            .sidebar {
              font-size: 11px;
            }
            
            .sidebar section {
              margin-bottom: 20px;
            }
            
            .sidebar h2 {
              font-size: 12px;
              margin-bottom: 8px;
            }
            
            .sidebar li {
              margin-bottom: 4px;
              padding-left: 0;
              font-size: 10px;
            }
            
            .sidebar li::before {
              display: none;
            }
            
            .skill-category {
              margin-bottom: 12px;
            }
            
            .skill-category h4 {
              margin-bottom: 4px;
              font-size: 10px;
              font-weight: 500;
            }
            
            .skill-list {
              color: #6a6a6a;
              font-size: 9px;
              line-height: 1.3;
            }
            
            .education-item {
              margin-bottom: 12px;
            }
            
            .degree {
              font-weight: 500;
              font-size: 10px;
              margin-bottom: 2px;
            }
            
            .institution {
              color: #4a4a4a;
              font-size: 9px;
            }
          </style>
        </head>
        <body>
          <header>
            <h1>KAYRON CALLOWAY</h1>
            <div class="title">Creative Director</div>
            <div class="contact-info">
              <span>Los Angeles, CA</span>
              <span>310.498.8059</span>
              <span>KayronCalloway@gmail.com</span>
            </div>
          </header>

          <div class="main-content">
            <div class="primary-content">
              <section class="experience">
                <h2>Experience</h2>
                
                <div class="experience-item">
                  <h3>Founder & Creative Director</h3>
                  <div class="company">Coloring With Gray</div>
                  <div class="dates">2024 - Present</div>
                  <ul>
                    <li>Building philosophy-driven creative house developing multimodal experiences across fragrance, film, digital applications, and experiential design</li>
                    <li>Developing philosophical frameworks into scalable creative systems spanning multiple mediums and touchpoints</li>
                    <li>Leading team of 7 specialists (designers, developers, photographers, vendors) through pre-launch development and strategic planning</li>
                    <li>Managing $50k development budget across product innovation, digital platforms, and content creation initiatives</li>
                  </ul>
                </div>

                <div class="experience-item">
                  <h3>Financial Analyst (Residuals)</h3>
                  <div class="company">Cast & Crew</div>
                  <div class="dates">Apr 2019 - Present</div>
                  <ul>
                    <li>Manage high-volume residual reporting for entertainment clients including Netflix, HBO, Amazon, and Apple</li>
                    <li>Built automated reporting workflows reducing process time by 30% while maintaining compliance accuracy</li>
                    <li>Interpret complex legal contracts into actionable reporting frameworks for executive teams</li>
                    <li>Allocate and track over $50M annually across multiple client accounts and production budgets</li>
                  </ul>
                </div>

                <div class="experience-item">
                  <h3>Creative Strategist</h3>
                  <div class="company">Independent Practice</div>
                  <div class="dates">2018 - Present</div>
                  <ul>
                    <li>Led creative strategy for Cest Bon Paris Fashion Week activation featuring NBA MVP Shai Gilgeous-Alexander, generating Vogue coverage and brand positioning</li>
                    <li>Developed brand campaigns for Bulletproof Coffee, GOAT Group, No Plastic, Kris Fe, and Purespores, managing budgets up to $250k</li>
                    <li>Created integrated creative solutions spanning digital, experiential, and traditional media for emerging and established brands</li>
                    <li>Negotiated acquisition contracts and strategic partnerships, combining creative vision with business development</li>
                  </ul>
                </div>

                <div class="experience-item">
                  <h3>Creative Director & Co-Founder</h3>
                  <div class="company">Modern Tea Room</div>
                  <div class="dates">Mar 2015 - 2018</div>
                  <ul>
                    <li>Conceptualized and launched community-focused tea house, developing unique sensory experience strategy including signature gummy bear tea blend</li>
                    <li>Designed comprehensive brand identity, interior concept, and customer journey from initial scent immersion to gallery art curation</li>
                    <li>Managed $150k operational budget and collaborated with local artists to create integrated cultural experience</li>
                    <li>Built sustainable community gathering space that became neighborhood staple (600+ Yelp reviews, 4.5+ rating)</li>
                  </ul>
                </div>
              </section>
            </div>

            <div class="sidebar">
              <section class="skills">
                <h2>Core Skills</h2>
                
                <div class="skill-category">
                  <h4>Creative Leadership</h4>
                  <div class="skill-list">Brand Strategy, Creative Direction, Campaign Development, Concept Ideation, Cross-platform Integration</div>
                </div>
                
                <div class="skill-category">
                  <h4>Business Operations</h4>
                  <div class="skill-list">Budget Management, Financial Analysis, Contract Negotiation, Team Leadership, Strategic Planning</div>
                </div>
                
                <div class="skill-category">
                  <h4>Technical</h4>
                  <div class="skill-list">Adobe Creative Suite, Workflow Automation, Data Analysis, Digital Platforms, Project Management</div>
                </div>
                
                <div class="skill-category">
                  <h4>Specialized</h4>
                  <div class="skill-list">Philosophy & Conceptual Thinking, Multimodal Design, Cultural Strategy, Venture Development</div>
                </div>
              </section>

              <section class="education">
                <h2>Education</h2>
                <div class="education-item">
                  <div class="degree">Bachelor of Arts in Philosophy</div>
                  <div class="institution">California State University, Fullerton</div>
                </div>
              </section>

              <section class="recognition">
                <h2>Recognition</h2>
                <ul>
                  <li>Vogue Feature - Cest Bon Paris Fashion Week Campaign</li>
                  <li>Modern Tea Room - 600+ Reviews, 4.5+ Rating</li>
                </ul>
              </section>

              <section class="philosophy">
                <h2>Philosophy</h2>
                <div style="color: #4a4a4a; font-size: 9px; line-height: 1.4; font-style: italic;">
                  "I create from lived experience and authentic perspective, building universes that extend philosophical concepts across multiple mediums. My approach combines analytical thinking with creative innovation, always seeking the redemptive quality in art and business."
                </div>
              </section>
            </div>
          </div>
        </body>
        </html>
      `;

      // Create a temporary container for the resume content
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = resumeHTML;
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);

      // Wait a moment for any fonts to load
      await new Promise(resolve => setTimeout(resolve, 500));

      // Configure html2pdf options
      const opt = {
        margin: 0.4,
        filename: 'Kayron_Calloway_Resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait' 
        }
      };

      // Generate and download the PDF
      await html2pdf().set(opt).from(tempContainer.querySelector('body')).save();

      // Clean up
      document.body.removeChild(tempContainer);
      
      // Reset button state
      downloadButton.innerHTML = originalText;
      downloadButton.disabled = false;

    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF generation failed. Please try again.');
      
      // Reset button state
      downloadButton.innerHTML = '( download pdf )';
      downloadButton.disabled = false;
    }
  });
}
