// channels/ch1/home.js

export async function init() {
  console.log('Channel 1 init started');
  
  // Fix for Channel 1 content
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
      console.log('Video background styles applied');
    }
    
    // Ensure buttons are visible and positioned correctly
    const channelButtons = section1.querySelector('.channel-buttons');
    if (channelButtons) {
      channelButtons.style.position = 'absolute';
      channelButtons.style.top = '50%';
      channelButtons.style.left = '50%';
      channelButtons.style.transform = 'translate(-50%, -50%)';
      channelButtons.style.zIndex = '10';
      channelButtons.style.display = 'flex';
      channelButtons.style.flexDirection = 'column';
      channelButtons.style.gap = '20px';
      console.log('Channel buttons styles applied');
    }
  }
  
  try {
    console.log('Loading Channel 1 modals...');
    const response = await fetch('./channels/ch1/modals.html');
    if (\!response.ok) {
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
      }
    });
  };

  // Helper function to set up modal trigger and close events.
  const setupModal = (buttonId, modalId, closeButtonId) => {
    const triggerButton = document.getElementById(buttonId);
    const modal = document.getElementById(modalId);
    const closeButton = document.getElementById(closeButtonId);
    
    console.log(`Setting up ${modalId}: Button=${\!\!triggerButton}, Modal=${\!\!modal}, CloseButton=${\!\!closeButton}`);
    
    if (triggerButton && modal && closeButton) {
      triggerButton.addEventListener('click', () => {
        console.log(`Opening modal ${modalId}`);
        modal.style.display = 'flex';
        modal.classList.remove('hidden');
        animateModalIn(modal);
      });
      closeButton.addEventListener('click', () => {
        console.log(`Closing modal ${modalId}`);
        animateModalOut(modal);
      });
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
        if (modal && modal.style.display === 'flex') {
          animateModalOut(modal);
        }
      });
    }
  });
}
