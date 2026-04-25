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
    console.error('YouTube player container #youtube-player not found in the DOM');
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
    console.error('Could not create YouTube player container, aborting player initialization');
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
        
        // Force playback on mobile devices with enhanced iOS support
        if (isMobile) {
          // iOS-specific detection
          const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
          
          // More aggressive retry strategy especially for iOS
          const forcePlay = () => {
            if (event.target.getPlayerState() !== YT.PlayerState.PLAYING) {
              event.target.playVideo();
              
              // Check if video is actually playing after a short delay
              if (isiOS) {
                setTimeout(() => {
                  if (event.target.getPlayerState() !== YT.PlayerState.PLAYING) {
                    event.target.playVideo();
                  }
                }, 300);
              }
            }
          };
          
          // Initial attempt
          forcePlay();
          
          // More frequent retries for iOS
          if (isiOS) {
            // iOS needs multiple attempts with user interaction context
            for (let i = 1; i <= 5; i++) {
              setTimeout(forcePlay, i * 600); // More frequent retries
            }
            
            // Additional attempts after page stabilizes
            setTimeout(forcePlay, 3000);
            setTimeout(forcePlay, 5000);
            
            // Attempt playback on first user interaction
            const attemptPlayOnInteraction = () => {
              event.target.playVideo();
              // Clean up after first attempt
              document.removeEventListener('touchstart', attemptPlayOnInteraction);
            };
            
            document.addEventListener('touchstart', attemptPlayOnInteraction, {once: true, passive: true});
          } else {
            // Standard retry for non-iOS
            setTimeout(forcePlay, 1000);
            setTimeout(forcePlay, 3000);
          }
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
            console.error('YouTube iframe not found for styling');
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
        console.error('YouTube player error:', event.data);
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
            console.log('Applied optimized fallback background due to YouTube error');
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
