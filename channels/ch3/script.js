// channels/ch3/script.js
window.initGame = function() {
  console.log("initGame called. document.readyState:", document.readyState);
  
  const startBtn = document.getElementById("startBtn");
  const questionContainer = document.getElementById("questionContainer");
  const questionText = document.getElementById("question");
  const choicesContainer = document.getElementById("choices");
  const finalRound = document.getElementById("finalRound");
  const smashBtn = document.getElementById("smashBtn");
  const smashCountDisplay = document.getElementById("smashCount");
  const resultScreen = document.getElementById("resultScreen");
  const unlockedSkills = document.getElementById("unlockedSkills");
  const restartBtn = document.getElementById("restartBtn");
  const progressContainer = document.getElementById("progressContainer");
  const roundCount = document.getElementById("roundCount");
  const progressBar = document.getElementById("progressBar");
  const gameMessage = document.getElementById("gameMessage");
  
  if (!startBtn) {
    console.error("Start button not found, DOM might not be ready");
    setTimeout(window.initGame, 100);
    return;
  }

  let smashCount = 0;
  let skillsUnlocked = [];
  let currentQuestionIndex = 0;

  const questions = [
    {
      question: "You've been hired to reposition a struggling brand. What's your first move?",
      choices: [
        "Storytelling & Brand Identity",
        "Flood social media with ads",
        "Change the logo and hope for the best"
      ],
      correct: 0,
      skill: "Brand Strategy & Creative Direction"
    },
    {
      question: "A startup asks for AI-driven growth recommendations. What do you prioritize?",
      choices: [
        "Ethical AI & Consumer Trust",
        "Collect as much data as possible",
        "Automate everything"
      ],
      correct: 0,
      skill: "AI Ethics & Business Strategy"
    }
  ];

  function nextQuestion() {
    if (currentQuestionIndex >= questions.length) {
      questionContainer.classList.add("hidden");
      progressContainer.classList.add("hidden");
      finalRound.classList.remove("hidden");
      return;
    }
    
    // Update progress
    roundCount.textContent = currentQuestionIndex + 1;
    progressBar.value = currentQuestionIndex + 1;
    
    const { question, choices } = questions[currentQuestionIndex];
    questionText.textContent = question;
    choicesContainer.innerHTML = "";
    
    choices.forEach((choice, index) => {
      const btn = document.createElement("button");
      btn.textContent = choice;
      btn.addEventListener("click", () => checkAnswer(index));
      choicesContainer.appendChild(btn);
    });
    
    progressContainer.classList.remove("hidden");
    questionContainer.classList.remove("hidden");
  }

  function checkAnswer(selectedIndex) {
    const currentQ = questions[currentQuestionIndex];
    if (selectedIndex === currentQ.correct) {
      skillsUnlocked.push(currentQ.skill);
      gameMessage.textContent = "Correct answer! Moving to next question...";
    } else {
      gameMessage.textContent = "Not quite right, but let's continue...";
    }
    
    currentQuestionIndex++;
    setTimeout(nextQuestion, 1000);
  }

  smashBtn.addEventListener("click", () => {
    smashCount++;
    smashCountDisplay.textContent = `Clicks: ${smashCount}`;
    if (smashCount >= 15) {
      finalRound.classList.add("hidden");
      showResult();
    }
  });

  function showResult() {
    resultScreen.classList.remove("hidden");
    if (skillsUnlocked.length === 0) {
      skillsUnlocked.push("Basic Problem Solving");
    }
    unlockedSkills.innerHTML = skillsUnlocked.map(skill => `<div class="skill">✅ ${skill}</div>`).join("");
  }

  restartBtn.addEventListener("click", () => {
    // Reset game state
    smashCount = 0;
    skillsUnlocked = [];
    currentQuestionIndex = 0;
    smashCountDisplay.textContent = "Clicks: 0";
    
    // Hide all sections
    questionContainer.classList.add("hidden");
    finalRound.classList.add("hidden");
    resultScreen.classList.add("hidden");
    progressContainer.classList.add("hidden");
    
    // Show start button
    startBtn.classList.remove("hidden");
    gameMessage.textContent = "Welcome contestant! Get ready to test your skills!";
  });

  // Start button event listener
  startBtn.addEventListener("click", () => {
    startBtn.classList.add("hidden");
    gameMessage.textContent = "Game started! Choose wisely...";
    progressBar.max = questions.length;
    nextQuestion();
  });
};

// Check if document is already loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function() {
    if (typeof window.initGame === "function") {
      window.initGame();
    }
  });
} else {
  // Document already loaded, call initGame directly
  if (typeof window.initGame === "function") {
    window.initGame();
  }
}
