// channels/ch1/home.js
import { loadHTML, animations, setupEventListeners, dom, errorTracker } from '../../utils.js';

/**
 * Channel 1 initialization
 * @returns {Function} Cleanup function for when channel is unloaded
 */
export async function init() {
  try {
    // Load the modal HTML fragment
    await loadHTML('./channels/ch1/modals.html');
    
    // Setup modal event listeners and get cleanup function
    const cleanup = setupHomeEventListeners();
    
    // Return cleanup function
    return cleanup;
  } catch (error) {
    errorTracker.track('Channel1.init', error);
    console.error('Failed to initialize Channel 1:', error);
  }
}

/**
 * Channel 1 cleanup
 * This function will be called when the channel is unloaded
 */
export function cleanup() {
  // Additional cleanup logic if needed
  console.log('Channel 1 cleanup complete');
}

/**
 * Setup event listeners for Channel 1 modals
 * @returns {Function} Cleanup function to remove event listeners
 */
function setupHomeEventListeners() {
  // Set up modal events with automatic cleanup
  const modalCleanup = setupModalEventListeners();
  
  // Set up escape key event
  const escapePressCleanup = setupEscapeKeyListener();
  
  // Return a combined cleanup function
  return () => {
    modalCleanup();
    escapePressCleanup();
  };
}

/**
 * Setup modal trigger and close event listeners
 * @returns {Function} Cleanup function
 */
function setupModalEventListeners() {
  // Define modal configurations
  const modals = [
    { buttonId: 'resumeButton', modalId: 'resumeModal', closeId: 'closeResume' },
    { buttonId: 'aboutButton', modalId: 'aboutModal', closeId: 'closeAbout' },
    { buttonId: 'contactButton', modalId: 'contactModal', closeId: 'closeContact' }
  ];
  
  // Set up event listeners for each modal
  const listeners = modals.flatMap(({ buttonId, modalId, closeId }) => {
    const button = dom.get(`#${buttonId}`);
    const modal = dom.get(`#${modalId}`);
    const closeButton = dom.get(`#${closeId}`);
    
    if (!button || !modal || !closeButton) {
      console.warn(`Could not find all elements for modal ${modalId}`);
      return [];
    }
    
    // Create event listeners
    const openHandler = () => {
      modal.style.display = 'flex';
      animations.modalIn(modal);
    };
    
    const closeHandler = () => {
      animations.modalOut(modal);
    };
    
    // Attach event listeners
    button.addEventListener('click', openHandler);
    closeButton.addEventListener('click', closeHandler);
    
    // Return listeners array for cleanup
    return [
      [button, 'click', openHandler],
      [closeButton, 'click', closeHandler]
    ];
  });
  
  // Return cleanup function
  return function cleanup() {
    listeners.forEach(([element, event, handler]) => {
      element.removeEventListener(event, handler);
    });
  };
}

/**
 * Setup escape key listener to close any open modal
 * @returns {Function} Cleanup function
 */
function setupEscapeKeyListener() {
  const modalIds = ['resumeModal', 'aboutModal', 'contactModal'];
  
  const keydownHandler = (e) => {
    if (e.key === 'Escape') {
      modalIds.forEach(id => {
        const modal = dom.get(`#${id}`);
        if (modal && modal.style.display === 'flex') {
          animations.modalOut(modal);
        }
      });
    }
  };
  
  document.addEventListener('keydown', keydownHandler);
  
  return function cleanup() {
    document.removeEventListener('keydown', keydownHandler);
  };
}