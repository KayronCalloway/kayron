// Channel 4: Game Show JavaScript

export async function init() {
  console.log('Channel 4 Game Show init started');
  
  try {
    // Load the game show HTML
    console.log('Loading Channel 4 game show...');
    const response = await fetch('./channels/ch4/index.html');
    if (!response.ok) {
      throw new Error(`Failed to fetch game show: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();
    
    // Insert into the section
    const section4 = document.getElementById('section4');
    if (section4) {
      section4.innerHTML = html;
      
      // Load game show styles
      const gameStylesheet = document.createElement('link');
      gameStylesheet.rel = 'stylesheet';
      gameStylesheet.href = './channels/ch4/styles.css';
      document.head.appendChild(gameStylesheet);
      
      console.log('Channel 4 game show loaded successfully');
      
      // Initialize game show functionality directly
      setupGameShow();
      
    } else {
      console.error('Section 4 not found');
    }
  } catch (err) {
    console.error('Failed to load game show:', err);
  }
}

// Simple gameshow setup - following the Ch3 pattern
function setupGameShow() {
  console.log('Setting up gameshow...');
  
  // Get the start button and add event listener
  const startBtn = document.getElementById('start-game-button');
  if (startBtn) {
    startBtn.addEventListener('click', startGame);
    console.log('Start button event listener added');
  } else {
    console.error('Start button not found');
  }
  
  // Get play again button
  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', resetGame);
  }
  
  // Show the host intro screen by default
  showScreen('host-intro');
}

// Simple screen management
function showScreen(screenName) {
  console.log(`Showing screen: ${screenName}`);
  
  // Hide all screens
  const screens = ['host-intro', 'game-round', 'commercial-break', 'final-results'];
  screens.forEach(screen => {
    const element = document.getElementById(screen);
    if (element) {
      element.classList.add('hidden');
    }
  });
  
  // Show the requested screen
  const targetScreen = document.getElementById(screenName);
  if (targetScreen) {
    targetScreen.classList.remove('hidden');
    console.log(`Successfully showed ${screenName}`);
  } else {
    console.error(`Screen not found: ${screenName}`);
  }
}

// Simple game start
function startGame() {
  console.log('Starting game...');
  showScreen('game-round');
  
  // Simple question display
  const questionDisplay = document.getElementById('question-display');
  if (questionDisplay) {
    questionDisplay.innerHTML = `
      <h3>Sample Question</h3>
      <p>What's the most important skill for a creative strategist?</p>
      <div class="options">
        <button onclick="selectAnswer('A')">A) Technical skills</button>
        <button onclick="selectAnswer('B')">B) Problem-solving</button>
        <button onclick="selectAnswer('C')">C) Communication</button>
        <button onclick="selectAnswer('D')">D) All of the above</button>
      </div>
    `;
  }
}

// Simple answer handling
window.selectAnswer = function(answer) {
  console.log(`Selected answer: ${answer}`);
  
  // Show results
  setTimeout(() => {
    showScreen('final-results');
    
    const resultsContent = document.getElementById('performance-details');
    if (resultsContent) {
      resultsContent.innerHTML = `
        <h3>Great job!</h3>
        <p>You selected: ${answer}</p>
        <p>This demonstrates your understanding of creative strategy fundamentals.</p>
      `;
    }
  }, 1000);
};

// Simple reset
function resetGame() {
  console.log('Resetting game...');
  showScreen('host-intro');
}