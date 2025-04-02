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
        { src: 'visuals/bulletproof.jpg', alt: 'Coloring With Gray - Brand Identity' },
        { src: 'visuals/mtr.jpg', alt: 'Coloring With Gray - Product Design' },
        { src: 'visuals/VOL 1. FIRST c.001.jpeg', alt: 'Coloring With Gray - Customer Experience' }
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

  // Initialize the browse experience
  function init() {
    // Ensure container has proper sizing
    const container = document.getElementById('section2');
    if (container) {
      container.style.height = '100vh';
      container.style.overflow = 'hidden';
      
      // Add data attribute for CSS scoping to prevent leaks
      container.setAttribute('data-channel', 'ch2');
      
      // Add attribute to body to prevent any global leaks from fixed elements
      document.body.setAttribute('data-active-channel', 'ch2');
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
    
    // Set up the project cards with more robust click handling
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
      // Remove any existing event listeners
      const newCard = card.cloneNode(true);
      card.parentNode.replaceChild(newCard, card);
      
      // Force card to be clickable
      newCard.style.cursor = 'pointer';
      newCard.style.pointerEvents = 'auto';
      newCard.style.position = 'relative';
      newCard.style.zIndex = '2';
      
      // Add direct click handler
      newCard.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("Card clicked directly");
        const projectId = this.getAttribute('data-project');
        if (projectId) {
          console.log(`Opening project: ${projectId}`);
          openProjectModal(projectId);
          setActiveCard(this);
        } else {
          console.error("No project ID found on card");
        }
        return false;
      };

      // Keyboard accessibility
      newCard.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const projectId = newCard.getAttribute('data-project');
          openProjectModal(projectId);
          setActiveCard(newCard);
        }
      });
      
      // Additional direct event listeners on all child elements
      const childElements = newCard.querySelectorAll('*');
      childElements.forEach(element => {
        element.style.pointerEvents = 'none'; // Let clicks pass through to the card
      });
    });

    // Set up the featured project CTA with more robust click handling
    const featuredCta = document.querySelector('.featured-cta');
    if (featuredCta) {
      // Replace button to clear any potential event listener conflicts
      const newFeaturedCta = featuredCta.cloneNode(true);
      featuredCta.parentNode.replaceChild(newFeaturedCta, featuredCta);
      
      // Force button to be clickable
      newFeaturedCta.style.cursor = 'pointer';
      newFeaturedCta.style.pointerEvents = 'auto';
      newFeaturedCta.style.position = 'relative';
      newFeaturedCta.style.zIndex = '10';
      
      // Direct onclick handler
      newFeaturedCta.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("Featured CTA clicked");
        const projectId = this.getAttribute('data-project');
        if (projectId) {
          console.log(`Opening featured project: ${projectId}`);
          openProjectModal(projectId);
        } else {
          console.error("No project ID found on featured CTA");
        }
        return false;
      };
    }

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
      modalBackdrop.addEventListener('click', closeProjectModal);
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

  // Open the project modal
  function openProjectModal(projectId) {
    if (!projectData[projectId]) {
      console.error(`Project data not found for ID: ${projectId}`);
      return;
    }
    
    const project = projectData[projectId];
    console.log(`Opening modal for project: ${project.title}`);
    
    // Reset the view to "final" when opening a new project
    activeView = 'final';
    updateViewToggleButtons();
    
    // Generate the modal content
    modalContent.innerHTML = generateModalContent(project);
    
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
    
    // Add debugging class
    modal.classList.add('modal-opened');
    
    // Set focus to the close button
    setTimeout(() => {
      const closeButton = document.querySelector('.modal-close');
      if (closeButton) {
        closeButton.focus();
        // Make sure close button is clickable
        closeButton.style.zIndex = '10000';
        closeButton.style.pointerEvents = 'auto';
      } else {
        console.error("Close button not found in modal");
      }
    }, 100);
  }

  // Close the project modal
  function closeProjectModal() {
    console.log("Closing project modal");
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
    
    // Generate gallery HTML
    const galleryHTML = project.galleryImages ? `
      <div class="project-gallery">
        ${project.galleryImages.map(img => `
          <div class="gallery-item">
            <img src="${img.src}" alt="${img.alt}" loading="lazy">
          </div>
        `).join('')}
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

  // Setup smooth scroll for project rows
  function setupSmoothScroll() {
    const scrollers = document.querySelectorAll('.project-scroller');
    
    scrollers.forEach(scroller => {
      const parentRow = scroller.closest('.category-row');
      const leftArrow = parentRow.querySelector('.scroll-left');
      const rightArrow = parentRow.querySelector('.scroll-right');
      
      // Add arrow click handlers with more robust handling
      if (leftArrow) {
        // Replace element to clear any potential event listener conflicts
        const newLeftArrow = leftArrow.cloneNode(true);
        leftArrow.parentNode.replaceChild(newLeftArrow, leftArrow);
        leftArrow = newLeftArrow;
        
        // Force element to be clickable
        leftArrow.style.cursor = 'pointer';
        leftArrow.style.pointerEvents = 'auto';
        leftArrow.style.position = 'relative';
        leftArrow.style.zIndex = '5';
        
        // Direct onclick handler
        leftArrow.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log("Left arrow clicked");
          scroller.scrollBy({ left: -600, behavior: 'smooth' });
          return false;
        };
      }
      
      if (rightArrow) {
        // Replace element to clear any potential event listener conflicts
        const newRightArrow = rightArrow.cloneNode(true);
        rightArrow.parentNode.replaceChild(newRightArrow, rightArrow);
        rightArrow = newRightArrow;
        
        // Force element to be clickable
        rightArrow.style.cursor = 'pointer';
        rightArrow.style.pointerEvents = 'auto';
        rightArrow.style.position = 'relative';
        rightArrow.style.zIndex = '5';
        
        // Direct onclick handler
        rightArrow.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log("Right arrow clicked");
          scroller.scrollBy({ left: 600, behavior: 'smooth' });
          return false;
        };
      }
      
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
        console.log("Channel 2 re-initializing after channel change");
        init();
      }
    }, 300);
  });
})();