// youtube-setup.js

let youtubePlayer;

// Called by the YouTube IFrame API when it's ready.
function onYouTubeIframeAPIReady() {
  console.log('YouTube API ready, initializing player');
  
  // First check if the player container exists
  const playerContainer = document.getElementById('youtube-player');
  if (!playerContainer) {
    console.error('YouTube player container #youtube-player not found in the DOM');
    // Try to create it if missing
    const section1 = document.getElementById('section1');
    if (section1) {
      const videoBackground = section1.querySelector('.video-background');
      if (videoBackground) {
        console.log('Found video background container, creating player element');
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
  
  console.log('Creating YouTube player with ID: KISNE4qOIBM');
  
  // Check for mobile devices or low bandwidth signal set by the Channel 1 module
  const isMobile = window.innerWidth <= 600;
  const optimizedMode = window.useLowQualityVideo || document.querySelector('.video-background[data-optimized="true"]');
  
  // Determine optimal quality based on device and connection
  let suggestedQuality = 'hd720'; // Default quality
  if (isMobile || optimizedMode) {
    console.log('Loading optimized YouTube video for mobile/low bandwidth');
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
      vq: suggestedQuality // Suggest initial quality level
    },
    events: {
      onReady: event => {
        console.log('YouTube player ready, applying styles and starting playback');
        // Mute the video initially to allow autoplay.
        event.target.mute();
        event.target.playVideo();
        
        // Set quality level based on device type
        if (isMobile || optimizedMode) {
          event.target.setPlaybackQuality('small');
        }
        
        // Force playback on mobile devices
        if (isMobile) {
          // Try to force playback on mobile
          const forcePlay = () => {
            if (event.target.getPlayerState() !== YT.PlayerState.PLAYING) {
              console.log('Forcing video playback on mobile');
              event.target.playVideo();
            }
          };
          
          // Try multiple times to start playback
          forcePlay();
          setTimeout(forcePlay, 1000);
          setTimeout(forcePlay, 3000);
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
            console.log('Video background container styled');
          }
        }
        
        // Adjust the iframe size after a short delay.
        setTimeout(() => {
          const iframe = document.querySelector('#youtube-player iframe');
          if (iframe) {
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style.left = '0';
            console.log('YouTube iframe styles applied');
          } else {
            console.error('YouTube iframe not found for styling');
          }
        }, 500);
      },
      onStateChange: event => {
        console.log(`YouTube player state changed: ${event.data}`);
        // If video ends or pauses unexpectedly, try to restart it
        if (event.data === YT.PlayerState.ENDED || event.data === YT.PlayerState.PAUSED) {
          console.log('Video ended or paused - restarting');
          event.target.seekTo(0);
          event.target.playVideo();
        }
      },
      onError: event => {
        console.error('YouTube player error:', event.data);
        // On error, apply a more interesting fallback background
        const section1 = document.getElementById('section1');
        if (section1) {
          const videoBackground = section1.querySelector('.video-background');
          if (videoBackground) {
            videoBackground.style.background = "url('visuals/static.gif') center center repeat";
            videoBackground.style.backgroundSize = 'cover';
            videoBackground.style.opacity = '0.7';
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
