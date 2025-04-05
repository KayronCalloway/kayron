// channels/ch2/script.js
(() => {
  // Project data
  const projectData = {
    'business-strategy': {
      title: 'Upgrade Labs (Bulletproof Labs)',
      tagline: 'Key contributor to biohacking fitness center startup and growth',
      description: `Served as a key contributor in the startup and growth of Bulletproof Labs (now Upgrade Labs), a revolutionary biohacking fitness concept created by Dave Asprey of Bulletproof Coffee. Devised strategic business plans and assisted with implementation while mastering operation of up to 15 pieces of cutting-edge fitness equipment. Facilitated sales through prospecting and equipment demonstrations, while analyzing sales data to optimize inventory and maximize profits.`,
      projectUrl: 'https://upgradelabs.com',
      metaInfo: [
        { label: 'Role', value: 'Business Operations' },
        { label: 'Skills', value: 'Strategic Planning, Sales, Equipment Operation' },
        { label: 'Location', value: 'Santa Monica, CA' }
      ],
      galleryImages: [
        { src: 'visuals/bulletproof.jpg', alt: 'Upgrade Labs - Facility' },
        { src: 'visuals/mtr.jpg', alt: 'Upgrade Labs - Tech Equipment' },
        { src: 'visuals/VOL 1. FIRST c.001.jpeg', alt: 'Upgrade Labs - Brand Experience' }
      ],
      processStages: [
        { name: 'Strategic Planning', description: 'Devised strategic business plans and evaluated business requirements for technical solutions.' },
        { name: 'Equipment Expertise', description: 'Mastered operation of up to 15 pieces of advanced fitness and recovery equipment.' },
        { name: 'Sales Development', description: 'Facilitated sales through prospecting, product demonstrations, and customer engagement.' },
        { name: 'Inventory Management', description: 'Analyzed sales data and forecasts to maintain optimal inventory and maximize profits.' }
      ]
    },
    'market-analysis': {
      title: 'The Modern Tea Room',
      tagline: 'Director of Development for specialty tea shop in Lancaster',
      description: `As Director of Development for The Modern Tea Room (MTR), I spearheaded business growth initiatives that propelled this specialty tea shop to success. I designed and implemented four distinct revenue streams, formulated quarterly growth strategies, and championed the brand's development from its inception while mentoring staff to enhance product knowledge and boost sales.`,
      projectUrl: 'https://www.yelp.com/biz/the-modern-tea-room-lancaster',
      metaInfo: [
        { label: 'Role', value: 'Director of Development' },
        { label: 'Timeline', value: 'March 2015 - March 2016' },
        { label: 'Location', value: 'Lancaster, CA' }
      ],
      galleryImages: [
        { src: 'visuals/mtr.jpg', alt: 'The Modern Tea Room - Interior' },
        { src: 'visuals/bulletproof.jpg', alt: 'The Modern Tea Room - Products' },
        { src: 'visuals/VOL 1. FIRST c.001.jpeg', alt: 'The Modern Tea Room - Customer Experience' }
      ],
      processStages: [
        { name: 'Revenue Diversification', description: 'Designed and enabled four alternative revenue sources for sustainable growth.' },
        { name: 'Team Development', description: 'Mentored staff in product knowledge and sales techniques to enhance customer experience.' },
        { name: 'Strategic Planning', description: 'Formulated comprehensive quarterly strategies to maximize revenue and growth.' },
        { name: 'Brand Building', description: 'Championed the growth of the brand from inception, establishing market presence.' }
      ]
    },
    'growth-platform': {
      title: 'VOL 1 Coffee Concept',
      tagline: 'Pioneering the 4th Wave Coffee movement',
      description: `VOL 1 envisions a space that transcends the boundaries of coffee, culture, and craftsmanship—creating a global destination where tranquility and artistry inspire connection and discovery. Our mission is to create an immersive coffee experience that bridges cultures, showcases the world's finest coffees, and celebrates the art of connection while establishing the new 4th wave coffee movement.`,
      projectUrl: '#',
      metaInfo: [
        { label: 'Status', value: 'In Development' },
        { label: 'Role', value: 'Founder & Concept Creator' },
        { label: 'Category', value: 'Hospitality Innovation' }
      ],
      galleryImages: [
        { src: 'visuals/VOL 1. FIRST c.001.jpeg', alt: 'VOL 1 - Coffee Experience Concept' },
        { src: 'visuals/bulletproof.jpg', alt: 'VOL 1 - Space Design Concept' },
        { src: 'visuals/dou.jpg', alt: 'VOL 1 - Cultural Integration Elements' }
      ],
      processStages: [
        { name: 'Vision Development', description: 'Creating a foundational concept that transcends traditional coffee experiences.' },
        { name: 'Cultural Integration', description: 'Designing elements that bridge different coffee cultures and traditions.' },
        { name: 'Experiential Innovation', description: 'Developing immersive customer journeys that balance artistry and tranquility.' },
        { name: 'Fourth Wave Pioneering', description: 'Establishing frameworks for what defines the new era of coffee culture.' }
      ]
    },
    'luxury-brand': {
      title: 'C'est Bon Paris Fashion Week',
      tagline: 'Audio design and narration for SS23 runway presentation',
      description: `Contributed audio design and narration for C'est Bon's Spring/Summer 2023 Collection showcased at Paris Fashion Week. The collection, which received coverage in fashion publications including Vogue, explored themes of nature and architecture. My role involved creating audio elements that complemented the designs while also providing consulting services for the presentation.`,
      projectUrl: 'https://pausemag.co.uk/2022/06/cest-bon-spring-summer-2023-collection/',
      metaInfo: [
        { label: 'Role', value: 'Audio Design & Narration' },
        { label: 'Season', value: 'Spring/Summer 2023' },
        { label: 'Coverage', value: 'Vogue, Pause Magazine' }
      ],
      galleryImages: [
        { src: 'visuals/dou.jpg', alt: 'C'est Bon - Runway Presentation' },
        { src: 'visuals/sobe.jpeg', alt: 'C'est Bon - Collection Details' },
        { src: 'visuals/VOL 1. FIRST c.001.jpeg', alt: 'C'est Bon - Show Experience' }
      ],
      processStages: [
        { name: 'Concept Development', description: 'Understanding the collection's themes to create complementary audio elements.' },
        { name: 'Audio Design', description: 'Crafting a sonic atmosphere that enhanced the visual and emotional impact of designs.' },
        { name: 'Narration', description: 'Recording evocative narrative elements that communicated the brand's vision.' },
        { name: 'Consultation', description: 'Providing strategic input to optimize the overall presentation experience.' }
      ]
    },
    'digital-platform': {
      title: 'SOBE x Trophies Collaboration',
      tagline: 'Menu design and concept development for culinary partnership',
      description: `Assisted in creating the concept, storytelling, and artistic direction for the SOBE x Trophies collaboration burger project. My contributions included menu design and refinement, helping to translate the SOBE brand's ethos into a unique culinary experience that resonated with customers and enhanced both brands' visibility.`,
      projectUrl: 'https://www.instagram.com/p/C_08KxTyJHB/',
      metaInfo: [
        { label: 'Role', value: 'Menu & Concept Design' },
        { label: 'Collaboration', value: 'SOBE x Trophies' },
        { label: 'Platform', value: 'Culinary Experience' }
      ],
      galleryImages: [
        { src: 'visuals/sobe.jpeg', alt: 'SOBE x Trophies - Collaboration Burger' },
        { src: 'visuals/bulletproof.jpg', alt: 'SOBE x Trophies - Menu Design' },
        { src: 'visuals/VOL 1. FIRST c.001.jpeg', alt: 'SOBE x Trophies - Concept Art' }
      ],
      processStages: [
        { name: 'Concept Development', description: 'Creating a narrative that united the SOBE brand with culinary innovation.' },
        { name: 'Menu Design', description: 'Crafting a specialized menu that highlighted the partnership elements.' },
        { name: 'Artistic Direction', description: 'Contributing to the visual storytelling and presentation concepts.' },
        { name: 'Refinement', description: 'Iterative improvements to ensure the final experience matched the collaborative vision.' }
      ]
    },
    'user-experience': {
      title: 'Coloring With Gray',
      tagline: 'Founder & Creative Director of luxury fragrance brand',
      description: `Established and founded Coloring With Gray, creating immersive sensory experiences that challenge perspectives. Launched "Reflections of You," a bespoke fragrance portfolio leveraging proprietary olfactory technologies that evolve with the wearer. Engineered a brand ecosystem converging consumer psychology with artistic narrative, while overseeing end-to-end product development and sustainability-driven production strategies.`,
      projectUrl: 'https://coloringwithgray.github.io/coloring-page/',
      metaInfo: [
        { label: 'Role', value: 'Founder & Creative Director' },
        { label: 'Founded', value: '2024' },
        { label: 'Product', value: 'Luxury Fragrance' }
      ],
      galleryImages: [
        // Website-inspired preview
        { 
          customHtml: `
            <div style="width: 100%; height: 100%; background-color: #f7f7f7; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
              <div style="font-family: 'Merova', serif; font-size: 28px; font-weight: bold; margin-bottom: 25px; color: #333; letter-spacing: 2px;">COLORING WITH GRAY</div>
              <div style="width: 120px; height: 160px; background: linear-gradient(to bottom, #d1d1d1, #eaeaea); border-radius: 10px 10px 30px 30px; position: relative; margin-bottom: 30px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                <div style="width: 40px; height: 25px; background-color: #b0b0b0; border-radius: 10px; position: absolute; top: -15px; left: 40px;"></div>
                <div style="width: 80px; height: 20px; background-color: rgba(255,255,255,0.5); position: absolute; top: 40px; left: 20px; border-radius: 10px;"></div>
              </div>
              <div style="font-size: 16px; font-style: italic; color: #666; margin-bottom: 30px; text-align: center;">Experience scents that evolve with you</div>
              <div style="display: flex; gap: 15px;">
                <div style="padding: 8px 20px; background-color: #333; color: white; border-radius: 4px; font-size: 14px; cursor: pointer;">SHOP NOW</div>
                <div style="padding: 8px 20px; background-color: transparent; color: #333; border: 1px solid #333; border-radius: 4px; font-size: 14px; cursor: pointer;">LEARN MORE</div>
              </div>
            </div>
          `,
          alt: 'Coloring With Gray - Website Preview' 
        },
        { 
          customHtml: `
            <div style="width: 100%; height: 100%; background-color: #f2f2f2; display: flex; flex-direction: column; padding: 20px;">
              <div style="font-family: 'Merova', serif; font-size: 20px; font-weight: bold; margin-bottom: 20px; color: #333;">REFLECTIONS OF YOU</div>
              <div style="display: flex; gap: 15px; flex: 1;">
                <div style="flex: 1; background: linear-gradient(to bottom, #e5e5e5, #f5f5f5); border-radius: 5px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px;">
                  <div style="width: 40px; height: 70px; background: linear-gradient(to bottom, #d1d1d1, #e8e8e8); border-radius: 5px 5px 15px 15px; margin-bottom: 10px;"></div>
                  <div style="font-size: 12px; text-align: center;">MORNING</div>
                </div>
                <div style="flex: 1; background: linear-gradient(to bottom, #d5d5d5, #e8e8e8); border-radius: 5px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px;">
                  <div style="width: 40px; height: 70px; background: linear-gradient(to bottom, #c1c1c1, #d8d8d8); border-radius: 5px 5px 15px 15px; margin-bottom: 10px;"></div>
                  <div style="font-size: 12px; text-align: center;">AFTERNOON</div>
                </div>
                <div style="flex: 1; background: linear-gradient(to bottom, #b5b5b5, #d5d5d5); border-radius: 5px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px;">
                  <div style="width: 40px; height: 70px; background: linear-gradient(to bottom, #a1a1a1, #c8c8c8); border-radius: 5px 5px 15px 15px; margin-bottom: 10px;"></div>
                  <div style="font-size: 12px; text-align: center; color: #333;">EVENING</div>
                </div>
              </div>
            </div>
          `,
          alt: 'Coloring With Gray - Product Collection' 
        },
        { 
          customHtml: `
            <div style="width: 100%; height: 100%; background-color: #efefef; display: flex; flex-direction: column; padding: 20px;">
              <div style="font-size: 14px; text-transform: uppercase; margin-bottom: 15px; color: #555;">Our Technology</div>
              <div style="font-family: 'Merova', serif; font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #333;">Proprietary Olfactory Evolution</div>
              <div style="display: flex; align-items: center; gap: 20px; flex: 1;">
                <div style="flex: 1; height: 100%; background: linear-gradient(45deg, #d0d0d0, #e0e0e0); border-radius: 10px; position: relative; overflow: hidden;">
                  <div style="position: absolute; width: 80%; height: 80%; top: 10%; left: 10%; background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%); animation: pulse 3s infinite alternate;"></div>
                </div>
                <div style="flex: 1;">
                  <div style="width: 100%; height: 5px; background-color: #ddd; margin-bottom: 15px;"></div>
                  <div style="width: 100%; height: 5px; background-color: #ccc; margin-bottom: 15px;"></div>
                  <div style="width: 100%; height: 5px; background-color: #bbb; margin-bottom: 15px;"></div>
                  <div style="font-size: 12px; color: #666; line-height: 1.4;">Our fragrances adapt to your body chemistry throughout the day, creating a truly personalized experience.</div>
                </div>
              </div>
            </div>
          `,
          alt: 'Coloring With Gray - Technology' 
        }
      ],
      processStages: [
        { name: 'Brand Development', description: 'Creating a brand identity that challenges conventional perspectives on fragrance.' },
        { name: 'Product Innovation', description: 'Developing proprietary olfactory technologies for personalized fragrance experiences.' },
        { name: 'Experience Design', description: 'Engineering immersive customer experiences that blend artistry with commerce.' },
        { name: 'Sustainable Production', description: 'Implementing ethical sourcing and environmentally conscious production methods.' }
      ]
    },
  };

  // Default projects for modal process views
  for (const key in projectData) {
    if (!projectData[key].processView) {
      projectData[key].processView = {
        title: 'Our Process',
        description: 'Behind the scenes of how we approach this work',
        stages: projectData[key].processStages || []
      };
    }
  }

  // DOM elements
  let modal;
  let modalContent;
  let modalBackdrop;
  let activeCard = null;
  let activeView = 'final';

  // Initialize the browse experience with mobile optimizations
  function init() {
    // Detect mobile device
    const isMobile = window.innerWidth <= 600 || isMobileDevice();
    
    // Ensure container has proper sizing
    const container = document.getElementById('section2');
    if (container) {
      container.style.height = '100vh';
      container.style.overflow = 'hidden';
      
      // Add data attribute for CSS scoping to prevent leaks
      container.setAttribute('data-channel', 'ch2');
      
      // Add mobile-specific attribute if needed
      if (isMobile) {
        container.setAttribute('data-mobile', 'true');
      }
      
      // Add attribute to body to prevent any global leaks from fixed elements
      document.body.setAttribute('data-active-channel', 'ch2');
      
      // Safari-specific fix: ensure no click events are being captured/blocked at the container level
      container.style.pointerEvents = 'auto';
      container.onclick = null;
      
      // Mobile optimization for touch
      if (isMobile) {
        container.style.webkitTapHighlightColor = 'transparent';
        container.style.webkitTouchCallout = 'none';
      }
      
      // Make sure no parent elements are capturing clicks
      let parent = container.parentNode;
      while (parent && parent !== document.body) {
        parent.style.pointerEvents = 'auto';
        parent.onclick = null;
        parent = parent.parentNode;
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
    
    // Ensure portfolio browse has proper sizing
    const portfolioBrowse = document.getElementById('portfolio-browse');
    if (portfolioBrowse) {
      portfolioBrowse.style.height = '100%';
      portfolioBrowse.style.overflow = 'hidden';
      portfolioBrowse.style.display = 'flex';
      portfolioBrowse.style.flexDirection = 'column';
      portfolioBrowse.style.paddingTop = '60px'; // Add top padding of about 1 inch
    }
    
    // Simplify card interaction by using a single global event listener for all cards
    // This approach avoids issues with event propagation and Safari's event handling quirks
    
    // First ensure cards are visually clickable 
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
      card.style.cursor = 'pointer';
      card.style.pointerEvents = 'auto';
      card.style.position = 'relative';
      card.style.zIndex = '2';
    });
    
    // Global event handler for card clicks through event delegation
    document.body.addEventListener('click', function(e) {
      // Check if clicked element is a card or inside a card
      const card = e.target.closest('.project-card');
      if (card) {
        const projectId = card.getAttribute('data-project');
        if (projectId) {
          // Add small delay to ensure event processing completes
          setTimeout(() => {
            openProjectModal(projectId);
            setActiveCard(card);
          }, 10);
        } else {
          console.error("No project ID found on card");
        }
      }
    });
    
    // Still keep keyboard accessibility
    cards.forEach(card => {
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const projectId = card.getAttribute('data-project');
          openProjectModal(projectId);
          setActiveCard(card);
        }
      });
    });

    // Direct approach for featured CTA button
    document.body.addEventListener('click', function(e) {
      // Check if the clicked element is the featured CTA or inside it
      if (e.target.classList.contains('featured-cta') || e.target.closest('.featured-cta')) {
        // Get the button element
        const button = e.target.classList.contains('featured-cta') ? e.target : e.target.closest('.featured-cta');
        
        // Get project ID and open modal
        const projectId = button.getAttribute('data-project');
        if (projectId) {
          setTimeout(() => {
            openProjectModal(projectId);
          }, 10);
        } else {
          console.error("No project ID found on featured CTA");
        }
      }
    });

    // Get modal elements
    modal = document.getElementById('project-modal');
    modalContent = document.querySelector('.modal-content');
    modalBackdrop = document.querySelector('.modal-backdrop');
    
    // Add modal close handlers
    const closeButton = document.querySelector('.modal-close');
    if (closeButton) {
      closeButton.addEventListener('click', closeProjectModal);
    }
    
    // Close on backdrop click
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        // Only close if the click is directly on the backdrop (not on modal container)
        if (e.target === modalBackdrop) {
          closeProjectModal();
        }
      });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
        closeProjectModal();
      }
    });

    // Set up view toggle buttons
    const viewButtons = document.querySelectorAll('.view-toggle');
    viewButtons.forEach(button => {
      button.addEventListener('click', () => {
        const view = button.getAttribute('data-view');
        toggleView(view);
        
        // Update active button
        viewButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });

    // Behind the scenes mode removed

    // Set initial active state for first view button
    if (viewButtons.length > 0) {
      viewButtons[0].classList.add('active');
    }
    
    // Create smooth scroll for project rows
    setupSmoothScroll();
  }

  // Open the project modal with mobile optimizations
  function openProjectModal(projectId) {
    if (!projectData[projectId]) {
      console.error(`Project data not found for ID: ${projectId}`);
      return;
    }
    
    const project = projectData[projectId];
    const isMobile = window.innerWidth <= 600;
    
    // Reset the view to "final" when opening a new project
    activeView = 'final';
    updateViewToggleButtons();
    
    // Generate the modal content
    modalContent.innerHTML = generateModalContent(project);
    
    // Apply mobile-specific optimizations to the modal content
    if (isMobile) {
      // Enhance gallery for mobile viewing
      const gallery = modalContent.querySelector('.project-gallery');
      if (gallery) {
        gallery.style.gridTemplateColumns = '1fr'; // Single column on mobile
        
        // Make gallery images taller on mobile for better visibility
        const galleryItems = gallery.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
          item.style.height = '180px';
        });
      }
      
      // Make project link more prominent on mobile
      const projectLink = modalContent.querySelector('.project-link a');
      if (projectLink) {
        projectLink.style.display = 'block';
        projectLink.style.width = '100%';
        projectLink.style.textAlign = 'center';
        projectLink.style.padding = '15px 0';
        projectLink.style.minHeight = '50px';
      }
      
      // Adjust description text for readability on mobile
      const description = modalContent.querySelector('.project-description p');
      if (description) {
        description.style.fontSize = '0.95rem';
        description.style.lineHeight = '1.5';
      }
    }
    
    // Safari-specific and mobile modal fix: ensure elements are clickable
    setTimeout(() => {
      // Force all links and buttons in modal to be clickable
      const clickables = modalContent.querySelectorAll('a, button');
      clickables.forEach(el => {
        el.style.cursor = 'pointer';
        el.style.pointerEvents = 'auto';
        el.style.position = 'relative';
        el.style.zIndex = '20';
        
        // Mobile enhancements for touch targets
        if (isMobile) {
          if (el.tagName === 'BUTTON') {
            el.style.minHeight = '44px';
            el.style.minWidth = '44px';
            el.style.padding = '10px 15px';
          }
          el.style.webkitTapHighlightColor = 'rgba(62, 146, 204, 0.3)';
          el.style.touchAction = 'manipulation';
        }
        
        // Safari direct click handler
        el.onclick = function(e) {
          e.stopPropagation();
          return true; // Allow normal link behavior
        };
      });
    }, 50);
    
    // Show the modal and ensure it's scoped to this channel
    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('data-channel', 'ch2');
    
    // Make sure modal is visible and positioned correctly
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
    modal.style.zIndex = '9999';
    modal.style.pointerEvents = 'auto';
    
    // Safari-specific fix: ensure clicks work within the modal
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    modal.addEventListener('click', function(e) {
      e.stopPropagation();
    }, true);
    
    // Add debugging class
    modal.classList.add('modal-opened');
    
    // Set focus to the close button with Safari-specific handling
    setTimeout(() => {
      const closeButton = document.querySelector('.modal-close');
      if (closeButton) {
        closeButton.focus();
        
        // Replace button to clear any conflicting listeners for Safari
        const newCloseButton = closeButton.cloneNode(true);
        closeButton.parentNode.replaceChild(newCloseButton, closeButton);
        
        // Make sure close button is clickable for Safari
        newCloseButton.style.cursor = 'pointer';
        newCloseButton.style.pointerEvents = 'auto';
        newCloseButton.style.position = 'relative';
        newCloseButton.style.zIndex = '10000';
        newCloseButton.style.touchAction = 'manipulation'; // Safari touch optimization
        
        // Direct Safari-friendly click handler
        newCloseButton.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          closeProjectModal();
          return false;
        };
      } else {
        console.error("Close button not found in modal");
      }
    }, 100);
  }

  // Close the project modal
  function closeProjectModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('data-channel');
    
    // Reset modal styles
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    modal.style.pointerEvents = 'none';
    
    // Remove debugging class
    modal.classList.remove('modal-opened');
    
    // Remove active states from cards
    if (activeCard) {
      activeCard.classList.remove('active');
      activeCard = null;
    }
    
    // Set focus back to document body
    document.body.focus();
    
    // Delay hiding the modal to allow for transition
    setTimeout(() => {
      if (modal.getAttribute('aria-hidden') === 'true') {
        modal.style.display = 'none';
      }
    }, 500);
  }

  // Set active card
  function setActiveCard(card) {
    // Remove active class from any previously active card
    const activeCards = document.querySelectorAll('.project-card.active');
    activeCards.forEach(activeCard => {
      activeCard.classList.remove('active');
    });
    
    // Add active class to the selected card
    card.classList.add('active');
    activeCard = card;
  }

  // Toggle between final and process views
  function toggleView(view) {
    activeView = view;
    
    const finalView = document.querySelector('.final-view');
    const processView = document.querySelector('.process-view');
    
    if (view === 'final') {
      finalView.classList.add('active');
      processView.classList.remove('active');
    } else {
      finalView.classList.remove('active');
      processView.classList.add('active');
    }
    
    // Update the active button state
    updateViewToggleButtons();
  }

  // Update view toggle buttons to reflect the active view
  function updateViewToggleButtons() {
    const viewButtons = document.querySelectorAll('.view-toggle');
    viewButtons.forEach(button => {
      const buttonView = button.getAttribute('data-view');
      if (buttonView === activeView) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  // Behind the scenes mode function removed

  // Generate modal content based on project data
  function generateModalContent(project) {
    // Generate meta info HTML
    const metaHTML = project.metaInfo ? project.metaInfo.map(meta => `
      <div class="meta-item">
        <strong>${meta.label}:</strong> ${meta.value}
      </div>
    `).join('') : '';
    
    // Generate project link HTML if URL exists
    const projectLinkHTML = project.projectUrl ? `
      <div class="project-link">
        <a href="${project.projectUrl}" target="_blank" rel="noopener noreferrer" class="external-link">
          Visit Project <span class="link-arrow">→</span>
        </a>
      </div>
    ` : '';
    
    // Generate gallery HTML, supporting both regular images and custom HTML
    const galleryHTML = project.galleryImages ? `
      <div class="project-gallery">
        ${project.galleryImages.map(img => {
          // Support custom HTML for website previews
          if (img.customHtml) {
            return `
              <div class="gallery-item">
                ${img.customHtml}
              </div>
            `;
          } else {
            return `
              <div class="gallery-item">
                <img src="${img.src}" alt="${img.alt}" loading="lazy">
              </div>
            `;
          }
        }).join('')}
      </div>
    ` : '';
    
    // Generate process timeline HTML
    const processTimelineHTML = project.processStages ? `
      <div class="timeline-stages">
        ${project.processStages.map((stage, index) => `
          <div class="stage ${index === 0 ? 'active' : ''}">
            <div class="stage-marker">${index + 1}</div>
            <div class="stage-name">${stage.name}</div>
          </div>
        `).join('')}
      </div>
      <div class="stage-details">
        <h4>${project.processStages[0].name} Phase</h4>
        <p>${project.processStages[0].description}</p>
      </div>
    ` : '';
    
    // Complete modal content with final and process views
    return `
      <div class="project-header">
        <h2 class="project-title">${project.title}</h2>
        <p class="project-tagline">${project.tagline}</p>
      </div>
      
      <div class="project-meta">
        ${metaHTML}
      </div>
      
      <div class="view-content">
        <div class="final-view active">
          ${galleryHTML}
          
          <div class="project-description">
            <h3>Overview</h3>
            <p>${project.description}</p>
            ${projectLinkHTML}
          </div>
        </div>
        
        <div class="process-view">
          <div class="process-timeline">
            <h3 class="timeline-header">${project.processView.title}</h3>
            <p>${project.processView.description}</p>
            ${processTimelineHTML}
          </div>
        </div>
      </div>
    `;
  }

  // Setup smooth scroll for project rows with mobile optimizations
  function setupSmoothScroll() {
    const scrollers = document.querySelectorAll('.project-scroller');
    const isMobile = window.innerWidth <= 600;
    
    scrollers.forEach(scroller => {
      const parentRow = scroller.closest('.category-row');
      const leftArrow = parentRow.querySelector('.scroll-left');
      const rightArrow = parentRow.querySelector('.scroll-right');
      
      // Mobile optimizations for scrolling
      if (isMobile) {
        // Add smooth scrolling for iOS
        scroller.style.webkitOverflowScrolling = 'touch';
        
        // Add scroll snapping for a more pleasant touch experience
        scroller.style.scrollSnapType = 'x mandatory';
        
        // Set proper styles for cards to support snapping
        const cards = scroller.querySelectorAll('.project-card');
        cards.forEach(card => {
          card.style.scrollSnapAlign = 'start';
          card.style.minWidth = '200px'; // Ensure consistent width on mobile
          
          // Enhance touch feedback
          card.style.webkitTapHighlightColor = 'rgba(62, 146, 204, 0.3)';
          card.style.touchAction = 'manipulation';
        });
      }
      
      // Set enhanced styles for arrows with mobile optimizations
      if (leftArrow) {
        leftArrow.style.cursor = 'pointer';
        leftArrow.style.pointerEvents = 'auto';
        leftArrow.style.position = 'relative';
        leftArrow.style.zIndex = '5';
        leftArrow.setAttribute('data-scrolldir', 'left');
        
        if (isMobile) {
          leftArrow.style.width = '50px';
          leftArrow.style.height = '50px';
          leftArrow.style.fontSize = '22px';
          leftArrow.style.display = 'flex';
          leftArrow.style.alignItems = 'center';
          leftArrow.style.justifyContent = 'center';
          leftArrow.style.opacity = '0.9';
          leftArrow.style.webkitTapHighlightColor = 'rgba(62, 146, 204, 0.3)';
          leftArrow.style.touchAction = 'manipulation';
        }
      }
      
      if (rightArrow) {
        rightArrow.style.cursor = 'pointer';
        rightArrow.style.pointerEvents = 'auto';
        rightArrow.style.position = 'relative';
        rightArrow.style.zIndex = '5';
        rightArrow.setAttribute('data-scrolldir', 'right');
        
        if (isMobile) {
          rightArrow.style.width = '50px';
          rightArrow.style.height = '50px';
          rightArrow.style.fontSize = '22px';
          rightArrow.style.display = 'flex';
          rightArrow.style.alignItems = 'center';
          rightArrow.style.justifyContent = 'center';
          rightArrow.style.opacity = '0.9';
          rightArrow.style.webkitTapHighlightColor = 'rgba(62, 146, 204, 0.3)';
          rightArrow.style.touchAction = 'manipulation';
        }
      }
      
      // Add a single global event handler for scroll arrows
      document.body.addEventListener('click', function(e) {
        // Check for left arrow
        if (e.target.classList.contains('scroll-left') || e.target.closest('.scroll-left')) {
          // Find the scroller element
          const parentRow = e.target.closest('.category-row');
          if (parentRow) {
            const scroller = parentRow.querySelector('.project-scroller');
            if (scroller) {
              scroller.scrollBy({ left: -600, behavior: 'smooth' });
            }
          }
        }
        // Check for right arrow
        else if (e.target.classList.contains('scroll-right') || e.target.closest('.scroll-right')) {
          // Find the scroller element
          const parentRow = e.target.closest('.category-row');
          if (parentRow) {
            const scroller = parentRow.querySelector('.project-scroller');
            if (scroller) {
              scroller.scrollBy({ left: 600, behavior: 'smooth' });
            }
          }
        }
      });
      
      // Add mousewheel horizontal scrolling
      scroller.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          scroller.scrollLeft += e.deltaY;
        }
      }, { passive: false });
      
      // Add touch scrolling
      let startX;
      let scrollLeft;
      
      scroller.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - scroller.offsetLeft;
        scrollLeft = scroller.scrollLeft;
      }, { passive: true });
      
      scroller.addEventListener('touchmove', (e) => {
        if (!startX) return;
        const x = e.touches[0].pageX - scroller.offsetLeft;
        const walk = (x - startX) * 2;
        scroller.scrollLeft = scrollLeft - walk;
      }, { passive: true });
      
      // Show/hide arrows based on scroll position
      function updateArrowVisibility() {
        // Only show left arrow if there's content to scroll left
        if (leftArrow) {
          leftArrow.style.opacity = scroller.scrollLeft > 20 ? 0.7 : 0.2;
        }
        
        // Only show right arrow if there's content to scroll right
        if (rightArrow) {
          const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth - 20;
          rightArrow.style.opacity = scroller.scrollLeft < maxScrollLeft ? 0.7 : 0.2;
        }
      }
      
      // Initial visibility check
      updateArrowVisibility();
      
      // Update on scroll
      scroller.addEventListener('scroll', updateArrowVisibility);
      
      // Update on window resize
      window.addEventListener('resize', updateArrowVisibility);
    });
  }

  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', init);
  
  // If document is already loaded, initialize immediately
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  }
  
  // Re-initialize if channel is shown after being hidden
  document.addEventListener('channelChange', () => {
    setTimeout(() => {
      if (document.body.getAttribute('data-active-channel') === 'ch2') {
        init();
      }
    }, 300);
  });
})();