// channels/ch3/ch3.js
export async function init() {
  const container = document.getElementById('section3');
  if (!container) {
    console.error("Channel 3 container not found");
    return;
  }
  // Prevent duplicate initialization
  if (container.querySelector('#skillshowdown-container')) {
    console.log("Channel 3 already loaded; skipping initialization.");
    return;
  }
  
  try {
    const response = await fetch('./channels/ch3/index.html');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const html = await response.text();
    container.innerHTML = html;
  } catch (error) {
    console.error("Failed to load Channel 3 markup:", error);
    container.innerHTML = `<div class="error">Error loading SkillShowdown content.</div>`;
    return;
  }
  
  // Dynamically load CSS if not already loaded
  if (!document.querySelector('link[href="./channels/ch3/styles.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './channels/ch3/styles.css';
    document.head.appendChild(link);
  }

  // Removed dynamic JS loading to prevent recursive loading of ch3.js
}
