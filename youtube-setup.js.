// youtube-setup.js

// This function is called by the YouTube IFrame API when it's ready.
function onYouTubeIframeAPIReady() {
  var player = new YT.Player('youtube-player', {
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
        event.target.unMute(); // Attempt to play with sound
        event.target.playVideo();
      }
    }
  });
}
