// channels/ch4/ch4.js
export async function init() {
  const container = document.getElementById('section4');
  if (!container) {
    console.error("Channel 4 container not found");
    return;
  }
  // Prevent duplicate initialization
  if (container.querySelector('#youtube-player-4')) {
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
  
  // Use the YouTube IFrame API to create a player in Channel 4.
  // We wait a short delay to ensure the HTML is in place.
  setTimeout(() => {
    if (typeof YT !== 'undefined' && YT.Player) {
      new YT.Player('youtube-player-4', {
        videoId: 'OFlnSoPm7x4', // New video ID from your link
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: 'OFlnSoPm7x4', // Required for looping the same video
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          fs: 0,
          showinfo: 0
          // Removed mute: 1 to allow unmuted playback
        },
        events: {
          onReady: event => {
            // Unmute the player now that it is ready.
            event.target.unMute();
            event.target.playVideo();
            console.log("Channel 4 YouTube Player ready and playing unmuted.");
          }
        }
      });
    } else {
      console.error("YouTube API not available for Channel 4.");
    }
  }, 500);
}

