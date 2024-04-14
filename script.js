// Connection CANVAS
const CANVAS_NODE = document.getElementById("arkanoid");
const CTX = CANVAS_NODE.getContext("2d");
// THE BALL RADIUS
const BALL_RADIUS = 10;

//COLOR OF THE GAME ELEMENTS
CTX.fillStyle = "#0095DD";
CTX.font = "16px Arial";

// OUR PLATFORM PAREMENTERS
const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 75;

// BLOCK PAREMETERS
const BRICK_ROW_COUNT = 5; //COUNT ON EACH LINE
const BRICK_COLUMN_COUNT = 3; // AMOU TOF COLUMNS
const BRICK_WIDTH = 75; // HOW BIG IN WISTH
const BRICK_HEIGHT = 20; // HOW TALL
const BRICK_PADDING = 10; // SPACING BEETWEEN EACH BLOCK
const BRICK_OFFSET = 30; // SPACING BEETWEEN EDGES OF THE FIELD

// BALL CORDINATES
let ballX = CANVAS_NODE.width / 2; // THE BALL BE IN THE ,IDDLE
let ballY = CANVAS_NODE.height - 30; // FOR THE BALL BE IN THE MIDDLE
let dx = 2; // SPEED CGANGES IN X
let dy = -2; // SPEED CHANGES IN Y

// PLATFORM POSITIONING
let paddleX = (CANVAS_NODE.width - PADDLE_WIDTH) / 2;

// AMOUNT OF SCORE AND LIVES LEFT
let score = 0;
let lives = 3;

//MAKING A MASSIVE FOR OUR BLOCKS
const bricks = [];

// PUTTING ALL THE BLOCKS IN THE MASSIVE AND THEIR STATUS
for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
  bricks[c] = [];

  for (let r = 0; r < BRICK_ROW_COUNT; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// MAKING A NEW EVENT THAT HAPPENS ON MOUSE MOVE
document.addEventListener("mousemove", handleMouseMove);

// MAKING IT MOVE
function handleMouseMove(e) {
  const RELATIVE_X = e.clientX - CANVAS_NODE.offsetLeft; // MAKIN GIT GO LEFT AND RIGHT

  if (RELATIVE_X > 0 && RELATIVE_X < CANVAS_NODE.width) {
    paddleX = RELATIVE_X - PADDLE_WIDTH / 2; // SO IT DOESNT GO OFF THE MAP
  }
}

// GIVING THE BALL PHYSICS AND DRAWING IT ON THE SCREEN
function drawBall() {
  CTX.beginPath();
  CTX.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
  CTX.fill();
  CTX.closePath();
}

// DRAWING THE PADDLE ITS SELF 
function drawPaddle() {
  CTX.beginPath();
  CTX.rect(
    paddleX,
    CANVAS_NODE.height - PADDLE_HEIGHT,
    PADDLE_WIDTH,
    PADDLE_HEIGHT
  );
  CTX.fill();
  CTX.closePath();
}

// DRAWING THE BRICKS
function drawBricks() {
  for (let c = 0; c < BRICK_COLUMN_COUNT; c++) { // GOING THROUGH COLUMNS
    for (let r = 0; r < BRICK_ROW_COUNT; r++) { // GOING THORUGH ROWS
      if (bricks[c][r].status === 1) { // IF STATUS 1 THEN ITS STILL THERE
        const BRICK_X = r * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET; // USING RORMULA TO DRAW BRICKS
        const BRICK_Y = c * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET; // SAME THING FOR Y

        // SAVING NEW CORDINATES
        bricks[c][r].x = BRICK_X; // X
        bricks[c][r].y = BRICK_Y;// y

        // Drawing them again if they are still there
        CTX.beginPath();
        CTX.rect(BRICK_X, BRICK_Y, BRICK_WIDTH, BRICK_HEIGHT);
        CTX.fill();
        CTX.closePath();
      }
    }
  }
}

// drawing score
function drawScore() {
  CTX.fillText("Счет: " + score, 8, 20);
}

// drawing lives
function drawLives() {
  CTX.fillText("Жизней: " + lives, CANVAS_NODE.width - 85, 20);
}

// Decetio of collusio if true staus = 0
function detectCollision() {
  for (let c = 0; c < BRICK_COLUMN_COUNT; c++) { // same going trough
    for (let r = 0; r < BRICK_ROW_COUNT; r++) { // same but for y
      let brick = bricks[c][r];

      // if the brick is still there then
      if (brick.status === 1) {
        // FORMULA IF A COLLUSION HAPPENED
        const isCollisionTrue =
        ballX > brick.x &&
        ballX < brick.x + BRICK_WIDTH &&
        ballY > brick.y &&
        ballY < brick.y + BRICK_HEIGHT;

        // IF IT DID THEN:
        if (isCollisionTrue) {
          dy = -dy; // BALL GOING OTHER WAY DOWN
          brick.status = 0; //  STAUS 0

          score++; // ADD SCORE

          // IF SCORE = AMOUNT OF BRICKS WE WIN
          if (score === BRICK_ROW_COUNT * BRICK_COLUMN_COUNT) {
            alert("Вы выиграли!");
            // RELOAING THE PAGE
            document.location.reload();
          }
        }
      }
    }
  }
}

// DRAWING EVERYTHING
function draw() {
  // CLEARING THE PATH AFTER THE BALL MOVES
  CTX.clearRect(0, 0, CANVAS_NODE.width, CANVAS_NODE.height);

  // DRAWING EVERYTHING AGAIN
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  detectCollision();


  // IF THE BALL TOUCHES EDGE OF THE LEFT BORDER OR RIGHT BORDER
  if (ballX + dx < BALL_RADIUS || ballX + dx > CANVAS_NODE.width - BALL_RADIUS) {
    dx = -dx;
  }
// IF TH BALL TOUCHED THE TOP
  if (ballY + dy < BALL_RADIUS) {
    dy = -dy;
  }

  // IF THE BALL TOUCHES THE BOTTOM
  if (ballY + dy > CANVAS_NODE.height - BALL_RADIUS) {
    // IF THE BALL TOCUHED THE PADDLE
    if (ballX > paddleX && ballX < paddleX + PADDLE_WIDTH) {
      dy = -dy; // AKING THE BALL GO OTER WAY
    } else { // IF IT DIDT HIT
      lives--; // LOOSIG LIFES

      // IF NO LIVES THE GAME OVER
      if (lives === 0) {
        alert("Игра окончена!");

        document.location.reload();
      } else { // IF THERE ARE STILL LIVES BUT THE BALL MISSED
        ballX = CANVAS_NODE.width / 2; // PUTTING THE BALL I THE MIDDLE
        ballY = CANVAS_NODE.height - 30;// SAME
        dx = 2; // CHANGING SPEEDS
        dy = -2;
        paddleX = (CANVAS_NODE.width - PADDLE_WIDTH) / 2; // PUTTING PADDLE BACK TO STARING POSITION
      }
    }
  }

  // GIVIN THE BALL ITS SPEEDS
  ballX += dx; // ballX = ballX + dx
  ballY += dy;

  // MAKING THE ANIMATIO TO CONTINUE FOREVER
  requestAnimationFrame(draw);
}

draw();