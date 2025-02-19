// channels/ch2/ch2.js
export async function init() {
  const container = document.getElementById('section2');
  if (!container) {
    console.error("Channel 2 container not found");
    return;
  }
  
  // Prevent duplicate initialization
  if (container.querySelector('#slideshow-container')) {
    console.log("Slideshow already loaded; skipping initialization.");
    return;
  }
  
  try {
    const response = await fetch('./channels/ch2/index.html');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const html = await response.text();
    container.innerHTML = html;
  } catch (error) {
    console.error("Failed to load Channel 2 markup:", error);
    container.innerHTML = `<div class="error">Error loading slideshow content.</div>`;
    return;
  }
  
  // Dynamically load CSS if not already loaded
  if (!document.querySelector('link[href="./channels/ch2/styles.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './channels/ch2/styles.css';
    document.head.appendChild(link);
  }
  
  // Dynamically load the JS for slideshow functionality
  if (!document.querySelector('script[src="./channels/ch2/script.js"]')) {
    const script = document.createElement('script');
    script.src = './channels/ch2/script.js';
    script.defer = true;
    document.body.appendChild(script);
  }
}
