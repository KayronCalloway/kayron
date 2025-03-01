// youtube-setup.js

let youtubePlayer;

// Called by the YouTube IFrame API when it's ready.
function onYouTubeIframeAPIReady() {
  console.log("YouTube API ready, initializing player...");
  // Check if element exists first
  if (document.getElementById('youtube-player')) {
    youtubePlayer = new YT.Player('youtube-player', {
      videoId: 'KISNE4qOIBM', // Your YouTube video ID
      width: '100%',  // Set width
      height: '100%', // Set height
      playerVars: {
        autoplay: 1,
        controls: 0,
        loop: 1,
        playlist: 'KISNE4qOIBM', // Required for looping the same video
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        fs: 0,
        showinfo: 0
      },
      events: {
        onReady: event => {
          // Mute the video initially to allow autoplay.
          console.log("YouTube player ready");
          event.target.mute();
          event.target.playVideo();
          // Adjust the iframe size after a short delay.
          setTimeout(() => {
            const iframe = document.querySelector('#youtube-player iframe');
            if (iframe) {
              iframe.style.width = '100%';
              iframe.style.height = '100%';
              iframe.style.position = 'absolute';
              iframe.style.top = '0';
              iframe.style.left = '0';
              console.log("YouTube iframe styles applied");
            } else {
              console.error("YouTube iframe element not found");
            }
          }, 500);
        },
        onError: error => {
          console.error("YouTube player error:", error);
        }
      }
    });
  } else {
    console.error("YouTube player element not found");
  }
}

// Unmute the video on user interaction (e.g., clicking the power button)
document.addEventListener('DOMContentLoaded', () => {
  const powerButton = document.getElementById('powerButton');
  if (powerButton) {
    powerButton.addEventListener('click', () => {
      if (youtubePlayer && typeof youtubePlayer.unMute === 'function') {
        youtubePlayer.unMute();
      }
    });
  }
});
