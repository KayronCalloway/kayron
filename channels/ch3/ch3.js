// channels/ch3/ch3.js
export async function init() {
  const container = document.getElementById('section3');
  if (!container) {
    console.error("Channel 3 container not found");
    return;
  }
  
  // Clean up any existing game elements to prevent duplicates
  const existingContainer = container.querySelector('#gameshow-container');
  if (existingContainer) {
    console.log("Removing existing game container and reinitializing");
    container.innerHTML = '';
  }
  
  try {
    // Load HTML
    const response = await fetch('./channels/ch3/index.html');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const html = await response.text();
    container.innerHTML = html;
    
    // Ensure Font Awesome is loaded
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const fontAwesome = document.createElement('link');
      fontAwesome.rel = 'stylesheet';
      fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      fontAwesome.integrity = 'sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==';
      fontAwesome.crossOrigin = 'anonymous';
      fontAwesome.referrerPolicy = 'no-referrer';
      document.head.appendChild(fontAwesome);
    }
    
    // Dynamically load CSS - remove existing CSS first
    const existingCSS = document.querySelector('link[href="./channels/ch3/styles.css"]');
    if (existingCSS) {
      existingCSS.remove();
    }
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './channels/ch3/styles.css';
    document.head.appendChild(link);
    
    // Dynamically load the script.js file - remove existing script first
    const existingScript = document.querySelector('script[src="./channels/ch3/script.js"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.src = './channels/ch3/script.js';
    script.onload = function() {
      console.log("script.js loaded, calling initGame");
      if (typeof window.initGame === "function") {
        setTimeout(() => {
          window.initGame();
        }, 100); // Small delay to ensure DOM is ready
      }
    };
    document.body.appendChild(script);
    
  } catch (error) {
    console.error("Failed to load Channel 3 markup:", error);
    container.innerHTML = `<div class="error">Error loading SkillShowdown content.</div>`;
    return;
  }
}
