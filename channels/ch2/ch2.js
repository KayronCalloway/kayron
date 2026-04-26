// channels/ch2/ch2.js

export async function init() {
  try {
    const container = document.getElementById('section2');
    if (!container) return;

    if (container.querySelector('#portfolio-browse')) return;

    document.body.style.overflow = "hidden";
    container.style.height = "100vh";
    container.style.overflow = "hidden";

    await loadStyles();

    const portfolioResponse = await fetch('./channels/ch2/index.html');
    if (!portfolioResponse.ok) throw new Error(`HTTP error! Status: ${portfolioResponse.status}`);

    const portfolioHtml = await portfolioResponse.text();
    container.innerHTML = portfolioHtml;

    setTimeout(() => {
      import('../../menu-manager.js').then(({ notifyChannelChanged }) => {
        notifyChannelChanged();
      }).catch(() => {});
    }, 300);

    if (!container.querySelector('.channel-number-overlay')) {
      const channelOverlay = document.createElement('div');
      channelOverlay.className = 'channel-number-overlay';
      channelOverlay.textContent = 'CH 02';
      container.appendChild(channelOverlay);
    }

    await loadScript('./channels/ch2/script.js');

    setTimeout(() => {
      const portfolioBrowse = document.getElementById('portfolio-browse');
      if (portfolioBrowse) {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
          card.style.pointerEvents = 'auto';
          card.style.cursor = 'pointer';
          card.style.position = 'relative';
          card.style.zIndex = '1';
        });
      }
    }, 500);

    const tvGuide = document.getElementById('tvGuide');
    if (tvGuide) {
      tvGuide.style.position = 'fixed';
      tvGuide.style.top = '0';
      tvGuide.style.left = '0';
      tvGuide.style.width = '100%';
      tvGuide.style.height = '100%';
      tvGuide.style.zIndex = '10000000';
    }
  } catch (error) {
    const container = document.getElementById('section2');
    if (container) {
      container.innerHTML = `<div class="error">Error loading portfolio studio content.</div>
                         <div class="channel-number-overlay">CH 02</div>`;
    }
  }
}

function loadStyles() {
  return new Promise((resolve) => {
    if (!document.querySelector('link[href="./channels/ch2/styles.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = './channels/ch2/styles.css';
      link.onload = () => resolve();
      document.head.appendChild(link);
    } else {
      resolve();
    }
  });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}
