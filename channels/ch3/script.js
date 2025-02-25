// channels/ch3/script.js
window.initGame = function() {
  const gameElements = {
    startBtn: document.getElementById("startBtn"),
    questionContainer: document.getElementById("questionContainer"),
    questionText: document.getElementById("question"),
    answerInput: document.getElementById("answerInput"),
    timerDisplay: document.getElementById("timer"),
    scoreDisplay: document.getElementById("score"),
    roundDisplay: document.getElementById("roundDisplay"),
    resultScreen: document.getElementById("resultScreen"),
    resultsContainer: document.getElementById("resultsContainer"),
    restartBtn: document.getElementById("restartBtn"),
    gameMessage: document.getElementById("gameMessage")
  };

  if (!gameElements.startBtn) {
    console.error("Start button not found, DOM might not be ready");
    setTimeout(window.initGame, 100);
    return;
  }

  const gameState = {
    currentRound: 1,
    currentQuestion: 0,
    score: 0,
    timeLeft: 30,
    timer: null,
    answers: []
  };

  const questions = [
    // Round 1 Questions
    [
      {
        question: "Name a key skill in modern financial analysis",
        answers: [
          { text: "Data Visualization", points: 30 },
          { text: "Predictive Modeling", points: 25 },
          { text: "Python/SQL", points: 20 },
          { text: "Excel", points: 15 },
          { text: "Statistical Analysis", points: 10 }
        ]
      },
      {
        question: "What's most important in brand development?",
        answers: [
          { text: "Story/Identity", points: 35 },
          { text: "Target Audience", points: 25 },
          { text: "Visual Design", points: 20 },
          { text: "Market Research", points: 15 },
          { text: "Consistency", points: 5 }
        ]
      },
      {
        question: "Top consideration in AI implementation?",
        answers: [
          { text: "Ethics", points: 40 },
          { text: "ROI", points: 25 },
          { text: "Scalability", points: 15 },
          { text: "Integration", points: 12 },
          { text: "Training", points: 8 }
        ]
      },
      {
        question: "Essential leadership quality?",
        answers: [
          { text: "Communication", points: 35 },
          { text: "Vision", points: 25 },
          { text: "Adaptability", points: 20 },
          { text: "Empathy", points: 15 },
          { text: "Decision-making", points: 5 }
        ]
      },
      {
        question: "Key factor in market expansion?",
        answers: [
          { text: "Market Research", points: 30 },
          { text: "Strategy", points: 25 },
          { text: "Resources", points: 20 },
          { text: "Timing", points: 15 },
          { text: "Competition", points: 10 }
        ]
      }
    ],
    // Round 2 Questions (Different questions, points will be doubled)
    [
      {
        question: "Critical skill in consulting?",
        answers: [
          { text: "Problem Solving", points: 35 },
          { text: "Communication", points: 25 },
          { text: "Analysis", points: 20 },
          { text: "Industry Knowledge", points: 15 },
          { text: "Project Management", points: 5 }
        ]
      },
      {
        question: "Most valuable tech skill today?",
        answers: [
          { text: "AI/ML", points: 40 },
          { text: "Data Analysis", points: 25 },
          { text: "Programming", points: 15 },
          { text: "Cloud Computing", points: 12 },
          { text: "Cybersecurity", points: 8 }
        ]
      },
      {
        question: "Key to successful innovation?",
        answers: [
          { text: "User Focus", points: 35 },
          { text: "Research", points: 25 },
          { text: "Experimentation", points: 20 },
          { text: "Collaboration", points: 15 },
          { text: "Risk Taking", points: 5 }
        ]
      },
      {
        question: "Most important in project management?",
        answers: [
          { text: "Planning", points: 30 },
          { text: "Communication", points: 25 },
          { text: "Risk Management", points: 20 },
          { text: "Team Leadership", points: 15 },
          { text: "Budget Control", points: 10 }
        ]
      },
      {
        question: "Essential for digital transformation?",
        answers: [
          { text: "Change Management", points: 35 },
          { text: "Strategy", points: 25 },
          { text: "Technology", points: 20 },
          { text: "Training", points: 15 },
          { text: "Leadership", points: 5 }
        ]
      }
    ]
  ];

  function startTimer() {
    gameState.timeLeft = 30;
    updateTimer();
    gameState.timer = setInterval(() => {
      gameState.timeLeft--;
      updateTimer();
      if (gameState.timeLeft <= 0) {
        endRound();
      }
    }, 1000);
  }

  function updateTimer() {
    gameElements.timerDisplay.textContent = gameState.timeLeft;
    if (gameState.timeLeft <= 5) {
      gameElements.timerDisplay.classList.add('urgent');
    }
  }

  function startRound() {
    gameElements.questionContainer.classList.remove('hidden');
    gameElements.answerInput.value = '';
    gameElements.answerInput.focus();
    gameState.currentQuestion = 0;
    showQuestion();
    startTimer();
  }

  function showQuestion() {
    const currentQ = questions[gameState.currentRound - 1][gameState.currentQuestion];
    gameElements.questionText.textContent = currentQ.question;
    gameElements.roundDisplay.textContent = `Round ${gameState.currentRound}`;
  }

  function submitAnswer() {
    const answer = gameElements.answerInput.value.trim().toLowerCase();
    const currentQ = questions[gameState.currentRound - 1][gameState.currentQuestion];
    
    // Store answer for review
    gameState.answers.push({
      question: currentQ.question,
      answer: answer
    });

    // Clear input and move to next question
    gameElements.answerInput.value = '';
    gameState.currentQuestion++;

    if (gameState.currentQuestion < questions[gameState.currentRound - 1].length) {
      showQuestion();
    } else {
      endRound();
    }
  }

  function endRound() {
    clearInterval(gameState.timer);
    calculateScore();
    
    if (gameState.currentRound === 1) {
      // Start round 2
      gameState.currentRound = 2;
      gameElements.gameMessage.textContent = "Get ready for Round 2! Points are doubled!";
      setTimeout(startRound, 3000);
    } else {
      showFinalResults();
    }
  }

  function calculateScore() {
    gameState.answers.forEach((answerObj, index) => {
      const roundIndex = index < 5 ? 0 : 1;
      const questionIndex = index % 5;
      const question = questions[roundIndex][questionIndex];
      
      const matchedAnswer = question.answers.find(ans => 
        ans.text.toLowerCase().includes(answerObj.answer.toLowerCase()) ||
        answerObj.answer.toLowerCase().includes(ans.text.toLowerCase())
      );

      if (matchedAnswer) {
        const points = roundIndex === 1 ? matchedAnswer.points * 2 : matchedAnswer.points;
        gameState.score += points;
      }
    });
    
    gameElements.scoreDisplay.textContent = gameState.score;
  }

  function showFinalResults() {
    gameElements.questionContainer.classList.add('hidden');
    gameElements.resultScreen.classList.remove('hidden');
    
    const totalPossibleScore = questions.reduce((total, round, roundIndex) => {
      return total + round.reduce((roundTotal, q) => {
        return roundTotal + (q.answers[0].points * (roundIndex === 1 ? 2 : 1));
      }, 0);
    }, 0);

    const percentage = (gameState.score / totalPossibleScore) * 100;
    let message = "";
    
    if (percentage >= 80) {
      message = "Outstanding! You're a Strategic Mastermind! 🏆";
    } else if (percentage >= 60) {
      message = "Great job! You've got solid business acumen! 🌟";
    } else if (percentage >= 40) {
      message = "Good effort! Keep developing those skills! 📈";
    } else {
      message = "Thanks for playing! Try again to improve your score! 💪";
    }

    gameElements.resultsContainer.innerHTML = `
      <h2>${message}</h2>
      <p>Final Score: ${gameState.score} points</p>
      <div class="answer-review">
        <h3>Your Best Answers:</h3>
        ${generateAnswerReview()}
      </div>
    `;
  }

  function generateAnswerReview() {
    return gameState.answers
      .map((answer, index) => `
        <div class="answer-item">
          <strong>Q${index + 1}:</strong> ${answer.question}
          <br>Your answer: ${answer.answer}
        </div>
      `)
      .join('');
  }

  // Event Listeners
  gameElements.startBtn.addEventListener('click', () => {
    gameElements.startBtn.classList.add('hidden');
    startRound();
  });

  gameElements.answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && gameElements.answerInput.value.trim()) {
      submitAnswer();
    }
  });

  gameElements.restartBtn.addEventListener('click', () => {
    location.reload();
  });
};

// Initialize game when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", window.initGame);
} else {
  window.initGame();
}
