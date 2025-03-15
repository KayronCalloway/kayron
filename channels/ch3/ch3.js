// channels/ch3/ch3.js

// Track initialization state
let gameInitialized = false;
let gameResources = {
  stylesheet: null,
  script: null
};

// Function to stop all game sounds when leaving Channel 3
function stopAllChannelSounds(event) {
  // Only stop sounds when leaving Channel 3, not when entering it
  const leavingChannel3 = document.getElementById('section3') && 
                         !document.getElementById('section3').classList.contains('active');
  
  if (!leavingChannel3) {
    console.log("Not stopping Channel 3 sounds - either we're on Channel 3 or event not relevant");
    return;
  }
  
  console.log("Leaving Channel 3, stopping sounds");
  
  // First check if the GameShowManager is available globally
  if (window.GameShowManager && window.GameShowManager.sounds) {
    console.log("Found GameShowManager, pausing sounds but keeping loop state");
    
    // Call the stopAllSounds method if it exists
    if (typeof window.GameShowManager.stopAllSounds === 'function') {
      window.GameShowManager.stopAllSounds();
      return;
    }
    
    // Otherwise use the direct approach as fallback
    Object.values(window.GameShowManager.sounds).forEach(sound => {
      if (sound && typeof sound.pause === 'function') {
        console.log("Pausing sound:", sound.src);
        sound.pause();
        // Don't reset currentTime or loop state to allow resuming
      }
    });
  }
  
  // Additional safety check for any audio elements that might be playing
  // This catches any sounds that might not be properly tracked
  document.querySelectorAll('audio').forEach(audio => {
    if (audio.src && audio.src.includes('gameshow.aif')) {
      console.log("Pausing loose audio element:", audio.src);
      audio.pause();
      // Don't reset currentTime or loop state to allow resuming
    }
  });
}

// Remove any existing event listener to prevent duplicates
document.removeEventListener('channelChange', stopAllChannelSounds);
// Add a global event listener to stop sounds when changing channels
document.addEventListener('channelChange', stopAllChannelSounds);

export async function init() {
  try {
    // Container validation
    const container = document.getElementById('section3');
    if (!container) {
      console.error("Channel 3 container not found");
      return;
    }
    
    // Resuming sound when returning to Channel 3
    if (window.GameShowManager && window.GameShowManager.sounds) {
      // Resume background sound if already initialized
      if (window.GameShowManager.sounds.background) {
        console.log("Resuming background sound when returning to Channel 3");
        window.GameShowManager.sounds.background.play().catch(err => 
          console.log("Failed to resume background sound:", err)
        );
      }
    }
    
    // If already initialized and container exists, just ensure visibility
    if (container.querySelector('#game-show-container') && gameInitialized) {
      console.log("Game show already loaded; ensuring visibility without reinitializing.");
      
      // Make sure the container is visible
      const existingContainer = container.querySelector('#game-show-container');
      if (existingContainer) {
        existingContainer.style.display = 'flex';
        existingContainer.style.visibility = 'visible';
        existingContainer.style.opacity = '1';
      }
      
      return;
    }
    
    // Clear container before initializing
    container.innerHTML = '';
    
    // Load the game HTML fragment
    const response = await fetch('./channels/ch3/gameshow.html');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    const html = await response.text();
    container.innerHTML = html;
    
    // Force header to be visible by notifying MenuManager
    setTimeout(() => {
      import('../../menu-manager.js').then(({ notifyChannelChanged }) => {
        notifyChannelChanged();
        console.log("Notified MenuManager to ensure header and guide button visibility on channel 3");
      }).catch(err => console.error("Error importing MenuManager:", err));
    }, 300);
    
    // Ensure TV Guide has correct positioning
    const tvGuide = document.getElementById('tvGuide');
    if (tvGuide) {
      tvGuide.style.position = 'fixed';
      tvGuide.style.top = '0';
      tvGuide.style.left = '0';
      tvGuide.style.width = '100%';
      tvGuide.style.height = '100%';
      tvGuide.style.zIndex = '10000000';
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
      
      // Trigger curtain animation
      setTimeout(() => {
        console.log("Triggering curtain opening animation");
        const curtainLeft = container.querySelector('.curtain-left');
        const curtainRight = container.querySelector('.curtain-right');
        
        if (curtainLeft && curtainRight) {
          // Reset animation states
          curtainLeft.style.transform = 'translateX(0%)';
          curtainRight.style.transform = 'translateX(0%)';
          
          // Remove any existing animations
          curtainLeft.style.animation = 'none';
          curtainRight.style.animation = 'none';
          
          // Force reflow to ensure the animation restarts
          void curtainLeft.offsetWidth;
          void curtainRight.offsetWidth;
          
          // Re-apply the animation
          curtainLeft.style.animation = 'curtain-left 2s cubic-bezier(0.7, 0, 0.3, 1) forwards';
          curtainRight.style.animation = 'curtain-right 2s cubic-bezier(0.7, 0, 0.3, 1) forwards';
        }
      }, 1000);
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
    bottom: 10px;
    right: 10px;
    z-index: 999998;
    font-size: 2.5rem;
    color: var(--primary-color, #fff);
    opacity: 0.9;
    pointer-events: none;
    padding: 0;
    margin: 0;
    line-height: 1;
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
  // Let MenuManager handle button visibility
  
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
          question: "A client hires you for a major creative project but suddenly wants to pivot in a completely new direction. What's your move?",
          options: [
            { text: "Stick to the original plan—changing direction now would waste time and resources.", points: 5 },
            { text: "Express your concerns but ultimately follow their lead—they're paying, after all.", points: 10 },
            { text: "Strategically suggest a middle ground that aligns with their new vision while keeping key elements intact.", points: 15 },
            { text: "Reframe the pivot as an opportunity for innovation—proactively present fresh ideas that meet their new goals while maintaining quality.", points: 20, correct: true }
          ],
          insight: "This highlights adaptability, problem-solving, and client management skills!"
        },
        {
          question: "You're leading a team on a high-stakes project, but a key deadline is unexpectedly moved up. What's your approach?",
          options: [
            { text: "Work harder and push through—even if it means long hours and stress.", points: 5 },
            { text: "Restructure tasks and redistribute the workload efficiently to meet the deadline.", points: 10 },
            { text: "Communicate with the team, adjust priorities, and propose realistic solutions to maintain quality under pressure.", points: 15 },
            { text: "Stay calm, motivate the team, and introduce a streamlined approach that increases efficiency without sacrificing the creative vision.", points: 20, correct: true }
          ],
          insight: "This showcases leadership, time management, and resilience under pressure!"
        },
        {
          question: "You're presenting a brand strategy to a high-profile client, but mid-meeting, they seem skeptical. What do you do?",
          options: [
            { text: "Stick to the script—you prepared for this.", points: 5 },
            { text: "Address their concerns briefly but move forward with confidence.", points: 10 },
            { text: "Adapt on the spot, engaging them in a discussion and tailoring the presentation to their reactions.", points: 15 },
            { text: "Flip the approach—turn the meeting into a collaborative conversation where they feel involved in shaping the direction.", points: 20, correct: true }
          ],
          insight: "This highlights communication, adaptability, and persuasion skills!"
        },
        {
          question: "Your fragrance project hits a supply chain issue, and a key ingredient is unavailable. How do you react?",
          options: [
            { text: "Pause production until the ingredient is back in stock.", points: 5 },
            { text: "Find a similar replacement and move forward with minimal changes.", points: 10 },
            { text: "Experiment with alternatives, ensuring the final product maintains the intended essence and quality.", points: 15 },
            { text: "Use this as a chance to refine the formula, possibly improving the fragrance while communicating transparently with your audience.", points: 20, correct: true }
          ],
          insight: "This tests problem-solving, creativity, and strategic thinking!"
        },
        {
          question: "You're consulting for a brand that needs a major creative refresh, but their leadership is hesitant about big changes. How do you handle it?",
          options: [
            { text: "Follow their instructions and make only small tweaks.", points: 5 },
            { text: "Show them industry trends but ultimately let them decide.", points: 10 },
            { text: "Present a vision that bridges innovation with elements they're comfortable with.", points: 15 },
            { text: "Build trust by educating them on long-term benefits and showing a phased approach to transformation.", points: 20, correct: true }
          ],
          insight: "This demonstrates leadership, strategic thinking, and influence!"
        }
      ],
      
      // Performance levels based on score
      performanceLevels: [
        {
          threshold: 95,
          title: "Creative Genius!",
          message: "Wow! You've got the kind of creative problem-solving that companies dream about! If I were hiring (which I hope you are), I'd be sending an offer letter right now. My approach to challenges combines vision, innovation, and people skills!",
          skills: ["Visionary Leadership", "Strategic Innovation", "Client Trust"]
        },
        {
          threshold: 75,
          title: "Creative Superstar!",
          message: "Nice job! You've got the kind of thinking that makes projects successful! I bring this same approach to my work—leading with creative confidence, bringing fresh ideas, and keeping everyone aligned toward awesome outcomes!",
          skills: ["Creative Direction", "Team Leadership", "Strategic Thinking"]
        },
        {
          threshold: 45,
          title: "Creative Problem Solver!",
          message: "You've got solid skills! This reflects my balanced approach to work challenges—I adapt quickly, find solutions where others see roadblocks, and keep projects on track with a mix of structure and creative thinking!",
          skills: ["Adaptability", "Problem Solving", "Project Management"]
        },
        {
          threshold: 0,
          title: "Creative Contender!",
          message: "Thanks for playing! Even when faced with tough choices, I bring reliability and efficiency to every project. My greatest strength is following through on commitments while still bringing creative thinking to practical challenges!",
          skills: ["Reliability", "Efficiency", "Practical Thinking"]
        }
      ]
    };
    
    // Sound effects
    this.sounds = {
      correct: new Audio('./audio/ka-ching.mp3'),
      incorrect: new Audio('./audio/click.mp3'),
      background: new Audio('./audio/gameshow.aif')
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
    
    // Reset timer display with a longer time since questions are more complex
    this.state.timeLeft = 45; // Increased from 30 to 45 seconds
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
        const percentLeft = (this.state.timeLeft / 45) * 100; // Also updated here
        this.elements.ui.timerBar.style.width = `${percentLeft}%`;
        
        // Add warning color when time is running low
        if (this.state.timeLeft <= 15) { // Updated from 10 to 15
          this.elements.ui.timerBar.style.backgroundColor = '#ff453a';
        } else {
          this.elements.ui.timerBar.style.backgroundColor = '#1e90ff'; // Updated from gold to blue
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
    
    // Copy and randomize the options
    const randomizedOptions = [...this.state.currentQuestion.options];
    
    // Shuffle the options
    for (let i = randomizedOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomizedOptions[i], randomizedOptions[j]] = [randomizedOptions[j], randomizedOptions[i]];
    }
    
    // Create button for each option
    randomizedOptions.forEach((option, index) => {
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
        
        // Only show a commercial break after the 3rd question (middle of the game)
        if (this.state.playedQuestions.size === 3) {
          this.state.currentRound++;
          this.updateRoundDisplay();
          console.log("Showing the only commercial break");
          this.showCommercialBreak();
        } else {
          // For all other questions, just move to the next one
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
    
    // Remove any existing insight
    const existingInsight = questionArea.querySelector('.insight');
    if (existingInsight) {
      existingInsight.remove();
    }
    
    const insight = document.createElement('div');
    insight.className = 'insight';
    insight.textContent = this.state.currentQuestion.insight;
    
    questionArea.appendChild(insight);
    
    // Animate insight appearance
    try {
      gsap.fromTo(
        insight,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    } catch (error) {
      console.error("Animation error:", error);
      insight.style.opacity = '1';
      insight.style.transform = 'translateY(0)';
    }
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
    console.log("Showing the mid-game commercial break...");
    
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
    
    // Update commercial break title to indicate it's a mid-game break
    const commercialTitle = document.querySelector('.commercial-content h2');
    if (commercialTitle) {
      commercialTitle.textContent = 'Mid-Game Break! Almost There!';
    }
    
    // Populate commercial break content with more skills
    this.populateCommercialContent();
    
    // Pause timer during commercial
    clearInterval(this.state.timerInterval);
    
    console.log("Commercial break started, will end in 4 seconds");
    
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
    }, 4000);
  }
  
  // Populate commercial break content
  populateCommercialContent() {
    console.log("Populating mid-game commercial content...");
    
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
    
    // Show all the skills for the mid-game break
    const skills = [
      { name: "Strategic Vision", icon: "eye" },
      { name: "Brand Development", icon: "paint-brush" },
      { name: "Business Analytics", icon: "chart-line" },
      { name: "Creative Direction", icon: "lightbulb" },
      { name: "Project Management", icon: "tasks" },
      { name: "Client Relations", icon: "handshake" }
    ];
    
    // Create skill items directly with proper HTML
    let skillsHTML = '';
    skills.forEach(skill => {
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
            duration: 0.4, 
            ease: "back.out(1.2)",
            delay: index * 0.15 // Faster stagger for more items
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
    
    console.log(`Commercial content populated with ${skills.length} skills`);
  }
  
  // End the game and show results
  endGame() {
    this.showFinalResults();
    this.state.isGameActive = false;
    clearInterval(this.state.timerInterval);
    
    // Explicitly stop all sounds when game ends
    this.stopAllSounds();
  }
  
  // Method to stop all sounds owned by this game instance
  stopAllSounds() {
    // Only pause sounds without modifying their looping state
    Object.values(this.sounds).forEach(sound => {
      if (sound && typeof sound.pause === 'function') {
        console.log("Pausing game sound:", sound.src);
        sound.pause();
        // Keep currentTime and loop state to allow resuming
      }
    });
  }
  
  // Show final results screen
  showFinalResults() {
    // Pause background music but don't stop it completely
    if (this.sounds.background) {
      this.sounds.background.pause();
      // Don't reset currentTime or loop state to allow resuming
    }
    
    // Play correct sound for success
    this.playSound('correct');
    
    // Determine performance level based on score
    const performanceLevel = this.content.performanceLevels.find(level => 
      this.state.score >= level.threshold
    ) || this.content.performanceLevels[this.content.performanceLevels.length - 1];
    
    // Update results screen
    if (this.elements.ui.finalScore) {
      this.elements.ui.finalScore.textContent = this.state.score;
    }
    
    // Check if on mobile for font size adjustments
    const isMobile = window.innerWidth <= 768;
    
    if (this.elements.ui.performanceDetails) {
      // Choose font size based on device
      const titleSize = isMobile ? '1.4rem' : '1.7rem';
      const textSize = isMobile ? '0.9rem' : '1rem';
      
      this.elements.ui.performanceDetails.innerHTML = `
        <h4 style="font-size: ${titleSize}; line-height: 1.3; margin-bottom: 15px;">${performanceLevel.title}</h4>
        <p style="font-size: ${textSize}; line-height: 1.4; max-width: 100%;">${performanceLevel.message}</p>
      `;
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