// channels/ch1/home.js

export async function init() {
  try {
    // Check if modals are already loaded
    if (document.getElementById('resumeModal')) {
      console.log('Channel 1 modals already loaded, just setting up event listeners.');
      setupModalEventListeners();
      return;
    }
    
    // Load the modal HTML fragment for Channel 1 using async/await.
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
  } catch (err) {
    console.error('Failed to load modals:', err);
  }
}

function setupModalEventListeners() {
  // ------------------------------
  // GSAP Animation: "Coming Out of the Box"
  // ------------------------------
  const animateModalIn = modal => {
    gsap.fromTo(
      modal,
      { 
        opacity: 0, 
        scale: 0.8, 
        y: 20, 
        rotationX: 5,
        transformOrigin: "top center" // makes it look like it’s emerging from the top edge
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
      }
    });
  };

  // Helper function to set up modal trigger and close events.
  const setupModal = (buttonId, modalId, closeButtonId) => {
    const triggerButton = document.getElementById(buttonId);
    const modal = document.getElementById(modalId);
    const closeButton = document.getElementById(closeButtonId);
    
    if (!triggerButton) {
      console.warn(`Button with id ${buttonId} not found`);
    }
    if (!modal) {
      console.warn(`Modal with id ${modalId} not found`);
    }
    if (!closeButton) {
      console.warn(`Close button with id ${closeButtonId} not found`);
    }
    
    if (triggerButton && modal && closeButton) {
      console.log(`Setting up event listeners for ${modalId}`);
      // Remove any existing event listeners
      const newTriggerButton = triggerButton.cloneNode(true);
      triggerButton.parentNode.replaceChild(newTriggerButton, triggerButton);
      
      const newCloseButton = closeButton.cloneNode(true);
      closeButton.parentNode.replaceChild(newCloseButton, closeButton);
      
      newTriggerButton.addEventListener('click', () => {
        console.log(`Opening modal ${modalId}`);
        modal.style.display = 'flex';
        animateModalIn(modal);
      });
      newCloseButton.addEventListener('click', () => {
        console.log(`Closing modal ${modalId}`);
        animateModalOut(modal);
      });
    } else {
      console.error(`Could not setup modal ${modalId} - some elements are missing`);
    }
  };

  // ------------------------------
  // Setup individual modals using the helper.
  // ------------------------------
  setupModal('resumeButton', 'resumeModal', 'closeResume');
  setupModal('aboutButton', 'aboutModal', 'closeAbout');
  setupModal('contactButton', 'contactModal', 'closeContact');

  // ------------------------------
  // Close any open modal on Escape key press.
  // ------------------------------
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      ['resumeModal', 'aboutModal', 'contactModal'].forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && modal.style.display === 'flex') {
          animateModalOut(modal);
        }
      });
    }
  });
}
