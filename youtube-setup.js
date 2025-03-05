// youtube-setup.js

let youtubePlayer;
let youtubeApiLoaded = false;
let youtubeApiLoading = false;

/**
 * Dynamically load the YouTube IFrame API script
 * This defers loading the ~300KB API until it's actually needed
 */
function loadYouTubeAPI() {
  if (youtubeApiLoaded || youtubeApiLoading) return;
  
  youtubeApiLoading = true;
  console.log('Lazy loading YouTube IFrame API');
  
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  tag.onload = () => {
    youtubeApiLoaded = true;
    youtubeApiLoading = false;
    console.log('YouTube API loaded successfully');
  };
  tag.onerror = (error) => {
    console.error('Failed to load YouTube API:', error);
    youtubeApiLoading = false;
  };
  
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

/**
 * Observe player visibility and load API when needed
 */
function initYouTubePlayerObserver() {
  const playerContainer = document.getElementById('section1');
  if (!playerContainer) {
    console.warn('Channel 1 section not found, loading YouTube API immediately as fallback');
    loadYouTubeAPI();
    return;
  }
  
  const playerObserver = new IntersectionObserver((entries) => {
    // Load YouTube API when player section is about to be visible
    if (entries[0].isIntersecting) {
      loadYouTubeAPI();
      playerObserver.disconnect();
    }
  }, { rootMargin: '200px' }); // Load when within 200px of viewport
  
  playerObserver.observe(playerContainer);
  console.log('YouTube player observer initialized');
}

// Initiate observation on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initYouTubePlayerObserver);

// Called by the YouTube IFrame API when it's ready
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
      playsinline: 1,
      fs: 0,
      showinfo: 0
    },
    events: {
      onReady: event => {
        console.log('YouTube player ready, applying styles and starting playback');
        // Mute the video initially to allow autoplay.
        event.target.mute();
        event.target.playVideo();
        
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
