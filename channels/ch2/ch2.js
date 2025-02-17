// channels/ch2/ch2.js

export async function init() {
  console.log("Channel 2 (Workbook) module loaded.");

  // Get the Channel 2 container (the <section> with id="section2")
  const container = document.getElementById('section2');

  // Prevent re-initializing if the lookbook is already loaded.
  if (container.querySelector('#lookbook-container')) {
    console.log("Channel 2 is already loaded; skipping re-initialization.");
    return;
  }

  // Load the external markup from ch2/index.html
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

  // Dynamically load Channel 2-specific JavaScript for lookbook interactions
  const script = document.createElement('script');
  script.src = './channels/ch2/script.js';
  script.defer = true;
  document.body.appendChild(script);
}
