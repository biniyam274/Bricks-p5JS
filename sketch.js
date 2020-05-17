let MENU = 0;
let playerScore = 0;
let paddle;
let ball;
let bricks;
let gameState;
let colour;
let controllers = [];
var x = 0;

function setup() {
  createCanvas(500, 500);
  colour = color(0, 0, 0);
  let colors = createColors();
  gameState = "playing";
  paddle = new Paddle();
  ball = new Ball(paddle);
  bricks = createBricks(colors);
  setUpJoyStick();
}

function draw() {
  background(166, 156, 156);
  fill(0, 255, 0);
  //Start
  rect(50, 50, 200, 75);
  fill(255, 0, 255);
  //Instruction
  rect(50, 200, 200, 75);
  fill(255, 0, 0);
  //End
  rect(50, 350, 200, 75);
  textSize(50);
  fill(255);
  text("START", 70, 106);
  text("EXIT", 94, 406);
  textSize(26);
  text("INSTRUCTIONS", 52, 248);

  if (MENU == 1) {
    background(0);

    // code area
    drawGamepad();
    if (gameState === "playing") {
      background(colour);

      ball.bounceEdge();
      ball.bouncePaddle();

      ball.update();

      if (keyIsDown(LEFT_ARROW)) {
        paddle.move("left");
      } else if (keyIsDown(RIGHT_ARROW)) {
        paddle.move("right");
      }

      for (let i = bricks.length - 1; i >= 0; i--) {
        const brick = bricks[i];
        if (brick.colide(ball)) {
          ball.reverse("y");
          bricks.splice(i, 1);
          playerScore += brick.points;
          ball.speedUp(0.2, 0.2);
        } else {
          brick.display();
        }
      }

      paddle.display();
      ball.display();

      textSize(32);
      fill(255);
      text(`Score:${playerScore}`, width - 150, 50);

      if (ball.belowBottom()) {
        gameState = "Lose";
      }

      if (bricks.length === 0) {
        gameState = "Win";
      }
    } else {
      textSize(70);
      gameState === "Lose" ? fill(255, 0, 255) : fill(255);
      if (gameState === "Lose") {
        fill("red");
        text(`Game Over!`, width / 2 - 220, height / 2);
      }

      if (gameState === "Win") {
        text(`Congratulations !!!`, width / 2 - 220, height / 2);
      }
    }
    // end of code area
    if (mouseButton == RIGHT) {
      MENU = 0;
    }
  } // START GAME
  if (MENU == 2) {
    background(255, 0, 255);
    textSize(20);
    text("Right Click to return to MENU", 525, 30);
    textSize(15);
    text(
      "1. The Game is about successfully finishing breaking Bricks.",
      50,
      150
    );
    text("1. The Game speeds up as points are scored.", 50, 200);
    text(
      "2. USE <- and -> Arrow Or Joystick to  move \nthe PADDLE right or left to prevent the ball from leak",
      50,
      250
    );
    text(
      "3. The game is over when the ball leaks out without missing paddle.",
      50,
      300
    );
    if (mouseButton == RIGHT) {
      MENU = 0;
    }
  } // INSTRUCTIONS
  if (MENU == 3) {
    background(255, 0, 0);
    textSize(30);
    text("COME AGAIN SOON!", 25, height / 2);
    setTimeout(function () {
      MENU = 0;
    }, 2000);
  } // EXIT
}

function buttonPressed(b) {
  if (typeof b == "object") {
    return b.pressed; // binary
  }
  return b > 0.2; // analog value
}

function createColors() {
  const colors = [];
  colors.push(color(252, 186, 3));
  colors.push(color(3, 252, 53));
  colors.push(color(3, 7, 252));
  for (let i = 0; i < 10; i++) {
    colors.push(color(random(50, 255), random(50, 255), random(50, 255)));
  }
  return colors;
}

function createBricks(colors) {
  const bricks = [];
  const brickHeight = 25;
  const rows = Math.floor(height / 2 / brickHeight);
  const bricksPerRow = 10;
  const brickWidth = width / bricksPerRow;
  for (let row = 0; row < rows; row++) {
    for (let i = 0; i < bricksPerRow; i++) {
      brick = new Brick(
        createVector(brickWidth * i, 25 * row),
        brickWidth,
        brickHeight,
        colors[floor(random(0, colors.length))]
      );
      bricks.push(brick);
    }
  }
  return bricks;
}

function mouseClicked() {
  if (MENU == 0) {
    if (mouseX < 200 && mouseX > 50) {
      if (mouseY < 125 && mouseY > 50) {
        MENU = 1;
      }
      if (mouseY < 275 && mouseY > 200) {
        MENU = 2;
      }
      if (mouseY < 425 && mouseY > 350) {
        MENU = 3;
      }
    }
  }
}

//Joystick Functionality

function drawGamepad() {
  var gamepads = navigator.getGamepads();

  for (let i in controllers) {
    let controller = gamepads[i];
    if (controller.buttons) {
      for (let btn = 0; btn < controller.buttons.length; btn++) {
        let val = controller.buttons[btn];

        if (buttonPressed(val)) {
          switch (btn) {
            case 15:
              paddle.move("right");
              break;
            case 14:
              paddle.move("left");
              break;

            default:
              break;
          }
        }
      }
    }
    if (controller.axes) {
      let axes = controller.axes;
      for (let axis = 0; axis < axes.length; axis++) {
        let val = controller.axes[axis];
        console.log("Axes:", val);
      }
    }
  }
}

function gamepadHandler(event, connecting) {
  let gamepad = event.gamepad;
  if (connecting) {
    console.log("Connecting to controller " + gamepad.index);
    controllers[gamepad.index] = gamepad;
  } else {
    delete controllers[gamepad.index];
  }
}
function setUpJoyStick() {
  window.addEventListener("gamepadconnected", function (e) {
    gamepadHandler(e, true);
    console.log("Gamepad connected");
    console.log("controllers : ", controllers);
  });
  window.addEventListener("gamepaddisconnected", function (e) {
    console.log(
      "Gamepad disconnected from index %d: %s",
      e.gamepad.index,
      e.gamepad.id
    );
    colour = color(120, 0, 0);
    gamepadHandler(e, false);
  });
}
