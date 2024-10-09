const character = document.querySelector(".character");
const obstacle = document.querySelector(".obstacle");
const scoreElement = document.querySelector(".score-value");

let isJumping = false;
let score = 0;
let obstacleSpeed = 5;
let gameInterval;
let gameStarted = false;

function jump() {
  if (isJumping || !gameStarted) return;

  isJumping = true;
  character.classList.add("jumping");

  setTimeout(() => {
    character.classList.replace("jumping", "falling");
  }, 400);

  setTimeout(() => {
    character.classList.remove("falling");
    isJumping = false;
  }, 600);
}

function moveObstacle() {
  const obstaclePosition = obstacle.offsetLeft;

  if (obstaclePosition <= -20) {
    resetObstacle();
  } else {
    obstacle.style.left = `${obstaclePosition - obstacleSpeed}px`;
  }
}

function resetObstacle() {
  obstacle.style.left = "600px";
  scoreElement.textContent = ++score;
}

function detectCollision() {
  const characterRect = character.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  const overlap = (
    characterRect.left < obstacleRect.right &&
    characterRect.right > obstacleRect.left &&
    characterRect.top < obstacleRect.bottom &&
    characterRect.bottom > obstacleRect.top
  );

  if (overlap) endGame();
}

function gameLoop() {
  moveObstacle();
  detectCollision();
}

function startGame() {
  gameStarted = true;
  score = 0;
  scoreElement.textContent = score;
  gameInterval = setInterval(gameLoop, 20);
}

function endGame() {
  clearInterval(gameInterval);
  alert(`Game Over! Final Score: ${score}`);
  resetGame();
}

function resetGame() {
  resetObstacle();
  gameStarted = false;
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !gameStarted) startGame();
  if ((e.key === " " || e.key === "Spacebar") && gameStarted) jump();
});
