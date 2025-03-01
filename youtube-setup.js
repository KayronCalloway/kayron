// youtube-setup.js

// Called by the YouTube IFrame API when it's ready.
function onYouTubeIframeAPIReady() {
  window.youtubePlayer = new YT.Player('youtube-player', {
    videoId: 'KISNE4qOIBM', // Your YouTube video ID
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
        event.target.mute();
        event.target.playVideo();
        // Adjust the iframe size after a short delay.
        setTimeout(() => {
          const iframe = document.querySelector('#youtube-player iframe');
          if (iframe) {
            iframe.style.width = '100%';
            iframe.style.height = '100%';
          }
        }, 500);
      }
    }
  });
}

// Unmute the video on user interaction (e.g., clicking the power button)
document.addEventListener('DOMContentLoaded', () => {
  const powerButton = document.getElementById('powerButton');
  if (powerButton) {
    powerButton.addEventListener('click', () => {
      if (window.youtubePlayer && typeof window.youtubePlayer.unMute === 'function') {
        window.youtubePlayer.unMute();
      }
    });
  }
});