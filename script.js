const canvas = document.getElementById('canvas');
context = canvas.getContext("2d");

canvas.style.background = '#d3e4cd';
canvas.width = 800;
canvas.height = 300;

let playerY = 130;
const playerX = 100;
const playerWidth = 25;
const playerHeight = 25;
let velocityY = 0; 
const jumpPower = 3;
const gravity = 0.1;
const maxFallSpeed = 7; 

let obstacleX = 700;
let obstacleY = 130;
const obstacleWidth = 25;
const obstacleHeight = 90;
let obstacleSpeed = 2; 
const speedIncreaseThreshold = 3; 
let gameRunning = false;
let score = 0;

function drawPlayer() {
  context.fillStyle = 'black';
  context.fillRect(playerX, playerY, playerWidth, playerHeight);
}

function drawObstacle() {
  context.fillStyle = '#e06600';
  context.fillRect(obstacleX, obstacleY, obstacleWidth, obstacleHeight);
}

function drawScore() {
  context.fillStyle = 'black';
  context.font = '20px Arial';
  context.fillText(`Score: ${score}`, 5, 25); 
}

function applyGravity() {
  velocityY += gravity;
  
  if (velocityY > maxFallSpeed) {
    velocityY = maxFallSpeed;
  }
  
  playerY += velocityY;

  if (playerY + playerHeight > canvas.height) {
    playerY = canvas.height - playerHeight;
    velocityY = 0;
  }

  if (playerY < 0) {
    playerY = 0;
    velocityY = 0;
  }
}

function playerJump() {
  velocityY = -jumpPower;
}

function checkCollision() {
  if (playerY <= 0 || playerY + playerHeight >= canvas.height) {
    return true;
  }

  if (playerX < obstacleX + obstacleWidth &&
      playerX + playerWidth > obstacleX &&
      playerY < obstacleY + obstacleHeight &&
      playerY + playerHeight > obstacleY) {
    return true;
  }

  return false;
}

function moveObstacle() {
  if (gameRunning) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    applyGravity();
    drawPlayer();
    drawObstacle();
    drawScore(); 

    if (checkCollision()) {
      alert(`Game over! Your score was ${score}`); 
      stopGame();
      return; 
    }

    obstacleX -= obstacleSpeed;
    
    if (obstacleX + obstacleWidth < 0) {
      obstacleX = canvas.width;
      obstacleY = Math.floor(Math.random() * (canvas.height - obstacleHeight));
      score++;

      if (score % speedIncreaseThreshold === 0) {
        obstacleSpeed += 0.5;
      }
    }

    requestAnimationFrame(moveObstacle);
  }
}

function startGame() {
  if (!gameRunning) {
    score = 0; 
    obstacleSpeed = 2; 
    gameRunning = true;
    moveObstacle();
  }
}

function stopGame() {
  gameRunning = false;

  playerY = 130;
  obstacleX = 700;
  obstacleY = 130;

  context.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawObstacle();
}

window.addEventListener('load', () => {
  drawPlayer();
  drawObstacle();
  drawScore(); 
});

const startButton = document.querySelector('.start-button');
startButton.addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
  if (event.code === 'Enter') {
    startGame();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'Escape') {
    stopGame();
  }
});

const exitButton = document.querySelector('.exit-button');
exitButton.addEventListener('click', stopGame);

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    if (!gameRunning) {
      startGame();
    } else {
      event.preventDefault();
      playerJump();
    }
  }
});