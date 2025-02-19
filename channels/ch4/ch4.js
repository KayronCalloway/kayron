// channels/ch4/ch4.js
export async function init() {
  const container = document.getElementById('section4');
  if (!container) {
    console.error("Channel 4 container not found");
    return;
  }
  // Prevent duplicate initialization
  if (container.querySelector('.video-embed')) {
    console.log("Channel 4 already loaded; skipping initialization.");
    return;
  }
  
  try {
    const response = await fetch('./channels/ch4/index.html');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const html = await response.text();
    container.innerHTML = html;
  } catch (error) {
    console.error("Failed to load Channel 4 markup:", error);
    container.innerHTML = `<div class="error">Error loading video content.</div>`;
    return;
  }
  
  // Dynamically load CSS if not already loaded
  if (!document.querySelector('link[href="./channels/ch4/styles.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './channels/ch4/styles.css';
    document.head.appendChild(link);
  }
  
  // Force refresh of the iframe to trigger autoplay
  setTimeout(() => {
    const iframe = container.querySelector('iframe');
    if (iframe) {
      const src = iframe.src;
      iframe.src = src;
      console.log("Channel 4 iframe refreshed to trigger autoplay.");
    }
  }, 500);
}
