// channels/ch1/home.js

export function init() {
  // Fetch the modal HTML fragment for Channel 1
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
  // ------------------------------
  // GSAP Animations (Genie Effect)
  // ------------------------------
  function animateModalIn(modal) {
    gsap.fromTo(
      modal,
      { opacity: 0, scale: 0.8, y: -100, rotationX: 15 },
      { opacity: 1, scale: 1, y: 0, rotationX: 0, duration: 0.6, ease: "power2.out", transformOrigin: "top center" }
    );
  }

  function animateModalOut(modal) {
    gsap.to(modal, {
      opacity: 0,
      scale: 0.8,
      y: -100,
      rotationX: 15,
      duration: 0.5,
      ease: "power2.in",
      transformOrigin: "top center",
      onComplete: () => {
        modal.style.display = 'none';
      }
    });
  }

  // ------------------------------
  // Resume Modal
  // ------------------------------
  const resumeButton = document.getElementById('resumeButton');
  const resumeModal = document.getElementById('resumeModal');
  const closeResume = document.getElementById('closeResume');

  if (resumeButton && resumeModal && closeResume) {
    resumeButton.addEventListener('click', () => {
      resumeModal.style.display = 'flex';
      animateModalIn(resumeModal);
    });
    closeResume.addEventListener('click', () => {
      animateModalOut(resumeModal);
    });
  }

  // ------------------------------
  // About Modal
  // ------------------------------
  const aboutButton = document.getElementById('aboutButton');
  const aboutModal = document.getElementById('aboutModal');
  const closeAbout = document.getElementById('closeAbout');

  if (aboutButton && aboutModal && closeAbout) {
    aboutButton.addEventListener('click', () => {
      aboutModal.style.display = 'flex';
      animateModalIn(aboutModal);
    });
    closeAbout.addEventListener('click', () => {
      animateModalOut(aboutModal);
    });
  }

  // ------------------------------
  // Contact Modal
  // ------------------------------
  const contactButton = document.getElementById('contactButton');
  const contactModal = document.getElementById('contactModal');
  const closeContact = document.getElementById('closeContact');

  if (contactButton && contactModal && closeContact) {
    contactButton.addEventListener('click', () => {
      contactModal.style.display = 'flex';
      animateModalIn(contactModal);
    });
    closeContact.addEventListener('click', () => {
      animateModalOut(contactModal);
    });
  }

  // ------------------------------
  // Close open modals on Escape key press
  // ------------------------------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [resumeModal, aboutModal, contactModal].forEach(modal => {
        if (modal && modal.style.display === 'flex') {
          animateModalOut(modal);
        }
      });
    }
  });
}
