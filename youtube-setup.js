// youtube-setup.js - Manages YouTube player initialization

import { errorTracker } from './utils.js';

// Track if the API is ready
let apiReady = false;

// Create and export the YouTube player
let youtubePlayer = null;

/**
 * Called by the YouTube IFrame API when it's ready
 */
function onYouTubeIframeAPIReady() {
  apiReady = true;
  createMainPlayer();
}

/**
 * Create the main YouTube player for channel 1
 */
function createMainPlayer() {
  try {
    window.youtubePlayer = new YT.Player('youtube-player', {
      videoId: 'KISNE4qOIBM', // YouTube video ID
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
        onReady: handlePlayerReady,
        onError: handlePlayerError
      }
    });
    
    youtubePlayer = window.youtubePlayer;
  } catch (error) {
    errorTracker.track('YouTube.createMainPlayer', error);
    console.error('Failed to create YouTube player:', error);
  }
}

/**
 * Handle the onReady event from YouTube player
 * @param {Object} event - YouTube player event
 */
function handlePlayerReady(event) {
  try {
    // Mute the video initially to allow autoplay
    event.target.mute();
    event.target.playVideo();
    
    // Adjust the iframe size after a short delay
    setTimeout(() => {
      const iframe = document.querySelector('#youtube-player iframe');
      if (iframe) {
        iframe.style.width = '100%';
        iframe.style.height = '100%';
      }
    }, 500);
    
    console.log('YouTube player ready');
  } catch (error) {
    errorTracker.track('YouTube.handlePlayerReady', error);
  }
}

/**
 * Handle YouTube player errors
 * @param {Object} event - YouTube player error event
 */
function handlePlayerError(event) {
  const errorCodes = {
    2: 'Invalid parameter',
    5: 'HTML5 player error',
    100: 'Video not found',
    101: 'Embedded playback disabled',
    150: 'Embedded playback disabled'
  };
  
  const errorMessage = errorCodes[event.data] || `Unknown error (${event.data})`;
  errorTracker.track('YouTube.playerError', new Error(errorMessage));
  
  console.error(`YouTube player error: ${errorMessage}`);
}

/**
 * Setup power button to unmute video on click
 */
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

// Make onYouTubeIframeAPIReady globally available
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

export { youtubePlayer };