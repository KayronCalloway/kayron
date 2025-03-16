// channels/ch2/script.js
(() => {
  // Project data
  const projectData = {
    'business-strategy': {
      title: 'Business Strategy Solutions',
      tagline: 'Transform your business with our revolutionary strategic approach',
      description: `Our comprehensive business strategy solutions help companies identify opportunities for growth, optimize their operations, and develop roadmaps for sustainable success. We combine market analysis with innovative thinking to create customized strategies that deliver measurable results.`,
      metaInfo: [
        { label: 'Client Impact', value: '45+ Businesses' },
        { label: 'Average ROI', value: '300%' },
        { label: 'Success Rate', value: '87%' }
      ],
      galleryImages: [
        { src: 'visuals/bulletproof.jpg', alt: 'Business Strategy - Framework Overview' },
        { src: 'visuals/mtr.jpg', alt: 'Business Strategy - Workshop Session' },
        { src: 'visuals/VOL 1. FIRST c.001.jpeg', alt: 'Business Strategy - Results Graphic' }
      ],
      processStages: [
        { name: 'Research', description: 'In-depth market and competitive analysis to identify opportunities and threats.' },
        { name: 'Strategy', description: 'Development of custom frameworks tailored to your specific business objectives.' },
        { name: 'Implementation', description: 'Hands-on guidance to execute strategic initiatives with precision.' },
        { name: 'Measurement', description: 'Tracking key performance indicators to quantify impact and ROI.' }
      ]
    },
    'market-analysis': {
      title: 'Market Analysis Framework',
      tagline: 'Data-driven insights to navigate complex market landscapes',
      description: `Our market analysis framework provides comprehensive intelligence on industry trends, competitive positioning, and growth opportunities. Using advanced data analytics and expert interpretation, we deliver actionable insights that help businesses make informed strategic decisions.`,
      metaInfo: [
        { label: 'Markets Analyzed', value: '12+' },
        { label: 'Data Points', value: '10,000+' },
        { label: 'Accuracy Rate', value: '95%' }
      ],
      galleryImages: [
        { src: 'visuals/mtr.jpg', alt: 'Market Analysis - Data Visualization' },
        { src: 'visuals/bulletproof.jpg', alt: 'Market Analysis - Segment Breakdown' },
        { src: 'visuals/VOL 1. FIRST c.001.jpeg', alt: 'Market Analysis - Competitive Landscape' }
      ],
      processStages: [
        { name: 'Data Collection', description: 'Gathering comprehensive industry and competitive intelligence.' },
        { name: 'Analysis', description: 'Applying advanced analytics to identify patterns and opportunities.' },
        { name: 'Interpretation', description: 'Translating data into meaningful business insights.' },
        { name: 'Recommendation', description: 'Developing actionable strategies based on findings.' }
      ]
    },
    'growth-platform': {
      title: 'Growth Platform',
      tagline: 'Scalable solutions for sustainable business expansion',
      description: `Our Growth Platform provides businesses with the strategies, tools, and frameworks needed to scale effectively. We focus on creating sustainable growth engines that can adapt to changing market conditions while maintaining operational excellence.`,
      metaInfo: [
        { label: 'Growth Rate', value: '200%' },
        { label: 'Scalability Index', value: '8.5/10' },
        { label: 'Implementation Time', value: '90 Days' }
      ],
      galleryImages: [
        { src: 'visuals/VOL 1. FIRST c.001.jpeg', alt: 'Growth Platform - Scaling Framework' },
        { src: 'visuals/bulletproof.jpg', alt: 'Growth Platform - Expansion Planning' },
        { src: 'visuals/dou.jpg', alt: 'Growth Platform - Market Penetration' }
      ],
      processStages: [
        { name: 'Assessment', description: 'Identifying current capabilities and growth limitations.' },
        { name: 'Architecture', description: 'Designing scalable systems and processes.' },
        { name: 'Activation', description: 'Implementing growth strategies across channels.' },
        { name: 'Acceleration', description: 'Optimizing for maximum sustainable growth velocity.' }
      ]
    },
    'luxury-brand': {
      title: 'Luxury Brand Development',
      tagline: 'Elevating brands to premium market positioning',
      description: `Our luxury brand development service helps businesses establish distinctive positioning in premium markets. We craft sophisticated brand identities, design high-end customer experiences, and develop exclusive marketing strategies that resonate with affluent audiences.`,
      metaInfo: [
        { label: 'Brand Value Increase', value: '65%' },
        { label: 'Industry Awards', value: '12' },
        { label: 'Premium Perception', value: '9.2/10' }
      ],
      galleryImages: [
        { src: 'visuals/dou.jpg', alt: 'Luxury Brand - Identity System' },
        { src: 'visuals/sobe.jpeg', alt: 'Luxury Brand - Customer Experience' },
        { src: 'visuals/VOL 1. FIRST c.001.jpeg', alt: 'Luxury Brand - Market Positioning' }
      ],
      processStages: [
        { name: 'Identity', description: 'Crafting distinctive luxury positioning and visual language.' },
        { name: 'Experience', description: 'Designing premium touchpoints across all customer interactions.' },
        { name: 'Exclusivity', description: 'Building scarcity and desirability into brand offerings.' },
        { name: 'Elevation', description: 'Continuous refinement to maintain premium positioning.' }
      ]
    },
    'digital-platform': {
      title: 'Digital Innovation Platform',
      tagline: 'Cutting-edge technology solutions for business transformation',
      description: `Our Digital Innovation Platform helps businesses harness emerging technologies to create competitive advantages. From AI-powered analytics to immersive customer experiences, we build forward-thinking digital solutions that drive engagement and business outcomes.`,
      metaInfo: [
        { label: 'Engagement Increase', value: '250%' },
        { label: 'Implementation Speed', value: '40% Faster' },
        { label: 'Digital Transformation', value: '32 Businesses' }
      ],
      galleryImages: [
        { src: 'visuals/mtr.jpg', alt: 'Digital Platform - Technology Stack' },
        { src: 'visuals/bulletproof.jpg', alt: 'Digital Platform - User Interface' },
        { src: 'visuals/VOL 1. FIRST c.001.jpeg', alt: 'Digital Platform - Performance Metrics' }
      ],
      processStages: [
        { name: 'Discovery', description: 'Identifying digital opportunity spaces and technologies.' },
        { name: 'Architecture', description: 'Designing innovative systems and platforms.' },
        { name: 'Development', description: 'Building with cutting-edge technologies and methodologies.' },
        { name: 'Optimization', description: 'Continuously enhancing performance and capabilities.' }
      ]
    }
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
    // Set up the project cards
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const projectId = card.getAttribute('data-project');
        openProjectModal(projectId);
        setActiveCard(card);
      });

      // Keyboard accessibility
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const projectId = card.getAttribute('data-project');
          openProjectModal(projectId);
          setActiveCard(card);
        }
      });
    });

    // Set up the featured project CTA
    const featuredCta = document.querySelector('.featured-cta');
    if (featuredCta) {
      featuredCta.addEventListener('click', () => {
        const projectId = featuredCta.getAttribute('data-project');
        openProjectModal(projectId);
      });
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

    // Set up behind the scenes toggle
    const viewModeToggle = document.getElementById('view-mode-toggle');
    if (viewModeToggle) {
      viewModeToggle.addEventListener('click', toggleBehindScenesMode);
    }

    // Set initial active state for first view button
    if (viewButtons.length > 0) {
      viewButtons[0].classList.add('active');
    }
    
    // Create smooth scroll for project rows
    setupSmoothScroll();
  }

  // Open the project modal
  function openProjectModal(projectId) {
    if (!projectData[projectId]) return;
    
    const project = projectData[projectId];
    
    // Reset the view to "final" when opening a new project
    activeView = 'final';
    updateViewToggleButtons();
    
    // Generate the modal content
    modalContent.innerHTML = generateModalContent(project);
    
    // Show the modal
    modal.setAttribute('aria-hidden', 'false');
    
    // Set focus to the close button
    setTimeout(() => {
      document.querySelector('.modal-close').focus();
    }, 100);
  }

  // Close the project modal
  function closeProjectModal() {
    modal.setAttribute('aria-hidden', 'true');
    
    // Remove active states from cards
    if (activeCard) {
      activeCard.classList.remove('active');
      activeCard = null;
    }
    
    // Set focus back to document body
    document.body.focus();
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

  // Toggle behind the scenes mode
  function toggleBehindScenesMode() {
    document.body.classList.toggle('behind-scenes-mode');
    
    const toggle = document.getElementById('view-mode-toggle');
    if (document.body.classList.contains('behind-scenes-mode')) {
      toggle.classList.add('active');
    } else {
      toggle.classList.remove('active');
    }
  }

  // Generate modal content based on project data
  function generateModalContent(project) {
    // Generate meta info HTML
    const metaHTML = project.metaInfo ? project.metaInfo.map(meta => `
      <div class="meta-item">
        <strong>${meta.label}:</strong> ${meta.value}
      </div>
    `).join('') : '';
    
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
      
      // Add arrow click handlers
      if (leftArrow) {
        leftArrow.addEventListener('click', () => {
          scroller.scrollBy({ left: -600, behavior: 'smooth' });
        });
      }
      
      if (rightArrow) {
        rightArrow.addEventListener('click', () => {
          scroller.scrollBy({ left: 600, behavior: 'smooth' });
        });
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
})();