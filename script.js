class Player {
  constructor(htmlElement) {
    this.htmlElement = htmlElement;
    this.isJumping = false;
    this.jumpHeight = 150; 
    this.gravity = 5;    
    this.position = 100;    
    this.velocity = 0;    
    this.isFalling = true;
    this.maxHeight = 400; 
  }

  jump() {
    if (this.position < this.maxHeight) { 
      this.velocity = this.jumpHeight;   
      this.position += this.velocity;     
      this.updatePosition();
    }
  }

  updatePosition() {
    this.htmlElement.style.bottom = this.position + 'px';
  }
}

class Obstacle {
  constructor(htmlElement, speed) {
    this.htmlElement = htmlElement;
    this.speed = speed;
    this.positionX = 100;
    this.positionY = Math.floor(Math.random() * 80);
  }

  move() {
    this.positionX -= this.speed;
    this.positionY = this.positionY;
    this.updatePosition();
    if (this.positionX < -20) {
      this.positionX = 100;
      this.positionY = this.positionY = Math.floor(Math.random() * 80);
      game.increaseScore(); 
    }
  }

  updatePosition() {
    this.htmlElement.style.left = this.positionX + '%';
    this.htmlElement.style.bottom = this.positionY + '%';
  } 

  detectCollision(player) {
    const playerRect = player.htmlElement.getBoundingClientRect();
    const obstacleRect = this.htmlElement.getBoundingClientRect();
    
    return (
    playerRect.left < obstacleRect.right &&
    playerRect.right > obstacleRect.left &&
    playerRect.top < obstacleRect.bottom &&
    playerRect.bottom > obstacleRect.top
    );
  }
}

class Game {
  constructor(player, obstacle) {
    this.player = player;
    this.obstacle = obstacle;
    this.isGameRunning = false;
    this.score = 0; 
    this.scoreElement = document.querySelector('.score');
    this.applyGravity();
  }

  applyGravity() {
    setInterval(() => {
      if (this.isGameRunning) {
        this.player.position -= this.player.gravity;
      }
      if (this.player.position < 0) {
        this.player.position = 0;
        this.player.isFalling = false; 
      } else {
        this.player.isFalling = true;
      }
      this.player.updatePosition();
    }, 15); 
  }

  gameLoop () {
    if (!this.isGameRunning) {
      return;
    }
    this.obstacle.move();
    if (this.obstacle.detectCollision(this.player)) {
      confirm(`Game Over! Your score was ${game.score}!`)
      game.exit();
    }
    requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  increaseScore() {
    this.score += 1;
    this.updateScoreDisplay(); 
  }

  updateScoreDisplay() { 
    this.scoreElement.innerText = `Score: ${this.score}`;
  }

  exit() {
    if (this.isGameRunning) {
      this.isGameRunning = false;  
      obstacle.positionX = 90;
      obstacle.positionY = 5;
      obstacle.updatePosition();
      player.position = 100;
      player.updatePosition();
      this.score = 0; 
      this.updateScoreDisplay(); 
    };
  }

  start() {
    if (!this.isGameRunning) {
      this.isGameRunning = true; 
      this.score = 0; 
      this.updateScoreDisplay();
      this.gameLoop();    
    };        
  }
}

const player = new Player(document.querySelector('.player'));
const obstacle = new Obstacle(document.querySelector('.obstacle'), 1);
const gameContainer = document.getElementById('game-container');
const game = new Game(player, obstacle, gameContainer);


const startButton = document.querySelector('.start-button');
startButton.addEventListener('click', () => {
  game.start();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {  
    game.start();  
  }
});

const exitButton = document.querySelector('.exit-button');
exitButton.addEventListener('click', () => {
  game.exit();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {  
    game.exit();  
  }
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    if (game.isGameRunning) {
      player.jump();
    console.log('should be jumping')
    }
    else {
      game.start(); 
    }
  }
});