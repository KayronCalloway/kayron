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
  hostIntro: "Welcome to 'Get To Know Kayron!' - I'm your host and the star of the show! We've surveyed people who know me well about various aspects of my life, career, and personality. Can you guess what they said? Let's play!",
  
  questions: [
    {
      question: "What do people say is my biggest strength as a Creative Director?",
      answers: [
        { text: "Design Thinking", points: 35 },
        { text: "Team Leadership", points: 25 },
        { text: "Creative Vision", points: 20 },
        { text: "Problem Solving", points: 15 },
        { text: "Communication", points: 5 }
      ],
      insight: "Design thinking is at the core of how I approach every creative challenge!"
    },
    {
      question: "Name something I'm passionate about outside of work",
      answers: [
        { text: "Photography", points: 40 },
        { text: "Music", points: 25 },
        { text: "Travel", points: 20 },
        { text: "Technology", points: 10 },
        { text: "Fashion", points: 5 }
      ],
      insight: "Photography helps me see the world through a different lens!"
    },
    {
      question: "What's my favorite type of project to work on?",
      answers: [
        { text: "Brand Identity", points: 35 },
        { text: "User Experience", points: 25 },
        { text: "Digital Innovation", points: 20 },
        { text: "Creative Strategy", points: 15 },
        { text: "Interactive Design", points: 5 }
      ],
      insight: "I love creating unique brand identities that tell compelling stories!"
    },
    {
      question: "What's my go-to software for creative work?",
      answers: [
        { text: "Adobe Suite", points: 35 },
        { text: "Figma", points: 25 },
        { text: "Sketch", points: 20 },
        { text: "After Effects", points: 15 },
        { text: "Procreate", points: 5 }
      ],
      insight: "Adobe Suite has been my trusted companion throughout my creative journey!"
    },
    {
      question: "What do my colleagues appreciate most about working with me?",
      answers: [
        { text: "Creative Vision", points: 35 },
        { text: "Mentorship", points: 25 },
        { text: "Collaboration", points: 20 },
        { text: "Innovation", points: 15 },
        { text: "Reliability", points: 5 }
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
    currentScreen: 'hostIntro',
    score: 0,
    currentQuestion: null,
    revealedAnswers: new Set(),
    strikes: 0,
    timerId: null
  };

  let elements = {
    screens: {
      hostIntro: document.getElementById('hostIntro'),
      game: document.getElementById('game-screen'),
      commercial: document.getElementById('commercial-break'),
      results: document.getElementById('results-screen')
    }
  };

  function init() {
    resetGame();
    startGameShow();
  }

  async function startGameShow() {
    soundManager.play('transition');
    await AnimationManager.showElement(elements.screens.hostIntro);
    await new Promise(resolve => setTimeout(resolve, 5000));
    await AnimationManager.hideElement(elements.screens.hostIntro);
    await AnimationManager.showElement(elements.screens.game);
    soundManager.sounds.background.play();
    startGame();
  }

  function startGame() {
    gameState.score = 0;
    gameState.strikes = 0;
    updateScoreDisplay();
    showNextQuestion();
  }

  function showNextQuestion() {
    if (gameState.strikes >= config.maxStrikes) {
      endGame();
      return;
    }

    const availableQuestions = gameContent.questions.filter(q => 
      !gameState.playedQuestions?.includes(q)
    );

    if (availableQuestions.length === 0) {
      endGame();
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    gameState.currentQuestion = availableQuestions[randomIndex];
    gameState.revealedAnswers = new Set();
    
    const questionText = document.querySelector('.question-text');
    const answerBoard = document.querySelector('.answer-board');
    
    questionText.textContent = gameState.currentQuestion.question;
    answerBoard.innerHTML = '';
    
    // Create answer slots
    gameState.currentQuestion.answers.forEach((answer, index) => {
      const slot = document.createElement('div');
      slot.className = 'answer-slot';
      slot.dataset.index = index;
      slot.innerHTML = `
        <span class="number">${index + 1}</span>
        <span class="answer hidden">?????</span>
        <span class="points hidden">??</span>
      `;
      answerBoard.appendChild(slot);
    });

    // Show answer input
    const inputContainer = document.querySelector('.answer-input-container');
    inputContainer.innerHTML = `
      <input type="text" class="answer-input" placeholder="Enter your answer...">
      <button class="submit-answer">Submit</button>
    `;

    const input = inputContainer.querySelector('.answer-input');
    const submit = inputContainer.querySelector('.submit-answer');

    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') submit.click();
    });

    submit.addEventListener('click', () => {
      const answer = input.value.trim().toLowerCase();
      checkAnswer(answer);
      input.value = '';
      input.focus();
    });
  }

  function checkAnswer(userAnswer) {
    const matchingAnswer = gameState.currentQuestion.answers.find(a => 
      a.text.toLowerCase() === userAnswer && !gameState.revealedAnswers.has(a.text)
    );

    if (matchingAnswer) {
      revealAnswer(matchingAnswer);
      gameState.score += matchingAnswer.points;
      updateScoreDisplay();
      soundManager.play('correct');
      AnimationManager.celebrate();
    } else {
      gameState.strikes++;
      updateStrikes();
      soundManager.play('incorrect');
      if (gameState.strikes >= config.maxStrikes) {
        endGame();
      }
    }
  }

  function revealAnswer(answer) {
    const index = gameState.currentQuestion.answers.findIndex(a => a.text === answer.text);
    const slot = document.querySelector(`.answer-slot[data-index="${index}"]`);
    
    gameState.revealedAnswers.add(answer.text);
    
    // Flip animation
    slot.classList.add('flip');
    setTimeout(() => {
      slot.querySelector('.answer').textContent = answer.text;
      slot.querySelector('.points').textContent = answer.points;
      slot.querySelector('.answer').classList.remove('hidden');
      slot.querySelector('.points').classList.remove('hidden');
      slot.classList.remove('flip');
    }, config.revealDelay / 2);
  }

  function updateStrikes() {
    const strikesDisplay = document.querySelector('.strikes-display');
    strikesDisplay.textContent = 'X'.repeat(gameState.strikes);
  }

  function updateScoreDisplay() {
    document.querySelector('.score-display').textContent = `Score: ${gameState.score}`;
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
      startGameShow();
    });
  }

  function resetGame() {
    gameState = {
      currentScreen: 'hostIntro',
      score: 0,
      currentQuestion: null,
      revealedAnswers: new Set(),
      strikes: 0,
      playedQuestions: new Set(),
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
