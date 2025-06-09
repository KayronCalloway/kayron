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
      
    } else {
      console.error('Section 3 not found');
    }
  } catch (err) {
    console.error('Failed to load music interface:', err);
  }
}

let currentPlayer = null;
let currentTrackIndex = 0;
let tracks = [];

function setupMusicPlayer() {
  console.log('Setting up music player...');
  
  // Get track data from the DOM
  tracks = Array.from(document.querySelectorAll('.track-card')).map((card, index) => ({
    id: card.dataset.youtubeId,
    title: card.dataset.trackTitle,
    year: card.dataset.year,
    element: card,
    index: index
  }));
  
  console.log('Found tracks:', tracks);
  
  // Setup control buttons
  const playPauseBtn = document.getElementById('playPause');
  const prevBtn = document.getElementById('prevTrack');
  const nextBtn = document.getElementById('nextTrack');
  const muteBtn = document.getElementById('muteBtn');
  
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlayPause);
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', playPreviousTrack);
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', playNextTrack);
  }
  
  if (muteBtn) {
    muteBtn.addEventListener('click', toggleMute);
  }
}

function setupTrackSelection() {
  console.log('Setting up track selection...');
  
  const trackCards = document.querySelectorAll('.track-card');
  trackCards.forEach((card, index) => {
    const playBtn = card.querySelector('.play-track-btn');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        playTrack(index);
      });
    }
    
    // Add click to whole card as well
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking the button directly
      if (!e.target.classList.contains('play-track-btn')) {
        playTrack(index);
      }
    });
  });
}

function playTrack(index) {
  console.log('Playing track:', index);
  
  if (index < 0 || index >= tracks.length) {
    console.error('Invalid track index:', index);
    return;
  }
  
  currentTrackIndex = index;
  const track = tracks[index];
  
  // Update current track display
  const currentTrackElement = document.getElementById('current-track');
  if (currentTrackElement) {
    currentTrackElement.textContent = track.title || `Audio Project ${index + 1}`;
  }
  
  // Update visual states
  updateTrackStates();
  
  // Load YouTube video
  loadYouTubeVideo(track.id);
}

function loadYouTubeVideo(videoId) {
  console.log('Loading YouTube video:', videoId);
  
  const playerContainer = document.getElementById('music-video-player');
  if (!playerContainer) {
    console.error('Player container not found');
    return;
  }
  
  // Create iframe for YouTube video
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&showinfo=0`;
  iframe.width = '100%';
  iframe.height = '100%';
  iframe.frameBorder = '0';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  
  // Clear previous content and add new iframe
  playerContainer.innerHTML = '';
  playerContainer.appendChild(iframe);
  
  // Update play button state
  const playPauseBtn = document.getElementById('playPause');
  if (playPauseBtn) {
    playPauseBtn.textContent = '⏸';
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
  if (!playPauseBtn) return;
  
  // This is a simplified version - in a full implementation,
  // we'd need to interact with the YouTube player API
  if (playPauseBtn.textContent === '▶') {
    playPauseBtn.textContent = '⏸';
    // Would send play command to YouTube player
  } else {
    playPauseBtn.textContent = '▶';
    // Would send pause command to YouTube player
  }
}

function playPreviousTrack() {
  const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
  playTrack(newIndex);
}

function playNextTrack() {
  const newIndex = currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0;
  playTrack(newIndex);
}

function toggleMute() {
  const muteBtn = document.getElementById('muteBtn');
  if (!muteBtn) return;
  
  // Toggle mute state (simplified)
  if (muteBtn.textContent === '🔊') {
    muteBtn.textContent = '🔇';
  } else {
    muteBtn.textContent = '🔊';
  }
}

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
  .track-card.active {
    border-color: #3e92cc !important;
    background: rgba(62, 146, 204, 0.1) !important;
    box-shadow: 0 0 20px rgba(62, 146, 204, 0.3) !important;
  }
  
  .track-card.active .track-title {
    color: #3e92cc !important;
  }
  
  .track-card.active .play-track-btn {
    background: linear-gradient(45deg, #5d9edd, #3e92cc) !important;
  }
`;
document.head.appendChild(style);