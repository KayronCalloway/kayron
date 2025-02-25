// channels/ch3/script.js
function initGame() {
  const startBtn = document.getElementById("startBtn");
  console.log("initGame called. document.readyState:", document.readyState, "startBtn:", startBtn);
  if (!startBtn) { setTimeout(initGame, 100); return; }
  // Automatically start the game by hiding the start button and starting the game
  startBtn.classList.add("hidden");
  nextQuestion();
  const questionContainer = document.getElementById("questionContainer");
  const questionText = document.getElementById("question");
  const choicesContainer = document.getElementById("choices");
  const finalRound = document.getElementById("finalRound");
  const smashBtn = document.getElementById("smashBtn");
  const smashCountDisplay = document.getElementById("smashCount");
  const resultScreen = document.getElementById("resultScreen");
  const unlockedSkills = document.getElementById("unlockedSkills");
  const restartBtn = document.getElementById("restartBtn");

  let smashCount = 0;
  let skillsUnlocked = [];
  let currentQuestionIndex = 0;

  const questions = [
    {
      question: "You’ve been hired to reposition a struggling brand. What’s your first move?",
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
      finalRound.classList.remove("hidden");
      return;
    }
    const { question, choices } = questions[currentQuestionIndex];
    questionText.textContent = question;
    choicesContainer.innerHTML = "";
    choices.forEach((choice, index) => {
      const btn = document.createElement("button");
      btn.textContent = choice;
      btn.addEventListener("click", () => checkAnswer(index));
      choicesContainer.appendChild(btn);
    });
    questionContainer.classList.remove("hidden");
  }

  function checkAnswer(selectedIndex) {
    const currentQ = questions[currentQuestionIndex];
    if (selectedIndex === currentQ.correct) {
      skillsUnlocked.push(currentQ.skill);
    }
    currentQuestionIndex++;
    nextQuestion();
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
    unlockedSkills.innerHTML = skillsUnlocked.join("<br>");
  }

  restartBtn.addEventListener("click", () => {
    location.reload();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGame);
} else {
  initGame();
}
