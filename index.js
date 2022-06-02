const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 3024;
canvas.height = 2076;

const gravity = 0.5;

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

const boxSprite = new Image();
boxSprite.src = "./img/Industrial-Box.png";

const wallSprite = new Image();
wallSprite.src = "./img/WallRight.png";

class Player {
  constructor() {
    this.position = {
      x: 1460,
      y: 100,
    };

    this.velocity = {
      x: 0,
      y: 0,
    };
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

class Wall {
  constructor({ x, y, image }) {
    this.width = image.width;
    this.height = image.height;
    (this.position = {
      x: x,
      y: y,
    }),
      (this.image = image);
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class Box {
  constructor({ x, y, image }) {
    this.width = 100;
    this.height = 100;
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
  new Platform({ x: 900, y: 1200, image: platformVines }),
  new Platform({ x: 1222, y: 1200, image: platformVines }),
  new Platform({ x: 1544, y: 1200, image: platformVines }),
  new Platform({ x: 1866, y: 1200, image: platformVines }),
  new Platform({ x: 1266, y: 900, image: platformVines }),
  new Platform({ x: 1666, y: 1000, image: platformVines }),
];
const wall = new Wall({ x: 2074, y: 560, image: wallSprite });
const box = new Box({ x: 1100, y: 1088, image: boxSprite });

let currentKey;
const keys = {
  up: {
    pressed: false,
  },
  down: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  right: {
    pressed: false,
  },
};

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  platforms.forEach((platform) => {
    platform.draw();
  });
  wall.draw();
  box.draw();
  player.update();

  let pushingBoxRight = false;
  let pushingBoxLeft = false;
  let collidingWall = false;

  // Wall Collision
  if (
    player.position.x + player.width >= wall.position.x &&
    player.position.x <= wall.position.x &&
    keys.right.pressed
  ) {
    collidingWall = true;
    player.velocity.x = 0;
  }

  // Box Collision
  if (
    player.position.y + player.height <= box.position.y &&
    player.position.y + player.height + player.velocity.y >= box.position.y &&
    player.position.x + player.width >= box.position.x &&
    player.position.x <= box.position.x + box.width
  ) {
    player.velocity.y = 0;
  } else if (
    player.position.x + player.width >= box.position.x &&
    player.position.x <= box.position.x &&
    player.position.y + player.height >= box.position.y &&
    keys.right.pressed
  ) {
    if (wall.position.x < 1710) {
      console.log("1");
      box.position.x += 0;
      platforms.forEach((platform) => {
        platform.position.x += 0;
      });
    } else {
      box.position.x += 7;
    }
    pushingBoxRight = true;
  } else if (
    player.position.x <= box.position.x + box.width &&
    player.position.x >= box.position.x &&
    player.position.y + player.height >= box.position.y &&
    keys.left.pressed
  ) {
    box.position.x -= 7;
    pushingBoxLeft = true;
  }

  // X-Axis Platform Displacement
  if (keys.right.pressed && player.position.x < 1500) {
    player.velocity.x = 7;
  } else if (keys.left.pressed && player.position.x > 1450) {
    player.velocity.x = -7;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      if (!collidingWall) {
        console.log("2");
        platforms.forEach((platform) => {
          platform.position.x -= 7;
        });
        box.position.x -= 7;
        wall.position.x -= 7;
      }
    } else if (keys.left.pressed) {
      platforms.forEach((platform) => {
        platform.position.x += 7;
      });
      box.position.x += 7;
      wall.position.x += 7;
    }
  }

  // Y-Axis Playform Displacement
  if (player.position.y < 840) {
    platforms.forEach((platform) => {
      platform.position.y += 2;
    });
    player.position.y += 2;
    box.position.y += 2;
    wall.position.y += 2;
  } else if (player.position.y >= 1112) {
    platforms.forEach((platform) => {
      platform.position.y -= 6;
    });
    player.position.y -= 6;
    box.position.y -= 6;
    wall.position.y -= 6;
  }

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

  // Changing Animations
  if (
    keys.right.pressed &&
    currentKey === "right" &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.currentSprite = player.sprites.run.right;
  } else if (
    keys.left.pressed &&
    currentKey === "left" &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.currentSprite = player.sprites.run.left;
  }
}
animate();

// EventListeners
window.addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "w": // Up
      if (player.velocity.y === 0) player.velocity.y = -12;
      keys.up.pressed = true;
      break;
    case "s": // Down
      keys.down.pressed = true;
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
      keys.up.pressed = false;
      break;
    case "s": // Down
      keys.down.pressed = false;
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
