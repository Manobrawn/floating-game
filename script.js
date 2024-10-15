const canvas = document.getElementById('canvas');
context = canvas.getContext("2d");

const scoreSound = new Audio('./score-sound.mp3');
const accelerateSound = new Audio('./accelerate-sound.mp3');
const gameOverSound = new Audio('./game-over-sound.mp3');

canvas.style.background = '#accba1';
canvas.width = 1000;
canvas.height = 400;

let playerY = 130;
const playerX = 100;
const playerWidth = 30;
const playerHeight = 30;
let velocityY = 0; 
const jumpPower = 3;
const gravity = 0.1;
const maxFallSpeed = 7; 

let obstacleX = 700;
let obstacleY = 130;
const obstacleWidth = 30;
const obstacleHeight = 140;
let obstacleSpeed = 4; 
const speedIncreaseThreshold = 3; 
let gameRunning = false;
let score = 0;

function drawPlayer() {
  const playerRadius = playerWidth / 2;

  context.fillStyle = 'white';
  context.beginPath();
  context.arc(playerX + playerRadius, playerY + playerRadius, playerRadius, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = 'white';
  context.lineWidth = 5;
  context.beginPath();
  context.arc(playerX + playerRadius, playerY + playerRadius, playerRadius, 0, Math.PI * 2);
  context.stroke();
}

function drawObstacle() {
  const borderRadius = obstacleWidth * 0.2;

  context.fillStyle = '#e06600'; 
  context.strokeStyle = 'white'; 
  context.lineWidth = 4; 

  context.beginPath();
  context.moveTo(obstacleX + borderRadius, obstacleY); 
  context.lineTo(obstacleX + obstacleWidth - borderRadius, obstacleY);
  context.arcTo(obstacleX + obstacleWidth, obstacleY, obstacleX + obstacleWidth, obstacleY + borderRadius, borderRadius); 
  context.lineTo(obstacleX + obstacleWidth, obstacleY + obstacleHeight - borderRadius);
  context.arcTo(obstacleX + obstacleWidth, obstacleY + obstacleHeight, obstacleX + obstacleWidth - borderRadius, obstacleY + obstacleHeight, borderRadius); 
  context.lineTo(obstacleX + borderRadius, obstacleY + obstacleHeight);  
  context.arcTo(obstacleX, obstacleY + obstacleHeight, obstacleX, obstacleY + obstacleHeight - borderRadius, borderRadius);
  context.lineTo(obstacleX, obstacleY + borderRadius); 
  context.arcTo(obstacleX, obstacleY, obstacleX + borderRadius, obstacleY, borderRadius); 
  context.closePath();

  context.fill();

  context.stroke();
}

function drawScore() {
  context.fillStyle = 'white';
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
      gameOverSound.play();
      alert(`Game over! Your score was ${score}`); 
      stopGame();
      return; 
    }

    obstacleX -= obstacleSpeed;
    
    if (obstacleX + obstacleWidth < 0) {
      obstacleX = canvas.width;
      obstacleY = Math.floor(Math.random() * (canvas.height - obstacleHeight));
      score++;
      scoreSound.play();

      if (score % speedIncreaseThreshold === 0) {
        obstacleSpeed += 0.5;
        accelerateSound.play();
      }
    }

    requestAnimationFrame(moveObstacle);
  }
}

function startGame() {
  if (!gameRunning) {
    score = 0; 
    obstacleSpeed = 4; 
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

canvas.addEventListener('click', () => {
  if (!gameRunning) {
    startGame();
  } else {
    playerJump();
  }
});

canvas.addEventListener('touchstart', (event) => {
  event.preventDefault(); 
  if (!gameRunning) {
    startGame();
  } else {
    playerJump();
  }
});

const toggleInstructionsCheckbox = document.getElementById('toggle-instructions');
const instructionsContainer = document.querySelector('.instructions-container');

document.addEventListener("DOMContentLoaded", () => {

  instructionsContainer.style.display = toggleInstructionsCheckbox.checked ? 'block' : 'none';

  toggleInstructionsCheckbox.addEventListener('change', handleToggleInstructions);

  window.addEventListener('resize', handleResize);
});

function handleToggleInstructions() {
  const screenWidth = window.innerWidth;
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;

  instructionsContainer.style.display = toggleInstructionsCheckbox.checked ? 'block' : 'none';

  if (screenWidth <= 900 && isLandscape) {
    document.querySelector('main').style.marginBottom = toggleInstructionsCheckbox.checked ? '26rem' : '21rem';
  } else {
    document.querySelector('main').style.marginBottom = ''; 
  }
}

function handleResize() {
  const screenWidth = window.innerWidth;
  const isLandscape = window.innerWidth > window.innerHeight;

  if (screenWidth <= 900 && isLandscape) {
    document.querySelector('main').style.marginBottom = toggleInstructionsCheckbox.checked ? '26rem' : '21rem';
  } else {
    document.querySelector('main').style.marginBottom = ''; 
  }
}
