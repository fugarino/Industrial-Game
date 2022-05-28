// Selectors
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// How big the canvas is
canvas.width = 1024;
canvas.height = 576;

// Gravity will accelerate player's falling speed
const gravity = 0.5;

// Player class will store and update all properties of player (new Player)
class Player {
  constructor() {
    // position - where on the canvas it is at any given time
    this.position = {
      x: 100,
      y: 100,
    };
    // velocity - how fast the player is moving in any given direction
    this.velocity = {
      x: 0,
      y: 0,
    };
    // width and height determine the size of the player
    this.width = 88;
    this.height = 88;
  }
  // the draw method is drawing a red square refrencing the position and size of the player
  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  // the update method will be called over and over again updating the player's properties
  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height < canvas.height) this.velocity.y += gravity;
    if (player.position.y >= canvas.height - player.height) player.velocity.y = 0;
  }
}

const player = new Player();

const keys = {
  left: {
    pressed: false,
  },
  right: {
    pressed: false,
  },
};

function animate() {
  // recursively calling animate function to create a game loop
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.update();

  if (keys.right.pressed) {
    player.velocity.x = 5;
  } else if (keys.left.pressed) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;
  }
}
animate();

// EventListeners
window.addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "w": // Up
      if (player.position.y + player.height - 2 === canvas.height) player.velocity.y = -20;
      break;
    case "s": // Down
      break;
    case "a": // Left
      keys.left.pressed = true;
      break;
    case "d": // Right
      keys.right.pressed = true;
      break;
  }
});

window.addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "w": // Up
      break;
    case "s": // Down
      break;
    case "a": // Left
      keys.left.pressed = false;
      break;
    case "d": // Right
      keys.right.pressed = false;
      break;
  }
});
