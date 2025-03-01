// channels/ch3/ch3.js

// Track initialization state
let gameInitialized = false;
let gameResources = {
  stylesheet: null,
  script: null
};

export async function init() {
  try {
    // Container validation
    const container = document.getElementById('section3');
    if (!container) {
      console.error("Channel 3 container not found");
      return;
    }
    
    // Prevent duplicate initialization
    if (container.querySelector('#game-show-container') && gameInitialized) {
      console.log("Game show already loaded; skipping initialization.");
      return;
    }
    
    // Clear container before initializing
    container.innerHTML = '';
    
    // Load the game HTML fragment
    const response = await fetch('./channels/ch3/gameshow.html');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    const html = await response.text();
    container.innerHTML = html;
    
    // Make sure the menu button is visible
    const menuButton = document.getElementById('menuButton');
    if (menuButton) {
      menuButton.style.zIndex = '999999';
      menuButton.style.display = 'block';
      menuButton.style.opacity = '1';
    }
    
    // Add channel number overlay with high z-index to ensure visibility
    ensureChannelNumberVisible(container);
    
    // Dynamically load CSS if not already loaded
    await loadStylesheet();
    
    // Initialize game components
    await initializeGameShow();
    
    // Track successful initialization
    gameInitialized = true;
    
    console.log("Channel 3 game show initialized successfully");
    
    // Force the game to be visible
    const gameContainer = container.querySelector('#game-show-container');
    if (gameContainer) {
      gameContainer.style.display = 'flex';
      gameContainer.style.visibility = 'visible';
      gameContainer.style.opacity = '1';
    }
    
  } catch (error) {
    console.error("Failed to load Channel 3 markup:", error);
    const container = document.getElementById('section3');
    if (container) {
      container.innerHTML = `
        <div class="error">Error loading game show content.</div>
        <div class="channel-number-overlay">CH 03</div>
      `;
    }
  }
}

// Ensure the channel number is always visible
function ensureChannelNumberVisible(container) {
  // Remove any existing overlay
  const existingOverlay = container.querySelector('.channel-number-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }
  
  // Create a fixed position overlay with very high z-index
  const channelOverlay = document.createElement('div');
  channelOverlay.className = 'channel-number-overlay';
  channelOverlay.textContent = 'CH 03';
  channelOverlay.style.cssText = `
    position: fixed;
    bottom: 40px;
    right: 20px;
    z-index: 999998;
    font-size: 2rem;
    color: var(--primary-color, #fff);
    opacity: 0.8;
    pointer-events: none;
  `;
  container.appendChild(channelOverlay);
}

// Load game stylesheet with proper cleanup
async function loadStylesheet() {
  // Remove any existing stylesheet to prevent conflicts
  const existingStylesheet = document.querySelector('link[href*="channels/ch3/styles.css"]');
  if (existingStylesheet) {
    existingStylesheet.remove();
  }
  
  // Create new stylesheet
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './channels/ch3/styles.css?' + new Date().getTime(); // Cache busting
    link.id = 'ch3-stylesheet';
    
    // Track when loaded
    link.onload = () => {
      gameResources.stylesheet = link;
      resolve();
    };
    
    link.onerror = () => {
      console.error("Failed to load Channel 3 stylesheet");
      resolve(); // Resolve anyway to prevent blocking
    };
    
    document.head.appendChild(link);
  });
}

// Initialize the game show
async function initializeGameShow() {
  // Ensure the menu button remains visible
  const menuButton = document.getElementById('menuButton');
  if (menuButton) {
    menuButton.style.zIndex = '999999';
    menuButton.style.display = 'block';
    menuButton.style.opacity = '1';
    menuButton.style.position = 'fixed';
    menuButton.style.pointerEvents = 'auto';
  }
  
  try {
    // Make sure Font Awesome is loaded for icons
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const fontAwesome = document.createElement('link');
      fontAwesome.rel = 'stylesheet';
      fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
      document.head.appendChild(fontAwesome);
    }
    
    // Initialize the Game Show Manager
    const GameShowManager = new GameShow();
    GameShowManager.init();
    
    // Make sure we expose the game manager globally for debugging
    window.GameShowManager = GameShowManager;
    
    // Ensure all game screens are properly initialized
    const hostIntro = document.getElementById('host-intro');
    if (hostIntro) {
      hostIntro.classList.remove('hidden');
      // Make sure host intro is visible
      hostIntro.style.display = 'flex';
      hostIntro.style.visibility = 'visible';
      hostIntro.style.opacity = '1';
      hostIntro.style.zIndex = '10';
    }
    
    // Make sure the start button is clickable
    const startButton = document.getElementById('start-game-button');
    if (startButton) {
      startButton.style.zIndex = '20';
      startButton.style.position = 'relative';
      console.log("Start button initialized");
    }
    
    console.log("Game show initialized successfully");
  } catch (error) {
    console.error("Error initializing game show:", error);
    // Fallback display in case of initialization error
    const container = document.getElementById('game-show-container');
    if (container) {
      container.innerHTML = `
        <div style="color: white; text-align: center; padding: 20px;">
          <h2>Game Show Coming Soon!</h2>
          <p>Test your skills with our interactive game experience.</p>
        </div>
      `;
    }
  }
}

// Game Show Class
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
    
    // Sound effects
    this.sounds = {
      correct: new Audio('./audio/ka-ching.mp3'),
      incorrect: new Audio('./audio/click.mp3'),
      success: new Audio('./audio/whoosh.mp3'),
      background: new Audio('./audio/ticker-hum.mp3')
    };
  }
  
  // Initialize game
  init() {
    // Cache DOM elements
    this.cacheElements();
    
    // Set up event listeners
    this.setupEvents();
    
    // Start background sound
    this.playSound('background', { loop: true, volume: 0.3 });
    
    // Show host intro screen only - wait for button click to start
    this.showScreen('host-intro');
  }
  
  // Cache DOM elements for better performance
  cacheElements() {
    console.log("Caching DOM elements");
    
    // Game screens with detailed logging
    const hostIntro = document.getElementById('host-intro');
    const gameRound = document.getElementById('game-round');
    const commercial = document.getElementById('commercial-break');
    const results = document.getElementById('final-results');
    
    console.log("Game screens found:", {
      hostIntro: !!hostIntro,
      gameRound: !!gameRound,
      commercial: !!commercial,
      results: !!results
    });
    
    // Store game screens
    this.elements.screens = {
      hostIntro: hostIntro,
      gameRound: gameRound, 
      commercial: commercial,
      results: results
    };
    
    // Game UI elements
    this.elements.ui = {
      questionDisplay: document.getElementById('question-display'),
      optionsContainer: document.getElementById('options-container'),
      currentScore: document.getElementById('current-score'),
      roundDisplay: document.getElementById('round-number'),
      timerDisplay: document.getElementById('timer'),
      timerBar: document.getElementById('timer-bar'),
      finalScore: document.getElementById('final-score'),
      performanceDetails: document.getElementById('performance-details'),
      unlockedSkills: document.getElementById('unlocked-skills'),
      playAgainBtn: document.getElementById('play-again-btn')
    };
    
    // Make sure the game container is visible
    const gameContainer = document.getElementById('game-show-container');
    if (gameContainer) {
      gameContainer.style.display = 'flex';
      gameContainer.style.visibility = 'visible';
      gameContainer.style.opacity = '1';
      gameContainer.style.zIndex = '100';
    } else {
      console.error("Game container not found!");
    }
    
    // Ensure host intro is visible initially
    if (hostIntro) {
      hostIntro.classList.remove('hidden');
      hostIntro.style.display = 'flex';
      hostIntro.style.visibility = 'visible';
      hostIntro.style.opacity = '1';
      hostIntro.style.zIndex = '10';
    }
    
    // Make sure other screens are hidden initially
    [gameRound, commercial, results].forEach(screen => {
      if (screen) {
        screen.classList.add('hidden');
        screen.style.display = 'none';
      }
    });
  }
  
  // Set up game event listeners
  setupEvents() {
    console.log("Setting up game event listeners");
    
    // Start game button with extra logging and explicit handling
    const startGameBtn = document.getElementById('start-game-button');
    if (startGameBtn) {
      // Remove any existing event listeners
      startGameBtn.replaceWith(startGameBtn.cloneNode(true));
      
      // Get fresh reference
      const newStartBtn = document.getElementById('start-game-button');
      
      // Make sure button is visible and clickable
      newStartBtn.style.display = 'block';
      newStartBtn.style.visibility = 'visible';
      newStartBtn.style.opacity = '1';
      newStartBtn.style.position = 'relative';
      newStartBtn.style.zIndex = '100';
      newStartBtn.style.pointerEvents = 'auto';
      
      // Add click handler with debugging
      const startGameHandler = () => {
        console.log("Start game button clicked!");
        this.startGame();
        
        // Add flash effect when clicked (with fallback)
        try {
          gsap.to(newStartBtn, {
            backgroundColor: "#fff",
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
              newStartBtn.style.display = 'none';
            }
          });
        } catch (error) {
          console.error("Animation error:", error);
          // Fallback
          newStartBtn.style.display = 'none';
        }
      };
      
      // Add event listener with both click and touch events for mobile
      newStartBtn.addEventListener('click', startGameHandler);
      newStartBtn.addEventListener('touchstart', startGameHandler);
      
      console.log("Start game button event listener attached");
    } else {
      console.error("Start game button not found!");
    }
    
    // Play again button
    if (this.elements.ui.playAgainBtn) {
      const playAgainHandler = () => this.resetGame();
      this.elements.ui.playAgainBtn.addEventListener('click', playAgainHandler);
      this.elements.ui.playAgainBtn.addEventListener('touchstart', playAgainHandler);
    }
    
    // Add keyboard control (for accessibility)
    const keydownHandler = (e) => {
      // Number keys 1-4 for answering questions
      if (this.state.isGameActive && e.key >= '1' && e.key <= '4') {
        const index = parseInt(e.key) - 1;
        const options = this.elements.ui.optionsContainer?.children;
        if (options && options[index]) {
          options[index].click();
        }
      }
      
      // Enter key to start game when on intro screen
      if (e.key === 'Enter') {
        const hostIntro = document.getElementById('host-intro');
        const startGameBtn = document.getElementById('start-game-button');
        
        if (hostIntro && !hostIntro.classList.contains('hidden') && startGameBtn) {
          console.log("Enter key pressed on intro screen");
          startGameBtn.click();
        }
      }
    };
    
    // Remove any existing event listener and add new one
    document.removeEventListener('keydown', keydownHandler);
    document.addEventListener('keydown', keydownHandler);
  }
  
  // Play sound with error handling
  playSound(soundId, options = {}) {
    try {
      const sound = this.sounds[soundId];
      if (!sound) return;
      
      // Apply options
      if (options.loop !== undefined) sound.loop = options.loop;
      if (options.volume !== undefined) sound.volume = options.volume;
      
      // Play sound with error handling
      sound.currentTime = 0;
      sound.play().catch(err => {
        console.warn(`Failed to play sound: ${err.message}`);
      });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }
  
  // Show a specific screen and hide others
  showScreen(screenName) {
    console.log(`Showing screen: ${screenName}`);
    
    // Hide all screens with explicit styles
    Object.values(this.elements.screens).forEach(screen => {
      if (screen) {
        screen.classList.add('hidden');
        screen.style.display = 'none';
        screen.style.visibility = 'hidden';
        screen.style.opacity = '0';
      }
    });
    
    // Show requested screen with explicit styles and animation
    const screen = this.elements.screens[screenName];
    if (screen) {
      // First remove hidden class
      screen.classList.remove('hidden');
      
      // Then set explicit styles for visibility
      screen.style.display = 'flex';
      screen.style.visibility = 'visible';
      screen.style.opacity = '1';
      screen.style.zIndex = '10';
      
      // Add entrance animation
      try {
        gsap.fromTo(
          screen,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
        );
      } catch (error) {
        console.error("Animation error:", error);
        // Fallback if GSAP fails
        screen.style.opacity = '1';
        screen.style.transform = 'scale(1)';
      }
      
      console.log(`Screen ${screenName} is now visible`);
    } else {
      console.error(`Screen ${screenName} not found in cached elements`);
    }
  }
  
  // Start a new game
  startGame() {
    console.log("Game starting...");
    
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
    
    // Show game screen with explicit visibility settings
    const gameRound = this.elements.screens.gameRound;
    if (gameRound) {
      // First remove hidden class
      gameRound.classList.remove('hidden');
      
      // Then set explicit styles
      gameRound.style.display = 'flex';
      gameRound.style.visibility = 'visible';
      gameRound.style.opacity = '1';
      gameRound.style.zIndex = '10';
    }
    
    // Hide host intro with explicit settings
    const hostIntro = this.elements.screens.hostIntro;
    if (hostIntro) {
      hostIntro.classList.add('hidden');
      hostIntro.style.display = 'none';
    }
    
    // Start timer
    this.startTimer();
    
    // Show first question
    this.showNextQuestion();
    
    console.log("Game started successfully");
  }
  
  // Update score display
  updateScoreDisplay() {
    if (this.elements.ui.currentScore) {
      this.elements.ui.currentScore.textContent = this.state.score;
    }
  }
  
  // Update round display
  updateRoundDisplay() {
    if (this.elements.ui.roundDisplay) {
      this.elements.ui.roundDisplay.textContent = `ROUND ${this.state.currentRound}`;
    }
  }
  
  // Start countdown timer
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
          this.elements.ui.timerBar.style.backgroundColor = '#ff453a';
        } else {
          this.elements.ui.timerBar.style.backgroundColor = '#ffd700';
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
  
  // Show the next question
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
  
  // Display multiple choice options
  displayOptions() {
    const optionsContainer = this.elements.ui.optionsContainer;
    if (!optionsContainer) return;
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Create button for each option
    this.state.currentQuestion.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'option-button';
      
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
  
  // Handle player's answer selection
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
      const pointsDisplay = document.createElement('div');
      pointsDisplay.className = 'points-display';
      pointsDisplay.textContent = `${points} POINTS!`;
      selectedButton.appendChild(pointsDisplay);
      
      // Animate points display
      gsap.fromTo(
        pointsDisplay,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
    
    // Play appropriate sound
    this.playSound(points > 15 ? 'correct' : 'incorrect');
    
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
  
  // Show insight about the answer
  showInsight() {
    if (!this.state.currentQuestion || !this.state.currentQuestion.insight) return;
    
    const questionArea = document.querySelector('.question-area');
    if (!questionArea) return;
    
    const insight = document.createElement('div');
    insight.className = 'insight';
    insight.textContent = this.state.currentQuestion.insight;
    questionArea.appendChild(insight);
    
    // Animate insight appearance
    gsap.fromTo(
      insight,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
    );
  }
  
  // Create celebration particles effect
  celebrateAnswer() {
    // Create container for particles
    const container = document.createElement('div');
    container.className = 'celebration-container';
    document.body.appendChild(container);
    
    // Create multiple particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'celebration-particle';
      
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
  
  // Show commercial break
  showCommercialBreak() {
    console.log("Showing commercial break...");
    
    // Get the commercial screen element
    const commercialScreen = this.elements.screens.commercial;
    
    if (!commercialScreen) {
      console.error("Commercial screen element not found!");
      // Skip commercial and continue with next question
      this.state.currentQuestion = null;
      this.startTimer();
      this.showNextQuestion();
      return;
    }
    
    // Make sure the commercial screen is visible with explicit styles
    commercialScreen.classList.remove('hidden');
    commercialScreen.style.display = 'flex';
    commercialScreen.style.visibility = 'visible';
    commercialScreen.style.opacity = '1';
    commercialScreen.style.zIndex = '15';
    
    // Hide other screens
    const gameRound = this.elements.screens.gameRound;
    if (gameRound) {
      gameRound.classList.add('hidden');
      gameRound.style.display = 'none';
    }
    
    // Populate commercial break content
    this.populateCommercialContent();
    
    // Pause timer during commercial
    clearInterval(this.state.timerInterval);
    
    console.log("Commercial break started, will end in 5 seconds");
    
    // Resume game after commercial break
    setTimeout(() => {
      console.log("Commercial break ending...");
      
      // Hide commercial screen
      commercialScreen.classList.add('hidden');
      commercialScreen.style.display = 'none';
      
      // Show game round screen
      if (gameRound) {
        gameRound.classList.remove('hidden');
        gameRound.style.display = 'flex';
        gameRound.style.visibility = 'visible';
        gameRound.style.opacity = '1';
      }
      
      this.state.currentQuestion = null;
      this.startTimer();
      this.showNextQuestion();
      
      console.log("Game resumed after commercial");
    }, 5000);
  }
  
  // Populate commercial break content
  populateCommercialContent() {
    console.log("Populating commercial content...");
    
    const skillShowcase = document.querySelector('.skill-showcase');
    if (!skillShowcase) {
      console.error("Skill showcase element not found!");
      return;
    }
    
    // Clear existing skills
    skillShowcase.innerHTML = '';
    
    // Make sure the commercial content is visible
    const commercialContent = document.querySelector('.commercial-content');
    if (commercialContent) {
      commercialContent.style.display = 'block';
      commercialContent.style.visibility = 'visible';
      commercialContent.style.opacity = '1';
    }
    
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
    
    // Create skill items directly with proper HTML
    let skillsHTML = '';
    roundSkills.forEach(skill => {
      skillsHTML += `
        <div class="skill-item">
          <i class="fas fa-${skill.icon}"></i>
          <span>${skill.name}</span>
        </div>
      `;
    });
    
    // Set the HTML content
    skillShowcase.innerHTML = skillsHTML;
    
    // Get the newly created elements and animate them
    const skillItems = skillShowcase.querySelectorAll('.skill-item');
    
    // Add staggered entrance animation
    try {
      skillItems.forEach((skillItem, index) => {
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
    } catch (error) {
      console.error("Animation error:", error);
      // Fallback if animation fails
      skillItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      });
    }
    
    console.log(`Commercial content populated with ${roundSkills.length} skills`);
  }
  
  // End the game and show results
  endGame() {
    this.showFinalResults();
    this.state.isGameActive = false;
    clearInterval(this.state.timerInterval);
  }
  
  // Show final results screen
  showFinalResults() {
    // Stop background music and play success sound
    if (this.sounds.background) {
      this.sounds.background.pause();
    }
    this.playSound('success');
    
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
  
  // Reset the game to play again
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
    if (this.sounds.background) {
      this.sounds.background.currentTime = 0;
      this.playSound('background', { loop: true, volume: 0.3 });
    }
    
    // Show host intro then start game after delay
    this.showScreen('host-intro');
    setTimeout(() => {
      this.startGame();
    }, 3000);
  }
}