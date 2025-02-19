// channels/ch2/ch2.js

export async function init() {
  console.log("Channel 2 Infomercial module loaded.");

  // Get the Channel 2 container from the main page (Section with id="section2")
  const container = document.getElementById('section2');

  // Prevent re-initialization if the infomercial is already loaded
  if (container.querySelector('#infomercial-container')) {
    console.log("Infomercial already loaded; skipping re-init.");
    return;
  }

  // Load the external markup from index.html
  try {
    const response = await fetch('./channels/ch2/index.html');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const html = await response.text();
    container.innerHTML = html;
  } catch (error) {
    console.error("Failed to load channels/ch2/index.html", error);
  }

  // Dynamically load Channel 2-specific CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = './channels/ch2/styles.css';
  document.head.appendChild(link);

  // Dynamically load Channel 2-specific JavaScript
  const script = document.createElement('script');
  script.src = './channels/ch2/script.js';
  script.defer = true;
  document.body.appendChild(script);
}
