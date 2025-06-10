// Channel 4: Game Show JavaScript (moved from ch3)

export async function init() {
  console.log('Channel 4 Game Show init started');
  
  try {
    // Load the game show HTML
    console.log('Loading Channel 4 game show...');
    const response = await fetch('./channels/ch4/index.html');
    if (!response.ok) {
      throw new Error(`Failed to fetch game show: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();
    
    // Insert into the section
    const section4 = document.getElementById('section4');
    if (section4) {
      // Preserve any existing channel overlay from main page
      const existingOverlay = section4.querySelector('.channel-number-overlay');
      const overlayHTML = existingOverlay ? existingOverlay.outerHTML : '';
      
      section4.innerHTML = html;
      
      // If there was an existing overlay and the new content doesn't have one, restore it
      if (overlayHTML && !section4.querySelector('.channel-number-overlay')) {
        section4.insertAdjacentHTML('beforeend', overlayHTML);
      }
      
      // Load game show styles
      const gameStylesheet = document.createElement('link');
      gameStylesheet.rel = 'stylesheet';
      gameStylesheet.href = './channels/ch4/styles.css';
      document.head.appendChild(gameStylesheet);
      
      console.log('Channel 4 game show loaded successfully');
      
      // Load and execute the game show script
      await import('./channels/ch4/script.js');
      
      // Wait a moment for the script to load, then initialize manually
      setTimeout(() => {
        console.log('Checking for GameShow object:', window.GameShow);
        if (window.GameShow && window.GameShow.init) {
          console.log('Calling GameShow.init()...');
          window.GameShow.init();
        } else {
          console.error('GameShow object not found or no init function');
        }
      }, 500); // Increased timeout
      
    } else {
      console.error('Section 4 not found');
    }
  } catch (err) {
    console.error('Failed to load game show:', err);
  }
}