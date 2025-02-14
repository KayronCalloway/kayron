// youtube-setup.js

// Global variable to store the player
var youtubePlayer;

// This function is called by the YouTube IFrame API when it's ready.
function onYouTubeIframeAPIReady() {
  youtubePlayer = new YT.Player('youtube-player', {
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
      onReady: function(event) {
        // Do not unmute immediately so that autoplay is allowed.
        // The video will play muted initially.
        event.target.playVideo();
      }
    }
  });
}

// When the DOM is fully loaded, add a listener to unmute the video upon user interaction.
document.addEventListener("DOMContentLoaded", function() {
  var powerButton = document.getElementById("powerButton");
  if (powerButton) {
    powerButton.addEventListener("click", function() {
      if (youtubePlayer && typeof youtubePlayer.unMute === "function") {
        youtubePlayer.unMute();
      }
    });
  }
});
