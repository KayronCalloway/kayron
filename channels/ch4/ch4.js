// Channel 4: Game Show JavaScript

export async function init() {
  try {
    // Container validation
    const container = document.getElementById('section4');
    if (!container) {
      console.error("Channel 4 container not found");
      return;
    }
    
    // Prevent duplicate initialization
    if (container.querySelector('#game-show-container')) {
      console.log("Gameshow already loaded; skipping initialization.");
      return;
    }
    
    console.log('Channel 4 Game Show init started');
    
    // Load gameshow styles first to prevent FOUC
    await loadStyles();
    
    // Load the gameshow HTML
    const gameshowResponse = await fetch('./channels/ch4/index.html');
    if (!gameshowResponse.ok) throw new Error(`HTTP error! Status: ${gameshowResponse.status}`);
    
    const gameshowHtml = await gameshowResponse.text();
    container.innerHTML = gameshowHtml;
    
    console.log('Channel 4 gameshow loaded successfully');
    
    // Initialize gameshow functionality
    initializeGameshow();
    
  } catch (error) {
    console.error("Failed to load Channel 4 gameshow:", error);
    const container = document.getElementById('section4');
    if (container) {
      container.innerHTML = `<div class="error">Error loading gameshow content.</div>`;
    }
  }
}

// Load styles helper function (following Ch2 pattern)
async function loadStyles() {
  return new Promise((resolve, reject) => {
    // Check if styles are already loaded
    if (document.querySelector('link[href="./channels/ch4/styles.css"]')) {
      resolve();
      return;
    }
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './channels/ch4/styles.css';
    link.onload = () => resolve();
    link.onerror = () => reject(new Error('Failed to load gameshow styles'));
    document.head.appendChild(link);
  });
}

// Initialize gameshow functionality
function initializeGameshow() {
  console.log('Initializing gameshow...');
  
  // Show host intro by default
  showScreen('host-intro');
  
  // Set up event listeners
  setupEventListeners();
  
  // Initialize audio
  setupAudio();
}

// Event listeners setup
function setupEventListeners() {
  // Start game button
  const startBtn = document.getElementById('start-game-button');
  if (startBtn) {
    startBtn.addEventListener('click', startGame);
    console.log('Start button initialized');
  }
  
  // Play again button
  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', resetGame);
  }
}

// Audio setup
function setupAudio() {
  try {
    // Background audio setup
    const backgroundAudio = new Audio('./audio/ticker-hum.mp3');
    backgroundAudio.loop = true;
    backgroundAudio.volume = 0.3;
    
    // Store in window for global access
    window.gameshowAudio = backgroundAudio;
    
    // Auto-play with error handling
    backgroundAudio.play().catch(err => {
      console.log('Background audio autoplay prevented:', err);
    });
  } catch (error) {
    console.warn('Audio setup failed:', error);
  }
}

// Screen management
function showScreen(screenName) {
  console.log(`Showing screen: ${screenName}`);
  
  // Hide all screens
  const allScreens = document.querySelectorAll('.game-screen');
  allScreens.forEach(screen => {
    screen.style.display = 'none';
    screen.classList.add('hidden');
  });
  
  // Show target screen
  const targetScreen = document.getElementById(screenName);
  if (targetScreen) {
    targetScreen.style.display = 'flex';
    targetScreen.classList.remove('hidden');
    console.log(`Successfully showed ${screenName}`);
  } else {
    console.error(`Screen not found: ${screenName}`);
  }
}

// Game logic
function startGame() {
  console.log('Starting gameshow...');
  
  // Play start sound
  playSound('./audio/whoosh.mp3');
  
  // Show game screen
  showScreen('game-round');
  
  // Display first question
  displayQuestion();
}

function displayQuestion() {
  const questionDisplay = document.getElementById('question-display');
  if (questionDisplay) {
    questionDisplay.innerHTML = `
      <h2>Professional Skills Assessment</h2>
      <div class="question">
        <h3>What's most important for creative strategy success?</h3>
        <div class="options-container">
          <button class="option-btn" onclick="selectAnswer('Understanding client needs')">
            A) Understanding client needs
          </button>
          <button class="option-btn" onclick="selectAnswer('Creative problem-solving')">
            B) Creative problem-solving  
          </button>
          <button class="option-btn" onclick="selectAnswer('Clear communication')">
            C) Clear communication
          </button>
          <button class="option-btn" onclick="selectAnswer('All of the above')">
            D) All of the above
          </button>
        </div>
      </div>
    `;
  }
}

// Answer selection (global function)
window.selectAnswer = function(answer) {
  console.log(`Answer selected: ${answer}`);
  
  // Play success sound
  playSound('./audio/ka-ching.mp3');
  
  // Show results after delay
  setTimeout(() => {
    showResults(answer);
  }, 1000);
};

function showResults(answer) {
  showScreen('final-results');
  
  const resultsDisplay = document.getElementById('performance-details');
  if (resultsDisplay) {
    resultsDisplay.innerHTML = `
      <div class="results-content">
        <h2>Excellent Choice!</h2>
        <p><strong>You selected:</strong> ${answer}</p>
        <div class="assessment">
          <h3>Your Creative Strategy Assessment</h3>
          <p>This demonstrates strong understanding of holistic creative strategy. 
          The best creative strategists combine client empathy, innovative problem-solving, 
          and clear communication to deliver exceptional results.</p>
        </div>
      </div>
    `;
  }
}

function resetGame() {
  console.log('Resetting gameshow...');
  showScreen('host-intro');
}

// Sound helper
function playSound(src) {
  try {
    const audio = new Audio(src);
    audio.play().catch(err => console.log('Sound play failed:', err));
  } catch (error) {
    console.warn('Sound error:', error);
  }
}

// Cleanup function for when leaving channel
window.cleanupGameshow = function() {
  if (window.gameshowAudio) {
    window.gameshowAudio.pause();
    window.gameshowAudio.currentTime = 0;
  }
};