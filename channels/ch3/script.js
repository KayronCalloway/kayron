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
 * @property {Set} revealedAnswers - Set of revealed answers
 * @property {boolean} isGameActive - Whether game is in progress
 */

/**
 * @typedef {Object} GameConfig
 * @property {number} rounds - Total number of rounds
 * @property {number} timePerRound - Time per round in seconds
 * @property {number} questionsPerRound - Questions per round
 * @property {number} revealDelay - Delay for answer reveals in ms
 * @property {number} commercialBreakDuration - Duration of breaks in ms
 * @property {number} inputDebounceTime - Debounce time for input in ms
 */

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
  showTitle: "Innovation Insights Challenge",
  hostIntro: "Welcome to Innovation Insights! I'm Kayron Calloway, a Creative Director and Strategic Innovator who believes in the transformative power of design thinking and human-centered experiences. Today, we're exploring how creativity, technology, and user experience shape the future of innovation. Ready to challenge conventional thinking?",
  
  categories: [
    "Design Innovation",
    "User Experience",
    "Creative Strategy",
    "Brand Storytelling",
    "Future Vision"
  ],

  questions: [
    {
      category: "Design Innovation",
      text: "What's the most crucial element in revolutionary product design?",
      answers: [
        { text: "Human Connection", points: 35, insight: "Design that resonates emotionally" },
        { text: "Simplicity", points: 25, insight: "Reducing complexity to essence" },
        { text: "Craftsmanship", points: 20, insight: "Attention to every detail" },
        { text: "Innovation", points: 15, insight: "Breaking new ground" },
        { text: "Sustainability", points: 5, insight: "Future-conscious design" }
      ]
    },
    {
      category: "User Experience",
      text: "What defines an exceptional user experience?",
      answers: [
        { text: "Emotional Impact", points: 40, insight: "Creating lasting connections" },
        { text: "Intuitive Design", points: 30, insight: "Natural interaction" },
        { text: "Accessibility", points: 15, insight: "Universal usability" },
        { text: "Performance", points: 10, insight: "Seamless operation" },
        { text: "Delight", points: 5, insight: "Unexpected joy" }
      ]
    },
    {
      category: "Creative Strategy",
      text: "Key to transforming user behavior through design?",
      answers: [
        { text: "Empathy", points: 35, insight: "Understanding human needs" },
        { text: "Innovation", points: 25, insight: "Reimagining possibilities" },
        { text: "Integration", points: 20, insight: "Seamless ecosystem" },
        { text: "Education", points: 15, insight: "Guiding discovery" },
        { text: "Feedback", points: 5, insight: "Continuous improvement" }
      ]
    },
    {
      category: "Brand Storytelling",
      text: "Most important aspect of creating memorable brand experiences?",
      answers: [
        { text: "Emotional Resonance", points: 35, insight: "Creating deep connections" },
        { text: "Visual Poetry", points: 25, insight: "Aesthetic impact" },
        { text: "Cultural Impact", points: 20, insight: "Shaping culture" },
        { text: "Authenticity", points: 15, insight: "True to values" },
        { text: "Innovation", points: 5, insight: "Breaking conventions" }
      ]
    },
    {
      category: "Future Vision",
      text: "What will define next-generation user experiences?",
      answers: [
        { text: "Seamless Integration", points: 35, insight: "Natural tech interaction" },
        { text: "Emotional AI", points: 25, insight: "Empathetic technology" },
        { text: "Sustainability", points: 20, insight: "Environmental harmony" },
        { text: "Accessibility", points: 15, insight: "Universal design" },
        { text: "Privacy", points: 5, insight: "User trust" }
      ]
    }
  ],

  performanceLevels: [
    {
      threshold: 85,
      title: "Creative Visionary",
      message: "Your insights demonstrate a profound understanding of how design, emotion, and innovation intersect to create transformative user experiences. You show the ability to think beyond conventional boundaries while maintaining a deep focus on human connection - exactly what's needed to shape the future of technology.",
      skills: ["Design Innovation", "User Experience", "Creative Leadership"]
    },
    {
      threshold: 70,
      title: "Experience Architect",
      message: "You effectively blend creative thinking with user-centered design principles, showing strong potential for crafting experiences that resonate deeply with people while pushing technological boundaries.",
      skills: ["Experience Design", "Creative Strategy", "Innovation"]
    },
    {
      threshold: 50,
      title: "Design Thinker",
      message: "Your understanding of user experience and creative innovation shows promise. You're developing the perspective needed to create meaningful technological experiences.",
      skills: ["Design Thinking", "User Empathy", "Creative Development"]
    }
  ],

  commercialBreaks: [
    {
      title: "Experience Innovation",
      content: "As Creative Director at Coloring with Gray, I revolutionized the fragrance experience through 'Reflections of You' - a product that adapts to each user's unique chemistry, demonstrating how technology and creativity can create deeply personal connections.",
      duration: 5000
    },
    {
      title: "Design Impact",
      content: "My approach combines emotional intelligence with innovative technology, creating experiences that don't just serve users - they inspire them. Every project starts with one question: How can we make technology more human?",
      duration: 5000
    }
  ],
  
  interstitials: [
    {
      title: "Design Philosophy",
      content: "Great design isn't just about aesthetics - it's about creating experiences that enhance people's lives in meaningful ways.",
      duration: 3000
    },
    {
      title: "Innovation Perspective",
      content: "The best innovations happen when we focus on the human element first, then let technology serve that vision.",
      duration: 3000
    }
  ]
};

// Sound Manager
class SoundManager {
  constructor() {
    this.sounds = {
      click: new Audio('sounds/click.mp3'),
      correct: new Audio('sounds/correct.mp3'),
      incorrect: new Audio('sounds/incorrect.mp3'),
      success: new Audio('sounds/success.mp3'),
      background: new Audio('sounds/background.mp3'),
      transition: new Audio('sounds/transition.mp3')
    };
    
    // Configure background music
    this.sounds.background.loop = true;
    this.sounds.background.volume = 0.3;
    
    // Initialize mute state
    this.muted = localStorage.getItem('gameSoundMuted') === 'true';
    this.updateMuteState();
    
    // Add mute toggle button
    this.addMuteButton();
  }
  
  play(soundName) {
    if (!this.muted && this.sounds[soundName]) {
      // Stop and reset the sound before playing
      this.sounds[soundName].currentTime = 0;
      this.sounds[soundName].play().catch(e => console.log('Sound play prevented:', e));
    }
  }
  
  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('gameSoundMuted', this.muted);
    this.updateMuteState();
  }
  
  updateMuteState() {
    Object.values(this.sounds).forEach(sound => {
      sound.muted = this.muted;
    });
    
    // Update mute button icon
    const muteButton = document.getElementById('muteButton');
    if (muteButton) {
      muteButton.innerHTML = this.muted ? '🔇' : '🔊';
    }
  }
  
  addMuteButton() {
    const muteButton = document.createElement('button');
    muteButton.id = 'muteButton';
    muteButton.className = 'mute-button';
    muteButton.innerHTML = this.muted ? '🔇' : '🔊';
    muteButton.addEventListener('click', () => {
      this.toggleMute();
      soundManager.play('click');
    });
    document.body.appendChild(muteButton);
  }
}

// Initialize sound manager
const soundManager = new SoundManager();

// Enhanced Animation Manager
class AnimationManager {
  static async animateTransition(element, animation) {
    return new Promise(resolve => {
      element.style.animation = animation;
      element.addEventListener('animationend', () => {
        element.style.animation = '';
        resolve();
      }, { once: true });
    });
  }
  
  static async showElement(element) {
    element.style.display = 'block';
    await this.animateTransition(element, 'fadeIn 0.5s ease-out');
  }
  
  static async hideElement(element) {
    await this.animateTransition(element, 'fadeOut 0.5s ease-in');
    element.style.display = 'none';
  }
  
  static async celebrate() {
    const container = document.createElement('div');
    container.className = 'celebration-container';
    document.body.appendChild(container);
    
    // Create particles
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'celebration-particle';
      particle.style.setProperty('--delay', `${Math.random() * 2}s`);
      particle.style.setProperty('--x-end', `${-50 + Math.random() * 100}vw`);
      container.appendChild(particle);
    }
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    container.remove();
  }
}

// Leaderboard System
class LeaderboardManager {
  constructor() {
    this.leaderboard = JSON.parse(localStorage.getItem('gameLeaderboard')) || [];
  }
  
  addScore(score, difficulty) {
    const entry = {
      score,
      difficulty,
      date: new Date().toISOString(),
      timestamp: Date.now()
    };
    
    this.leaderboard.push(entry);
    this.leaderboard.sort((a, b) => b.score - a.score);
    this.leaderboard = this.leaderboard.slice(0, 10); // Keep top 10
    
    localStorage.setItem('gameLeaderboard', JSON.stringify(this.leaderboard));
    return this.getScoreRank(score);
  }
  
  getScoreRank(score) {
    return this.leaderboard.findIndex(entry => entry.score === score) + 1;
  }
  
  getTopScores(difficulty = null) {
    return this.leaderboard
      .filter(entry => !difficulty || entry.difficulty === difficulty)
      .slice(0, 10);
  }
  
  displayLeaderboard(container) {
    const difficultyFilter = document.createElement('select');
    difficultyFilter.innerHTML = `
      <option value="">All Difficulties</option>
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
    `;
    
    difficultyFilter.addEventListener('change', (e) => {
      this.updateLeaderboardDisplay(container, e.target.value);
    });
    
    container.innerHTML = '<h2>Top Scores</h2>';
    container.appendChild(difficultyFilter);
    
    this.updateLeaderboardDisplay(container);
  }
  
  updateLeaderboardDisplay(container, difficulty = null) {
    const scores = this.getTopScores(difficulty);
    const table = document.createElement('table');
    table.className = 'leaderboard-table';
    
    table.innerHTML = `
      <thead>
        <tr>
          <th>Rank</th>
          <th>Score</th>
          <th>Difficulty</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${scores.map((entry, index) => `
          <tr>
            <td>#${index + 1}</td>
            <td>${entry.score}</td>
            <td>${entry.difficulty}</td>
            <td>${new Date(entry.date).toLocaleDateString()}</td>
          </tr>
        `).join('')}
      </tbody>
    `;
    
    const existingTable = container.querySelector('table');
    if (existingTable) {
      container.replaceChild(table, existingTable);
    } else {
      container.appendChild(table);
    }
  }
}

// Difficulty System
const DifficultySettings = {
  easy: {
    timeLimit: 30,
    pointMultiplier: 1,
    hintAllowed: true
  },
  medium: {
    timeLimit: 20,
    pointMultiplier: 1.5,
    hintAllowed: false
  },
  hard: {
    timeLimit: 15,
    pointMultiplier: 2,
    hintAllowed: false
  }
};

// Initialize managers
const leaderboardManager = new LeaderboardManager();

// Game Module
const GameShow = (function() {
  /** @type {GameConfig} */
  const config = {
    rounds: 2,
    timePerRound: 30,
    questionsPerRound: 5,
    revealDelay: 500,
    commercialBreakDuration: 5000,
    inputDebounceTime: 300,
    difficulty: 'medium', // default difficulty
  };

  /** @type {GameState} */
  let gameState = null;
  let elements = null;
  let timer = null;
  let inputTimer = null;

  /**
   * Cache DOM elements and set up accessibility attributes
   * @private
   */
  function cacheElements() {
    elements = {
      screens: {
        title: document.getElementById('title-screen'),
        hostIntro: document.getElementById('hostIntro'),
        fastMoney: document.getElementById('fast-money'),
        commercial: document.getElementById('commercial-break'),
        results: document.getElementById('final-results')
      },
      buttons: {
        startShow: document.getElementById('startShowBtn'),
        startGame: document.getElementById('startGameBtn'),
        playAgain: document.getElementById('playAgainBtn')
      },
      game: {
        questionDisplay: document.getElementById('question-display'),
        answerInput: document.getElementById('answer-input'),
        timer: document.getElementById('timer'),
        timerBar: document.getElementById('timer-bar'),
        currentScore: document.getElementById('current-score'),
        roundNumber: document.getElementById('roundNumber'),
        answerBoard: document.getElementById('answer-board'),
        answersContainer: document.querySelector('.answers-container'),
        previousAnswers: document.getElementById('previous-answers')
      }
    };

    // Set up accessibility attributes
    setupAccessibility();
  }

  /**
   * Set up accessibility attributes and keyboard navigation
   * @private
   */
  function setupAccessibility() {
    // Add ARIA labels
    elements.game.questionDisplay.setAttribute('aria-live', 'polite');
    elements.game.timer.setAttribute('aria-label', i18n.t('timeRemaining'));
    elements.game.answerInput.setAttribute('aria-label', i18n.t('enterAnswer'));
    
    // Add keyboard navigation
    elements.game.answerInput.addEventListener('keydown', handleKeyboardNavigation);
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event - Keyboard event
   * @private
   */
  function handleKeyboardNavigation(event) {
    if (event.key === 'Tab') {
      const focusableElements = document.querySelectorAll('button, input, [tabindex="0"]');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  // Private variables and methods
  const config = {
    rounds: 2,
    timePerRound: 30,
    questionsPerRound: 5,
    revealDelay: 500,
    commercialBreakDuration: 5000,
    inputDebounceTime: 300,
    difficulty: 'medium', // default difficulty
  };

  let gameState = null;
  let elements = null;
  let timer = null;
  let inputTimer = null;

  // Cache DOM elements once
  function cacheElements() {
    elements = {
      screens: {
        title: document.getElementById('title-screen'),
        hostIntro: document.getElementById('hostIntro'),
        fastMoney: document.getElementById('fast-money'),
        commercial: document.getElementById('commercial-break'),
        results: document.getElementById('final-results')
      },
      buttons: {
        startShow: document.getElementById('startShowBtn'),
        startGame: document.getElementById('startGameBtn'),
        playAgain: document.getElementById('playAgainBtn')
      },
      game: {
        questionDisplay: document.getElementById('question-display'),
        answerInput: document.getElementById('answer-input'),
        timer: document.getElementById('timer'),
        timerBar: document.getElementById('timer-bar'),
        currentScore: document.getElementById('current-score'),
        roundNumber: document.getElementById('roundNumber'),
        answerBoard: document.getElementById('answer-board'),
        answersContainer: document.querySelector('.answers-container'),
        previousAnswers: document.getElementById('previous-answers')
      }
    };
  }

  // Initialize game state
  function initGameState() {
    gameState = {
      currentScreen: 'title',
      round: 1,
      score: 0,
      timeLeft: config.timePerRound,
      currentQuestionIndex: 0,
      answers: [],
      revealedAnswers: new Set(),
      isGameActive: false
    };
  }

  // Event handler setup with proper cleanup
  function setupEventListeners() {
    const handlers = {
      startShow: () => transitionToScreen('hostIntro'),
      startGame: () => transitionToScreen('fastMoney'),
      playAgain: resetGame,
      submitAnswer: handleAnswerSubmit
    };

    elements.buttons.startShow.addEventListener('click', handlers.startShow);
    elements.buttons.startGame.addEventListener('click', handlers.startGame);
    elements.buttons.playAgain.addEventListener('click', handlers.playAgain);
    elements.game.answerInput.addEventListener('keypress', debounce(handlers.submitAnswer, config.inputDebounceTime));

    // Return cleanup function
    return () => {
      elements.buttons.startShow.removeEventListener('click', handlers.startShow);
      elements.buttons.startGame.removeEventListener('click', handlers.startGame);
      elements.buttons.playAgain.removeEventListener('click', handlers.playAgain);
      elements.game.answerInput.removeEventListener('keypress', handlers.submitAnswer);
    };
  }

  // Debounce utility function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Screen transition with animations
  async function transitionToScreen(screenName) {
    if (!elements.screens[screenName]) return;

    const currentScreen = elements.screens[gameState.currentScreen];
    const nextScreen = elements.screens[screenName];

    currentScreen.classList.add('fade-out');
    
    setTimeout(() => {
      Object.values(elements.screens).forEach(screen => {
        screen.classList.add('hidden');
      });
      
      nextScreen.classList.remove('hidden');
      nextScreen.classList.add('fade-in');
      
      gameState.currentScreen = screenName;
      
      if (screenName === 'fastMoney') {
        startRound();
      }
    }, 300);
  }

  // Timer management
  function startTimer() {
    if (timer) clearInterval(timer);
    
    const startTime = Date.now();
    const totalTime = config.timePerRound * 1000;

    timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const timeLeft = Math.max(0, totalTime - elapsed);
      
      gameState.timeLeft = Math.ceil(timeLeft / 1000);
      
      // Update UI
      requestAnimationFrame(() => {
        elements.game.timer.textContent = gameState.timeLeft;
        elements.game.timerBar.style.width = `${(timeLeft / totalTime) * 100}%`;
      });

      if (timeLeft <= 0) {
        clearInterval(timer);
        handleRoundEnd();
      }
    }, 100);
  }

  // Round management
  function startRound() {
    gameState.isGameActive = true;
    gameState.timeLeft = config.timePerRound;
    gameState.currentQuestionIndex = (gameState.round - 1) * config.questionsPerRound;
    
    updateUI();
    startTimer();
  }

  // UI updates batched together
  function updateUI() {
    requestAnimationFrame(() => {
      const question = gameContent.questions[gameState.currentQuestionIndex];
      elements.game.questionDisplay.textContent = question.text;
      elements.game.roundNumber.textContent = `ROUND ${gameState.round}`;
      elements.game.currentScore.textContent = gameState.score;
      elements.game.answerInput.value = '';
      elements.game.answerInput.focus();
    });
  }

  // Answer handling with validation
  function handleAnswerSubmit(event) {
    if (event.key !== 'Enter' || !gameState.isGameActive) return;
    
    const answer = elements.game.answerInput.value.trim().toLowerCase();
    if (!answer) return;

    const question = gameContent.questions[gameState.currentQuestionIndex];
    const matchingAnswer = question.answers.find(a => 
      a.text.toLowerCase() === answer && !gameState.revealedAnswers.has(a.text)
    );

    if (matchingAnswer) {
      const points = gameState.round === 2 ? matchingAnswer.points * 2 : matchingAnswer.points;
      gameState.score += points;
      gameState.revealedAnswers.add(matchingAnswer.text);
      
      updateAnswerBoard(matchingAnswer);
    }

    elements.game.answerInput.value = '';
  }

  // Answer board updates optimized
  function updateAnswerBoard(answer) {
    const answerElement = document.createElement('div');
    answerElement.classList.add('answer');
    answerElement.innerHTML = `
      <span class="answer-text">${answer.text}</span>
      <span class="answer-points">${answer.points}</span>
    `;
    
    requestAnimationFrame(() => {
      elements.game.answersContainer.appendChild(answerElement);
      answerElement.classList.add('reveal');
    });
  }

  // Round end handling
  function handleRoundEnd() {
    gameState.isGameActive = false;
    
    if (gameState.round < config.rounds) {
      gameState.round++;
      showCommercialBreak();
    } else {
      showFinalResults();
    }
  }

  // Commercial break handling
  async function showCommercialBreak() {
    soundManager.play('transition');
    await AnimationManager.hideElement(elements.screens.fastMoney);
    await AnimationManager.showElement(elements.screens.commercial);
    
    // Enhanced commercial break animation
    const highlights = document.querySelectorAll('.commercial-highlight');
    for (const highlight of highlights) {
      await AnimationManager.showElement(highlight);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    await AnimationManager.hideElement(elements.screens.commercial);
    await AnimationManager.showElement(elements.screens.fastMoney);
  }

  // Results display
  async function showFinalResults() {
    soundManager.play('success');
    soundManager.sounds.background.pause();
    soundManager.sounds.background.currentTime = 0;
    
    await AnimationManager.hideElement(elements.screens.fastMoney);
    await AnimationManager.showElement(elements.screens.results);
    
    if (gameState.score > 0) {
      await AnimationManager.celebrate();
    }
  }

  // Game reset
  function resetGame() {
    if (timer) clearInterval(timer);
    if (inputTimer) clearTimeout(inputTimer);
    
    // Clear UI
    elements.game.answersContainer.innerHTML = '';
    elements.game.previousAnswers.innerHTML = '';
    
    // Reset game state
    initGameState();
    
    // Start new game directly
    transitionToScreen('hostIntro');
  }

  // Public API
  return {
    init: function() {
      try {
        Analytics.init();
        Analytics.logEvent('Game', 'Initialize');
        
        cacheElements();
        initGameState();
        setupEventListeners();
        addTVEffects();
        
        // Announce game ready for screen readers
        elements.screens.title.setAttribute('aria-label', 'Game Show Ready');
      } catch (error) {
        Analytics.logError('Game initialization failed', error);
        console.error('Failed to initialize game:', error);
      }
    },
    
    /**
     * Reset the game state
     * @public
     */
    reset: resetGame,
    
    /**
     * Set the game language
     * @param {string} locale - Language code
     * @public
     */
    setLanguage: function(locale) {
      if (i18n.translations[locale]) {
        i18n.currentLocale = locale;
        updateUI();
      }
    }
  };
})();

// TV Effects
function addTVEffects() {
  const glitch = document.getElementById('screen-glitch');
  setInterval(() => {
    glitch.style.opacity = Math.random() > 0.95 ? '0.1' : '0';
  }, 100);
}

// Performance message generator
function getPerformanceMessage(score) {
  const performanceLevel = gameContent.performanceLevels.find(level => score >= level.threshold) 
    || gameContent.performanceLevels[gameContent.performanceLevels.length - 1];

  return performanceLevel.message;
}

// Show performance results
function showPerformanceResults(score) {
  const performanceLevel = gameContent.performanceLevels.find(level => score >= level.threshold) 
    || gameContent.performanceLevels[gameContent.performanceLevels.length - 1];

  const resultsContainer = document.getElementById('final-results');
  
  // Create an engaging results display
  const resultsHTML = `
    <div class="results-container">
      <h2 class="performance-title">${performanceLevel.title}</h2>
      <div class="score-display">
        <span class="score-number">${score}</span>
        <span class="score-label">points</span>
      </div>
      <p class="performance-message">${performanceLevel.message}</p>
      <div class="skills-showcase">
        ${performanceLevel.skills.map(skill => `
          <div class="skill-badge">
            <i class="fas fa-star"></i>
            <span>${skill}</span>
          </div>
        `).join('')}
      </div>
      <div class="portfolio-link">
        <p>Want to see more of my work?</p>
        <a href="https://github.com/KayronCalloway" target="_blank">
          Check out my portfolio
        </a>
      </div>
    </div>
  `;

  resultsContainer.innerHTML = resultsHTML;
  
  // Add some flair with animations
  anime({
    targets: '.score-number',
    innerHTML: [0, score],
    round: 1,
    easing: 'easeInOutExpo',
    duration: 2000
  });

  // Stagger the skill badges
  anime({
    targets: '.skill-badge',
    opacity: [0, 1],
    translateY: [20, 0],
    delay: anime.stagger(200)
  });
}

// Initialize game when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", GameShow.init);
} else {
  GameShow.init();
}

// Add difficulty selector to title screen
function initializeDifficultySelector() {
  const selector = document.createElement('div');
  selector.className = 'difficulty-selector';
  selector.innerHTML = `
    <h3>Select Difficulty</h3>
    <div class="difficulty-buttons">
      <button data-difficulty="easy">Easy</button>
      <button data-difficulty="medium">Medium</button>
      <button data-difficulty="hard">Hard</button>
    </div>
  `;
  
  selector.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      selector.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      GameShow.difficulty = button.dataset.difficulty;
    });
  });
  
  document.getElementById('title-screen').appendChild(selector);
}

// Update endGame function
async function endGame() {
  soundManager.play('success');
  soundManager.sounds.background.pause();
  soundManager.sounds.background.currentTime = 0;
  
  const finalScore = Math.round(GameShow.score * GameShow.difficultyMultiplier);
  const rank = leaderboardManager.addScore(finalScore, GameShow.difficulty);
  
  await AnimationManager.hideElement(document.getElementById('game-screen'));
  await AnimationManager.showElement(document.getElementById('results-screen'));
  
  // Update results display
  const resultsContainer = document.getElementById('results-screen');
  resultsContainer.querySelector('.score-display').textContent = finalScore;
  
  if (rank <= 3) {
    await AnimationManager.celebrate();
    resultsContainer.querySelector('.performance-title').textContent = 'New High Score!';
  }
  
  // Show leaderboard
  const leaderboardContainer = document.createElement('div');
  leaderboardContainer.className = 'leaderboard-container';
  resultsContainer.appendChild(leaderboardContainer);
  leaderboardManager.displayLeaderboard(leaderboardContainer);
}

// Initialize difficulty selector when game loads
document.addEventListener('DOMContentLoaded', () => {
  initializeDifficultySelector();
});
