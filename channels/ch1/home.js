// channels/ch1/home.js
export function init() {
  // Load modal HTML if it hasn't already been added to the document.
  fetch('./channels/ch1/modals.html')
    .then(response => response.text())
    .then(html => {
      const container = document.createElement('div');
      container.innerHTML = html;
      document.body.appendChild(container);
      setupModalEventListeners(); // See below for event listener setup.
    })
    .catch(err => console.error('Failed to load modals:', err));
}

function setupModalEventListeners() {
  // Example: Attach event listeners to the resume modal elements
  const resumeButton = document.getElementById('resumeButton');
  const resumeModal = document.getElementById('resumeModal');
  const closeResume = document.getElementById('closeResume');

  if (resumeButton && resumeModal && closeResume) {
    resumeButton.addEventListener('click', () => {
      resumeModal.style.display = 'flex';
      // animateModalIn(...) here if desired
    });
    closeResume.addEventListener('click', () => {
      resumeModal.style.display = 'none';
      // animateModalOut(...) if you want animations
    });
  }

  // Similarly, set up the About and Contact modals:
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
}
