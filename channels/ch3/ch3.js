// Channel 3: Music/Audio Works JavaScript

export async function init() {
  
  try {
    // Load the music interface HTML
    const response = await fetch('./channels/ch3/index.html');
    if (!response.ok) {
      throw new Error(`Failed to fetch music interface: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();
    
    // Insert into the section
    const section3 = document.getElementById('section3');
    if (section3) {
      section3.innerHTML = html;
      
      // Load music-specific styles
      const musicStylesheet = document.createElement('link');
      musicStylesheet.rel = 'stylesheet';
      musicStylesheet.href = './channels/ch3/styles.css';
      document.head.appendChild(musicStylesheet);
      
      
      // Initialize music player functionality
      setupMusicPlayer();
      setupBroadcastSignals();
      
      // Only auto-load the first track if ch3 is currently visible
      setTimeout(() => {
        const section3 = document.getElementById('section3');
        if (section3) {
          const rect = section3.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0 && 
                           rect.top >= -rect.height * 0.5 && rect.top <= window.innerHeight * 0.5;
          if (isVisible) {
            playTrack(0); // Index 0 = Track 1 = Field Trippin
          }
        }
      }, 1000);
      
      // Ensure TV Guide has correct positioning - USING GLOBAL STANDARD
      setTimeout(() => {
        if (typeof window.ensureTVGuideStandardStyling === 'function') {
          window.ensureTVGuideStandardStyling();
        } else {
        }
      }, 100);
      
    }
  } catch (err) {
    // Music player not yet available
  }
}

let currentPlayer = null;
let currentTrackIndex = -1;
let autoAdvanceTimer = null;

// Track data — no longer depends on DOM cards
const tracks = [
  { id: 'ftp_QMl9BgU', title: 'Field Trippin', year: '2024', isLocal: false },
  { id: 'tpeUkuGCzOU', title: 'date', year: '2023', isLocal: false },
  { id: 'ptNBEZ6pPp4', title: 'Shibuya Subway Slide', year: '2023', isLocal: false }
];

function setupMusicPlayer() {
  setupChannelVisibilityDetection();

  const playPauseBtn = document.getElementById('playPause');
  const prevBtn = document.getElementById('prevTrack');
  const nextBtn = document.getElementById('nextTrack');
  const isMobile = window.innerWidth <= 768;

  const addMobileSupport = (btn, handler) => {
    if (!btn) return;
    btn.addEventListener('click', handler);
    if (isMobile) {
      btn.addEventListener('touchstart', () => {
        btn.style.transform = 'scale(0.9)';
        btn.style.transition = 'transform 0.1s ease';
      }, { passive: true });
      btn.addEventListener('touchend', () => {
        btn.style.transform = '';
        setTimeout(handler, 50);
      }, { passive: true });
      btn.style.userSelect = 'none';
      btn.style.webkitUserSelect = 'none';
      btn.style.webkitTouchCallout = 'none';
    }
  };

  addMobileSupport(playPauseBtn, () => {
    if (currentTrackIndex === -1) {
      playTrack(0);
    } else {
      togglePlayPause();
    }
  });

  addMobileSupport(prevBtn, playPreviousTrack);
  addMobileSupport(nextBtn, playNextTrack);
}

function updateNowPlaying() {
  const titleEl = document.getElementById('nowPlayingTitle');
  if (!titleEl) return;
  if (currentTrackIndex >= 0 && tracks[currentTrackIndex]) {
    const t = tracks[currentTrackIndex];
    titleEl.textContent = `${t.title} \u00b7 ${t.year}`;
  } else {
    titleEl.textContent = 'Select a track';
  }
}

function playTrack(index) {
  if (index < 0 || index >= tracks.length) return;
  currentTrackIndex = index;
  const track = tracks[index];
  userPaused = false;
  updateNowPlaying();

  if (track.isLocal) {
    loadLocalVideo(track.videoPath);
  } else {
    loadYouTubeVideo(track.id);
  }
}

function loadYouTubeVideo(videoId) {
  
  // Clear any existing auto-advance timer
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
  
  const playerContainer = document.getElementById('music-video-player');
  if (!playerContainer) {
    return;
  }
  
  // Clear previous content
  playerContainer.innerHTML = '';
  
  // Create YouTube player using the iframe API
  if (window.YT && window.YT.Player) {
    // Create a div for the YouTube player
    const playerDiv = document.createElement('div');
    playerDiv.id = 'yt-player-' + Date.now();
    playerContainer.appendChild(playerDiv);
    
    currentPlayer = new window.YT.Player(playerDiv.id, {
      videoId: videoId,
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 1,
        controls: 1,
        rel: 0,
        showinfo: 0,
        enablejsapi: 1
      },
      events: {
        onStateChange: onPlayerStateChange
      }
    });
  } else {
    // Fallback to iframe if YT API not loaded
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&showinfo=0&enablejsapi=1`;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.id = 'youtube-player-iframe';
    
    playerContainer.appendChild(iframe);
    currentPlayer = iframe;
    
    // Use timer-based auto-advance as fallback
    setupAutoAdvance(videoId);
  }
  
  // Update play button state
  const playPauseBtn = document.getElementById('playPause');
  if (playPauseBtn) {
    playPauseBtn.textContent = '⏸';
  }
}

function loadLocalVideo(videoPath) {
  
  // Clear any existing auto-advance timer
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
  
  const playerContainer = document.getElementById('music-video-player');
  if (!playerContainer) {
    return;
  }
  
  // Clear previous content
  playerContainer.innerHTML = '';
  
  // Create HTML5 video element with proper alignment
  const video = document.createElement('video');
  video.src = videoPath; // Direct src assignment
  video.controls = true;
  video.muted = true; // Start muted to allow autoplay
  video.autoplay = false; // Don't autoplay initially
  video.loop = false;
  video.preload = 'auto'; // Preload the entire video
  video.id = 'local-video-player';
  
  
  // Test if video file is accessible
  fetch(videoPath).then(response => {
    if (!response.ok) {
    }
  }).catch(error => {
  });
  
  // Add event listeners
  video.addEventListener('loadedmetadata', () => {
    // Set auto-advance timer based on actual duration
    if (video.duration > 0) {
      autoAdvanceTimer = setTimeout(() => {
        playNextTrack();
      }, (video.duration - 2) * 1000); // Advance 2 seconds before end
    }
  });
  
  video.addEventListener('ended', () => {
    playNextTrack();
  });
  
  video.addEventListener('play', () => {
    const playPauseBtn = document.getElementById('playPause');
    if (playPauseBtn) playPauseBtn.textContent = '⏸';
  });
  
  video.addEventListener('pause', () => {
    const playPauseBtn = document.getElementById('playPause');
    if (playPauseBtn) playPauseBtn.textContent = '▶';
  });
  
  // Handle video loading states
  video.addEventListener('loadstart', () => {
  });
  
  video.addEventListener('canplay', () => {
    // Try to start playing once it can play
    video.play().then(() => {
      const playPauseBtn = document.getElementById('playPause');
      if (playPauseBtn) playPauseBtn.textContent = '⏸';
    }).catch(error => {
      const playPauseBtn = document.getElementById('playPause');
      if (playPauseBtn) playPauseBtn.textContent = '▶';
    });
  });
  
  // Handle autoplay errors
  video.addEventListener('error', (e) => {
    const playPauseBtn = document.getElementById('playPause');
    if (playPauseBtn) playPauseBtn.textContent = '▶';
  });
  
  // Video should load directly with src attribute
  
  playerContainer.appendChild(video);
  currentPlayer = video;
  
  // Set initial button state
  const playPauseBtn = document.getElementById('playPause');
  if (playPauseBtn) playPauseBtn.textContent = '▶';
}

// Set up auto-advance to next video
function setupAutoAdvance(videoId) {
  // Since we can't directly detect when a YouTube embed ends,
  // we'll use a timer-based approach with estimated video duration
  
  // First, try to get video duration from YouTube API
  fetchVideoDuration(videoId).then(duration => {
    if (duration > 0) {
      
      // Set timer to auto-advance slightly before video ends
      autoAdvanceTimer = setTimeout(() => {
        playNextTrack();
      }, (duration - 2) * 1000); // Advance 2 seconds before end
    } else {
      // Fallback: assume average video length and auto-advance
      autoAdvanceTimer = setTimeout(() => {
        playNextTrack();
      }, 180000); // 3 minutes fallback
    }
  });
}

// Fetch video duration using YouTube oEmbed API
async function fetchVideoDuration(videoId) {
  try {
    // This is a simple fallback - YouTube oEmbed doesn't provide duration
    // For a production app, you'd want to use the YouTube Data API v3
    // For now, we'll use estimated durations based on video type
    
    // Different durations for different video types - most music videos are 3-5 minutes
    const estimatedDurations = {
      'ftp_QMl9BgU': 240, // 4 minutes
      'tpeUkuGCzOU': 210, // 3.5 minutes  
      'ptNBEZ6pPp4': 180  // 3 minutes
    };
    
    return estimatedDurations[videoId] || 210; // Default 3.5 minutes
  } catch (error) {
    return 180; // 3 minute fallback
  }
}

function togglePlayPause() {
  const playPauseBtn = document.getElementById('playPause');
  if (!playPauseBtn || !currentPlayer) return;
  
  // Check if we have a YouTube API player
  if (currentPlayer.pauseVideo && currentPlayer.playVideo) {
    // YouTube API player
    if (playPauseBtn.textContent === '▶') {
      currentPlayer.playVideo();
      playPauseBtn.textContent = '⏸';
      userPaused = false; // User resumed playback
    } else {
      currentPlayer.pauseVideo();
      playPauseBtn.textContent = '▶';
      userPaused = true; // User paused playback
    }
  } else if (currentPlayer.tagName === 'VIDEO') {
    // HTML5 video element (local video)
    if (currentPlayer.paused) {
      currentPlayer.play();
      playPauseBtn.textContent = '⏸';
      userPaused = false; // User resumed playback
    } else {
      currentPlayer.pause();
      playPauseBtn.textContent = '▶';
      userPaused = true; // User paused playback
    }
  } else {
    // Iframe fallback - just update button state
    if (playPauseBtn.textContent === '▶') {
      playPauseBtn.textContent = '⏸';
      userPaused = false;
    } else {
      playPauseBtn.textContent = '▶';
      userPaused = true;
    }
  }
}

// YouTube API event handler
function onPlayerStateChange(event) {
  const playPauseBtn = document.getElementById('playPause');
  
  if (event.data === window.YT.PlayerState.PLAYING) {
    if (playPauseBtn) playPauseBtn.textContent = '⏸';
  } else if (event.data === window.YT.PlayerState.PAUSED) {
    if (playPauseBtn) playPauseBtn.textContent = '▶';
  } else if (event.data === window.YT.PlayerState.ENDED) {
    playNextTrack();
  }
}

function playPreviousTrack() {
  if (tracks.length === 0) return;
  
  // If no track is currently selected, start from the last one
  if (currentTrackIndex === -1) {
    playTrack(tracks.length - 1);
    return;
  }
  
  const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
  playTrack(newIndex);
}

function playNextTrack() {
  if (tracks.length === 0) return;
  
  // If no track is currently selected, start from the first one
  if (currentTrackIndex === -1) {
    playTrack(0);
    return;
  }
  
  // Move to next track, or loop back to start
  const newIndex = currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0;
  playTrack(newIndex);
}

function playRandomTrack() {
  if (tracks.length === 0) return;
  
  const randomIndex = Math.floor(Math.random() * tracks.length);
  playTrack(randomIndex);
}

// Removed toggleMute function since mute button was removed

function setupBroadcastSignals() {
  
  const sendBtn = document.getElementById('sendSignal');
  const messageInput = document.getElementById('signalMessage');
  const feed = document.getElementById('signalsFeed');
  
  if (sendBtn && messageInput && feed) {
    sendBtn.addEventListener('click', () => {
      const message = messageInput.value.trim();
      if (message) {
        addSignalToFeed(message);
        messageInput.value = '';
      }
    });
    
    // Allow Enter key to send
    messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
      }
    });
    
    // Add some initial signals
    addSignalToFeed("Channel initialized... Broadcasting memories...", true);
    addSignalToFeed("Signal strength: STRONG", true);
  }
}

function addSignalToFeed(message, isSystem = false) {
  const feed = document.getElementById('signalsFeed');
  if (!feed) return;
  
  const signal = document.createElement('div');
  signal.style.marginBottom = '10px';
  signal.style.padding = '8px';
  signal.style.borderLeft = isSystem ? '3px solid #3e92cc' : '3px solid #5d9edd';
  signal.style.backgroundColor = 'rgba(30, 35, 45, 0.3)';
  signal.style.borderRadius = '4px';
  
  const timestamp = new Date().toLocaleTimeString();
  const prefix = isSystem ? '[SYSTEM]' : '[SIGNAL]';
  
  signal.innerHTML = `
    <div style="color: ${isSystem ? '#3e92cc' : '#5d9edd'}; font-size: 10px; margin-bottom: 4px;">
      ${prefix} ${timestamp}
    </div>
    <div style="color: #ffffff; font-size: 12px; line-height: 1.4;">
      ${message}
    </div>
  `;
  
  feed.appendChild(signal);
  feed.scrollTop = feed.scrollHeight;
}

// Add CSS for active track state
const style = document.createElement('style');
style.textContent = `
  #section3 .track-card.active {
    border-color: #3e92cc !important;
    background: rgba(62, 146, 204, 0.1) !important;
    box-shadow: 0 0 20px rgba(62, 146, 204, 0.3) !important;
  }
  
  #section3 .track-card.active .track-title {
    color: #3e92cc !important;
  }
  
  #section3 .track-card.active .play-track-btn {
    background: linear-gradient(45deg, #5d9edd, #3e92cc) !important;
  }
`;
document.head.appendChild(style);

// Channel visibility detection for audio control
let userPaused = false; // Track if user manually paused

function setupChannelVisibilityDetection() {
  let isChannelVisible = false;
  let wasSystemMuted = false;

  // Create intersection observer to detect when Channel 3 is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target.id === 'section3') {
        const wasVisible = isChannelVisible;
        isChannelVisible = entry.isIntersecting && entry.intersectionRatio > 0.5;

        // If channel became invisible, mute (but keep playing)
        if (wasVisible && !isChannelVisible && currentPlayer) {
          muteMedia(true);
        }

        // If channel became visible and was system-muted, unmute
        if (!wasVisible && isChannelVisible && currentPlayer && wasSystemMuted) {
          unmuteMedia();
        }
      }
    });
  }, {
    threshold: [0.1, 0.5, 0.9] // Trigger at different visibility levels
  });

  // Observe Channel 3
  const section3 = document.getElementById('section3');
  if (section3) {
    observer.observe(section3);
  }

  // Also listen for visibility change events (when user switches tabs)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && currentPlayer) {
      muteMedia(true);
    } else if (!document.hidden && currentPlayer && wasSystemMuted) {
      // Only unmute if we're also on the channel
      const rect = section3 ? section3.getBoundingClientRect() : null;
      const onChannel = rect && rect.top < window.innerHeight && rect.bottom > 0;
      if (onChannel) unmuteMedia();
    }
  });

  function muteMedia(system = false) {
    if (currentPlayer) {
      if (currentPlayer.mute) {
        currentPlayer.mute();
      } else if (currentPlayer.tagName === 'VIDEO') {
        currentPlayer.muted = true;
      }
    }
    if (system) wasSystemMuted = true;
  }

  function unmuteMedia() {
    if (currentPlayer) {
      if (currentPlayer.unMute) {
        currentPlayer.unMute();
      } else if (currentPlayer.tagName === 'VIDEO') {
        currentPlayer.muted = false;
      }
    }
    wasSystemMuted = false;
  }
}

function pauseCurrentMedia(isSystemPause = false) {
  const playPauseBtn = document.getElementById('playPause');
  
  // If this is a user-initiated pause (not system), mark it
  if (!isSystemPause) {
    userPaused = true;
  }
  
  // Try to actually pause the media if possible
  if (currentPlayer) {
    if (currentPlayer.pauseVideo) {
      // YouTube API player
      currentPlayer.pauseVideo();
    } else if (currentPlayer.tagName === 'VIDEO') {
      // HTML5 video element
      currentPlayer.pause();
    }
  }
  
  // Update button state
  if (playPauseBtn) {
    playPauseBtn.textContent = '▶';
  }
}

