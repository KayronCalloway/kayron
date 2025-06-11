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
    
    // Wait a moment for DOM to settle, then initialize gameshow functionality
    setTimeout(() => {
      console.log('🚀 Initializing gameshow after DOM settlement...');
      initializeGameshow();
    }, 200);
    
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
  
  // Don't open curtains immediately - wait for intersection observer
  // Show host intro by default (behind curtains)
  showScreen('host-intro');
  
  // Set up event listeners
  setupEventListeners();
  
  // Initialize audio but don't auto-play - wait for channel focus
  setupAudio();
}

// Event listeners setup
function setupEventListeners() {
  // Start game button
  const startBtn = document.getElementById('start-game-button');
  if (startBtn) {
    console.log('Start button found:', startBtn);
    
    // Ensure button is clickable
    startBtn.style.pointerEvents = 'auto';
    startBtn.style.cursor = 'pointer';
    startBtn.style.zIndex = '1000';
    
    // Add click event listener
    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('START BUTTON CLICKED!');
      startGame();
    });
    
    // Also add touch event for mobile
    startBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      console.log('START BUTTON TOUCHED!');
      startGame();
    });
    
    console.log('Start button initialized with events');
  } else {
    console.error('Start button NOT found!');
  }
  
  // Play again button
  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', resetGame);
  }
}

// Curtain opening animation
function openCurtains() {
  console.log('🎭 Opening curtains...');
  
  const leftCurtain = document.querySelector('.curtain-left');
  const rightCurtain = document.querySelector('.curtain-right');
  
  if (leftCurtain && rightCurtain) {
    // Add animation classes
    leftCurtain.style.animation = 'curtain-left 2s ease-in-out forwards';
    rightCurtain.style.animation = 'curtain-right 2s ease-in-out forwards';
    
    // After curtains open, start audio if channel is visible
    setTimeout(() => {
      const section4 = document.getElementById('section4');
      if (section4) {
        const rect = section4.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible && window.gameshowAudio) {
          window.gameshowAudio.play().catch(err => {
            console.log('Gameshow audio autoplay prevented:', err);
          });
        }
      }
    }, 2000);
  }
}

// Audio setup
function setupAudio() {
  try {
    // Background audio setup - use gameshow.aif for proper gameshow ambiance
    const backgroundAudio = new Audio('./audio/gameshow.aif');
    backgroundAudio.loop = true;
    backgroundAudio.volume = 0.4;
    
    // Store in window for global access
    window.gameshowAudio = backgroundAudio;
    
    // Don't auto-play immediately - let curtain animation handle this
    console.log('Gameshow audio initialized (ready to play)');
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
  console.log('🎬 STARTING GAMESHOW...');
  
  // Reset game state
  gameState.score = 0;
  gameState.currentQuestionIndex = 0;
  
  // Update displays
  const scoreDisplay = document.getElementById('current-score');
  if (scoreDisplay) {
    scoreDisplay.textContent = '0';
  }
  
  // Start sound removed - keeping only gameshow.aif background
  
  // Show game screen
  console.log('🎮 Switching to game screen...');
  showScreen('game-round');
  
  // Small delay then display first question
  setTimeout(() => {
    console.log('❓ Displaying first question...');
    displayQuestion();
  }, 500);
}

// Game state
let gameState = {
  score: 0,
  currentQuestionIndex: 0,
  questions: [
    {
      question: "When Kayron encounters a creative brief, what does he see first?",
      options: [
        { letter: "A", text: "The deliverables and timeline", points: 8 },
        { letter: "B", text: "The system of meaning underneath", points: 20 },
        { letter: "C", text: "The budget and constraints", points: 5 },
        { letter: "D", text: "Similar work that's been done before", points: 12 }
      ],
      insight: "Kayron reverse-engineers the logic beneath ideas. He sees structures, loops, and intersections—not just surface requirements."
    },
    {
      question: "What matters most to Kayron when his work is complete?",
      options: [
        { letter: "A", text: "Getting proper credit and recognition", points: 8 },
        { letter: "B", text: "The idea speaking for itself", points: 20 },
        { letter: "C", text: "Positive client feedback", points: 12 },
        { letter: "D", text: "Award submissions and accolades", points: 5 }
      ],
      insight: "Kayron believes the creator's identity should dissolve into the concept. He wants connection, not credit."
    },
    {
      question: "How does Kayron approach taste and aesthetic decisions?",
      options: [
        { letter: "A", text: "Follow current design trends", points: 5 },
        { letter: "B", text: "Study, filter, and cultivate intentionally", points: 20 },
        { letter: "C", text: "Copy what successful brands do", points: 8 },
        { letter: "D", text: "Trust gut instinct", points: 15 }
      ],
      insight: "Kayron has earned his taste through study and discipline. It's cultivated, filtered, and intentional—not trend-chasing."
    },
    {
      question: "What drives Kayron to create across multiple mediums?",
      options: [
        { letter: "A", text: "Keeping work interesting and varied", points: 12 },
        { letter: "B", text: "Each medium reveals different angles of truth", points: 20 },
        { letter: "C", text: "Building a diverse portfolio", points: 8 },
        { letter: "D", text: "Avoiding creative burnout", points: 10 }
      ],
      insight: "Kayron is a pattern shaper. Fragrance, film, UX, AI—each becomes a vessel for the same underlying idea."
    },
    {
      question: "How does Kayron view the act of creation itself?",
      options: [
        { letter: "A", text: "A fun creative outlet", points: 10 },
        { letter: "B", text: "A moral obligation to meaning", points: 20 },
        { letter: "C", text: "A way to build career success", points: 8 },
        { letter: "D", text: "A form of self-expression", points: 15 }
      ],
      insight: "Kayron sees art and thought as obligations, not luxuries. If you're capable of making meaning, you owe the world that attempt."
    }
  ]
};

function displayQuestion() {
  const questionDisplay = document.getElementById('question-display');
  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
  
  if (questionDisplay && currentQuestion) {
    questionDisplay.innerHTML = `
      <div class="question">
        <h3>${currentQuestion.question}</h3>
      </div>
    `;
    
    // Create options container separately to ensure proper styling
    const optionsContainer = document.getElementById('options-container');
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      
      currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.innerHTML = `
          <span class="option-letter">${option.letter}</span>
          <span class="option-text">${option.text}</span>
        `;
        
        // Add click handler
        button.addEventListener('click', () => {
          console.log(`🖱️ Option ${option.letter} clicked: ${option.text} (${option.points} points)`);
          selectAnswer(option);
        });
        
        // Ensure button is clickable
        button.style.pointerEvents = 'auto';
        button.style.cursor = 'pointer';
        
        optionsContainer.appendChild(button);
      });
      
      console.log(`📋 Displayed question ${gameState.currentQuestionIndex + 1}: ${currentQuestion.question}`);
    }
  }
}

// Answer selection function
function selectAnswer(selectedOption) {
  console.log(`🎯 Answer selected: ${selectedOption.text} (${selectedOption.points} points)`);
  
  // Disable all buttons
  const optionButtons = document.querySelectorAll('.option-button');
  optionButtons.forEach(btn => {
    btn.disabled = true;
    btn.style.opacity = '0.6';
  });
  
  // Add score
  gameState.score += selectedOption.points;
  console.log(`💰 Score updated: ${gameState.score} total points`);
  
  // Update score display
  const scoreDisplay = document.getElementById('current-score');
  if (scoreDisplay) {
    scoreDisplay.textContent = gameState.score;
  }
  
  // Highlight selected answer
  const selectedButton = Array.from(optionButtons).find(btn => 
    btn.querySelector('.option-text').textContent === selectedOption.text
  );
  if (selectedButton) {
    selectedButton.classList.add('selected');
    selectedButton.style.opacity = '1';
    
    // Show points earned
    const pointsDisplay = document.createElement('div');
    pointsDisplay.className = 'points-display';
    pointsDisplay.textContent = `+${selectedOption.points} POINTS!`;
    selectedButton.appendChild(pointsDisplay);
  }
  
  // Success sound removed - keeping only gameshow.aif background
  
  // Show insight and progress to next question
  setTimeout(() => {
    showInsight(selectedOption);
  }, 1500);
}

function showInsight(selectedOption) {
  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
  const questionArea = document.querySelector('.question-area');
  
  if (questionArea && currentQuestion.insight) {
    const insight = document.createElement('div');
    insight.className = 'insight';
    insight.textContent = currentQuestion.insight;
    questionArea.appendChild(insight);
    
    setTimeout(() => {
      if (insight && insight.parentNode) {
        insight.parentNode.removeChild(insight);
      }
      
      // Move to next question or show final results
      gameState.currentQuestionIndex++;
      
      if (gameState.currentQuestionIndex < gameState.questions.length) {
        console.log(`📚 Moving to question ${gameState.currentQuestionIndex + 1}`);
        displayQuestion();
      } else {
        console.log(`🏁 Game complete! Final score: ${gameState.score}`);
        showFinalResults();
      }
    }, 2500);
  }
}

function showFinalResults() {
  showScreen('final-results');
  
  // Calculate performance level
  const performanceLevels = [
    {
      threshold: 85,
      title: "Philosophical Collaborator",
      message: "Extraordinary. You understand Kayron's meta-awareness and systemic thinking. You see meaning beneath surfaces and value ideas over ego. You're ready for concept-first collaboration.",
      skills: ["Systemic Thinking", "Meta-Awareness", "Concept-First Mindset", "Emotional Architecture"]
    },
    {
      threshold: 70,
      title: "Meaning Maker",
      message: "Impressive. You grasp Kayron's approach to taste cultivation and multimodal creation. You understand that true work carries emotional weight and moral purpose.",
      skills: ["Taste Literacy", "Pattern Recognition", "Cross-Medium Thinking", "Intentional Creation"]
    },
    {
      threshold: 50,
      title: "Cultural Intuitive",
      message: "Solid understanding. You recognize Kayron's preference for substance over surface. You're beginning to see how he approaches creation as obligation, not luxury.",
      skills: ["Cultural Awareness", "Depth Recognition", "Quality Appreciation"]
    },
    {
      threshold: 0,
      title: "Surface Explorer",
      message: "You're engaging with Kayron's work, but there are deeper layers to discover. His approach transcends typical creative practice—keep exploring the philosophy beneath.",
      skills: ["Curiosity", "Aesthetic Appreciation", "Creative Interest"]
    }
  ];
  
  const performanceLevel = performanceLevels.find(level => 
    gameState.score >= level.threshold
  ) || performanceLevels[performanceLevels.length - 1];
  
  // Update final score
  const finalScoreElement = document.getElementById('final-score');
  if (finalScoreElement) {
    finalScoreElement.textContent = gameState.score;
  }
  
  // Update performance details
  const resultsDisplay = document.getElementById('performance-details');
  if (resultsDisplay) {
    resultsDisplay.innerHTML = `
      <h4>${performanceLevel.title}</h4>
      <p>${performanceLevel.message}</p>
      <div class="skills-earned">
        <h5>Skills Demonstrated:</h5>
        <div class="skill-list">
          ${performanceLevel.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
      </div>
    `;
  }
  
  console.log(`🏆 Final Results: ${gameState.score} points - ${performanceLevel.title}`);
}

function resetGame() {
  console.log('🔄 Resetting gameshow...');
  
  // Reset game state
  gameState = {
    score: 0,
    currentQuestionIndex: 0,
    questions: gameState.questions // Keep the same questions
  };
  
  // Update score display
  const scoreDisplay = document.getElementById('current-score');
  if (scoreDisplay) {
    scoreDisplay.textContent = '0';
  }
  
  // Show host intro
  showScreen('host-intro');
}

// Individual sound effects removed - using only gameshow.aif background audio

// Global functions for testing and manual triggering
window.startGameshow = function() {
  console.log('🎯 Manual gameshow start triggered');
  startGame();
};

window.testGameshowButton = function() {
  const btn = document.getElementById('start-game-button');
  console.log('🔍 Button test:', btn ? 'found' : 'not found');
  if (btn) {
    console.log('Button styles:', {
      display: btn.style.display,
      visibility: btn.style.visibility,
      opacity: btn.style.opacity,
      pointerEvents: btn.style.pointerEvents
    });
  }
};

// Audio control based on channel visibility
window.controlGameshowAudio = function(isVisible) {
  if (isVisible) {
    console.log('🔊 Channel 4 is visible - opening curtains and starting audio');
    
    // Open curtains when channel becomes visible
    openCurtains();
    
    // Start audio
    if (window.gameshowAudio) {
      window.gameshowAudio.play().catch(err => {
        console.log('Gameshow audio play failed:', err);
      });
    }
  } else {
    console.log('🔇 Stopping gameshow audio');
    if (window.gameshowAudio) {
      window.gameshowAudio.pause();
      window.gameshowAudio.currentTime = 0;
    }
  }
};

// Listen for channel change events to stop audio
document.addEventListener('channelChange', () => {
  console.log('📺 Channel change detected, stopping gameshow audio');
  if (window.gameshowAudio) {
    window.gameshowAudio.pause();
    window.gameshowAudio.currentTime = 0;
  }
});

// Cleanup function for when leaving channel
window.cleanupGameshow = function() {
  if (window.gameshowAudio) {
    window.gameshowAudio.pause();
    window.gameshowAudio.currentTime = 0;
  }
};