// channels/ch2/script.js
(() => {
  // Define project data
  const projectData = {
    'business-strategy': {
      title: 'Business Strategy',
      tagline: 'Transform your business with our revolutionary strategic approach',
      description: `Our comprehensive business strategy solutions help companies identify opportunities for growth, optimize their operations, and develop roadmaps for sustainable success. We combine market analysis with innovative thinking to create customized strategies that deliver measurable results.`,
      image: 'visuals/bulletproof.jpg',
      stats: [
        { value: '300%', label: 'Average ROI' },
        { value: '45+', label: 'Clients Served' },
        { value: '87%', label: 'Success Rate' }
      ],
      timeline: [
        { phase: 'Research', description: 'In-depth market and competitor analysis' },
        { phase: 'Strategy', description: 'Developing custom growth frameworks' },
        { phase: 'Implementation', description: 'Executing with precision and agility' },
        { phase: 'Measurement', description: 'Tracking KPIs and adjusting as needed' }
      ]
    },
    'luxury-brand': {
      title: 'Luxury Brand Development',
      tagline: 'Elevate your brand to luxury status with our premium services',
      description: `Our luxury brand development service helps premium businesses establish distinctive positioning in competitive markets. We craft sophisticated brand identities, design high-end customer experiences, and develop exclusive marketing strategies that resonate with affluent audiences.`,
      image: 'visuals/dou.jpg',
      stats: [
        { value: '65%', label: 'Premium Perception Increase' },
        { value: '12', label: 'Award-Winning Brands' },
        { value: '3X', label: 'Customer Lifetime Value' }
      ],
      timeline: [
        { phase: 'Identity', description: 'Developing distinctive luxury positioning' },
        { phase: 'Experience', description: 'Crafting premium customer touchpoints' },
        { phase: 'Exclusivity', description: 'Creating scarcity and desirability' },
        { phase: 'Expansion', description: 'Strategic growth in premium markets' }
      ]
    },
    'digital-innovation': {
      title: 'Digital Innovation Platform',
      tagline: 'Revolutionize your digital presence with cutting-edge technology',
      description: `Our digital innovation platform helps businesses harness the power of emerging technologies to create competitive advantages. From AI-driven content strategies to immersive user experiences, we build digital solutions that engage audiences and drive conversions across channels.`,
      image: 'visuals/mtr.jpg',
      stats: [
        { value: '250%', label: 'Engagement Increase' },
        { value: '32', label: 'Digital Transformations' },
        { value: '8.5/10', label: 'User Satisfaction' }
      ],
      timeline: [
        { phase: 'Discovery', description: 'Identifying digital opportunity spaces' },
        { phase: 'Design', description: 'Creating innovative digital architectures' },
        { phase: 'Development', description: 'Building with cutting-edge technologies' },
        { phase: 'Deployment', description: 'Seamless integration and optimization' }
      ]
    },
    'creative-vision': {
      title: 'Creative Vision System',
      tagline: 'Unlock your creative potential with our comprehensive approach',
      description: `Our creative vision system helps brands find their unique voice in a crowded market. Through immersive ideation workshops, visual storytelling frameworks, and execution blueprints, we develop creative strategies that captivate audiences and build meaningful connections.`,
      image: 'visuals/VOL 1. FIRST c.001.jpeg',
      stats: [
        { value: '94%', label: 'Client Satisfaction' },
        { value: '27', label: 'Industry Awards' },
        { value: '40+', label: 'Creative Campaigns' }
      ],
      timeline: [
        { phase: 'Inspiration', description: 'Immersive research and ideation' },
        { phase: 'Conceptualization', description: 'Developing core creative concepts' },
        { phase: 'Visualization', description: 'Bringing ideas to life through design' },
        { phase: 'Storytelling', description: 'Crafting narratives that resonate' }
      ]
    }
  };

  // Initialize the studio experience
  function initStudio() {
    // Set up project item click handlers
    const projectItems = document.querySelectorAll('.project-item');
    const projectDetailView = document.querySelector('.project-detail-view');
    const closeDetailBtn = document.querySelector('.close-detail');
    
    // Add click event to each project
    projectItems.forEach(item => {
      item.addEventListener('click', () => {
        const projectId = item.getAttribute('data-project');
        openProjectDetail(projectId);
      });
      
      // Also add keyboard accessibility
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const projectId = item.getAttribute('data-project');
          openProjectDetail(projectId);
        }
      });
    });
    
    // Close detail view when clicking the close button
    closeDetailBtn.addEventListener('click', closeProjectDetail);
    
    // Set up perspective toggle button
    const perspectiveToggle = document.getElementById('perspective-toggle');
    perspectiveToggle.addEventListener('click', togglePerspective);
    
    // Set up arrange button
    const arrangeBtn = document.getElementById('arrange-projects');
    arrangeBtn.addEventListener('click', rearrangeProjects);
    
    // Add keyboard handlers for accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectDetailView.getAttribute('aria-hidden') === 'false') {
        closeProjectDetail();
      }
    });
  }
  
  // Open project detail view
  function openProjectDetail(projectId) {
    const projectData = getProjectData(projectId);
    const projectDetailView = document.querySelector('.project-detail-view');
    const projectContent = document.querySelector('.project-content');
    const processTimeline = document.querySelector('.process-timeline');
    
    if (projectData) {
      // Populate content
      projectContent.innerHTML = generateProjectHTML(projectData);
      processTimeline.innerHTML = generateTimelineHTML(projectData.timeline);
      
      // Show the detail view
      projectDetailView.setAttribute('aria-hidden', 'false');
      
      // Set up timeline node interactions
      setupTimelineNodes();
    }
  }
  
  // Generate HTML for project detail
  function generateProjectHTML(project) {
    // Generate stats HTML
    const statsHTML = project.stats.map(stat => `
      <div class="stat-item">
        <div class="stat-value">${stat.value}</div>
        <div class="stat-label">${stat.label}</div>
      </div>
    `).join('');
    
    // Return complete project HTML
    return `
      <div class="project-header">
        <h1 class="project-title">${project.title}</h1>
        <div class="project-tagline">${project.tagline}</div>
      </div>
      
      <div class="project-overview">
        <div class="project-image">
          <img src="${project.image}" alt="${project.title}" loading="lazy">
        </div>
        
        <div class="project-description">
          <h2 class="section-title">Overview</h2>
          <p>${project.description}</p>
          
          <div class="project-stats">
            ${statsHTML}
          </div>
        </div>
      </div>
    `;
  }
  
  // Generate timeline HTML
  function generateTimelineHTML(timeline) {
    return timeline.map((node, index) => `
      <div class="timeline-node ${index === 0 ? 'active' : ''}" data-phase="${index}">
        <div class="node-indicator"></div>
        <div class="node-label">${node.phase}</div>
      </div>
    `).join('');
  }
  
  // Set up timeline node interactions
  function setupTimelineNodes() {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    const projectContent = document.querySelector('.project-content');
    
    timelineNodes.forEach(node => {
      node.addEventListener('click', () => {
        // Remove active class from all nodes
        timelineNodes.forEach(n => n.classList.remove('active'));
        
        // Add active class to clicked node
        node.classList.add('active');
        
        // Get phase data
        const phaseIndex = node.getAttribute('data-phase');
        const projectId = getCurrentProjectId();
        const project = getProjectData(projectId);
        
        if (project && project.timeline[phaseIndex]) {
          // Highlight this phase in the content
          const phaseInfo = project.timeline[phaseIndex];
          const phaseDetail = document.createElement('div');
          phaseDetail.className = 'phase-detail';
          phaseDetail.innerHTML = `
            <h3 class="section-title">${phaseInfo.phase} Phase</h3>
            <p>${phaseInfo.description}</p>
          `;
          
          // Find or create the phase container
          let phaseContainer = document.querySelector('.phase-container');
          if (!phaseContainer) {
            phaseContainer = document.createElement('div');
            phaseContainer.className = 'phase-container';
            projectContent.appendChild(phaseContainer);
          }
          
          // Update the phase container with new content
          phaseContainer.innerHTML = '';
          phaseContainer.appendChild(phaseDetail);
        }
      });
    });
  }
  
  // Close project detail view
  function closeProjectDetail() {
    const projectDetailView = document.querySelector('.project-detail-view');
    projectDetailView.setAttribute('aria-hidden', 'true');
  }
  
  // Toggle 3D perspective view
  function togglePerspective() {
    const container = document.getElementById('studio-container');
    const button = document.getElementById('perspective-toggle');
    
    container.classList.toggle('perspective-on');
    
    if (container.classList.contains('perspective-on')) {
      button.textContent = '2D View';
    } else {
      button.textContent = '3D View';
    }
  }
  
  // Rearrange projects with animation
  function rearrangeProjects() {
    const deskGrid = document.querySelector('.desk-grid');
    deskGrid.classList.add('rearranging');
    
    // Get all project items
    const items = Array.from(document.querySelectorAll('.project-item'));
    
    // Shuffle the DOM order
    items.sort(() => Math.random() - 0.5).forEach(item => {
      deskGrid.appendChild(item);
    });
    
    // Remove animation class after animation completes
    setTimeout(() => {
      deskGrid.classList.remove('rearranging');
    }, 600);
  }
  
  // Helper to get project data by ID
  function getProjectData(projectId) {
    return projectData[projectId] || null;
  }
  
  // Helper to get current project ID from detail view
  function getCurrentProjectId() {
    const projectContent = document.querySelector('.project-content');
    const projectTitle = projectContent.querySelector('.project-title');
    
    if (projectTitle) {
      const title = projectTitle.textContent;
      
      // Find project ID by matching title
      for (const [id, data] of Object.entries(projectData)) {
        if (data.title === title) {
          return id;
        }
      }
    }
    
    return null;
  }
  
  // Initialize the studio
  initStudio();
})();