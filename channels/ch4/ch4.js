// channels/ch4/ch4.js
import { loadHTML, loadCSS, errorTracker } from '../../utils.js';

/**
 * Initialize Channel 4
 * @returns {Function} Cleanup function
 */
export async function init() {
  try {
    // Load HTML content
    await loadHTML('./channels/ch4/index.html', document.getElementById('section4'));
    
    // Load CSS
    await loadCSS('./channels/ch4/styles.css');
    
    // Setup YouTube player
    const cleanupPlayer = setupYouTubePlayer();
    
    // Return cleanup function
    return () => {
      cleanupPlayer();
      console.log('Channel 4 cleanup complete');
    };
  } catch (error) {
    errorTracker.track('Channel4.init', error);
    console.error('Failed to initialize Channel 4:', error);
    
    // Display error message
    const container = document.getElementById('section4');
    if (container) {
      container.innerHTML = '<div class="error">Error loading video content.</div>';
    }
  }
}

/**
 * Setup YouTube player for Channel 4
 * @returns {Function} Cleanup function
 */
function setupYouTubePlayer() {
  // Check if player already exists
  if (document.getElementById('section4').querySelector('#youtube-player-4')) {
    console.log("Channel 4 player already loaded; skipping initialization.");
    return () => {};
  }
  
  let playerInitTimeout;
  
  // Create the player after a short delay
  playerInitTimeout = setTimeout(() => {
    if (typeof YT !== 'undefined' && YT.Player) {
      try {
        // Create the player and assign it to a global variable
        window.channel4Player = new YT.Player('youtube-player-4', {
          videoId: 'OFlnSoPm7x4',
          playerVars: {
            autoplay: 1,
            controls: 0,
            loop: 1,
            playlist: 'OFlnSoPm7x4',
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            fs: 0,
            showinfo: 0
          },
          events: {
            onReady: event => {
              event.target.mute();
              event.target.playVideo();
              console.log("Channel 4 YouTube Player ready, starting muted.");
            },
            onError: event => {
              errorTracker.track('Channel4.YouTubeError', new Error(`YouTube error code: ${event.data}`));
            }
          }
        });
      } catch (error) {
        errorTracker.track('Channel4.createPlayer', error);
        console.error("Failed to create Channel 4 YouTube player:", error);
      }
    } else {
      errorTracker.track('Channel4.YouTubeAPI', new Error('YouTube API not available'));
      console.error("YouTube API not available for Channel 4.");
    }
  }, 500);
  
  // Return cleanup function
  return () => {
    clearTimeout(playerInitTimeout);
    
    // Stop and destroy the player if it exists
    if (window.channel4Player && typeof window.channel4Player.destroy === 'function') {
      try {
        window.channel4Player.destroy();
        window.channel4Player = null;
      } catch (error) {
        errorTracker.track('Channel4.cleanup', error);
      }
    }
  };
}

/**
 * Explicit cleanup function
 */
export function cleanup() {
  // Additional cleanup if needed
  const playerElement = document.getElementById('youtube-player-4');
  if (playerElement) {
    playerElement.innerHTML = '';
  }
}