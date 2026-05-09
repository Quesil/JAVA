const choices = document.querySelectorAll(".choice");
const result = document.getElementById("result");
const button = document.getElementById("battleBtn");
const slider = document.querySelector(".slider");
const music = document.getElementById("bg-music");

const userScoreEl = document.getElementById("user-score");
const compScoreEl = document.getElementById("comp-score");

let userScore = 0;
let compScore = 0;

button.addEventListener("click", () => {
  if (!playerChoice) {
    result.innerText = "Select a video first!";
    return;
  }

  const computer = getComputerChoice();
  const winner = getWinner(playerChoice, computer);

  result.innerText = `You: ${playerChoice} | Enemy: ${computer} → ${winner}`;

  enemyVideo.src = computer + ".mp4";
  enemyVideo.play();

  if (winner === "YOU WIN") {
    userScore++;
    userScoreEl.innerText = userScore;
  } else if (winner === "YOU LOSE") {
    compScore++;
    compScoreEl.innerText = compScore;
  }
});


// Battle
button.addEventListener("click", () => {
  if (!playerChoice) {
    result.innerText = "Select a video first!";
    return;
  }

  const computer = getComputerChoice();
  const winner = getWinner(playerChoice, computer);

  result.innerText = `You: ${playerChoice} | Enemy: ${computer} → ${winner}`;

  // Show enemy video
  enemyVideo.src = computer + ".mp4";
  enemyVideo.play();

  // Update scoreboard
  if (winner === "YOU WIN") {
    userScore++;
    userScoreEl.innerText = userScore;
  } else if (winner === "YOU LOSE") {
    compScore++;
    compScoreEl.innerText = compScore;
  }
});

// Reset scoreboard
resetBtn.addEventListener("click", () => {
  userScore = 0;
  compScore = 0;

  userScoreEl.innerText = userScore;
  compScoreEl.innerText = compScore;

  result.innerText = "Scoreboard reset!";
});

// Opponent video
const enemyVideo = document.getElementById("enemyVideo");

// Variables
let playerChoice = "";
let angle = 0;
let wins = 0;
let losses = 0;
let draws = 0;

// CLICK SELECT + ROTATE
choices.forEach((video, index) => {
  video.addEventListener("click", () => {
    playerChoice = video.dataset.choice;
    result.innerText = "Selected: " + playerChoice;

    angle = index * -120;
    slider.style.transform = `rotateY(${angle}deg)`;
  });
});

// COMPUTER CHOICE
function getComputerChoice() {
  const arr = ["punch", "scissor", "thunder"];
  return arr[Math.floor(Math.random() * arr.length)];
}

// WIN LOGIC
function getWinner(player, computer) {
  if (player === computer) return "DRAW";

  if (
    (player === "punch" && computer === "scissor") ||
    (player === "scissor" && computer === "thunder") ||
    (player === "thunder" && computer === "punch")
  ) {
    return "YOU WIN";
  }

  return "YOU LOSE";
}

// BATTLE
button.addEventListener("click", () => {
  if (!playerChoice) {
    result.innerText = "Select a video first!";
    return;
  }

  const computer = getComputerChoice();
  const winner = getWinner(playerChoice, computer);

  result.innerText = `You: ${playerChoice} | Enemy: ${computer} → ${winner}`;

  // Show enemy video (make sure punch.mp4, scissor.mp4, thunder.mp4 exist)
  enemyVideo.src = computer + ".mp4";
  enemyVideo.play();

  // Update scoreboard
  if (winner === "YOU WIN") {
    wins++;
    winsEl.innerText = wins;
  } else if (winner === "YOU LOSE") {
    losses++;
    lossesEl.innerText = losses;
  } else {
    draws++;
    drawsEl.innerText = draws;
  }
});

// RESET SCOREBOARD
const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", () => {
  wins = 0;
  losses = 0;
  draws = 0;

  winsEl.innerText = wins;
  lossesEl.innerText = losses;
  drawsEl.innerText = draws;

  result.innerText = "Scoreboard reset!";
});

// SLIDER CONTROL
slider.addEventListener("mouseenter", () => {
  slider.style.animationPlayState = "paused";
});

slider.addEventListener("mouseleave", () => {
  slider.style.animationPlayState = "running";
});

// MUSIC CONTROL
function startMusic() {
  music.play();
}

