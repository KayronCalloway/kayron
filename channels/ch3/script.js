// channels/ch3/script.js
window.initGame = function() {
  // Game State
  const gameState = {
    currentScreen: 'title',
    round: 1,
    score: 0,
    timeLeft: 30,
    currentQuestionIndex: 0,
    answers: [],
    timer: null,
    revealedAnswers: new Set()
  };

  // Game Configuration
  const config = {
    rounds: 2,
    timePerRound: 30,
    questionsPerRound: 5,
    revealDelay: 500,
    commercialBreakDuration: 5000
  };

  // Questions Database
  const questions = [
    {
      text: "Name a crucial skill for modern business leaders",
      answers: [
        { text: "Emotional Intelligence", points: 35 },
        { text: "Digital Literacy", points: 25 },
        { text: "Strategic Thinking", points: 20 },
        { text: "Communication", points: 15 },
        { text: "Adaptability", points: 5 }
      ]
    },
    {
      text: "What's most important when implementing AI in business?",
      answers: [
        { text: "Ethical Considerations", points: 40 },
        { text: "Data Quality", points: 30 },
        { text: "User Experience", points: 15 },
        { text: "Cost Efficiency", points: 10 },
        { text: "Speed", points: 5 }
      ]
    },
    {
      text: "Top factor in successful brand development?",
      answers: [
        { text: "Authenticity", points: 35 },
        { text: "Target Audience", points: 25 },
        { text: "Visual Identity", points: 20 },
        { text: "Consistency", points: 15 },
        { text: "Innovation", points: 5 }
      ]
    },
    {
      text: "Essential element of financial analysis?",
      answers: [
        { text: "Risk Assessment", points: 30 },
        { text: "Market Research", points: 25 },
        { text: "Data Modeling", points: 20 },
        { text: "Trend Analysis", points: 15 },
        { text: "Reporting", points: 10 }
      ]
    },
    {
      text: "Key to successful digital transformation?",
      answers: [
        { text: "Change Management", points: 35 },
        { text: "Employee Training", points: 25 },
        { text: "Technology Selection", points: 20 },
        { text: "Process Optimization", points: 15 },
        { text: "Budget Planning", points: 5 }
      ]
    },
    // Round 2 Questions (points are doubled in game logic)
    {
      text: "Most valuable consulting skill?",
      answers: [
        { text: "Problem Solving", points: 40 },
        { text: "Industry Knowledge", points: 30 },
        { text: "Client Management", points: 20 },
        { text: "Analysis", points: 15 },
        { text: "Documentation", points: 5 }
      ]
    },
    {
      text: "Critical factor in market expansion?",
      answers: [
        { text: "Market Research", points: 35 },
        { text: "Local Partnerships", points: 25 },
        { text: "Resource Planning", points: 20 },
        { text: "Risk Management", points: 15 },
        { text: "Timing", points: 5 }
      ]
    },
    {
      text: "Essential for project success?",
      answers: [
        { text: "Clear Objectives", points: 35 },
        { text: "Team Communication", points: 25 },
        { text: "Risk Management", points: 20 },
        { text: "Resource Allocation", points: 15 },
        { text: "Timeline", points: 5 }
      ]
    },
    {
      text: "Key to innovation leadership?",
      answers: [
        { text: "Creative Culture", points: 40 },
        { text: "Risk Tolerance", points: 30 },
        { text: "Resource Investment", points: 15 },
        { text: "Market Awareness", points: 10 },
        { text: "Experimentation", points: 5 }
      ]
    },
    {
      text: "Most important in stakeholder management?",
      answers: [
        { text: "Clear Communication", points: 35 },
        { text: "Trust Building", points: 25 },
        { text: "Value Delivery", points: 20 },
        { text: "Expectation Management", points: 15 },
        { text: "Regular Updates", points: 5 }
      ]
    }
  ];

  // DOM Elements
  const elements = {
    screens: {
      title: document.getElementById('title-screen'),
      hostIntro: document.getElementById('host-intro'),
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

  // TV Effects
  function addTVEffects() {
    const glitch = document.getElementById('screen-glitch');
    setInterval(() => {
      glitch.style.opacity = Math.random() > 0.95 ? '0.1' : '0';
    }, 100);
  }

  // Screen Transitions
  function showScreen(screenName) {
    Object.values(elements.screens).forEach(screen => {
      screen.classList.add('hidden');
    });
    elements.screens[screenName].classList.remove('hidden');
    gameState.currentScreen = screenName;
  }

  function startShow() {
    showScreen('hostIntro');
    playSound('tv-on');
  }

  function startHostIntro() {
    showScreen('fastMoney');
    startRound();
  }

  // Game Logic
  function startRound() {
    gameState.timeLeft = config.timePerRound;
    gameState.currentQuestionIndex = (gameState.round - 1) * config.questionsPerRound;
    updateTimerDisplay();
    showQuestion();
    startTimer();
  }

  function showQuestion() {
    const question = questions[gameState.currentQuestionIndex];
    elements.game.questionDisplay.textContent = question.text;
    elements.game.roundNumber.textContent = `ROUND ${gameState.round}`;
    elements.game.answerInput.value = '';
    elements.game.answerInput.focus();
  }

  function startTimer() {
    if (gameState.timer) clearInterval(gameState.timer);
    
    const startTime = Date.now();
    const roundDuration = config.timePerRound * 1000;
    
    gameState.timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = roundDuration - elapsed;
      
      if (remaining <= 0) {
        endRound();
        return;
      }
      
      gameState.timeLeft = Math.ceil(remaining / 1000);
      updateTimerDisplay();
    }, 100);
  }

  function updateTimerDisplay() {
    elements.game.timer.textContent = gameState.timeLeft;
    elements.game.timerBar.style.width = `${(gameState.timeLeft / config.timePerRound) * 100}%`;
    
    if (gameState.timeLeft <= 5) {
      elements.game.timer.classList.add('urgent');
    } else {
      elements.game.timer.classList.remove('urgent');
    }
  }

  function submitAnswer() {
    const answer = elements.game.answerInput.value.trim().toLowerCase();
    if (!answer) return;

    const question = questions[gameState.currentQuestionIndex];
    const matchedAnswer = findMatchingAnswer(answer, question.answers);
    
    if (matchedAnswer) {
      const points = gameState.round === 2 ? matchedAnswer.points * 2 : matchedAnswer.points;
      gameState.score += points;
      elements.game.currentScore.textContent = gameState.score;
      
      // Show the matched answer with animation
      revealAnswer(matchedAnswer, points);
    }

    // Add to previous answers
    addToPreviousAnswers(answer);
    
    // Clear input and move to next question
    elements.game.answerInput.value = '';
    gameState.currentQuestionIndex++;
    
    if (gameState.currentQuestionIndex % config.questionsPerRound === 0) {
      endRound();
    } else {
      showQuestion();
    }
  }

  function findMatchingAnswer(userAnswer, possibleAnswers) {
    return possibleAnswers.find(a => {
      const answer = a.text.toLowerCase();
      return !gameState.revealedAnswers.has(answer) &&
             (answer.includes(userAnswer) || userAnswer.includes(answer));
    });
  }

  function revealAnswer(answer, points) {
    gameState.revealedAnswers.add(answer.text.toLowerCase());
    
    const answerElement = document.createElement('div');
    answerElement.className = 'answer-reveal';
    answerElement.innerHTML = `
      <span class="answer-text">${answer.text}</span>
      <span class="answer-points">${points}</span>
    `;
    
    elements.game.answersContainer.appendChild(answerElement);
    playSound('reveal');
  }

  function addToPreviousAnswers(answer) {
    const answerElement = document.createElement('div');
    answerElement.className = 'previous-answer';
    answerElement.textContent = answer;
    elements.game.previousAnswers.appendChild(answerElement);
  }

  function endRound() {
    clearInterval(gameState.timer);
    
    if (gameState.round === 1) {
      gameState.round++;
      showCommercialBreak();
    } else {
      showFinalResults();
    }
  }

  function showCommercialBreak() {
    showScreen('commercial');
    setTimeout(() => {
      showScreen('fastMoney');
      startRound();
    }, config.commercialBreakDuration);
  }

  function showFinalResults() {
    showScreen('results');
    
    const finalScore = document.getElementById('final-score');
    const performanceDetails = document.getElementById('performance-details');
    const unlockedSkills = document.getElementById('unlocked-skills');
    
    finalScore.textContent = gameState.score;
    
    // Calculate performance metrics
    const maxPossibleScore = calculateMaxPossibleScore();
    const percentage = (gameState.score / maxPossibleScore) * 100;
    
    // Generate performance summary
    performanceDetails.innerHTML = generatePerformanceSummary(percentage);
    
    // Show unlocked skills based on performance
    unlockedSkills.innerHTML = generateUnlockedSkills(percentage);
  }

  function calculateMaxPossibleScore() {
    return questions.reduce((total, q, index) => {
      const roundMultiplier = index >= config.questionsPerRound ? 2 : 1;
      return total + (q.answers[0].points * roundMultiplier);
    }, 0);
  }

  function generatePerformanceSummary(percentage) {
    if (percentage >= 80) {
      return `
        <div class="performance-metric excellent">
          <h4>Executive Excellence</h4>
          <p>Your business acumen is outstanding! You've demonstrated exceptional understanding of modern business practices.</p>
        </div>
      `;
    } else if (percentage >= 60) {
      return `
        <div class="performance-metric great">
          <h4>Professional Proficiency</h4>
          <p>Strong showing! Your knowledge of business concepts is impressive.</p>
        </div>
      `;
    } else {
      return `
        <div class="performance-metric good">
          <h4>Growing Potential</h4>
          <p>Good foundation! Keep developing your business knowledge.</p>
        </div>
      `;
    }
  }

  function generateUnlockedSkills(percentage) {
    const skills = [];
    if (percentage >= 40) skills.push("Strategic Thinking");
    if (percentage >= 60) skills.push("Business Innovation");
    if (percentage >= 80) skills.push("Executive Leadership");
    
    return skills.map(skill => `
      <div class="skill-badge">
        <i class="fas fa-star"></i>
        <span>${skill}</span>
      </div>
    `).join('');
  }

  // Sound Effects (placeholder functions)
  function playSound(soundName) {
    // Implement sound playing logic
    console.log(`Playing sound: ${soundName}`);
  }

  // Event Listeners
  elements.buttons.startShow.addEventListener('click', startShow);
  elements.buttons.startGame.addEventListener('click', startHostIntro);
  elements.buttons.playAgain.addEventListener('click', () => location.reload());
  
  elements.game.answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') submitAnswer();
  });

  // Initialize TV Effects
  addTVEffects();
};

// Initialize game when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", window.initGame);
} else {
  window.initGame();
}
