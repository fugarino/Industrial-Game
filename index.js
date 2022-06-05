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

const trapDoorClosed = new Image();
trapDoorClosed.src = "./img/TrapDoorClosed.png";

const trapDoorOpen = new Image();
trapDoorOpen.src = "./img/TrapDoorOpen.png";

const endOff = new Image();
endOff.src = "./img/Off.png";

const endOn = new Image();
endOn.src = "./img/On.png";

// Active
let isPressurePlate1Active = false;
let isPressurePlate2Active = false;
let isPressurePlate3Active = false;
let leverPressed1 = false;
let leverPressed2 = false;
let leverPressed3 = true;
let leverPressed4 = false;
let endPressed = false;

class Player {
  constructor() {
    this.position = {
      x: 1460,
      // y: 100,
      y: 700,
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

class Box {
  constructor({ x, y, image, id }) {
    this.id = id;
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
  constructor({ x, y, id }) {
    this.id = id;
    this.width = 112;
    this.height = 112;
    this.position = {
      x: x,
      y: y,
    };
    this.currentSprite = pressurePlateSprite;
  }

  draw() {
    c.drawImage(this.currentSprite, this.position.x, this.position.y);
  }
}

class TrapDoor {
  constructor({ x, y, id, image }) {
    this.id = id;
    this.width = 112;
    this.height = 112;
    this.position = {
      x: x,
      y: y,
    };
    this.image = image;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }

  update() {
    this.draw();
    if (isPressurePlate1Active && this.id === 1) {
      this.image = trapDoorOpen;
    } else if (isPressurePlate2Active && this.id === 2) {
      this.image = trapDoorOpen;
    } else if (isPressurePlate3Active && this.id === 3) {
      this.image = trapDoorOpen;
    } else if (leverPressed1 && this.id === 4) {
      this.image = trapDoorOpen;
    } else if (leverPressed2 && this.id === 5) {
      this.image = trapDoorOpen;
    } else if (leverPressed3 && this.id === 6) {
      this.image = trapDoorOpen;
    } else {
      this.image = trapDoorClosed;
    }
  }
}

class Lever {
  constructor({ x, y, image }) {
    this.width = 112;
    this.height = 112;
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

class End {
  constructor({ x, y }) {
    this.width = 112;
    this.height = 112;
    this.position = {
      x: x,
      y: y,
    };
    this.image = {
      on: endOn,
      off: endOff,
    };
    this.currentImage = this.image.off;
  }

  draw() {
    c.drawImage(this.currentImage, this.position.x, this.position.y);
  }
}

const player = new Player();
const platforms = [
  new Platform({ x: 1378, y: 1200, image: platformVines }),
  new Platform({ x: 1600, y: 1200, image: platformVines }),
  new Platform({ x: 1922, y: 1200, image: platformVines }),
  new Platform({ x: 2244, y: 1200, image: platformVines }),
  new Platform({ x: 2566, y: 1200, image: platformVines }),
  new Platform({ x: 1266, y: 1450, image: platformVines }),
  new Platform({ x: 945, y: 1450, image: platformVines }),
  new Platform({ x: 645, y: 1450, image: platformVines }),
  new Platform({ x: 345, y: 1450, image: platformVines }),
  new Platform({ x: 310, y: 1200, image: platformVines }),
  new Platform({ x: 0, y: 1200, image: platformVines }),
  new Platform({ x: -600, y: 1200, image: platformVines }),
  new Platform({ x: -300, y: 1200, image: platformVines }),
  new Platform({ x: 2400, y: 700, image: platformVines }),
  new Platform({ x: 2566, y: 700, image: platformVines }),
  new Platform({ x: 1566, y: 1700, image: platformVines }),
  new Platform({ x: 1266, y: 1700, image: platformVines }),
  new Platform({ x: 966, y: 1700, image: platformVines }),
  new Platform({ x: 2566, y: 450, image: platformVines }),
  new Platform({ x: 2266, y: 450, image: platformVines }),
  new Platform({ x: 1966, y: 450, image: platformVines }),
  new Platform({ x: 1766, y: 450, image: platformVines }),
  new Platform({ x: 1174, y: 450, image: platformVines }),
  new Platform({ x: 2420, y: 260, image: platformVines }),
  new Platform({ x: 2220, y: 260, image: platformVines }),
  new Platform({ x: -400, y: 850, image: platformVines }),
  new Platform({ x: -750, y: 650, image: platformVines }),
  new Platform({ x: -900, y: 550, image: platformVines }),
  new Platform({ x: -50, y: 280, image: platformVines }),
];
// const wall = new Wall({ x: 2774, y: 560, image: wallSprite });
const boxes = [
  new Box({ x: 1600, y: 900, image: boxSprite, id: 1 }),
  new Box({ x: 1800, y: 100, image: boxSprite, id: 2 }),
  new Box({ x: 400, y: 900, image: boxSprite, id: 2 }),
];
const pressurePlates = [
  new PressurePlate({ x: 2070, y: 1090, id: 1 }),
  new PressurePlate({ x: -450, y: 1090, id: 2 }),
  new PressurePlate({ x: 1450, y: 1588, id: 3 }),
];
// const pressurePlate = new PressurePlate({ x: 2000, y: 1090 });
const trapDoors = [
  new TrapDoor({ x: 1820, y: 960, id: 1, image: trapDoorClosed }),
  new TrapDoor({ x: 2100, y: 820, id: 2, image: trapDoorClosed }),
  new TrapDoor({ x: 1200, y: 1320, id: 3, image: trapDoorClosed }),
  new TrapDoor({ x: -400, y: 720, id: 4, image: trapDoorClosed }),
  new TrapDoor({ x: 50, y: 960, id: 4, image: trapDoorClosed }),
  new TrapDoor({ x: 600, y: 280, id: 5, image: trapDoorClosed }),
  new TrapDoor({ x: -350, y: 420, id: 5, image: trapDoorClosed }),
  new TrapDoor({ x: 1523, y: 450, id: 6, image: trapDoorOpen }),
  new TrapDoor({ x: 1643, y: 450, id: 6, image: trapDoorOpen }),
];
const levers = [
  new Lever({ x: 460, y: 1338, image: leverLeftSprite }),
  new Lever({ x: -800, y: 440, image: leverLeftSprite }),
  new Lever({ x: 2400, y: 145, image: leverRightSprite }),
  new Lever({ x: 1100, y: 1588, image: leverRightSprite }),
];
const end = new End({ x: 2700, y: 587 });

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
  end.draw();
  pressurePlates.forEach((pressurePlate) => {
    pressurePlate.draw();
  });
  levers.forEach((lever) => {
    lever.draw();
  });
  trapDoors.forEach((trapDoor) => {
    trapDoor.update();
  });
  boxes.forEach((box) => {
    box.update();
  });
  player.update();

  let pushingBoxRight = false;
  let pushingBoxLeft = false;
  let collidingWall = false;

  if (leverPressed4) {
    end.currentImage = end.image.on;
  } else {
    end.currentImage = end.image.off;
  }

  pressurePlates.forEach((pressurePlate) => {
    if (
      (player.position.x + player.width >= pressurePlate.position.x &&
        player.position.x <= pressurePlate.position.x + pressurePlate.width &&
        player.position.y >= pressurePlate.position.y &&
        player.position.y <= pressurePlate.position.y + pressurePlate.height) ||
      (boxes[0].position.x + boxes[0].width >= pressurePlate.position.x &&
        boxes[0].position.x <= pressurePlate.position.x + pressurePlate.width &&
        boxes[0].position.y <= pressurePlate.position.y &&
        boxes[0].position.y + boxes[0].height >= pressurePlate.position.y) ||
      (boxes[1].position.x + boxes[1].width >= pressurePlate.position.x &&
        boxes[1].position.x <= pressurePlate.position.x + pressurePlate.width &&
        boxes[1].position.y <= pressurePlate.position.y &&
        boxes[1].position.y + boxes[1].height >= pressurePlate.position.y) ||
      (boxes[2].position.x + boxes[1].width >= pressurePlate.position.x &&
        boxes[2].position.x <= pressurePlate.position.x + pressurePlate.width &&
        boxes[2].position.y <= pressurePlate.position.y &&
        boxes[2].position.y + boxes[2].height >= pressurePlate.position.y)
    ) {
      if (pressurePlate.id === 1) {
        isPressurePlate1Active = true;
        pressurePlate.currentSprite = pressurePlateSpriteDown;
      } else if (pressurePlate.id === 2) {
        isPressurePlate2Active = true;
        pressurePlate.currentSprite = pressurePlateSpriteDown;
      } else if (pressurePlate.id === 3) {
        isPressurePlate3Active = true;
        pressurePlate.currentSprite = pressurePlateSpriteDown;
      }
    } else {
      if (pressurePlate.id === 1) {
        isPressurePlate1Active = false;
        pressurePlate.currentSprite = pressurePlateSprite;
      } else if (pressurePlate.id === 2) {
        isPressurePlate2Active = false;
        pressurePlate.currentSprite = pressurePlateSprite;
      } else if (pressurePlate.id === 3) {
        isPressurePlate3Active = false;
        pressurePlate.currentSprite = pressurePlateSprite;
      }
    }
  });

  // Box Collision
  boxes.forEach((box) => {
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
      box.position.x += 7;
      pushingBoxRight = true;
    } else if (
      player.position.x <= box.position.x + box.width &&
      player.position.x >= box.position.x &&
      player.position.y + player.height >= box.position.y &&
      player.position.y <= box.position.y + box.height &&
      keys.left.pressed
    ) {
      box.position.x -= 7;
      pushingBoxLeft = true;
    }
  });

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
        boxes.forEach((box) => {
          box.position.x -= 7;
        });
        pressurePlates.forEach((pressurePlate) => {
          pressurePlate.position.x -= 7;
        });
        trapDoors.forEach((trapDoor) => {
          trapDoor.position.x -= 7;
        });
        levers.forEach((lever) => {
          lever.position.x -= 7;
        });
        end.position.x -= 7;
        // wall.position.x -= 7;
      }
    } else if (keys.left.pressed) {
      platforms.forEach((platform) => {
        platform.position.x += 7;
      });
      boxes.forEach((box) => {
        box.position.x += 7;
      });
      pressurePlates.forEach((pressurePlate) => {
        pressurePlate.position.x += 7;
      });
      trapDoors.forEach((trapDoor) => {
        trapDoor.position.x += 7;
      });
      levers.forEach((lever) => {
        lever.position.x += 7;
      });
      end.position.x += 7;
      // wall.position.x += 7;
    }
  }

  // Y-Axis Playform Displacement
  if (player.position.y < 840) {
    platforms.forEach((platform) => {
      platform.position.y += 2;
    });
    player.position.y += 2;
    boxes.forEach((box) => {
      box.position.y += 2;
    });
    pressurePlates.forEach((pressurePlate) => {
      pressurePlate.position.y += 2;
    });
    trapDoors.forEach((trapDoor) => {
      trapDoor.position.y += 2;
    });
    levers.forEach((lever) => {
      lever.position.y += 2;
    });
    end.position.y += 2;
    // wall.position.y += 2;
  } else if (player.position.y >= 1112) {
    platforms.forEach((platform) => {
      platform.position.y -= 6;
    });
    player.position.y -= 6;
    boxes.forEach((box) => {
      box.position.y -= 6;
    });
    pressurePlates.forEach((pressurePlate) => {
      pressurePlate.position.y -= 6;
    });
    trapDoors.forEach((trapDoor) => {
      trapDoor.position.y -= 6;
    });
    levers.forEach((lever) => {
      lever.position.y -= 6;
    });
    end.position.y -= 6;
    // wall.position.y -= 6;
  }

  trapDoors.forEach((trapDoor) => {
    if (
      player.position.y + player.height <= trapDoor.position.y &&
      player.position.y + player.height + player.velocity.y >= trapDoor.position.y &&
      player.position.x + player.width >= trapDoor.position.x &&
      player.position.x <= trapDoor.position.x + trapDoor.width &&
      isPressurePlate1Active &&
      trapDoor.id === 1
    ) {
      player.velocity.y = 0;
    } else if (
      player.position.y + player.height <= trapDoor.position.y &&
      player.position.y + player.height + player.velocity.y >= trapDoor.position.y &&
      player.position.x + player.width >= trapDoor.position.x &&
      player.position.x <= trapDoor.position.x + trapDoor.width &&
      isPressurePlate2Active &&
      trapDoor.id === 2
    ) {
      player.velocity.y = 0;
    } else if (
      player.position.y + player.height <= trapDoor.position.y &&
      player.position.y + player.height + player.velocity.y >= trapDoor.position.y &&
      player.position.x + player.width >= trapDoor.position.x &&
      player.position.x <= trapDoor.position.x + trapDoor.width &&
      isPressurePlate3Active &&
      trapDoor.id === 3
    ) {
      player.velocity.y = 0;
    } else if (
      player.position.y + player.height <= trapDoor.position.y &&
      player.position.y + player.height + player.velocity.y >= trapDoor.position.y &&
      player.position.x + player.width >= trapDoor.position.x &&
      player.position.x <= trapDoor.position.x + trapDoor.width &&
      leverPressed1 &&
      trapDoor.id === 4
    ) {
      player.velocity.y = 0;
    } else if (
      player.position.y + player.height <= trapDoor.position.y &&
      player.position.y + player.height + player.velocity.y >= trapDoor.position.y &&
      player.position.x + player.width >= trapDoor.position.x &&
      player.position.x <= trapDoor.position.x + trapDoor.width &&
      leverPressed2 &&
      trapDoor.id === 5
    ) {
      player.velocity.y = 0;
    } else if (
      player.position.y + player.height <= trapDoor.position.y &&
      player.position.y + player.height + player.velocity.y >= trapDoor.position.y &&
      player.position.x + player.width >= trapDoor.position.x &&
      player.position.x <= trapDoor.position.x + trapDoor.width &&
      leverPressed3 &&
      trapDoor.id === 6
    ) {
      player.velocity.y = 0;
    }
  });

  trapDoors.forEach((trapDoor) => {
    if (
      boxes[1].position.y + boxes[1].height <= trapDoor.position.y &&
      boxes[1].position.y + boxes[1].height + boxes[1].velocity.y + 12 >= trapDoor.position.y &&
      boxes[1].position.x + boxes[1].width >= trapDoor.position.x &&
      boxes[1].position.x <= trapDoor.position.x + trapDoor.width &&
      leverPressed3 &&
      trapDoor.id === 6
    ) {
      boxes[1].velocity.y = 0;
    }
  });

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
    boxes.forEach((box) => {
      if (
        box.position.y + box.height <= platform.position.y &&
        box.position.y + box.height + box.velocity.y + 12 >= platform.position.y &&
        box.position.x + box.width >= platform.position.x &&
        box.position.x <= platform.position.x + platform.width
      ) {
        box.velocity.y = 0;
      }
    });
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

  // Lose Condition
  if (player.position.y > canvas.height) {
    window.location.reload();
  }
}
animate();

// EventListeners
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w": // Up
      if (player.velocity.y === 0 && !e.repeat) player.velocity.y = -12;
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

window.addEventListener("keydown", ({ key }) => {
  // Lever 1
  if (
    key === "e" &&
    player.position.x + player.width >= levers[0].position.x &&
    player.position.x <= levers[0].position.x + levers[0].width &&
    player.position.y >= levers[0].position.y &&
    !leverPressed1
  ) {
    levers[0].image = leverRightSprite;
    leverPressed1 = true;
  } else if (
    key === "e" &&
    player.position.x + player.width >= levers[0].position.x &&
    player.position.x <= levers[0].position.x + levers[0].width &&
    player.position.y >= levers[0].position.y &&
    leverPressed1
  ) {
    levers[0].image = leverLeftSprite;
    leverPressed1 = false;
  }
  // Lever 2
  if (
    key === "e" &&
    player.position.x + player.width >= levers[1].position.x &&
    player.position.x <= levers[1].position.x + levers[1].width &&
    player.position.y >= levers[1].position.y &&
    !leverPressed2
  ) {
    levers[1].image = leverRightSprite;
    leverPressed2 = true;
  } else if (
    key === "e" &&
    player.position.x + player.width >= levers[1].position.x &&
    player.position.x <= levers[1].position.x + levers[1].width &&
    player.position.y >= levers[1].position.y &&
    leverPressed2
  ) {
    levers[1].image = leverLeftSprite;
    leverPressed2 = false;
  }
  // Lever 3
  if (
    key === "e" &&
    player.position.x + player.width >= levers[2].position.x &&
    player.position.x <= levers[2].position.x + levers[2].width &&
    player.position.y >= levers[2].position.y &&
    !leverPressed3
  ) {
    levers[2].image = leverRightSprite;
    leverPressed3 = true;
  } else if (
    key === "e" &&
    player.position.x + player.width >= levers[2].position.x &&
    player.position.x <= levers[2].position.x + levers[2].width &&
    player.position.y >= levers[2].position.y &&
    leverPressed3
  ) {
    levers[2].image = leverLeftSprite;
    leverPressed3 = false;
  }
  // Lever 4
  if (
    key === "e" &&
    player.position.x + player.width >= levers[3].position.x &&
    player.position.x <= levers[3].position.x + levers[3].width &&
    player.position.y >= levers[3].position.y &&
    !leverPressed4
  ) {
    levers[3].image = leverLeftSprite;
    leverPressed4 = true;
  } else if (
    key === "e" &&
    player.position.x + player.width >= levers[3].position.x &&
    player.position.x <= levers[3].position.x + levers[3].width &&
    player.position.y >= levers[3].position.y &&
    leverPressed4
  ) {
    levers[3].image = leverRightSprite;
    leverPressed4 = false;
  }
  // End
  if (
    key === "e" &&
    player.position.x + player.width >= end.position.x &&
    player.position.x <= end.position.x + end.width &&
    player.position.y >= end.position.y &&
    leverPressed4
  ) {
    console.log("You Win!");
  }
});
