// Channel 5: Under the Influence JavaScript (moved from ch4)

export async function init() {
  console.log('Channel 5 Under the Influence init started');
  
  try {
    // Load the influence content
    console.log('Loading Channel 5 influence content...');
    const response = await fetch('./channels/ch5/index.html');
    if (!response.ok) {
      throw new Error(`Failed to fetch influence content: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();
    
    // Insert into the section
    const section5 = document.getElementById('section5');
    if (section5) {
      section5.innerHTML = html;
      
      // Load influence styles
      const influenceStylesheet = document.createElement('link');
      influenceStylesheet.rel = 'stylesheet';
      influenceStylesheet.href = './channels/ch5/styles.css';
      document.head.appendChild(influenceStylesheet);
      
      console.log('Channel 5 influence content loaded successfully');
      
    } else {
      console.error('Section 5 not found');
    }
  } catch (err) {
    console.error('Failed to load influence content:', err);
  }
}