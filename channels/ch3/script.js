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
  showTitle: "Get To Know Kayron!",
  hostIntro: "Welcome to 'Get To Know Kayron!' - I'm your host and the star of the show! We've surveyed people who know me well, let's see how well you know me!",
  
  questions: [
    {
      question: "What do people say is my biggest strength as a Creative Director?",
      options: [
        { letter: "A", text: "Design Thinking", points: 35 },
        { letter: "B", text: "Team Leadership", points: 25 },
        { letter: "C", text: "Problem Solving", points: 15 },
        { letter: "D", text: "Communication", points: 5 }
      ],
      insight: "Design thinking is at the core of how I approach every creative challenge!"
    },
    {
      question: "Name something I'm passionate about outside of work",
      options: [
        { letter: "A", text: "Photography", points: 40 },
        { letter: "B", text: "Music", points: 25 },
        { letter: "C", text: "Travel", points: 15 },
        { letter: "D", text: "Fashion", points: 5 }
      ],
      insight: "Photography helps me see the world through a different lens!"
    },
    {
      question: "What's my favorite type of project to work on?",
      options: [
        { letter: "A", text: "Brand Identity", points: 35 },
        { letter: "B", text: "User Experience", points: 25 },
        { letter: "C", text: "Digital Innovation", points: 15 },
        { letter: "D", text: "Interactive Design", points: 5 }
      ],
      insight: "I love creating unique brand identities that tell compelling stories!"
    },
    {
      question: "What's my go-to software for creative work?",
      options: [
        { letter: "A", text: "Adobe Suite", points: 35 },
        { letter: "B", text: "Figma", points: 25 },
        { letter: "C", text: "Sketch", points: 15 },
        { letter: "D", text: "Procreate", points: 5 }
      ],
      insight: "Adobe Suite has been my trusted companion throughout my creative journey!"
    },
    {
      question: "What do my colleagues appreciate most about working with me?",
      options: [
        { letter: "A", text: "Creative Vision", points: 35 },
        { letter: "B", text: "Mentorship", points: 25 },
        { letter: "C", text: "Innovation", points: 15 },
        { letter: "D", text: "Reliability", points: 5 }
      ],
      insight: "I believe in fostering creativity and growth in every team member!"
    }
  ],
  
  performanceLevels: [
    {
      threshold: 300,
      title: "My Best Friend!",
      message: "Wow, you really know me well! We must have worked together or you've been following my journey closely!",
      skills: ["Creative Vision", "Leadership Style", "Personal Interests"]
    },
    {
      threshold: 200,
      title: "Close Colleague!",
      message: "Great job! You have a solid understanding of who I am and what I do!",
      skills: ["Work Style", "Creative Process", "Professional Goals"]
    },
    {
      threshold: 100,
      title: "New Friend!",
      message: "You're getting to know me! Keep learning about my journey in creative leadership!",
      skills: ["Basic Background", "Career Highlights", "Creative Approach"]
    }
  ]
};

// Game Module
const GameShow = (function() {
  const config = {
    revealDelay: 800,
    answerRevealTime: 1500,
    maxStrikes: 3
  };

  let gameState = {
    currentScreen: 'game',
    score: 0,
    currentQuestion: null,
    strikes: 0,
    timerId: null
  };

  let elements = {};

  function init() {
    // Initialize DOM elements
    elements = {
      screens: {
        game: document.getElementById('game-screen'),
        results: document.getElementById('results-screen')
      },
      game: {
        questionText: document.querySelector('.question-text'),
        optionsContainer: document.querySelector('.options-container'),
        scoreDisplay: document.querySelector('.score-display')
      }
    };

    // Start the game only after elements are initialized
    if (elements.screens.game && elements.game.questionText && elements.game.optionsContainer) {
      resetGame();
      startGame();
    } else {
      console.error('Required game elements not found in DOM');
    }
  }

  function startGame() {
    // Reset game state
    gameState = {
      currentScreen: 'game',
      score: 0,
      currentQuestion: null,
      strikes: 0,
      timerId: null
    };
    
    // Update display and show first question
    updateScoreDisplay();
    showNextQuestion();
    
    // Show game screen
    Object.values(elements.screens).forEach(screen => screen.classList.add('hidden'));
    elements.screens.game.classList.remove('hidden');
  }

  function showNextQuestion() {
    if (gameState.strikes >= config.maxStrikes) {
      endGame();
      return;
    }

    // Initialize playedQuestions if it doesn't exist
    if (!gameState.playedQuestions) {
      gameState.playedQuestions = new Set();
    }

    const availableQuestions = gameContent.questions.filter(q => 
      !gameState.playedQuestions.has(q)
    );

    if (availableQuestions.length === 0) {
      endGame();
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    gameState.currentQuestion = availableQuestions[randomIndex];
    gameState.playedQuestions.add(gameState.currentQuestion);
    
    // Update DOM with new question
    elements.game.questionText.textContent = gameState.currentQuestion.question;
    elements.game.optionsContainer.innerHTML = '';
    
    // Create multiple choice buttons
    gameState.currentQuestion.options.forEach(option => {
      const button = document.createElement('button');
      button.className = 'option-button';
      button.innerHTML = `
        <span class="option-letter">${option.letter}</span>
        <span class="option-text">${option.text}</span>
      `;
      button.onclick = () => selectAnswer(option);
      elements.game.optionsContainer.appendChild(button);
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
    
    selectedButton.classList.add('selected');
    const pointsDisplay = document.createElement('div');
    pointsDisplay.className = 'points-display';
    pointsDisplay.textContent = `${points} POINTS!`;
    selectedButton.appendChild(pointsDisplay);
    
    soundManager.play(points > 15 ? 'correct' : 'incorrect');
    if (points > 15) AnimationManager.celebrate();
    
    // Show insight and move to next question
    setTimeout(() => {
      const insight = document.createElement('div');
      insight.className = 'insight';
      insight.textContent = gameState.currentQuestion.insight;
      document.querySelector('.question-container').appendChild(insight);
      
      setTimeout(() => {
        if (document.querySelector('.insight')) {
          document.querySelector('.insight').remove();
        }
        gameState.currentQuestion = null;
        showNextQuestion();
      }, 2000);
    }, 1500);
  }

  function updateScoreDisplay() {
    elements.game.scoreDisplay.textContent = `Score: ${gameState.score}`;
  }

  function endGame() {
    showFinalResults();
  }

  async function showFinalResults() {
    soundManager.play('success');
    soundManager.sounds.background.pause();
    
    const performanceLevel = gameContent.performanceLevels.find(level => 
      gameState.score >= level.threshold
    ) || gameContent.performanceLevels[gameContent.performanceLevels.length - 1];

    await AnimationManager.hideElement(elements.screens.game);
    
    const resultsScreen = elements.screens.results;
    resultsScreen.innerHTML = `
      <h2>${performanceLevel.title}</h2>
      <div class="final-score">Score: ${gameState.score}</div>
      <p>${performanceLevel.message}</p>
      <div class="skills-list">
        ${performanceLevel.skills.map(skill => `<span class="skill-badge">${skill}</span>`).join('')}
      </div>
      <button class="play-again">Play Again</button>
    `;

    await AnimationManager.showElement(resultsScreen);
    
    resultsScreen.querySelector('.play-again').addEventListener('click', () => {
      resetGame();
      startGame();
    });
  }

  function resetGame() {
    gameState = {
      currentScreen: 'game',
      score: 0,
      currentQuestion: null,
      strikes: 0,
      timerId: null
    };
    updateScoreDisplay();
  }

  return {
    init,
    config,
    gameState
  };
})();

// Initialize game when channel loads
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameShow;
} else {
  GameShow.init();
}
