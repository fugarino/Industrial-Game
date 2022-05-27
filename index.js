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

    if (this.position.y + this.height < canvas.height) this.velocity.y += gravity;
  }
}

const player = new Player();

function animate() {
  // recursively calling animate function to create a game loop
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  if (player.position.y >= canvas.height - player.height) player.velocity.y = 0;
}
animate();

// EventListeners
window.addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "w":
      console.log("up");
      if (player.position.y + player.height - 2 === canvas.height) player.velocity.y = -20;
      break;
    case "s":
      console.log("down");
      break;
    case "a":
      console.log("left");
      break;
    case "d":
      console.log("right");
      break;
  }
});
