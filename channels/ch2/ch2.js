// channels/ch2/ch2.js

export async function init() {
  console.log("Channel 2 Infomercial module loaded.");

  const container = document.getElementById('section2');
  if (!container) {
    console.error("Channel 2 container not found");
    return;
  }

  // Prevent duplicate initialization
  if (container.querySelector('#infomercial-container')) {
    console.log("Infomercial already loaded; skipping re-init.");
    return;
  }

  // Use an AbortController for fetch (and support cleanup if needed)
  const controller = new AbortController();
  const { signal } = controller;
  try {
    const response = await fetch('./channels/ch2/index.html', { signal });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const html = await response.text();
    container.innerHTML = html;
  } catch (error) {
    console.error("Failed to load channels/ch2/index.html", error);
    container.innerHTML = `<div class="error">Failed to load infomercial content. Please try again later.</div>`;
    return;
  }

  // Dynamically load CSS (avoid duplicates)
  if (!document.querySelector('link[href="./channels/ch2/styles.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './channels/ch2/styles.css';
    document.head.appendChild(link);
  }

  // Dynamically load the infomercial script
  if (!document.querySelector('script[src="./channels/ch2/script.js"]')) {
    const script = document.createElement('script');
    script.src = './channels/ch2/script.js';
    script.defer = true;
    document.body.appendChild(script);
  }
}
