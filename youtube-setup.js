// youtube-setup.js

let youtubePlayer;
let apiReady = false;

// Preload YouTube API faster
(function() {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  tag.async = true;
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})();

// Called by the YouTube IFrame API when it's ready.
function onYouTubeIframeAPIReady() {
  apiReady = true;
  
  // First check if the player container exists
  const playerContainer = document.getElementById('youtube-player');
  if (!playerContainer) {
    // Try to create it if missing
    const section1 = document.getElementById('section1');
    if (section1) {
      const videoBackground = section1.querySelector('.video-background');
      if (videoBackground) {
        const playerDiv = document.createElement('div');
        playerDiv.id = 'youtube-player';
        videoBackground.appendChild(playerDiv);
      }
    }
  }
  
  // Try again to find the container
  if (!document.getElementById('youtube-player')) {
    return;
  }
  
  
  // Check for mobile devices or low bandwidth signal set by the Channel 1 module
  const isMobile = window.innerWidth <= 600;
  const optimizedMode = window.useLowQualityVideo || document.querySelector('.video-background[data-optimized="true"]');
  
  // Determine optimal quality based on device and connection
  let suggestedQuality = 'hd720'; // Default quality
  if (isMobile || optimizedMode) {
    suggestedQuality = 'small'; // Lower quality for mobile/low bandwidth
  }
  
  youtubePlayer = new YT.Player('youtube-player', {
    videoId: 'KISNE4qOIBM', // Original video ID
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0,
      loop: 1,
      playlist: 'KISNE4qOIBM', // Required for looping the same video
      modestbranding: 1,
      rel: 0,
      playsinline: 1, // Important for iOS
      fs: 0,
      showinfo: 0,
      vq: suggestedQuality, // Suggest initial quality level
      enablejsapi: 1, // Enable JS API for better control
      origin: window.location.origin // Specify origin for faster loading
    },
    events: {
      onReady: event => {
        // Mute the video initially to allow autoplay.
        event.target.mute();
        event.target.playVideo();
        
        // Set quality level based on device type
        if (isMobile || optimizedMode) {
          event.target.setPlaybackQuality('small');
        }
        
        // Mobile autoplay is restricted; iOS requires user interaction for unmuted playback.
        // Muted autoplay is already attempted above. Retry once, then defer to touch.
        if (isMobile) {
          const retryOnce = () => {
            if (event.target.getPlayerState() !== YT.PlayerState.PLAYING) {
              event.target.playVideo();
            }
          };
          setTimeout(retryOnce, 800);

          const attemptOnTouch = () => {
            event.target.playVideo();
            document.removeEventListener('touchstart', attemptOnTouch);
          };
          document.addEventListener('touchstart', attemptOnTouch, { once: true, passive: true });
        }
        
        // Apply styles to containing divs
        const section1 = document.getElementById('section1');
        if (section1) {
          const videoBackground = section1.querySelector('.video-background');
          if (videoBackground) {
            videoBackground.style.position = 'absolute';
            videoBackground.style.top = '0';
            videoBackground.style.left = '0';
            videoBackground.style.width = '100%';
            videoBackground.style.height = '100%';
            videoBackground.style.zIndex = '-1';
            videoBackground.style.overflow = 'hidden';
          }
        }
        
        // Adjust the iframe size after a shorter delay for faster loading
        setTimeout(() => {
          const iframe = document.querySelector('#youtube-player iframe');
          if (iframe) {
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style.left = '0';
            // Add loading optimization
            iframe.style.transform = 'translateZ(0)'; // Hardware acceleration
            iframe.style.willChange = 'transform'; // Optimize for animations
          } else {
          }
        }, 200); // Reduced from 500ms to 200ms
      },
      onStateChange: event => {
        // If video ends or pauses unexpectedly, try to restart it
        if (event.data === YT.PlayerState.ENDED || event.data === YT.PlayerState.PAUSED) {
          event.target.playVideo();
        }
      },
      onError: event => {
        // On error, apply an optimized fallback background quickly
        const section1 = document.getElementById('section1');
        if (section1) {
          const videoBackground = section1.querySelector('.video-background');
          if (videoBackground) {
            // Use a smoother fallback transition
            videoBackground.style.transition = 'opacity 0.3s ease-in-out';
            videoBackground.style.background = "#000000 url('visuals/static.gif') center center repeat";
            videoBackground.style.backgroundSize = 'cover';
            videoBackground.style.opacity = '0.8';
          }
        }
      }
    }
  });
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
