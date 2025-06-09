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
      section4.innerHTML = html;
      
      // Load game show styles
      const gameStylesheet = document.createElement('link');
      gameStylesheet.rel = 'stylesheet';
      gameStylesheet.href = './channels/ch4/styles.css';
      document.head.appendChild(gameStylesheet);
      
      console.log('Channel 4 game show loaded successfully');
      
      // Load and execute the game show script
      const scriptModule = await import('./channels/ch4/script.js');
      if (scriptModule.init) {
        scriptModule.init();
      }
      
    } else {
      console.error('Section 4 not found');
    }
  } catch (err) {
    console.error('Failed to load game show:', err);
  }
}