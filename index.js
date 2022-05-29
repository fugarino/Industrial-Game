// Selectors
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// How big the canvas is
// canvas.width = 1024;
canvas.width = window.innerWidth - 10;
canvas.height = 576;

// Gravity will accelerate player's falling speed
const gravity = 0.5;

// Images
const platformVines = new Image();
platformVines.src = "./img/Industrial-Platform-Vines.png";

const spriteIdleRight = new Image();
spriteIdleRight.src = "./img/CharacterIdle.png";

const spriteIdleLeft = new Image();
spriteIdleLeft.src = "./img/Untitled-2.png";

const spriteRunRight = new Image();
spriteRunRight.src = "./img/CharacterRunning.png";

const spriteRunLeft = new Image();
spriteRunLeft.src = "./img/Untitled-3.png";

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

    this.frames = 0;
    this.num = 0;
    this.reverse = 8;
    this.sprites = {
      stand: {
        right: spriteIdleRight,
        left: spriteIdleLeft,
      },
      run: {
        right: spriteRunRight,
        left: spriteRunLeft,
      },
    };

    this.currentSprite = this.sprites.stand.right;
  }
  // the draw method is drawing a red square refrencing the position and size of the player
  draw() {
    c.drawImage(
      this.currentSprite,
      88 * this.frames,
      0,
      88,
      88,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  // the update method will be called over and over again updating the player's properties
  update() {
    if (this.currentSprite === this.sprites.stand.right) {
      this.num++;
      if (this.num % 10 === 0) {
        this.frames++;
      }
      if (this.frames > 3) this.frames = 0;
    } else if (this.currentSprite === this.sprites.stand.left) {
      this.reverse++;
      if (this.reverse % 10 === 0) {
        this.frames--;
      }
      if (this.frames < 4) this.frames = 7;
    } else if (this.currentSprite === this.sprites.run.right) {
      this.num++;
      if (this.num % 5 === 0) {
        this.frames++;
      }
      if (this.frames > 7) this.frames = 0;
    } else if (this.currentSprite === this.sprites.run.left) {
      this.reverse++;
      if (this.reverse % 5 === 0) {
        this.frames--;
      }
      if (this.frames < 0) this.frames = 7;
    }
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height < canvas.height) this.velocity.y += gravity;
    if (player.position.y >= canvas.height - player.height) player.velocity.y = 0;
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.width = 336;
    this.height = 56;
    this.position = {
      x: x,
      y: y,
    };
    this.image = image;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

const player = new Player();
const platforms = [
  new Platform({ x: 0, y: 500, image: platformVines }),
  new Platform({ x: 322, y: 500, image: platformVines }),
  new Platform({ x: 644, y: 500, image: platformVines }),
  new Platform({ x: 966, y: 500, image: platformVines }),
];

let currentKey;
const keys = {
  left: {
    pressed: false,
  },
  right: {
    pressed: false,
  },
};

// animate function will recursively clear the entire canvas and then update the player properties
function animate() {
  // recursively calling animate function to create a game loop
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();

  if (keys.right.pressed) {
    if (player.position.x + player.width >= canvas.width) {
      player.velocity.x = 0;
    } else {
      player.velocity.x = 7;
    }
  } else if (keys.left.pressed) {
    if (player.position.x <= 0) {
      player.velocity.x = 0;
    } else {
      player.velocity.x = -7;
    }
  } else {
    player.velocity.x = 0;
  }

  // Platform collision detection
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >= platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  // Sprite switching
  if (keys.right.pressed && currentKey === "right" && player.currentSprite !== player.sprites.run.right) {
    player.currentSprite = player.sprites.run.right;
  } else if (keys.left.pressed && currentKey === "left" && player.currentSprite !== player.sprites.run.left) {
    player.currentSprite = player.sprites.run.left;
  }
}
animate();

// EventListeners
window.addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "w": // Up
      if (player.velocity.y === 0) player.velocity.y = -12;
      break;
    case "s": // Down
      break;
    case "a": // Left
      keys.left.pressed = true;
      currentKey = "left";
      break;
    case "d": // Right
      keys.right.pressed = true;
      currentKey = "right";
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
      player.currentSprite = player.sprites.stand.left;
      break;
    case "d": // Right
      keys.right.pressed = false;
      player.currentSprite = player.sprites.stand.right;
      break;
  }
});
