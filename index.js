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

// const wallSprite = new Image();
// wallSprite.src = "./img/WallRight.png";

const pressurePlateSprite = new Image();
pressurePlateSprite.src = "./img/PressurePlate.png";

const pressurePlateSpriteDown = new Image();
pressurePlateSpriteDown.src = "./img/pressurePlateDown.png";

const trapDoorDownToUpSprite = new Image();
trapDoorDownToUpSprite.src = "./img/TrapDoorDownToUp.png";

const leverRightSprite = new Image();
leverRightSprite.src = "./img/LeverRight.png";

const leverLeftSprite = new Image();
leverLeftSprite.src = "./img/LeverLeft.png";

// Active
let isPressurePlate1Active = false;
let leverPressed = false;

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
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.image = image;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height < canvas.height) this.velocity.y += gravity;
  }
}

class PressurePlate {
  constructor({ x, y }) {
    this.width = 112;
    this.height = 112;
    this.position = {
      x: x,
      y: y,
    };
    this.sprites = {
      notActive: pressurePlateSprite,
      active: pressurePlateSpriteDown,
    };
    this.currentSprite = this.sprites.notActive;
  }

  draw() {
    c.drawImage(this.currentSprite, this.position.x, this.position.y);
  }

  update() {
    if (
      (player.position.x + player.width >= pressurePlate.position.x &&
        player.position.x <= pressurePlate.position.x + pressurePlate.width &&
        player.position.y >= pressurePlate.position.y) ||
      (box.position.x + box.width >= pressurePlate.position.x &&
        box.position.x <= pressurePlate.position.x + pressurePlate.width)
    ) {
      this.currentSprite = this.sprites.active;
      isPressurePlate1Active = true;
    } else {
      this.currentSprite = this.sprites.notActive;
      isPressurePlate1Active = false;
    }
    this.draw();
  }
}

class TrapDoor {
  constructor({ x, y }) {
    this.width = 112;
    this.height = 112;
    this.frames = 0;
    this.position = {
      x: x,
      y: y,
    };
    this.sprite = trapDoorDownToUpSprite;
  }

  draw() {
    c.drawImage(
      this.sprite,
      112 * this.frames,
      0,
      112,
      112,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    if (isPressurePlate1Active) {
      this.frames = 3;
    } else {
      this.frames = 0;
    }
  }
}

class Lever {
  constructor({ x, y }) {
    this.width = 112;
    this.height = 112;
    this.position = {
      x: x,
      y: y,
    };
    this.sprites = {
      right: leverRightSprite,
      left: leverLeftSprite,
    };
    this.currentSprite = this.sprites.right;
  }

  draw() {
    c.drawImage(this.currentSprite, this.position.x, this.position.y);
  }

  update() {
    if (leverPressed) {
      this.currentSprite = this.sprites.left;
      // isPressurePlate1Active = true;
    } else {
      this.currentSprite = this.sprites.right;
      // isPressurePlate1Active = false;
    }
    this.draw();
  }
}

const player = new Player();
const platforms = [
  new Platform({ x: 1278, y: 1200, image: platformVines }),
  new Platform({ x: 1600, y: 1200, image: platformVines }),
  new Platform({ x: 1922, y: 1200, image: platformVines }),
  new Platform({ x: 2244, y: 1200, image: platformVines }),
  new Platform({ x: 2566, y: 1200, image: platformVines }),
  new Platform({ x: 1266, y: 1400, image: platformVines }),
  new Platform({ x: 945, y: 1400, image: platformVines }),
];
// const wall = new Wall({ x: 2774, y: 560, image: wallSprite });
const box = new Box({ x: 1600, y: 900, image: boxSprite });
const pressurePlate = new PressurePlate({ x: 2000, y: 1090 });
const trapDoor = new TrapDoor({ x: 1820, y: 960 });
const lever = new Lever({ x: 2300, y: 1090 });

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
  // wall.draw();
  // box.draw();
  pressurePlate.update();
  lever.update();
  trapDoor.update();
  box.update();
  player.update();

  let pushingBoxRight = false;
  let pushingBoxLeft = false;
  let collidingWall = false;

  // Wall Collision
  // if (
  //   player.position.x + player.width >= wall.position.x &&
  //   player.position.x <= wall.position.x &&
  //   keys.right.pressed
  // ) {
  //   collidingWall = true;
  //   player.velocity.x = 0;
  // }

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
    player.position.y <= box.position.y + box.height &&
    keys.right.pressed
  ) {
    // if (wall.position.x < 1710) {
    //   box.position.x += 0;
    // } else {
    //   box.position.x += 7;
    // }
    box.position.x += 7;
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
        platforms.forEach((platform) => {
          platform.position.x -= 7;
        });
        box.position.x -= 7;
        pressurePlate.position.x -= 7;
        trapDoor.position.x -= 7;
        lever.position.x -= 7;
        // wall.position.x -= 7;
      }
    } else if (keys.left.pressed) {
      platforms.forEach((platform) => {
        platform.position.x += 7;
      });
      box.position.x += 7;
      pressurePlate.position.x += 7;
      trapDoor.position.x += 7;
      lever.position.x += 7;
      // wall.position.x += 7;
    }
  }

  // Y-Axis Playform Displacement
  if (player.position.y < 840) {
    platforms.forEach((platform) => {
      platform.position.y += 2;
    });
    player.position.y += 2;
    box.position.y += 2;
    pressurePlate.position.y += 2;
    trapDoor.position.y += 2;
    lever.position.y += 2;
    // wall.position.y += 2;
  } else if (player.position.y >= 1112) {
    platforms.forEach((platform) => {
      platform.position.y -= 6;
    });
    player.position.y -= 6;
    box.position.y -= 6;
    pressurePlate.position.y -= 6;
    trapDoor.position.y -= 6;
    lever.position.y -= 6;
    // wall.position.y -= 6;
  }

  if (
    player.position.y + player.height <= trapDoor.position.y &&
    player.position.y + player.height + player.velocity.y >= trapDoor.position.y &&
    player.position.x + player.width >= trapDoor.position.x &&
    player.position.x <= trapDoor.position.x + trapDoor.width &&
    isPressurePlate1Active
  ) {
    player.velocity.y = 0;
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
  platforms.forEach((platform) => {
    if (
      box.position.y + box.height <= platform.position.y &&
      box.position.y + box.height + box.velocity.y + 12 >= platform.position.y &&
      box.position.x + box.width >= platform.position.x &&
      box.position.x <= platform.position.x + platform.width
    ) {
      box.velocity.y = 0;
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
    // case "e":
    //   if (leverPressed) {
    //     leverPressed = false;
    //   } else {
    //     leverPressed = true;
    //   }
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

window.addEventListener("keydown", ({ key }) => {
  if (
    key === "e" &&
    player.position.x + player.width >= lever.position.x &&
    player.position.x <= lever.position.x + lever.width &&
    player.position.y >= lever.position.y &&
    !leverPressed
  ) {
    leverPressed = true;
  } else if (
    key === "e" &&
    player.position.x + player.width >= lever.position.x &&
    player.position.x <= lever.position.x + lever.width &&
    player.position.y >= lever.position.y &&
    leverPressed
  ) {
    leverPressed = false;
  }
});
