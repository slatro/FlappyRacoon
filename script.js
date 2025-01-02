const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Game state
let gameOver = false;
let gameStarted = false;
let score = 0;

// Raccoon properties
let raccoonX = 50;
let raccoonY = CANVAS_HEIGHT / 2;
const raccoonWidth = 100;
const raccoonHeight = 100;
let raccoonVelocity = 0;
const gravity = 0.25;
const jumpPower = -6;

// Pipe properties
const pipeWidth = 200;
let pipeGap = 100;
let pipeSpeed = 1;
let pipes = [];
let pipeFrequency = 10;
let frameCount = 0;

// Modal elements
const gameOverModal = document.getElementById("gameOverModal");
const retryBtn = document.getElementById("retryBtn");

// Event listeners
canvas.addEventListener("mousedown", handleJump);
retryBtn.addEventListener("click", resetGame);

// Images
const bgImage = new Image();
bgImage.src = "https://r.resimlink.com/2RDg1o4Zqrv.jpg";

const raccoonImage = new Image();
raccoonImage.src = "https://r.resimlink.com/TEwtcpF7.png";

const pipeNorthImage = new Image();
pipeNorthImage.src = "https://r.resimlink.com/y57S-u.png";

const pipeSouthImage = new Image();
pipeSouthImage.src = "https://r.resimlink.com/pYwTmztSd5h.png";

const logoImage = new Image();
logoImage.src = "https://r.resimlink.com/o37SOx6.png";

function update() {
  if (!gameOver && gameStarted) {
    // Apply gravity
    raccoonVelocity += gravity;
    raccoonY += raccoonVelocity;

    // Check boundaries
    if (raccoonY < 0 || raccoonY + raccoonHeight > CANVAS_HEIGHT) {
      endGame();
    }

    // Pipe generation logic
    frameCount++;
    if (frameCount % pipeFrequency === 0) {
      createPipe();
    }

    movePipes();
    checkCollision();
    updateScore();

    if (score > 0 && score % 100 === 0) {
      pipeSpeed += 0.05;
      pipeGap = Math.max(400, 500 - score);
    }
  }

  draw();
  requestAnimationFrame(update);
}

function createPipe() {
  const topHeight = Math.random() * (CANVAS_HEIGHT - pipeGap - 200) + 50;
  const bottomY = topHeight + pipeGap;
  pipes.push({
    x: CANVAS_WIDTH,
    topHeight: topHeight,
    bottomY: bottomY,
    passed: false
  });
}

function movePipes() {
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= pipeSpeed;
  }
  pipes = pipes.filter((pipe) => pipe.x + pipeWidth > 0);
}

function checkCollision() {
  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];

    if (
      raccoonX < pipe.x + pipeWidth &&
      raccoonX + raccoonWidth > pipe.x &&
      (raccoonY < pipe.topHeight || raccoonY + raccoonHeight > pipe.bottomY)
    ) {
      endGame();
    }
  }
}

function updateScore() {
  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    if (!pipe.passed && raccoonX > pipe.x + pipeWidth) {
      pipe.passed = true;
      score++;
    }
  }
}

function draw() {
  ctx.drawImage(bgImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    // Draw top pipe to stretch beyond canvas
    ctx.drawImage(pipeNorthImage, pipe.x, 0, pipeWidth, pipe.topHeight);
    // Draw bottom pipe to stretch beyond canvas
    ctx.drawImage(pipeSouthImage, pipe.x, pipe.bottomY, pipeWidth, CANVAS_HEIGHT - pipe.bottomY);
  }

  ctx.drawImage(raccoonImage, raccoonX, raccoonY, raccoonWidth, raccoonHeight);

  ctx.fillStyle = "#fff";
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + score, CANVAS_WIDTH - 140, 40);

  if (!gameStarted && !gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "#fff";
    ctx.font = "50px Arial";
    ctx.fillText("Let's Go Racoon!", CANVAS_WIDTH / 2.15 - 150, CANVAS_HEIGHT / 2);

    // Draw logo at the top center of the canvas
    const logoWidth = 400;
    const logoHeight = 200;
    const logoX = (CANVAS_WIDTH - logoWidth) / 2;
    const logoY = CANVAS_HEIGHT / 18
   ;
    ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
  }
}

function handleJump() {
  if (!gameStarted) gameStarted = true;
  if (!gameOver) raccoonVelocity = jumpPower;
}

function endGame() {
  gameOver = true;
  gameOverModal.style.display = "flex";
}

function resetGame() {
  raccoonX = 50;
  raccoonY = CANVAS_HEIGHT / 2;
  raccoonVelocity = 0;
  pipes = [];
  frameCount = 0;
  score = 0;
  pipeSpeed = 2;
  pipeGap = 250;
  pipeFrequency = 250;
  gameOverModal.style.display = "none";
  gameOver = false;
  gameStarted = false;
}

update();


