
//stops scroling
window.addEventListener(
  "keydown",
  (e) => {
    if (
      ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
        e.code
      )
    ) {
      e.preventDefault();
    }
  },
  false
);
// This is not my code ^ it disables scrolling with arrow keys and spacebar

let loseMessage = document.getElementById("loseMessage");
let winMessage = document.getElementById("winMessage");
let canHitSelf = document.getElementById("canHitSelf");
let wallHit = document.getElementById("walls");
let prompts = document.querySelector(".prompts");
prompts.innerHTML = "Press An Arrow Key To Start";
let score = 0;
let dScore = document.getElementById("uScore");
dScore.innerHTML = score;
let headJPG = document.querySelector(".headJPG");
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var head = { x: 250, y: 200 };
var cDirection = "right";
var direction = "right";
var moving = true;
var speed = 200;
var start = false;
ctx.fillStyle = `rgb( 0, 0, 0)`;
ctx.fillRect(0, 0, 500, 450);
var rangeinput = document.getElementById("rangeinput");
var speeds = rangeinput.value;
var apple;
let snake = [
  { x: 250, y: 200 },
  { x: 200, y: 200 },
  { x: 150, y: 200 },
];

//spawns the apples
function spawnApple() {
  let xCord = Math.floor(Math.random() * 10 + 0) * 50;
  let yCord = Math.floor(Math.random() * 9 + 0) * 50;
  for (let i = 0; i < snake.length; i++) {
    if (xCord == snake[i].x && yCord == snake[i].y) {
      return spawnApple();
    }
  }
  return { x: xCord, y: yCord };
}
apple = spawnApple();

//updates the score
function updateScore() {
  score++;
  dScore.innerHTML = score;
}

//gets speed sekected by user
function speedVal() {
  speeds = rangeinput.value;
}

// displays the background, snake and apple. Also clears objects from the old frame
function display() {
  var sInColor = godModeColor("rgb( 0, 0, 100)");
  var sOutColor = godModeColor("rgb( 0, 0, 255)");
  var aInColor = "rgb( 0, 100, 0)";
  var aOutColor = "rgb( 0, 255, 20)";
  if (score < 87 && moving == false) {
    sInColor = "rgb( 100, 0, 0)";
    sOutColor = "rgb( 255, 0, 0)";
  }
  if (score >= 87 && moving == false) {
    sInColor = "rgb( 0, 100, 0)";
    sOutColor = "rgb( 0, 255, 20)";
  }
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = "rgb( 0, 0, 0)";
  ctx.fillRect(0, 0, 500, 450);
  for (let i = snake.length - 1; i >= 0; i--) {
    ctx.fillStyle = sInColor;
    ctx.fillRect(snake[i].x, snake[i].y, 50, 50);
    ctx.fillStyle = sOutColor;
    ctx.fillRect(snake[i].x + 2, snake[i].y + 2, 46, 46);
  }
  if (moving == true) {
    ctx.fillStyle = aInColor;
    ctx.fillRect(apple.x, apple.y, 50, 50);
    ctx.fillStyle = aOutColor;
    ctx.fillRect(apple.x + 2, apple.y + 2, 46, 46);
  }
  ctx.drawImage(headJPG, head.x, head.y);
}
display();

//double checks that the snake cannot go backwards into its self
function conDirection() {
  cDirection = direction;
}

//checks to see if the snake hit the wall
function sInFrame() {
  if (
    snake[0].x < 0 ||
    snake[0].x > 450 ||
    snake[0].y < 0 ||
    snake[0].y > 400
  ) {
    moving = false;
  }
}

//checks to see if go mode is enabled
function godModeColor(prevRGB) {
  if (canHitSelf.checked == false && wallHit.checked == false && speeds == 3) {
    return (
      "rgb( " +
      Math.random() * 256 +
      ", " +
      Math.random() * 256 +
      ", " +
      Math.random() * 256 +
      ")"
    );
  } else {
    return prevRGB;
  }
}

//moves the snake
function moveSnake() {
  if (moving == true) {
    if (direction === "right") head = { x: snake[0].x + 50, y: snake[0].y };
    if (direction === "left") head = { x: snake[0].x - 50, y: snake[0].y };
    if (direction === "up") head = { x: snake[0].x, y: snake[0].y - 50 };
    if (direction === "down") head = { x: snake[0].x, y: snake[0].y + 50 };
    canHitWall();
    snake.unshift(head);
    if (head.x == apple.x && head.y == apple.y) {
      if (score < 86) {
        apple = spawnApple();
      }
      updateScore();
    } else {
      snake.pop();
    }
  }
}

//check to see if walls are disabled and moves the snake accordingly
function canHitWall() {
  if (wallHit.checked == true) {
    head = { x: head.x, y: head.y };
  } else if (head.x > 450) {
    head = { x: 0, y: head.y };
  } else if (head.x < 0) {
    head = { x: 450, y: head.y };
  } else if (head.y > 400) {
    head = { x: head.x, y: 0 };
  } else if (head.y < 0) {
    head = { x: head.x, y: 400 };
  }
}

//checks to see if snake can overlap
function hitSelf() {
  if (canHitSelf.checked == true) {
    for (let i = 1; i < snake.length; i++) {
      if (head.x == snake[i].x && head.y == snake[i].y) moving = false;
    }
  }
}

//checks to see if the player loses
function isLose() {
  sInFrame();
  hitSelf();
  if (moving == false && score < 87) {
    loseMessage.innerHTML = "You Lose!";
    prompts.innerHTML = "Press The Space Bar To Restart";
  }
}

//checks to see if the player reached the maximum score
function isWin() {
  if (score >= 87) {
    winMessage.innerHTML = "You Win!";
    prompts.innerHTML = "Press The Space Bar To Restart";
    moving = false;
  }
}

//runs the game
function main() {
  setTimeout(() => {
    moveSnake();
    isLose();
    isWin();
    display();
    conDirection();
    if (moving == true) {
      main();
    } else {
      start = false;
      window.addEventListener("keydown", (e) => {
        if (["Space"].includes(e.code) && moving == false) {
          restart();
        }
      });
    }
  }, speed);
}

//restart game
function restart() {
  loseMessage.innerHTML = "";
  winMessage.innerHTML = "";
  prompts.innerHTML = "Press An Arrow Key To Start";
  canHitSelf.disabled = false;
  wallHit.disabled = false;
  rangeinput.disabled = false;
  score = 0;
  dScore.innerHTML = score;
  head = { x: 250, y: 200 };
  cDirection = "right";
  direction = "right";
  moving = true;
  start = false;
  ctx.fillStyle = `rgb( 0, 0, 0)`;
  ctx.fillRect(0, 0, 500, 450);
  snake = [
    { x: 250, y: 200 },
    { x: 200, y: 200 },
    { x: 150, y: 200 },
  ];
  apple = spawnApple();
  speeds = 2;
  display();
  speeds = rangeinput.value;
}

// start the movement
if (start == false) {
  window.addEventListener("keydown", (e) => {
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code) &&
      start == false
    ) {
      prompts.innerHTML = "";
      speedVal();
      speed = 400 / speeds;
      main();
      start = true;
      rangeinput.disabled = true;
      canHitSelf.disabled = true;
      wallHit.disabled = true;
    }
  });
}

//movement of the snake
window.addEventListener("keydown", (e) => {
  if (e.key == "ArrowLeft" && cDirection != "right") {
    direction = "left";
  }

  if (e.key == "ArrowRight" && cDirection != "left") {
    direction = "right";
  }

  if (e.key == "ArrowUp" && cDirection != "down") {
    direction = "up";
  }

  if (e.key == "ArrowDown" && cDirection != "up") {
    direction = "down";
  }
});
