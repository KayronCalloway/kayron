/**
 * @fileoverview Game Show Module - An interactive TV-style game show experience
 * @author Kayron Calloway
 * @version 1.0.0
 */

/**
 * @typedef {Object} GameState
 * @property {string} currentScreen - Current visible screen
 * @property {number} round - Current game round
 * @property {number} score - Player's current score
 * @property {number} timeLeft - Remaining time in seconds
 * @property {number} currentQuestionIndex - Index of current question
 * @property {Array} answers - Player's submitted answers
 * @property {Set} playedQuestions - Set of played questions
 * @property {boolean} isGameActive - Whether game is in progress
 */

// Sound Manager
const soundManager = {
  sounds: {
    correct: new Audio('./audio/ka-ching.mp3'),
    incorrect: new Audio('./audio/click.mp3'),
    success: new Audio('./audio/whoosh.mp3'),
    background: new Audio('./audio/ticker-hum.mp3'),
    gameshow: new Audio('./audio/gameshow.aif')
  },
  
  play(soundId) {
    try {
      const sound = this.sounds[soundId];
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(err => console.warn(`Sound play failed: ${err.message}`));
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }
};

// Animation Manager
const AnimationManager = {
  celebrate() {
    const container = document.createElement('div');
    container.className = 'celebration-container';
    document.body.appendChild(container);
    
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'celebration-particle';
      particle.style.setProperty('--delay', `${Math.random() * 0.5}s`);
      particle.style.left = `${Math.random() * 100}%`;
      container.appendChild(particle);
    }
    
    setTimeout(() => container.remove(), 3000);
  },
  
  async showElement(element) {
    element.classList.remove('hidden');
    return new Promise(resolve => setTimeout(resolve, 300));
  },
  
  async hideElement(element) {
    element.classList.add('hidden');
    return new Promise(resolve => setTimeout(resolve, 300));
  }
};

// Analytics Setup
const Analytics = {
  init() {
    this.events = [];
    window.onerror = this.logError.bind(this);
  },
  
  /**
   * @param {string} category - Event category
   * @param {string} action - Event action
   * @param {Object} data - Event data
   */
  logEvent(category, action, data = {}) {
    const event = {
      timestamp: new Date().toISOString(),
      category,
      action,
      data
    };
    this.events.push(event);
    // In production, send to analytics service
    console.log('Analytics Event:', event);
  },

  /**
   * @param {string} message - Error message
   * @param {string} source - Error source
   * @param {number} lineno - Line number
   * @param {number} colno - Column number
   * @param {Error} error - Error object
   */
  logError(message, source, lineno, colno, error) {
    this.logEvent('Error', 'UnhandledError', {
      message,
      source,
      lineno,
      colno,
      stack: error?.stack
    });
    return false;
  }
};

// Internationalization Support
const i18n = {
  currentLocale: 'en',
  translations: {
    en: {
      roundLabel: 'ROUND',
      startShow: 'Start Show',
      timeRemaining: 'Time Remaining',
      enterAnswer: 'Enter your answer...',
      finalScore: 'Final Score',
      excellence: 'Executive Excellence',
      proficiency: 'Professional Proficiency',
      potential: 'Growing Potential'
    },
    es: {
      roundLabel: 'RONDA',
      startShow: 'Comenzar Show',
      timeRemaining: 'Tiempo Restante',
      enterAnswer: 'Ingrese su respuesta...',
      finalScore: 'Puntuación Final',
      excellence: 'Excelencia Ejecutiva',
      proficiency: 'Competencia Profesional',
      potential: 'Potencial Creciente'
    }
  },
  
  /**
   * @param {string} key - Translation key
   * @returns {string} Translated text
   */
  t(key) {
    return this.translations[this.currentLocale]?.[key] || key;
  }
};

// Game Show Content and Configuration
const gameContent = {
  showTitle: "Get To Know Kayron!",
  hostIntro: "Welcome to 'Get To Know Kayron!' - I'm your host and the star of the show! We've surveyed people who know me well, let's see how well you know me!",
  
  questions: [
    {
      question: "What's Kayron's favorite programming language?",
      options: [
        { letter: "A", text: "JavaScript", points: 20 },
        { letter: "B", text: "Python", points: 10 },
        { letter: "C", text: "Java", points: 5 },
        { letter: "D", text: "C++", points: 5 }
      ],
      insight: "JavaScript is Kayron's go-to language for both frontend and backend development!"
    },
    {
      question: "Which project is Kayron most proud of?",
      options: [
        { letter: "A", text: "AI-powered chatbot", points: 10 },
        { letter: "B", text: "Personal portfolio website", points: 5 },
        { letter: "C", text: "Game development project", points: 15 },
        { letter: "D", text: "Machine learning model", points: 20 }
      ],
      insight: "Kayron's passion for AI and machine learning shines through in his projects!"
    },
    {
      question: "What's Kayron's preferred development environment?",
      options: [
        { letter: "A", text: "VS Code", points: 20 },
        { letter: "B", text: "Sublime Text", points: 5 },
        { letter: "C", text: "IntelliJ IDEA", points: 10 },
        { letter: "D", text: "Vim", points: 15 }
      ],
      insight: "VS Code's extensibility and integrated features make it Kayron's top choice!"
    }
  ],
  performanceLevels: [
    {
      threshold: 50,
      title: "Tech Virtuoso!",
      message: "You really know your stuff! Your understanding of technology and development is impressive.",
      skills: ["Advanced Problem Solving", "Technical Excellence", "Innovation"]
    },
    {
      threshold: 30,
      title: "Rising Star!",
      message: "Great job! You've shown a solid grasp of development concepts.",
      skills: ["Problem Solving", "Technical Knowledge", "Quick Learning"]
    },
    {
      threshold: 0,
      title: "Tech Explorer!",
      message: "Good start! Keep exploring and learning about technology.",
      skills: ["Curiosity", "Determination", "Growth Mindset"]
    }
  ]
};

// Game Module
window.GameShow = (function() {
  const config = {
    revealDelay: 800,
    answerRevealTime: 1500,
    maxStrikes: 3
  };

  let gameState = {
    currentScreen: 'host-intro',
    score: 0,
    currentQuestion: null,
    strikes: 0,
    timerId: null,
    playedQuestions: new Set()
  };

  let elements = {};

  function init() {
    // Setup game container
    const container = document.getElementById('game-show-container');
    if (!container) {
      console.error('Game container not found');
      return;
    }
    
    // Initialize DOM elements
    elements = {
      screens: {
        hostIntro: document.getElementById('host-intro'),
        gameRound: document.getElementById('game-round'), // Changed from fast-money to game-round
        commercial: document.getElementById('commercial-break'),
        results: document.getElementById('final-results')
      },
      game: {
        questionDisplay: document.getElementById('question-display'),
        optionsContainer: document.getElementById('options-container') || document.createElement('div'),
        scoreDisplay: document.getElementById('current-score'),
        roundDisplay: document.getElementById('round-number'),
        timerDisplay: document.getElementById('timer'),
        timerBar: document.getElementById('timer-bar')
      }
    };

    // Create options container
    elements.game.optionsContainer.className = 'options-container';
    const questionArea = document.querySelector('.question-area');
    if (questionArea) {
      questionArea.appendChild(elements.game.optionsContainer);
    }

    // Setup event listeners
    const playAgainBtn = document.getElementById('play-again-btn');
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', resetGame);
    }
    
    const startGameBtn = document.getElementById('start-game-button');
    if (startGameBtn) {
      startGameBtn.addEventListener('click', () => {
        startGame();
      });
    }
    
    // Start background sound with error handling
    try {
      soundManager.sounds.background.loop = true;
      soundManager.sounds.background.volume = 0.3;
      soundManager.play('background');
    } catch (error) {
      console.warn('Could not play background sound:', error);
    }

    // Initialize timer
    initializeTimer();
    
    // Show host intro - user will manually start game
    showScreen('host-intro');
    
    // Initialize analytics
    Analytics.init();
    Analytics.logEvent('Game', 'Initialize');
  }
  
  // Initialize and setup timer functionality
  function initializeTimer() {
    if (elements.game.timerDisplay && elements.game.timerBar) {
      // Initialize timer state
      gameState.timeLeft = 30; // Default 30 seconds
      elements.game.timerDisplay.textContent = gameState.timeLeft;
      
      // Reset any existing timer
      if (gameState.timerId) {
        clearInterval(gameState.timerId);
        gameState.timerId = null;
      }
    }
  }
  
  // Start the timer counting down
  function startTimer() {
    if (!elements.game.timerDisplay || !elements.game.timerBar) return;
    
    // Reset timer display
    gameState.timeLeft = 30;
    elements.game.timerDisplay.textContent = gameState.timeLeft;
    elements.game.timerBar.style.width = '100%';
    
    // Clear any existing timer
    if (gameState.timerId) {
      clearInterval(gameState.timerId);
    }
    
    // Start new timer
    gameState.timerId = setInterval(() => {
      gameState.timeLeft--;
      
      if (gameState.timeLeft <= 0) {
        clearInterval(gameState.timerId);
        gameState.timeLeft = 0;
        // Time's up logic would go here
      }
      
      // Update UI
      elements.game.timerDisplay.textContent = gameState.timeLeft;
      const percentLeft = (gameState.timeLeft / 30) * 100;
      elements.game.timerBar.style.width = `${percentLeft}%`;
      
    }, 1000);
  }

  function showScreen(screenName) {
    // Hide all screens
    Object.values(elements.screens).forEach(screen => {
      if (screen) screen.classList.add('hidden');
    });
    
    // Handle screen name mapping
    let actualScreenName = screenName;
    if (screenName === 'game-round') {
      actualScreenName = 'gameRound';
    } else if (screenName === 'host-intro') {
      actualScreenName = 'hostIntro';
    } else if (screenName === 'commercial-break') {
      actualScreenName = 'commercial';
    } else if (screenName === 'final-results') {
      actualScreenName = 'results';
    }
    
    // Show requested screen
    if (elements.screens[actualScreenName]) {
      elements.screens[actualScreenName].classList.remove('hidden');
      gameState.currentScreen = screenName;
    }
  }

  function startGame() {
    // Reset game state
    gameState = {
      currentScreen: 'game-round',
      score: 0,
      round: 1,
      currentQuestion: null,
      strikes: 0,
      timerId: null,
      timeLeft: 30,
      playedQuestions: new Set()
    };
    
    // Update display
    updateScoreDisplay();
    updateRoundDisplay();
    
    // Show game screen
    showScreen('game-round');
    
    // Start timer
    startTimer();
    
    // Show first question
    showNextQuestion();
    
    // Populate commercial break skill items dynamically
    populateCommercialSkills();
    
    Analytics.logEvent('Game', 'Start');
  }
  
  // Populate skills in the commercial break dynamically
  function populateCommercialSkills() {
    const skillShowcase = document.querySelector('.skill-showcase');
    if (!skillShowcase) return;
    
    // Clear existing skills
    skillShowcase.innerHTML = '';
    
    // Sample skills to show
    const skills = [
      { name: "Creative Direction", icon: "lightbulb" },
      { name: "Brand Development", icon: "bullseye" },
      { name: "Digital Strategy", icon: "chart-network" }
    ];
    
    // Add skills to showcase
    skills.forEach(skill => {
      const skillItem = document.createElement('div');
      skillItem.className = 'skill-item';
      skillItem.setAttribute('data-skill', skill.name);
      
      skillItem.innerHTML = `
        <i class="fas fa-${skill.icon}"></i>
        <span>${skill.name}</span>
      `;
      
      skillShowcase.appendChild(skillItem);
    });
  }

  function updateScoreDisplay() {
    if (elements.game.scoreDisplay) {
      elements.game.scoreDisplay.textContent = gameState.score;
    }
  }

  function updateRoundDisplay() {
    if (elements.game.roundDisplay) {
      elements.game.roundDisplay.textContent = `ROUND ${gameState.round}`;
    }
  }

  function showNextQuestion() {
    if (gameState.strikes >= config.maxStrikes) {
      endGame();
      return;
    }

    // Filter questions that haven't been played - use proper Set checking
    const availableQuestions = gameContent.questions.filter(question => 
      !gameState.playedQuestions.has(question)
    );

    if (availableQuestions.length === 0) {
      endGame();
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    gameState.currentQuestion = availableQuestions[randomIndex];
    gameState.playedQuestions.add(gameState.currentQuestion);
    
    // Update DOM with new question
    if (elements.game.questionDisplay) {
      elements.game.questionDisplay.textContent = gameState.currentQuestion.question;
    }
    
    if (elements.game.optionsContainer) {
      elements.game.optionsContainer.innerHTML = '';
      
      // Create multiple choice buttons
      gameState.currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.innerHTML = `
          <span class="option-letter">${option.letter}</span>
          <span class="option-text">${option.text}</span>
        `;
        button.addEventListener('click', () => selectAnswer(option));
        elements.game.optionsContainer.appendChild(button);
      });
    }
    
    Analytics.logEvent('Game', 'NewQuestion', { 
      question: gameState.currentQuestion.question,
      round: gameState.round
    });
  }

  function selectAnswer(selectedOption) {
    if (!gameState.currentQuestion) return;
    
    const buttons = document.querySelectorAll('.option-button');
    buttons.forEach(btn => btn.disabled = true);
    
    const points = selectedOption.points;
    gameState.score += points;
    updateScoreDisplay();
    
    // Show points and play sound
    const selectedButton = Array.from(buttons).find(btn => 
      btn.querySelector('.option-text').textContent === selectedOption.text
    );
    
    if (selectedButton) {
      selectedButton.classList.add('selected');
      const pointsDisplay = document.createElement('div');
      pointsDisplay.className = 'points-display';
      pointsDisplay.textContent = `${points} POINTS!`;
      selectedButton.appendChild(pointsDisplay);
    }
    
    soundManager.play(points > 15 ? 'correct' : 'incorrect');
    if (points > 15) AnimationManager.celebrate();
    
    Analytics.logEvent('Game', 'AnswerSelected', {
      question: gameState.currentQuestion.question,
      answer: selectedOption.text,
      points: points
    });
    
    // Show insight and move to next question
    setTimeout(() => {
      const insight = document.createElement('div');
      insight.className = 'insight';
      insight.textContent = gameState.currentQuestion.insight;
      const questionArea = document.querySelector('.question-area');
      if (questionArea) {
        questionArea.appendChild(insight);
      }
      
      setTimeout(() => {
        if (insight && insight.parentNode) {
          insight.parentNode.removeChild(insight);
        }
        
        // Check if we should go to next round
        if (gameState.playedQuestions.size % 3 === 0 && gameState.playedQuestions.size > 0) {
          gameState.round++;
          updateRoundDisplay();
          showCommercialBreak();
        } else {
          gameState.currentQuestion = null;
          showNextQuestion();
        }
      }, 2000);
    }, 1500);
  }

  function showCommercialBreak() {
    showScreen('commercial');
    
    // Update skills for this round
    populateCommercialSkills();
    
    // Pause the timer during commercial break
    if (gameState.timerId) {
      clearInterval(gameState.timerId);
      gameState.timerId = null;
    }
    
    setTimeout(() => {
      showScreen('game-round');
      gameState.currentQuestion = null;
      // Restart timer for next round
      startTimer();
      showNextQuestion();
    }, 4000);
    
    Analytics.logEvent('Game', 'CommercialBreak', { round: gameState.round });
  }

  function endGame() {
    showFinalResults();
    Analytics.logEvent('Game', 'End', { finalScore: gameState.score });
  }

  function showFinalResults() {
    // Stop background sound
    if (soundManager.sounds.background) {
      soundManager.sounds.background.pause();
    }
    
    soundManager.play('success');
    
    // Calculate performance level
    const performanceLevel = gameContent.performanceLevels.find(level => 
      gameState.score >= level.threshold
    ) || gameContent.performanceLevels[gameContent.performanceLevels.length - 1];

    // Update results screen
    const finalScoreElement = document.getElementById('final-score');
    if (finalScoreElement) {
      finalScoreElement.textContent = gameState.score;
    }
    
    const performanceDetails = document.getElementById('performance-details');
    if (performanceDetails) {
      performanceDetails.innerHTML = `
        <h4>${performanceLevel.title}</h4>
        <p>${performanceLevel.message}</p>
      `;
    }
    
    const unlockedSkills = document.getElementById('unlocked-skills');
    if (unlockedSkills) {
      unlockedSkills.innerHTML = performanceLevel.skills.map(skill => 
        `<div class="skill-item">${skill}</div>`
      ).join('');
    }
    
    // Show results screen
    showScreen('final-results');
  }

  function resetGame() {
    gameState = {
      currentScreen: 'host-intro',
      score: 0,
      round: 1,
      currentQuestion: null,
      strikes: 0,
      timerId: null,
      playedQuestions: new Set()
    };
    
    updateScoreDisplay();
    updateRoundDisplay();
    
    // Restart background sound
    if (soundManager.sounds.background) {
      soundManager.sounds.background.currentTime = 0;
      soundManager.play('background');
    }
    
    // Show host intro then start game after delay
    showScreen('host-intro');
    setTimeout(() => {
      startGame();
    }, 3000);
    
    Analytics.logEvent('Game', 'Reset');
  }

  return {
    init,
    config,
    gameState
  };
})();

// GameShow will be initialized manually by ch4.js when the channel loads
