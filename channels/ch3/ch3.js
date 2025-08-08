// Channel 3: Music/Audio Works JavaScript

export async function init() {
  console.log('Channel 3 Music init started');
  
  try {
    // Load the music interface HTML
    console.log('Loading Channel 3 music interface...');
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
      
      console.log('Channel 3 music interface loaded successfully');
      
      // Initialize music player functionality
      setupMusicPlayer();
      setupTrackSelection();
      setupBroadcastSignals();
      
      // Auto-load the latest track (Window Shopping The American Dream) on channel load
      setTimeout(() => {
        playTrack(3); // Index 3 = Track 4 = Window Shopping The American Dream
      }, 1000);
      
      // Ensure TV Guide has correct positioning - USING GLOBAL STANDARD
      setTimeout(() => {
        if (typeof window.ensureTVGuideStandardStyling === 'function') {
          window.ensureTVGuideStandardStyling();
          console.log('Channel 3: Applied standard TV Guide styling');
        } else {
          console.warn('Channel 3: Global TV Guide styling function not available');
        }
      }, 100);
      
    } else {
      console.error('Section 3 not found');
    }
  } catch (err) {
    console.error('Failed to load music interface:', err);
  }
}

let currentPlayer = null;
let currentTrackIndex = -1; // Start with -1 to indicate no track selected
let tracks = [];
let autoAdvanceTimer = null; // Track the auto-advance timer

function setupMusicPlayer() {
  console.log('Setting up music player...');
  
  // Get track data from the DOM - back to YouTube
  tracks = Array.from(document.querySelectorAll('.track-card')).map((card, index) => ({
    id: card.dataset.youtubeId,
    title: card.dataset.trackTitle,
    year: card.dataset.year,
    element: card,
    index: index
  }));
  
  // Don't fetch video titles since we already have the correct ones
  // fetchVideoTitles();
  
  // Set up channel visibility detection for audio control
  setupChannelVisibilityDetection();
  
  console.log('Found tracks:', tracks);
  
  // Setup control buttons
  const playPauseBtn = document.getElementById('playPause');
  const prevBtn = document.getElementById('prevTrack');
  const nextBtn = document.getElementById('nextTrack');
  const isMobile = window.innerWidth <= 768;
  
  // Enhanced mobile touch support for control buttons
  const addMobileSupport = (btn, handler) => {
    if (!btn) return;
    
    btn.addEventListener('click', handler);
    
    if (isMobile) {
      // Touch feedback
      btn.addEventListener('touchstart', () => {
        btn.style.transform = 'scale(0.9)';
        btn.style.transition = 'transform 0.1s ease';
      }, { passive: true });
      
      btn.addEventListener('touchend', () => {
        btn.style.transform = '';
        setTimeout(handler, 50); // Small delay for visual feedback
      }, { passive: true });
      
      // Prevent text selection
      btn.style.userSelect = 'none';
      btn.style.webkitUserSelect = 'none';
      btn.style.webkitTouchCallout = 'none';
    }
  };
  
  addMobileSupport(playPauseBtn, () => {
    // If no track is playing, start with the latest track (track 3 - Window Shopping The American Dream)
    if (currentTrackIndex === -1) {
      playTrack(3); // Start with the newest track
    } else {
      togglePlayPause();
    }
  });
  
  addMobileSupport(prevBtn, playPreviousTrack);
  addMobileSupport(nextBtn, playNextTrack);
}

function setupTrackSelection() {
  console.log('Setting up track selection...');
  
  const trackCards = document.querySelectorAll('.track-card');
  const isMobile = window.innerWidth <= 768;
  
  trackCards.forEach((card, index) => {
    const playBtn = card.querySelector('.play-track-btn');
    
    // Enhanced touch support for mobile
    if (isMobile) {
      // Add touch feedback
      card.style.cursor = 'pointer';
      card.style.userSelect = 'none';
      card.style.webkitUserSelect = 'none';
      card.style.webkitTouchCallout = 'none';
      
      // Touch start feedback
      card.addEventListener('touchstart', () => {
        card.style.transform = 'scale(0.98)';
        card.style.transition = 'transform 0.1s ease';
      }, { passive: true });
      
      // Touch end cleanup
      card.addEventListener('touchend', () => {
        card.style.transform = '';
      }, { passive: true });
    }
    
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click
        playTrack(index); // Play specific track
      });
      
      // Mobile touch optimization
      if (isMobile) {
        playBtn.addEventListener('touchstart', (e) => {
          e.stopPropagation();
          playBtn.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        playBtn.addEventListener('touchend', (e) => {
          e.stopPropagation();
          playBtn.style.transform = '';
          playTrack(index);
        }, { passive: true });
      }
    }
    
    // Add click to whole card as well
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking the button directly
      if (!e.target.classList.contains('play-track-btn')) {
        playTrack(index); // Play specific track
      }
    });
  });
}

function playTrack(index) {
  console.log('Playing track:', index, 'out of', tracks.length, 'tracks');
  
  if (index < 0 || index >= tracks.length) {
    console.error('Invalid track index:', index, 'tracks length:', tracks.length);
    return;
  }
  
  currentTrackIndex = index;
  const track = tracks[index];
  
  console.log('Selected track:', track);
  
  // Update visual states
  updateTrackStates();
  
  // Load YouTube video
  loadYouTubeVideo(track.id);
}

function loadYouTubeVideo(videoId) {
  console.log('Loading YouTube video:', videoId);
  
  // Clear any existing auto-advance timer
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
  
  const playerContainer = document.getElementById('music-video-player');
  if (!playerContainer) {
    console.error('Player container not found');
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

// Set up auto-advance to next video
function setupAutoAdvance(videoId) {
  // Since we can't directly detect when a YouTube embed ends,
  // we'll use a timer-based approach with estimated video duration
  
  // First, try to get video duration from YouTube API
  fetchVideoDuration(videoId).then(duration => {
    if (duration > 0) {
      console.log(`Video ${videoId} duration: ${duration} seconds`);
      
      // Set timer to auto-advance slightly before video ends
      autoAdvanceTimer = setTimeout(() => {
        console.log('Auto-advancing to next video...');
        playNextTrack();
      }, (duration - 2) * 1000); // Advance 2 seconds before end
    } else {
      // Fallback: assume average video length and auto-advance
      autoAdvanceTimer = setTimeout(() => {
        console.log('Auto-advancing to next video (fallback timing)...');
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
      'ptNBEZ6pPp4': 180, // 3 minutes
      'uL_TspM3twU': 200  // 3.3 minutes - Window Shopping The American Dream
    };
    
    return estimatedDurations[videoId] || 210; // Default 3.5 minutes
  } catch (error) {
    console.error('Could not fetch video duration:', error);
    return 180; // 3 minute fallback
  }
}

function updateTrackStates() {
  // Remove active state from all tracks
  tracks.forEach(track => {
    track.element.classList.remove('active');
  });
  
  // Add active state to current track
  if (tracks[currentTrackIndex]) {
    tracks[currentTrackIndex].element.classList.add('active');
  }
}

function togglePlayPause() {
  const playPauseBtn = document.getElementById('playPause');
  if (!playPauseBtn || !currentPlayer) return;
  
  // Check if we have a YouTube API player or iframe
  if (currentPlayer.pauseVideo && currentPlayer.playVideo) {
    // YouTube API player
    if (playPauseBtn.textContent === '▶') {
      currentPlayer.playVideo();
      playPauseBtn.textContent = '⏸';
    } else {
      currentPlayer.pauseVideo();
      playPauseBtn.textContent = '▶';
    }
  } else {
    // Iframe fallback - just update button state
    if (playPauseBtn.textContent === '▶') {
      playPauseBtn.textContent = '⏸';
    } else {
      playPauseBtn.textContent = '▶';
    }
  }
}

// YouTube API event handler
function onPlayerStateChange(event) {
  const playPauseBtn = document.getElementById('playPause');
  
  if (event.data === window.YT.PlayerState.PLAYING) {
    console.log('Video is playing');
    if (playPauseBtn) playPauseBtn.textContent = '⏸';
  } else if (event.data === window.YT.PlayerState.PAUSED) {
    console.log('Video is paused');
    if (playPauseBtn) playPauseBtn.textContent = '▶';
  } else if (event.data === window.YT.PlayerState.ENDED) {
    console.log('Video ended - auto advancing');
    playNextTrack();
  }
}

function playPreviousTrack() {
  console.log('Previous track clicked, current index:', currentTrackIndex);
  if (tracks.length === 0) return;
  
  // If no track is currently selected, start from the last one
  if (currentTrackIndex === -1) {
    playTrack(tracks.length - 1);
    return;
  }
  
  const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
  console.log('Going to previous track:', newIndex);
  playTrack(newIndex);
}

function playNextTrack() {
  console.log('Next track triggered, current index:', currentTrackIndex);
  if (tracks.length === 0) return;
  
  // If no track is currently selected, start from the first one
  if (currentTrackIndex === -1) {
    playTrack(0);
    return;
  }
  
  // Move to next track, or loop back to start
  const newIndex = currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0;
  console.log('Auto-advancing to track:', newIndex);
  playTrack(newIndex);
}

function playRandomTrack() {
  console.log('Playing random track...');
  if (tracks.length === 0) return;
  
  const randomIndex = Math.floor(Math.random() * tracks.length);
  console.log('Selected random track:', randomIndex, '(' + tracks[randomIndex].title + ')');
  playTrack(randomIndex);
}

// Removed toggleMute function since mute button was removed

function setupBroadcastSignals() {
  console.log('Setting up broadcast signals...');
  
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
function setupChannelVisibilityDetection() {
  let isChannelVisible = false;
  
  // Create intersection observer to detect when Channel 3 is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target.id === 'section3') {
        const wasVisible = isChannelVisible;
        isChannelVisible = entry.isIntersecting && entry.intersectionRatio > 0.5;
        
        // If channel became invisible and there's a current player, handle it
        if (wasVisible && !isChannelVisible && currentPlayer) {
          console.log('Channel 3 left viewport - pausing media');
          pauseCurrentMedia();
        }
        
        // If channel became visible and there was a paused player, resume it
        if (!wasVisible && isChannelVisible && currentPlayer) {
          console.log('Channel 3 entered viewport - resuming media');
          // Note: Instagram embeds don't support programmatic play/pause
          // But we can track the state for user experience
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
      console.log('Tab became hidden - pausing media');
      pauseCurrentMedia();
    }
  });
}

function pauseCurrentMedia() {
  // For YouTube embeds, we can provide visual feedback
  const playPauseBtn = document.getElementById('playPause');
  if (playPauseBtn) {
    playPauseBtn.textContent = '▶';
  }
  
  // You could also hide/remove the iframe to stop playback entirely
  // if (currentPlayer) {
  //   currentPlayer.style.display = 'none';
  // }
}

