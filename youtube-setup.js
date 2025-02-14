// youtube-setup.js

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
        // Mute the video first to satisfy autoplay policies.
        event.target.mute();
        event.target.playVideo();
        // After a short delay, try to set the iframe's size.
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

// When the DOM is loaded, add a listener to unmute the video on user interaction.
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
