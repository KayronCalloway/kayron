// channels/ch3/ch3.js
import { loadHTML, loadCSS, dom, sound, errorTracker } from '../../utils.js';

/**
 * Initialize Channel 3's game show
 * @returns {Function} Cleanup function
 */
export async function init() {
  try {
    // Check container
    const container = document.getElementById('section3');
    if (!container) {
      console.error("Channel 3 container not found");
      return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Load the game HTML fragment
    await loadHTML('./channels/ch3/gameshow.html', container);
    
    // Load CSS with cache busting
    await loadCSS('./channels/ch3/styles.css', true);
    
    // Initialize game components and get cleanup function
    const gameManager = new GameShow();
    const cleanupGame = gameManager.init();
    
    // Store the manager globally for debugging
    window.GameShowManager = gameManager;
    
    // Return cleanup function
    return () => {
      if (cleanupGame && typeof cleanupGame === 'function') {
        cleanupGame();
      }
      
      // Remove global reference
      if (window.GameShowManager) {
        delete window.GameShowManager;
      }
      
      console.log('Channel 3 cleanup complete');
    };
  } catch (error) {
    errorTracker.track('Channel3.init', error);
    console.error('Failed to load game show:', error);
    
    // Display error message
    const container = document.getElementById('section3');
    if (container) {
      container.innerHTML = `
        <div class="error">Error loading game show content.</div>
        <div class="channel-number-overlay">CH 03</div>
      `;
    }
  }
}

/**
 * Explicit cleanup function
 */
export function cleanup() {
  // Explicit cleanup if needed
  
  // Stop sounds
  sound.stop('./audio/ticker-hum.mp3');
  sound.stop('./audio/ka-ching.mp3');
  sound.stop('./audio/click.mp3');
  sound.stop('./audio/whoosh.mp3');
  
  // Remove celebration effects if any
  const celebrations = document.querySelectorAll('.celebration-container');
  celebrations.forEach(cel => cel.remove());
}

/**
 * Game Show Class - Manages the interactive game experience
 */
class GameShow {
  constructor() {
    // Game state
    this.state = {
      currentRound: 1,
      score: 0,
      timeLeft: 30,
      currentQuestion: null,
      playedQuestions: new Set(),
      timerInterval: null,
      isGameActive: false
    };
    
    // DOM elements
    this.elements = {};
    
    // Game content - questions, answers, etc.
    this.content = {
      questions: [
        {
          question: "What's Kayron's favorite programming language?",
          options: [
            { text: "JavaScript", points: 20, correct: true },
            { text: "Python", points: 10 },
            { text: "Java", points: 5 },
            { text: "C++", points: 5 }
          ],
          insight: "JavaScript is Kayron's go-to language for both frontend and backend development!"
        },
        {
          question: "Which project is Kayron most proud of?",
          options: [
            { text: "AI-powered chatbot", points: 10 },
            { text: "Personal portfolio website", points: 5 },
            { text: "Game development project", points: 15 },
            { text: "Machine learning model", points: 20, correct: true }
          ],
          insight: "Kayron's passion for AI and machine learning shines through in his projects!"
        },
        {
          question: "What's Kayron's preferred development environment?",
          options: [
            { text: "VS Code", points: 20, correct: true },
            { text: "Sublime Text", points: 5 },
            { text: "IntelliJ IDEA", points: 10 },
            { text: "Vim", points: 15 }
          ],
          insight: "VS Code's extensibility and integrated features make it Kayron's top choice!"
        },
        {
          question: "What business sector is Kayron most experienced in?",
          options: [
            { text: "Entertainment", points: 20, correct: true },
            { text: "Finance", points: 10 },
            { text: "Healthcare", points: 5 },
            { text: "Retail", points: 5 }
          ],
          insight: "Kayron has extensive experience in the entertainment industry, particularly with financial analytics!"
        },
        {
          question: "What skill is Kayron continuously improving?",
          options: [
            { text: "Project Management", points: 5 },
            { text: "Creative Direction", points: 10 },
            { text: "Data Analysis", points: 15 },
            { text: "Strategic Planning", points: 20, correct: true }
          ],
          insight: "Strategic planning and business development are areas where Kayron consistently excels!"
        }
      ],
      
      // Performance levels based on score
      performanceLevels: [
        {
          threshold: 70,
          title: "Business Virtuoso!",
          message: "You have exceptional understanding of Kayron's professional profile and capabilities!",
          skills: ["Strategic Vision", "Business Acumen", "Creative Direction"]
        },
        {
          threshold: 40,
          title: "Rising Star!",
          message: "You have a solid grasp of Kayron's professional profile and key strengths.",
          skills: ["Problem Solving", "Business Knowledge", "Analytical Thinking"]
        },
        {
          threshold: 0,
          title: "Potential Explorer!",
          message: "You're starting to understand Kayron's professional offerings and capabilities.",
          skills: ["Curiosity", "Learning Mindset", "Professional Interest"]
        }
      ]
    };
  }
  
  /**
   * Initialize the game
   * @returns {Function} Cleanup function
   */
  init() {
    // Cache DOM elements
    this.cacheElements();
    
    // Set up event listeners
    const eventCleanup = this.setupEvents();
    
    // Start background sound
    sound.play('./audio/ticker-hum.mp3', { loop: true, volume: 0.3 });
    
    // Show host intro screen only - wait for button click to start
    this.showScreen('host-intro');
    
    // Return cleanup function
    return () => {
      // Clean up event listeners
      eventCleanup();
      
      // Clear timer if running
      if (this.state.timerInterval) {
        clearInterval(this.state.timerInterval);
      }
      
      // Stop background sound
      sound.stop('./audio/ticker-hum.mp3');
      
      console.log('Game show instance cleanup complete');
    };
  }
  
  /**
   * Cache DOM elements for better performance
   */
  cacheElements() {
    // Game screens
    this.elements.screens = {
      hostIntro: dom.get('#host-intro'),
      gameRound: dom.get('#game-round'),
      commercial: dom.get('#commercial-break'),
      results: dom.get('#final-results')
    };
    
    // Game UI elements
    this.elements.ui = {
      questionDisplay: dom.get('#question-display'),
      optionsContainer: dom.get('#options-container'),
      currentScore: dom.get('#current-score'),
      roundDisplay: dom.get('#round-number'),
      timerDisplay: dom.get('#timer'),
      timerBar: dom.get('#timer-bar'),
      finalScore: dom.get('#final-score'),
      performanceDetails: dom.get('#performance-details'),
      unlockedSkills: dom.get('#unlocked-skills'),
      playAgainBtn: dom.get('#play-again-btn')
    };
  }
  
  /**
   * Set up game event listeners
   * @returns {Function} Cleanup function
   */
  setupEvents() {
    const listeners = [];
    
    // Start game button
    const startGameBtn = dom.get('#start-game-button');
    if (startGameBtn) {
      const startHandler = () => {
        this.startGame();
        // Add flash effect when clicked
        gsap.to(startGameBtn, {
          backgroundColor: "#fff",
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            startGameBtn.style.display = 'none';
          }
        });
      };
      
      startGameBtn.addEventListener('click', startHandler);
      listeners.push([startGameBtn, 'click', startHandler]);
    }
    
    // Play again button
    if (this.elements.ui.playAgainBtn) {
      const playAgainHandler = () => this.resetGame();
      this.elements.ui.playAgainBtn.addEventListener('click', playAgainHandler);
      listeners.push([this.elements.ui.playAgainBtn, 'click', playAgainHandler]);
    }
    
    // Keyboard controls
    const keyHandler = (e) => {
      // Number keys 1-4 for answering questions
      if (this.state.isGameActive && e.key >= '1' && e.key <= '4') {
        const index = parseInt(e.key) - 1;
        const options = this.elements.ui.optionsContainer?.children;
        if (options && options[index]) {
          options[index].click();
        }
      }
      
      // Enter key to start game when on intro screen
      if (e.key === 'Enter' && document.getElementById('host-intro') && 
          !document.getElementById('host-intro').classList.contains('hidden')) {
        const startGameBtn = document.getElementById('start-game-button');
        if (startGameBtn) {
          startGameBtn.click();
        }
      }
    };
    
    document.addEventListener('keydown', keyHandler);
    listeners.push([document, 'keydown', keyHandler]);
    
    // Return cleanup function
    return () => {
      listeners.forEach(([element, event, handler]) => {
        element.removeEventListener(event, handler);
      });
    };
  }
  
  /**
   * Show a specific screen and hide others
   * @param {string} screenName - Screen name to show
   */
  showScreen(screenName) {
    // Hide all screens
    Object.values(this.elements.screens).forEach(screen => {
      if (screen) {
        screen.classList.add('hidden');
      }
    });
    
    // Show requested screen with animation
    const screen = this.elements.screens[screenName];
    if (screen) {
      screen.classList.remove('hidden');
      
      // Add entrance animation
      gsap.fromTo(
        screen,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }
  
  /**
   * Start a new game
   */
  startGame() {
    // Reset game state
    this.state = {
      currentRound: 1,
      score: 0,
      timeLeft: 30,
      currentQuestion: null,
      playedQuestions: new Set(),
      isGameActive: true
    };
    
    // Update UI with initial values
    this.updateScoreDisplay();
    this.updateRoundDisplay();
    
    // Show game screen
    this.showScreen('game-round');
    
    // Start timer
    this.startTimer();
    
    // Show first question
    this.showNextQuestion();
  }
  
  /**
   * Update score display
   */
  updateScoreDisplay() {
    if (this.elements.ui.currentScore) {
      this.elements.ui.currentScore.textContent = this.state.score;
    }
  }
  
  /**
   * Update round display
   */
  updateRoundDisplay() {
    if (this.elements.ui.roundDisplay) {
      this.elements.ui.roundDisplay.textContent = `ROUND ${this.state.currentRound}`;
    }
  }
  
  /**
   * Start countdown timer
   */
  startTimer() {
    // Clear any existing timer
    if (this.state.timerInterval) {
      clearInterval(this.state.timerInterval);
    }
    
    // Reset timer display
    this.state.timeLeft = 30;
    if (this.elements.ui.timerDisplay) {
      this.elements.ui.timerDisplay.textContent = this.state.timeLeft;
    }
    if (this.elements.ui.timerBar) {
      this.elements.ui.timerBar.style.width = '100%';
    }
    
    // Start countdown
    this.state.timerInterval = setInterval(() => {
      this.state.timeLeft--;
      
      // Update timer display
      if (this.elements.ui.timerDisplay) {
        this.elements.ui.timerDisplay.textContent = this.state.timeLeft;
      }
      
      // Update timer bar
      if (this.elements.ui.timerBar) {
        const percentLeft = (this.state.timeLeft / 30) * 100;
        this.elements.ui.timerBar.style.width = `${percentLeft}%`;
        
        // Add warning color when time is running low
        if (this.state.timeLeft <= 10) {
          this.elements.ui.timerBar.style.backgroundColor = 'var(--danger-color)';
        } else {
          this.elements.ui.timerBar.style.backgroundColor = 'var(--accent-color)';
        }
      }
      
      // Time's up
      if (this.state.timeLeft <= 0) {
        clearInterval(this.state.timerInterval);
        
        // Auto-proceed to next question after slight delay
        setTimeout(() => {
          this.showNextQuestion();
        }, 1000);
      }
    }, 1000);
  }
  
  /**
   * Show the next question
   */
  showNextQuestion() {
    // If we've played all questions, end the game
    if (this.state.playedQuestions.size >= this.content.questions.length) {
      this.endGame();
      return;
    }
    
    // Reset timer for new question
    this.startTimer();
    
    // Find a question we haven't played yet
    const availableQuestions = this.content.questions.filter(
      q => !this.state.playedQuestions.has(q)
    );
    
    if (availableQuestions.length === 0) {
      this.endGame();
      return;
    }
    
    // Pick a random question
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    this.state.currentQuestion = availableQuestions[randomIndex];
    this.state.playedQuestions.add(this.state.currentQuestion);
    
    // Display the question
    if (this.elements.ui.questionDisplay) {
      this.elements.ui.questionDisplay.textContent = this.state.currentQuestion.question;
      
      // Add question entrance animation
      gsap.fromTo(
        this.elements.ui.questionDisplay,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.2)" }
      );
    }
    
    // Display answer options
    this.displayOptions();
  }
  
  /**
   * Display multiple choice options
   */
  displayOptions() {
    const optionsContainer = this.elements.ui.optionsContainer;
    if (!optionsContainer) return;
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Create button for each option
    this.state.currentQuestion.options.forEach((option, index) => {
      // Create a button using the helper
      const button = dom.create('button', { className: 'option-button' });
      
      // Use letter labels (A, B, C, D)
      const letter = String.fromCharCode(65 + index); // A, B, C, D
      
      button.innerHTML = `
        <span class="option-letter">${letter}</span>
        <span class="option-text">${option.text}</span>
      `;
      
      // Add click event to handle answer selection
      button.addEventListener('click', () => this.selectAnswer(option));
      
      // Add to container
      optionsContainer.appendChild(button);
      
      // Add staggered entrance animation
      gsap.fromTo(
        button,
        { x: -20, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.4, 
          ease: "power2.out",
          delay: index * 0.1 // Stagger effect
        }
      );
    });
  }
  
  /**
   * Handle player's answer selection
   * @param {Object} selectedOption - The selected answer option
   */
  selectAnswer(selectedOption) {
    // Prevent multiple answers
    const buttons = document.querySelectorAll('.option-button');
    buttons.forEach(btn => btn.disabled = true);
    
    // Update score
    const points = selectedOption.points;
    this.state.score += points;
    this.updateScoreDisplay();
    
    // Find the button that was clicked
    const selectedButton = Array.from(buttons).find(btn => 
      btn.querySelector('.option-text').textContent === selectedOption.text
    );
    
    // Highlight selected answer
    if (selectedButton) {
      // Add appropriate styling class
      if (selectedOption.correct) {
        selectedButton.classList.add('correct');
      } else {
        selectedButton.classList.add('selected');
      }
      
      // Display points
      const pointsDisplay = dom.create('div', {
        className: 'points-display',
        textContent: `${points} POINTS!`
      });
      selectedButton.appendChild(pointsDisplay);
      
      // Animate points display
      gsap.fromTo(
        pointsDisplay,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
    
    // Play appropriate sound
    sound.play(points > 15 ? './audio/ka-ching.mp3' : './audio/click.mp3');
    
    // Add celebration effect for high-point answers
    if (points > 15) {
      this.celebrateAnswer();
    }
    
    // Show insight and move to next question after delay
    setTimeout(() => {
      // Show insight about answer
      this.showInsight();
      
      // Pause the timer
      clearInterval(this.state.timerInterval);
      
      // Proceed to next step after showing insight
      setTimeout(() => {
        // Remove insight
        const insight = document.querySelector('.insight');
        if (insight && insight.parentNode) {
          insight.parentNode.removeChild(insight);
        }
        
        // Check if we should go to commercial break
        const questionsPerRound = 2; // Show commercial every 2 questions
        if (this.state.playedQuestions.size % questionsPerRound === 0) {
          this.state.currentRound++;
          this.updateRoundDisplay();
          this.showCommercialBreak();
        } else {
          this.state.currentQuestion = null;
          this.showNextQuestion();
        }
      }, 3000);
    }, 1500);
  }
  
  /**
   * Show insight about the answer
   */
  showInsight() {
    if (!this.state.currentQuestion || !this.state.currentQuestion.insight) return;
    
    const questionArea = document.querySelector('.question-area');
    if (!questionArea) return;
    
    const insight = dom.create('div', {
      className: 'insight',
      textContent: this.state.currentQuestion.insight
    });
    questionArea.appendChild(insight);
    
    // Animate insight appearance
    gsap.fromTo(
      insight,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
    );
  }
  
  /**
   * Create celebration particles effect
   */
  celebrateAnswer() {
    // Create container for particles
    const container = dom.create('div', { className: 'celebration-container' });
    document.body.appendChild(container);
    
    // Create multiple particles
    for (let i = 0; i < 30; i++) {
      const particle = dom.create('div', { className: 'celebration-particle' });
      
      // Randomize particle properties
      particle.style.setProperty('--delay', `${Math.random() * 0.5}s`);
      particle.style.left = `${Math.random() * 100}%`;
      
      // Randomize particle color
      const hue = Math.floor(Math.random() * 360);
      particle.style.backgroundColor = `hsl(${hue}, 100%, 60%)`;
      
      container.appendChild(particle);
    }
    
    // Remove particles after animation completes
    setTimeout(() => container.remove(), 3000);
  }
  
  /**
   * Show commercial break
   */
  showCommercialBreak() {
    this.showScreen('commercial');
    
    // Populate commercial break content
    this.populateCommercialContent();
    
    // Pause timer during commercial
    clearInterval(this.state.timerInterval);
    
    // Resume game after commercial break
    setTimeout(() => {
      this.showScreen('game-round');
      this.state.currentQuestion = null;
      this.startTimer();
      this.showNextQuestion();
    }, 5000);
  }
  
  /**
   * Populate commercial break content
   */
  populateCommercialContent() {
    const skillShowcase = dom.get('.skill-showcase');
    if (!skillShowcase) return;
    
    // Clear existing skills
    skillShowcase.innerHTML = '';
    
    // Show different skills based on current round
    const skills = [
      { name: "Strategic Vision", icon: "eye" },
      { name: "Brand Development", icon: "paint-brush" },
      { name: "Business Analytics", icon: "chart-line" },
      { name: "Creative Direction", icon: "lightbulb" },
      { name: "Project Management", icon: "tasks" }
    ];
    
    // Select skills for this round
    const roundSkills = skills.slice(
      Math.min((this.state.currentRound - 1) * 2, skills.length - 3),
      Math.min(this.state.currentRound * 2 + 1, skills.length)
    );
    
    // Add skills to showcase
    roundSkills.forEach((skill, index) => {
      const skillItem = dom.create('div', {
        className: 'skill-item',
        innerHTML: `<i class="fas fa-${skill.icon}"></i><span>${skill.name}</span>`
      });
      
      skillShowcase.appendChild(skillItem);
      
      // Add staggered entrance animation
      gsap.fromTo(
        skillItem,
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.5, 
          ease: "back.out(1.2)",
          delay: index * 0.2 // Stagger effect
        }
      );
    });
  }
  
  /**
   * End the game and show results
   */
  endGame() {
    this.showFinalResults();
    this.state.isGameActive = false;
    clearInterval(this.state.timerInterval);
  }
  
  /**
   * Show final results screen
   */
  showFinalResults() {
    // Stop background music and play success sound
    sound.stop('./audio/ticker-hum.mp3');
    sound.play('./audio/whoosh.mp3');
    
    // Determine performance level based on score
    const performanceLevel = this.content.performanceLevels.find(level => 
      this.state.score >= level.threshold
    ) || this.content.performanceLevels[this.content.performanceLevels.length - 1];
    
    // Update results screen
    if (this.elements.ui.finalScore) {
      this.elements.ui.finalScore.textContent = this.state.score;
    }
    
    if (this.elements.ui.performanceDetails) {
      this.elements.ui.performanceDetails.innerHTML = `
        <h4>${performanceLevel.title}</h4>
        <p>${performanceLevel.message}</p>
      `;
    }
    
    if (this.elements.ui.unlockedSkills) {
      this.elements.ui.unlockedSkills.innerHTML = performanceLevel.skills.map(skill => 
        `<div class="skill-item">${skill}</div>`
      ).join('');
      
      // Animate skills appearance
      gsap.fromTo(
        this.elements.ui.unlockedSkills.children,
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.2, 
          ease: "back.out(1.7)" 
        }
      );
    }
    
    // Show results screen with animation
    this.showScreen('results');
  }
  
  /**
   * Reset the game to play again
   */
  resetGame() {
    // Reset game state
    this.state = {
      currentRound: 1,
      score: 0,
      timeLeft: 30,
      currentQuestion: null,
      playedQuestions: new Set(),
      isGameActive: false
    };
    
    // Update displays
    this.updateScoreDisplay();
    this.updateRoundDisplay();
    
    // Restart background music
    sound.play('./audio/ticker-hum.mp3', { loop: true, volume: 0.3 });
    
    // Show host intro
    this.showScreen('host-intro');
  }
}