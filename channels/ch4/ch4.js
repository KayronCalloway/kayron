// channels/ch4/ch4.js

export async function init() {
  try {
    // Load the HTML fragment for Channel 4 using async/await
    const response = await fetch('./channels/ch4/index.html');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    const html = await response.text();
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    
    // Setup YouTube player
    setupYouTubePlayer();
  } catch (err) {
    console.error('Failed to load Channel 4:', err);
  }
}

function setupYouTubePlayer() {
  // Use the YouTube IFrame API to create a player.
  // We wait a short delay to ensure the HTML is in place.
  setTimeout(() => {
    if (typeof YT !== 'undefined' && YT.Player) {
      // Create the player and assign it to a global variable so it can be controlled from main.js.
      window.channel4Player = new YT.Player('youtube-player-4', {
        videoId: 'OFlnSoPm7x4', 
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
          // We start muted by default; the observer in main.js will unmute if the channel is active.
        },
        events: {
          onReady: event => {
            event.target.mute();
            event.target.playVideo();
            console.log("Channel 4 YouTube Player ready, starting muted.");
          }
        }
      });
    } else {
      console.error("YouTube API not available for Channel 4.");
    }
  }, 500);
}