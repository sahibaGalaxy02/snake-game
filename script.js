const board = document.querySelector('.board');
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

const size = 20;
const cols = Math.floor(board.clientWidth / size);
const rows = Math.floor(board.clientHeight / size);

const blocks = {};
let snake, food, direction, score, speed, gameLoop;
// create gridd
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    const div = document.createElement("div");
    div.classList.add("block");
    board.appendChild(div);
    blocks[`${y},${x}`] = div;
  }
}

// RESET GAME

function restartGame() {
  snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 }
  ];
  direction = "right";
  score = 0;
  speed = 200;
  scoreEl.textContent = score;
  spawnFood();
  clearInterval(gameLoop);
  gameLoop = setInterval(game, speed);
}

// Food
function spawnFood() {
  let x, y;
  do {
    x = Math.floor(Math.random() * cols);
    y = Math.floor(Math.random() * rows);
  } while (snake.some(s => s.x === x && s.y === y));
  food = { x, y };
}

// CLEAR
function clearBoard() {
  Object.values(blocks).forEach(b => {
    b.classList.remove("snake", "food");
  });
}

// DRAW
function render() {
  clearBoard();

  snake.forEach(s => {
    blocks[`${s.y},${s.x}`]?.classList.add("snake");
  });

  blocks[`${food.y},${food.x}`]?.classList.add("food");
}

// MOVE
function moveSnake() {
  const head = { ...snake[0] };
  if (direction === "up") head.y--;
  if (direction === "down") head.y++;
  if (direction === "left") head.x--;
  if (direction === "right") head.x++;

  // WALL COLLISION
  if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows) {
    endGame();
    return;
  }

  // SELF COLLISION
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);

  // FOOD EAT
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    spawnFood();

    if (speed > 60) {
      speed -= 10;
      clearInterval(gameLoop);
      gameLoop = setInterval(game, speed);
    }
  } else {
    snake.pop();
  }
}

// GAME LOOP
function game() {
  moveSnake();
  render();
}

// GAME OVER
function endGame() {
  clearInterval(gameLoop);
  const high = Math.max(score, localStorage.getItem("highScore") || 0);
  localStorage.setItem("highScore", high);
  highScoreEl.textContent = high;
  alert("Game Over!");
}

// KEYS
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && direction !== "down") direction = "up";
  if (e.key === "ArrowDown" && direction !== "up") direction = "down";
  if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
  if (e.key === "ArrowRight" && direction !== "left") direction = "right";
});

// INIT
highScoreEl.textContent = localStorage.getItem("highScore") || 0;
restartGame();
