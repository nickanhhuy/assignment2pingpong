// Initialize canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var startBtn = document.getElementById("start-btn");
var pauseBtn = document.getElementById("pause-btn");
var restartBtn = document.getElementById("restart-btn");
var multiplayerBtn = document.getElementById("multi-btn");
var aiBtn = document.getElementById("ai-btn");
var gameMode = "";
var LplayerScore = document.getElementById("Leftplayer");
var RplayerScore = document.getElementById("Rightplayer");
var messageElement = document.getElementById("messagedisplay");
var animationId;
var gameRunning = false;

startBtn.addEventListener("click", function() {
  if (gameMode==="multi-btn" || gameMode === "ai-btn") {
    if (!gameRunning) { // only start the game if gameRunning is false
      gameRunning = true; // set gameRunning to true when the game starts
      loop();
    } }
  else {$('#message').text("Please choose your game mode (Multiplayer or Vs Computer)"); // Set the message text
  $('#message-modal').modal('show'); } // Display the message modal
});

pauseBtn.addEventListener("click", function() {
  gameRunning = false;
  cancelAnimationFrame(animationId);
});

restartBtn.addEventListener("click", function() {
  document.location.reload();
});

multiplayerBtn.addEventListener("click", function() {
  gameMode = "multi-btn";
})

aiBtn.addEventListener("click",function() {
  gameMode = "ai-btn";
})

addEventListener("load", (event) => {
  draw();
});


// Define ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    speedx:2,
    speedy:2,
    radius: 10,
    color: "#c8b63e",
    draw() {
        // Draw ball
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    },
};



// Define paddle properties
var paddleHeight = 80;
var paddleWidth = 10;
var leftPaddleY = canvas.height / 2 - paddleHeight / 2;
var rightPaddleY = canvas.height / 2 - paddleHeight / 2;
var paddleSpeed = 8;

// Define barriers properties
const barrier1 = {
  x: canvas.width / 2 - 75,
  y: 0,
  width: 150,
  height: 50,
};

const barrier2 = {
  x: canvas.width / 2 - 75,
  y: canvas.height - 50,
  width: 150,
  height: 50,
};



// Define score properties
var leftPlayerScore = 0;
var rightPlayerScore = 0;
var maxScore = 20;


// Listen for keyboard events
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// Handle key press
var upPressed = false;
var downPressed = false;
let wPressed = false;
let sPressed = false;

function keyDownHandler(e) {
  if (e.key === "ArrowUp") {
    upPressed = true;
  } else if (e.key === "ArrowDown") {
    downPressed = true;
  } else if (e.key === "w") {
    wPressed = true;
  } else if (e.key === "s") {
    sPressed = true;
  }
}

// Handle key release
function keyUpHandler(e) {
  if (e.key === "ArrowUp") {
    upPressed = false;
  } else if (e.key === "ArrowDown") {
    downPressed = false;
  } else if (e.key === "w") {
    wPressed = false;
  } else if (e.key === "s") {
    sPressed = false;
  }
}

//checkbarrier
function checkBarrierCollision() {
  { if (
    ball.x + ball.radius > barrier1.x &&
    ball.x - ball.radius < barrier1.x + barrier1.width &&
    ball.y + ball.radius > barrier1.y &&
    ball.y - ball.radius < barrier1.y + barrier1.height
  ) {
      // Reverse the ball's direction
      ball.speedx = -ball.speedx;
      ball.speedy = -ball.speedy;
    }

    if (
      ball.x + ball.radius > barrier2.x &&
      ball.x - ball.radius < barrier2.x + barrier2.width &&
      ball.y + ball.radius > barrier2.y &&
      ball.y - ball.radius < barrier2.y + barrier2.height
    ) {
        // Reverse the ball's direction
        ball.speedx = -ball.speedx;
        ball.speedy = -ball.speedy;
      }
  }
}

function updateScore(player, score) {
  if (player === "Leftplayer") {
      LplayerScore.textContent = score;
  } else if (player === "Rightplayer") {
      RplayerScore.textContent = score;
  }
  // Display message
  messageElement.textContent = player + " scored: "+ score;
  $('#message').show();
}

// Update game state
function update() {

  if (gameMode === "multi-btn") {
  // Move right paddles based on up and down arrows symbol
    if (upPressed && rightPaddleY > 0) {
      rightPaddleY -= paddleSpeed;
    } else if (downPressed && rightPaddleY + paddleHeight < canvas.height) {
    rightPaddleY += paddleSpeed;
    } 
  } 
  // Move right paddle automatically based on ball position
  else if (gameMode === "ai-btn") {
      if (ball.y > rightPaddleY + paddleHeight / 2) {
      rightPaddleY += paddleSpeed;
    } else if (ball.y < rightPaddleY + paddleHeight / 2) {
      rightPaddleY -= paddleSpeed;}
  }

  // Move left paddle based on "w" and "s" keys
  if (wPressed && leftPaddleY > 0) {
    leftPaddleY -= paddleSpeed;
  } else if (sPressed && leftPaddleY + paddleHeight < canvas.height) {
    leftPaddleY += paddleSpeed;
  }

  // Move ball
  ball.x += ball.speedx;
  ball.y += ball.speedy;

  // Check if ball collides with top or bottom of canvas
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.speedy = -ball.speedy;
  }

  // Check if ball collides with left paddle
  if (
    ball.x - ball.radius < paddleWidth &&
    ball.y > leftPaddleY &&
    ball.y < leftPaddleY + paddleHeight
  ) {
    ball.speedx = -ball.speedx;
  }
  checkBarrierCollision();

  // Check if ball collides with right paddle
  if (
    ball.x + ball.radius > canvas.width - paddleWidth &&
    ball.y > rightPaddleY &&
    ball.y < rightPaddleY + paddleHeight
  ) {
    ball.speedx = -ball.speedx;
  }

  // Check if ball goes out of bounds on left or right side of canvas
  if (ball.x < 10) {
    rightPlayerScore++;
    updateScore("rightplayer",rightPlayerScore)
    reset();
  } else if (ball.x > canvas.width - 10) {
    leftPlayerScore++;
    updateScore("leftplayer",leftPlayerScore)
    reset();
  }
  

  // Check if a player has won
  if (leftPlayerScore === maxScore) {
    playerWin("Left player");
  } else if (rightPlayerScore === maxScore) {
    playerWin("Right player");
  }
}


function playerWin(player) {
  var message = "Congratulations! " + player + " win!";
  $('#message').text(message); // Set the message text
  $('#message-modal').modal('show'); // Display the message modal
  reset();
}

// Reset ball to center of screen
function reset() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speedx = -ball.speedx;
  ball.speedy = Math.random() * 10 - 5;
}

// Draw objects on canvas
function draw() {

  //Color for paddles and score
  ctx.fillStyle = "#c10300";
  ctx.font = "bold 30px Arial ";

  //Draw a line
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#c10300"; // Set line color to white
  ctx.stroke();
  ctx.closePath();
  
  //Draw a circle
  ctx.beginPath();
  ctx.arc(400, 300, 150, 0, 2 * Math.PI); // (horizontal, diagonal, size, start angle to 0 and end at 2*Math.PI)
  ctx.strokeStyle = "#c10300";
  ctx.lineWidth = 5;
  ctx.stroke()
  ctx.closePath();

  
  
  // Draw left paddle
  ctx.fillRect(7, leftPaddleY, paddleWidth, paddleHeight);

  // Draw right paddle
  ctx.fillRect(canvas.width - paddleWidth - 7, rightPaddleY, paddleWidth, paddleHeight);

  // Draw scores
  ctx.fillText(leftPlayerScore, 150, 200);
  ctx.fillText(rightPlayerScore, canvas.width - 150, 200);
  
  //Draw barriers
  ctx.fillStyle = "#1c9048";
  ctx.fillRect(barrier1.x, barrier1.y, barrier1.width, barrier1.height);
  ctx.fillRect(barrier2.x, barrier2.y, barrier2.width, barrier2.height);

  //Draw a ball and fill its color
  ball.draw();

  //Fill background
  ctx.fillStyle = "rgb(0 255 255/ 20%)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

}


// Game loop
function loop() {
  update();
  draw();
  animationId = requestAnimationFrame(loop);
}

$('#message-modal-close').on('click', function() {
  document.location.reload();
});