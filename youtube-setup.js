// youtube-setup.js

var youtubePlayer;

// Called by the YouTube IFrame API when it's ready.
function onYouTubeIframeAPIReady() {
  youtubePlayer = new YT.Player('youtube-player', {
    videoId: 'KISNE4qOIBM', // Your YouTube video ID
    playerVars: {
      autoplay: 1,
      controls: 0,
      loop: 1,
      playlist: 'KISNE4qOIBM', // Needed for looping
      modestbranding: 1,
      rel: 0,
      playsinline: 1,
      fs: 0,
      showinfo: 0
    },
    events: {
      onReady: function(event) {
        event.target.mute(); // Mute initially to satisfy autoplay policies
        event.target.playVideo();
        // Ensure the iframe fills its container
        setTimeout(function() {
          var iframe = document.querySelector('#youtube-player iframe');
          if (iframe) {
            iframe.style.width = "100%";
            iframe.style.height = "100%";
          }
        }, 500);
      }
    }
  });
}

// Unmute the video on user interaction (e.g., clicking the power button)
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
