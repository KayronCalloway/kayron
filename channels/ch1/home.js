// channels/ch1/home.js

export function init() {
  // Load the modal HTML fragment for Channel 1
  fetch('./channels/ch1/modals.html')
    .then(response => response.text())
    .then(html => {
      const container = document.createElement('div');
      container.innerHTML = html;
      document.body.appendChild(container);
      setupModalEventListeners();
    })
    .catch(err => console.error('Failed to load modals:', err));
}

function setupModalEventListeners() {
  // Resume Modal
  const resumeButton = document.getElementById('resumeButton');
  const resumeModal = document.getElementById('resumeModal');
  const closeResume = document.getElementById('closeResume');
  if (resumeButton && resumeModal && closeResume) {
    resumeButton.addEventListener('click', () => {
      resumeModal.style.display = 'flex';
      // Optionally add GSAP animation here
    });
    closeResume.addEventListener('click', () => {
      resumeModal.style.display = 'none';
    });
  }
  
  // About Modal
  const aboutButton = document.getElementById('aboutButton');
  const aboutModal = document.getElementById('aboutModal');
  const closeAbout = document.getElementById('closeAbout');
  if (aboutButton && aboutModal && closeAbout) {
    aboutButton.addEventListener('click', () => {
      aboutModal.style.display = 'flex';
    });
    closeAbout.addEventListener('click', () => {
      aboutModal.style.display = 'none';
    });
  }
  
  // Contact Modal
  const contactButton = document.getElementById('contactButton');
  const contactModal = document.getElementById('contactModal');
  const closeContact = document.getElementById('closeContact');
  if (contactButton && contactModal && closeContact) {
    contactButton.addEventListener('click', () => {
      contactModal.style.display = 'flex';
    });
    closeContact.addEventListener('click', () => {
      contactModal.style.display = 'none';
    });
  }
  
  // Handle Escape key to close any open modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (resumeModal && resumeModal.style.display === 'flex') {
        resumeModal.style.display = 'none';
      }
      if (aboutModal && aboutModal.style.display === 'flex') {
        aboutModal.style.display = 'none';
      }
      if (contactModal && contactModal.style.display === 'flex') {
        contactModal.style.display = 'none';
      }
    }
  });
}
